const imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  pump = require('pump'),
  chalk = require('chalk');
del = require('del');

// Handling image compression
const GRAPHICS_SRC = process.env.GRAPHICS_SRC || './gulp/src/graphics/';
const GRAPHICS_DEST = process.env.GRAPHICS_DEST || './public/graphics/';
const PNGS = `${GRAPHICS_SRC}/pngs/*.png`;
const JPEGS = `${GRAPHICS_SRC}/jpegs/*.jpeg`;
const JPGS = `${GRAPHICS_SRC}/jpgs/*.jpg`;
const TECHNIC_2 = `${GRAPHICS_SRC}/jpegs/technic_2.jpeg`;
const GIF = `${GRAPHICS_SRC}/gifs/*.gif`;

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

const minimizeGifs = () => {
  pump(
    [
      gulp.src([GIF]),
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
          optimizationLevel: 3,
          colors: 250,
        }),
      ]),
      gulp.dest(GRAPHICS_DEST),
    ],
    err => {
      if (err) {
        console.log(err);
      }

      console.log('Finished minimizing GIFs');
      return `\n`;
    }
  );
};

const minimizeJpgs = cb => {
  pump(
    [
      gulp.src([JPGS]),
      imagemin([
        imagemin.jpegtran({
          progressive: true,
          arithmetic: false,
        }),
      ]),
      gulp.dest(GRAPHICS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }

      statusHandler('Finished minimizing JPGs');
    }
  );
  cb();
};

const minimizeJpegs = () => {
  pump(
    [
      gulp.src([JPEGS]),
      imagemin([
        imagemin.jpegtran({
          progressive: true,
          arithmetic: false,
        }),
      ]),
      gulp.dest(GRAPHICS_DEST),
    ],
    err => {
      if (err) {
        console.log(err);
      }

      console.log('Finished minimizing JPEGs');
      return `\n`;
    }
  );
};

const minimizeJpeg = cb => {
  pump(
    [
      gulp.src([TECHNIC_2]),
      imagemin([
        imagemin.jpegtran({
          progressive: true,
          arithmetic: false,
        }),
      ]),
      gulp.dest(GRAPHICS_DEST),
    ],
    err => {
      if (err) {
        errorHandler(err);
      }
      statusHandler('Finished minimizing JPEGs');
    }
  );
  cb();
};

const minimizePngs = () => {
  return pump(
    [
      gulp.src([PNGS]),
      imagemin([
        imagemin.optipng({
          optimizationLevel: 3,
          bitDepthReduction: true,
          colorTypeReduction: true,
          paletteReduction: true,
        }),
      ]),
      gulp.dest(GRAPHICS_DEST),
    ],
    err => {
      if (err) {
        console.log(err);
      }

      console.log('Finished minimizing PNGs');
      return `\n`;
    }
  );
};

// Clean up GRAPHICS_DEST directory
const deleteGraphicsDestContents = () => {
  return del([`${GRAPHICS_DEST}**/*`]);
};

module.exports = {
  minimizeGifs,
  minimizeJpeg,
  minimizeJpegs,
  minimizeJpgs,
  minimizePngs,
  deleteGraphicsDestContents,
};
