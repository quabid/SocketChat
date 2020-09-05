const sass = require('gulp-sass'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  pump = require('pump'),
  chalk = require('chalk'),
  del = require('del');

const SASS_SRC = process.env.SASS_SRC || './gulp/src/scss/';
const SASS_DEST = process.env.SASS_DEST || "./public/css/";
// const SASS_DEST = process.env.SASS_DEST || './dist/css/';
const SASS_ALL_FILES = `${SASS_SRC}*.scss`;
const SASS_MAIN = `${SASS_SRC}main.scss`;

const watchOptions = {
  queue: true,
  events: ['add', 'change', 'unlink'],
};

const errorHandler = (err = '') => {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    console.log(`\n\t${err}\n`);
    return '\n';
  }, 500);
};

const statusHandler = (msg = '') => {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    console.log(`\n\t${msg}\n`);
    return '\n';
  }, 500);
};

const compileAndCompressSass = cb => {
  pump(
    [
      gulp.src([SASS_MAIN]),
      concat('style.min.css'),
      sass({ outputStyle: 'compressed' }).on('error', sass.logError),
      gulp.dest(SASS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }
      statusHandler(
        `SASS compilation and compression had successfully completed.`
      );
    }
  );
  cb();
};

const compileSass = cb => {
  pump(
    [
      gulp.src([SASS_MAIN]),
      concat('style.css'),
      sass({ outputStyle: 'expanded' }).on('error', sass.logError),
      gulp.dest(SASS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }
      statusHandler(`SASS compilation finished`);
    }
  );
  cb();
};

module.exports = {
  compileAndCompressSass,
  compileSass,
};
