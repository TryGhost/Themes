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
const rename = require('gulp-rename');
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
};

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
            `${path}/assets/js/lib/*.js`,
            `${path}/assets/js/main.js`
        ], {sourcemaps: true}),
        concat('main.min.js'),
        uglify(),
        dest(`${path}/assets/built/`, {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function main(done) {
    const tasks = glob.sync('packages/*').map(path => {
        const packageName = path.replace('packages/', '');

        function package(taskDone) {
            function hbs(done) {
                pump([
                    src([`${path}/*.hbs`, `${path}/partials/**/*.hbs`]),
                    livereload()
                ], handleError(done));
            }
            hbs.displayName = `hbs_${packageName}`;

            function css(done) {
                doCSS(path, done);
            }
            css.displayName = `css_${packageName}`;

            function js(done) {
                doJS(path, done);
            }
            js.displayName = `js_${packageName}`;

            const hbsWatcher = () => watch([`${path}/*.hbs`, `${path}/partials/**/*.hbs`], hbs);
            const cssWatcher = () => watch(`${path}/assets/css/**/*.css`, css);
            const jsWatcher = () => watch(`${path}/assets/js/**/*.js`, js);
            const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
            const build = series(css, js);

            series(build, serve, watcher)();
            taskDone();
        }

        package.displayName = packageName;
        return package;
    });

    function sharedCSS(done) {
        pump([
            src(`packages/*/assets/css/screen.css`, {sourcemaps: true}),
            postcss([
                easyimport,
                autoprefixer(),
                cssnano()
            ]),
            rename(function (path) {
                path.dirname = path.dirname.replace('css', 'built');
            }),
            dest('packages/', {sourcemaps: '.'}),
            livereload()
        ], handleError(done));
    }

    const sharedCSSWatcher = () => watch('packages/_shared/assets/css/**/*.css', sharedCSS);
    const sharedWatcher = parallel(sharedCSSWatcher);

    return parallel(...tasks, sharedWatcher, parallelDone => {
        parallelDone();
        done();
    })();
}

function lint(done) {
    pump([
        src(['packages/**/*.css', '!packages/*/assets/built/*.css']),
        gulpStylelint({
            fix: true,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }),
        dest('packages/')
    ], handleError(done));
}

function symlink(done) {
    if (!argv.theme || !argv.site) {
        handleError(done('Required parameters [--theme, --site] missing!'));
    }

    exec(`ln -sfn ~/Developer/Themes/packages/${argv.theme} ${argv.site}/content/themes`);
    done();
}

function test(done) {
    glob.sync('packages/*').forEach(path => {
        if (path !== 'packages/_shared') {
            exec(`gscan ${path} --colors`, (error, stdout, _stderr) => {
                console.log(stdout);
                if (error) process.exit(1);
            });
        }
    });
    done();
}

function testCI(done) {
    if (!argv.theme) {
        handleError(done('Required parameter [--theme] missing!'));
    }

    exec(`gscan --fatal --verbose packages/${argv.theme} --colors`, (error, stdout, _stderr) => {
        console.log(stdout);
        if (error) process.exit(1);
    });
    done();
}

exports.lint = lint;
exports.symlink = symlink;
exports.test = test;
exports.testCI = testCI;
exports.default = main;
