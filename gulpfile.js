'use strict';

let gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create(),
exec = require('gulp-exec'),
cp = require('child_process');
// spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;


gulp.task('css', function () {
    return gulp.src('_assets/css/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('./docs/css/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});


//  Jekyll

gulp.task('jekyll', () =>  {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: "inherit", shell: true});
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });

    gulp.watch('_assets/css/**/*.css', gulp.series('css'));

    gulp.watch([
        './*.html',
        './_includes/*.html',
        './_layouts/*.html',
        './_posts/**/*.*'
    ]).on('change', gulp.series('jekyll', 'css'));

    gulp.watch('docs/**/*.html').on('change', browserSync.reload);
    gulp.watch('docs/**/*.js').on('change', browserSync.reload);

});

gulp.task('default', gulp.series('css', 'jekyll', 'watch'));