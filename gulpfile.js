const gulp = require('gulp');
const { series, parallel, watch } = require('gulp');

// JS Files
const {
  compileAndCompressJS,
  compileJS,
  deleteJsDestContents,
} = require('./gulp/gulp_tasks/js_tasks');

const {
  compileSidepanelJS,
  compileAndCompressSidepanelJS,
  deleteSidepanelJsDestContents,
} = require('./gulp/gulp_tasks/js_sidepanel_tasks');

// JS Class File
const {
  compileCompressJsClasses,
  compileJsClasses,
} = require('./gulp/gulp_tasks/js_classes');

// Graphic Files
const {
  minimizeGifs,
  minimizeJpeg,
  minimizeJpegs,
  minimizeJpgs,
  minimizePngs,
  deleteGraphicsDestContents,
} = require('./gulp/gulp_tasks/graphics_tasks');

// SCSS Files
const {
  compileAndCompressSass,
  compileSass,
} = require('./gulp/gulp_tasks/sass_tasks');

// JS Tasks
exports.js = series(compileJS, compileAndCompressJS);
exports.jsclean = series(deleteJsDestContents);
exports.jssp = series(compileSidepanelJS, compileAndCompressSidepanelJS);

// JS Classes Tasks
exports.jsclasses = series(compileCompressJsClasses, compileJsClasses);

// Graphics Tasks
exports.gifs = series(minimizeGifs);
exports.jpgs = series(minimizeJpgs);
exports.jpegs = series(minimizeJpegs);
exports.jpeg = series(minimizeJpeg);
exports.pngs = series(minimizePngs);
exports.graphicsclean = series(deleteGraphicsDestContents);
exports.graphics = series(
  minimizeGifs,
  minimizeJpgs,
  minimizeJpegs,
  minimizePngs
);

// Sass Tasks
exports.sass = series(compileAndCompressSass, compileSass);
