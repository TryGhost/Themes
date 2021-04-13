const {src, dest} = require('gulp');
const pump = require('pump');
const gulpStylelint = require('gulp-stylelint');

function handleError(done) {
    return function (err) {
        if (err) beeper();
        return done(err);
    };
};

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
