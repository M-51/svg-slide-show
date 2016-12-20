const gulp = require('gulp');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('gulp-babel');
const gzip = require('gulp-gzip');

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

gulp.task('minify', () => {
    gulp.src('./dist/js/script.js')
    .pipe(babel({ presets: ['babili'], comments: false }))
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gzip({ gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', () => {
    gulp.watch('src/js/**/*.js', ['rollup']);
});

gulp.task('production', ['rollup', 'minify']);

