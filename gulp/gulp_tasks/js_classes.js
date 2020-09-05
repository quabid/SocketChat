const uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    pump = require("pump"),
    chalk = require("chalk");
del = require("del");

const JS_SRC = process.env.JS_SRC || "./src/js_classes/";
// const JS_DEST = process.env.JS_DEST || "./public/js/";
const JS_DEST = process.env.JS_DEST || "./express/public/js/";
const CLASSES = `${JS_SRC}*.js`;

const watchOptions = {
    queue: true,
    events: ["add", "change", "unlink"],
};

const errorHandler = (err = "") => {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        console.log(`\n\t${err}\n`);
        return "\n";
    }, 500);
};

const statusHandler = (msg = "") => {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        console.log(`\n\t${msg}\n`);
        return "\n";
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
const compileCompressJsClasses = cb => {
    pump(
        [
            gulp.src([CLASSES]),
            babel({
                presets: ["@babel/env"],
            }),
            concat("classes.min.js"),
            uglify(),
            gulp.dest(JS_DEST),
        ],
        err => {
            if (err) {
                return errorHandler(err);
            }
            return statusHandler(`JS classes compressed compilation finished`);
        }
    );
    cb();
};

const compileJsClasses = cb => {
    pump(
        [
            gulp.src([CLASSES]),
            babel({
                presets: ["@babel/env"],
            }),
            concat("classes.js"),
            // uglify(),
            gulp.dest(JS_DEST),
        ],
        err => {
            if (err) {
                return errorHandler(err);
            }
            return statusHandler(
                `JS classes uncompressed compilation finished`
            );
        }
    );
    cb();
};

module.exports = {
    compileCompressJsClasses,
    compileJsClasses,
};
