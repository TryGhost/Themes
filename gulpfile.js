const {series, parallel, watch, src, dest} = require('gulp');
const pump = require('pump');
const glob = require('glob');

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
            css.displayName = `css_${packageName}`;

            function js(done) {
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
            js.displayName = `js_${packageName}`;

            function allCSS(done) {
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

            const hbsWatcher = () => watch([`${path}/*.hbs`, `${path}/partials/**/*.hbs`], hbs);
            const cssWatcher = () => watch(`${path}/assets/css/**/*.css`, packageName === '_shared' ? allCSS : css);
            const jsWatcher = () => watch(`${path}/assets/js/**/*.js`, js);
            const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
            const build = series(css, js);

            series(build, serve, watcher)();
            taskDone();
        }

        package.displayName = packageName;
        return package;
    });

    return parallel(...tasks, parallelDone => {
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

exports.lint = lint;
exports.default = main;
