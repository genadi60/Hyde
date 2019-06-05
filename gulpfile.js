'use strict';

let gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create(),
exec = require('gulp-exec'),
spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;

gulp.task('css', function () {
    return gulp.src('_assets/css/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('./docs/css/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

/*
*  Jekyll*/

gulp.task('jekyll', () =>  {
    return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: "inherit"});
});

/*gulp.task('build-jekyll', function () {
    return gulp.src(['./!*.html', './_layouts/!**!/!*.html', './_posts/!**!/!*.markdown'])
        .pipe(exec('jekyll build', options))
        .pipe(exec.reporter(reportOptions));
});*/

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
    ]).on('change', gulp.series('css', 'jekyll'));

    gulp.watch('docs/**/*.html').on('change', browserSync.reload);
    gulp.watch('docs/**/*.js').on('change', browserSync.reload);

});

gulp.task('default', gulp.series('css', 'jekyll', 'watch'));