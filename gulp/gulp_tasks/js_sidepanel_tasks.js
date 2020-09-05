const imagemin = require('gulp-imagemin'),
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
const JS_DEST = process.env.JS_DEST || './src/assets/js/sidepanel';
const IO_ADD_CLIENT = `${JS_SRC}io_addclient.js`;
const SCRIPTS = [IO_ADD_CLIENT];
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
const compileAndCompressSidepanelJS = cb => {
  pump(
    [
      gulp.src(SCRIPTS),
      babel({
        presets: ['@babel/env'],
      }),
      concat('sidepanel.min.js'),
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

const compileSidepanelJS = cb => {
  pump(
    [
      gulp.src(SCRIPTS),
      babel({
        presets: ['@babel/env'],
      }),
      concat('sidepanel.js'),
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
const deleteSidepanelJsDestContents = () => {
  return del([`${JS_DEST}/**/*`]);
};

module.exports = {
  compileAndCompressSidepanelJS,
  compileSidepanelJS,
  deleteSidepanelJsDestContents,
};
