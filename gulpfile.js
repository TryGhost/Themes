const {series, parallel, watch, src, dest} = require('gulp');
const pump = require('pump');
const glob = require('glob');
const argv = require('yargs').argv;
const exec = require('child_process').exec;

// gulp plugins and utils
const livereload = require('gulp-livereload');
const gulpStylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const zip = require('gulp-zip');

// postcss plugins
const easyimport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function serve(done) {
    livereload.listen();
    done();
}

function handleError(done) {
    return function (err) {
        if (err) beeper();
        return done(err);
    };
}

function doHBS(path, done) {
    pump([
        src([`${path}/*.hbs`, `${path}/partials/**/*.hbs`]),
        livereload()
    ], handleError(done));
}

function doCSS(path, done) {
    pump([
        src(`${path}/assets/css/screen.css`, {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest(`${path}/assets/built/`, {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function doJS(path, done) {
    pump([
        src([
            'themes/_shared/assets/js/lib/**/*.js',
            'themes/_shared/assets/js/main.js',
            `${path}/assets/js/lib/**/*.js`,
            `${path}/assets/js/main.js`,
        ], {sourcemaps: true}),
        concat('main.min.js'),
        uglify(),
        dest(`${path}/assets/built/`, {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function main(done) {
    const tasks = glob.sync('themes/*', {ignore: 'themes/_shared'}).map(path => {
        const packageName = require(`./${path}/package.json`).name;

        function package(taskDone) {
            const hbs = (done) => doHBS(path, done);
            hbs.displayName = `hbs_${packageName}`;

            const css = (done) => doCSS(path, done);
            css.displayName = `css_${packageName}`;

            const js = (done) => doJS(path, done);
            js.displayName = `js_${packageName}`;

            const hbsWatcher = () => watch([`${path}/*.hbs`, `${path}/partials/**/*.hbs`], hbs);
            hbsWatcher.displayName = `hbsWatcher_${packageName}`;

            const cssWatcher = () => watch(`${path}/assets/css/**/*.css`, css);
            cssWatcher.displayName = `cssWatcher_${packageName}`;

            const jsWatcher = () => watch(`${path}/assets/js/**/*.js`, js);
            jsWatcher.displayName = `jsWatcher_${packageName}`;

            const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
            const build = series(css, js);

            series(build, serve, watcher)();
            taskDone();
        }

        package.displayName = packageName;
        return package;
    });

    function sharedCSS(done) {
        glob.sync('themes/*', {ignore: 'themes/_shared'}).map(path => {
            pump([
                src(`${path}/assets/css/screen.css`, {sourcemaps: true}),
                postcss([
                    easyimport,
                    autoprefixer(),
                    cssnano()
                ]),
                dest(`${path}/assets/built/`, {sourcemaps: '.'}),
                livereload()
            ], handleError(done));
        });
    }
    const sharedCSSWatcher = () => watch('themes/_shared/assets/css/**/*.css', sharedCSS);

    function sharedJS(done) {
        glob.sync('themes/*', {ignore: 'themes/_shared'}).map(path => {
            pump([
                src([
                    'themes/_shared/assets/js/lib/**/*.js',
                    'themes/_shared/assets/js/main.js',
                    `${path}/assets/js/lib/**/*.js`,
                    `${path}/assets/js/main.js`,
                ], {sourcemaps: true}),
                concat('main.min.js'),
                uglify(),
                dest(`${path}/assets/built/`, {sourcemaps: '.'}),
                livereload()
            ], handleError(done));
        });
    }
    const sharedJSWatcher = () => watch('themes/_shared/assets/js/**/*.js', sharedJS);

    const sharedWatcher = parallel(sharedCSSWatcher, sharedJSWatcher);

    return series(parallel(...tasks), sharedWatcher, tasksDone => {
        tasksDone();
        done();
    })();
}

function doLint(theme, fix, done) {
    let source = ['themes/*/assets/css/**/*.css'];

    if (theme) {
        source = [`themes/${theme}/assets/css/**/*.css`, 'themes/_shared/assets/css/**/*.css'];
    }

    pump([
        src([...source, '!themes/*/assets/built/*.css'], {base: '.'}),
        gulpStylelint({
            fix: fix,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }),
        dest('./')
    ], handleError(done));
}

function lint(done) {
    doLint(false, true, done);
}

function symlink(done) {
    if (!argv.theme || !argv.site) {
        handleError(done('Required parameters [--theme, --site] missing!'));
    }

    exec(`ln -sfn ${__dirname}/themes/${argv.theme} ${argv.site}/content/themes`);
    done();
}

function test(done) {
    const testLint = lintDone => {
        doLint(false, false, done)
        lintDone();
    };

    const testGScan = gscanDone => {
        glob.sync('themes/*', {ignore: 'themes/_shared'}).forEach(path => {
            exec(`gscan ${path} --colors`, (error, stdout, _stderr) => {
                console.log(stdout);
                if (error) process.exit(1);
            });
        });
        gscanDone();
    }

    return series(testLint, testGScan)();
}

function testCI(done) {
    if (!argv.theme) {
        handleError(done('Required parameter [--theme] missing!'));
    }

    const testLint = lintDone => {
        doLint(argv.theme, false, done)
        lintDone();
    };

    const testGScan = gscanDone => {
        exec(`gscan --fatal --verbose themes/${argv.theme} --colors`, (error, stdout, _stderr) => {
            console.log(stdout);
            if (error) process.exit(1);
        });
        gscanDone();
    }

    return series(testLint, testGScan)();
}

function css(done) {
    doCSS(`./themes/${argv.theme}`, done);
}

function js(done) {
    doJS(`./themes/${argv.theme}`, done);
}

const build = series(css, js);

function zipper(done) {
    if (!argv.theme) {
        handleError(done('Required parameter [--theme] missing!'));
    }

    const filename = require(`./themes/${argv.theme}/package.json`).name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!yarn-error.log'
        ], {cwd: `./themes/${argv.theme}`}),
        zip(filename),
        dest(`themes/${argv.theme}/dist/`)
    ], handleError(done));
}

exports.lint = lint;
exports.symlink = symlink;
exports.test = test;
exports.testCI = testCI;
exports.zip = series(build, zipper);
exports.default = main;
