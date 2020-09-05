const imagemin = require('gulp-imagemin'),
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  pump = require('pump'),
  chalk = require('chalk'),
  del = require('del');

require('@babel/core').transform('code', {
  plugins: ['@babel/plugin-transform-strict-mode'],
});

const JS_SRC = process.env.JS_SRC || './gulp/src/js/';
// const JS_DEST = process.env.JS_DEST || "./public/js/";
const JS_DEST = process.env.JS_DEST || './src/assets/js/';
const RESOURCE = `${JS_SRC}resource.js`;
const MENU = `${JS_SRC}menu.js`;
const CALLOUT = `${JS_SRC}callout.js`;
const SIDEPANEL = `${JS_SRC}sidepanel.js`;
const DASHBOARD = `${JS_SRC}dashboard.js`;
const IDEASIDEPANEL = `${JS_SRC}ideasidepanel.js`;
const ACCORDION = `${JS_SRC}accordion.js`;
const IO_ADD_CLIENT = `${JS_SRC}io_addclient.js`;
const MAIN = `${JS_SRC}app.js`;
// const SCRIPTS = `${JS_SRC}*.js`;
const SCRIPTS = [MAIN];
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

// Watch scripts
/* const watcher = watch([SCRIPTS], watchOptions)

watcher.on('change', function(path, stats) {
    console.log(`File ${path} was changed`);
});

watcher.on('add', function(path, stats) {
    console.log(`File ${path} was added`);
});

watcher.on('unlink', function(path, stats) {
   console.log(`File ${path} was removed`);
}); */

// watcher.close();

// JS files
const compileAndCompressJS = cb => {
  pump(
    [
      gulp.src(SCRIPTS),
      babel({
        presets: ['@babel/env'],
      }),
      concat('script.min.js'),
      uglify(),
      gulp.dest(JS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }
      statusHandler(
        `JS compilation and compression had successfully completed.`
      );
    }
  );
  cb();
};

const compileJS = cb => {
  pump(
    [
      gulp.src(SCRIPTS),
      babel({
        presets: ['@babel/env'],
      }),
      concat('script.js'),
      gulp.dest(JS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }
      statusHandler(`JS compilation had successfully completed.`);
    }
  );
  cb();
};

// Clean up JS_DEST directory
const deleteJsDestContents = () => {
  return del([`${JS_DEST}/**/*`]);
};

module.exports = {
  compileAndCompressJS,
  compileJS,
  deleteJsDestContents,
};
