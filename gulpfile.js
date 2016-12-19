const gulp = require('gulp');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('rollup', () => {
    rollup({
        entry: './src/js/index.js',
        sourceMap: true,
    })
    .pipe(source('script.js', './js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', () => {
    gulp.watch('src/js/**/*.js', ['rollup']);
});

