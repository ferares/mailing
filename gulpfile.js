const gulp      = require('gulp');
const inlineCss = require('gulp-inline-css');

const html = 'src/mailing.html';

gulp.task('default', () =>
  gulp.src(html)
  .pipe(inlineCss())
  .pipe(gulp.dest('build/'))
);
