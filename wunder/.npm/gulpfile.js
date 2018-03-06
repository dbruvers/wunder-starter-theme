// Imports
var gulp = require('gulp-help')(require('gulp'));
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gulpSequence = require('gulp-sequence');
var watch = require('gulp-watch');
var notify = require('gulp-notify');

// Config
var config = require("./config.json");

/*------------------------------------------------------------------
 [SASS error logging]
 -------------------------------------------------------------------*/
var sassError = function (error) {
  var errorString = '' + error.messageOriginal; // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if (error.file)
    errorString += ' in ' + error.file;

  if (error.line)
    errorString += ' on line ' + error.line;

  if (error.column)
    errorString += ', column ' + error.column;

  gutil.log(gutil.colors.black.bgRed('[SASS ERROR]') + " - " + errorString);
};

/*------------------------------------------------------------------
 [Minify CSS]
 -------------------------------------------------------------------*/
gulp.task("minify-css", "Minify CSS files for production", function () {
  gulp.src(config.path.css + "/*.css")
    .pipe(cssnano())
    .pipe(gulp.dest(config.path.css));
});

/*------------------------------------------------------------------
 [Compile SASS]
 -------------------------------------------------------------------*/
gulp.task("sass", "Compiles SCSS files to CSS", function () {
  return gulp.src(config.path.scss + "/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: [
        require("node-neat").includePaths,
        require("node-normalize-scss").includePaths
      ],
      outputStyle: "expanded"
    }))
    .on('error', function (err) {
      sassError(err);
      return this.emit("end");
    })
    .pipe(prefix(config.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.path.css))
    .pipe(browserSync.stream())
    .pipe(notify({message: 'Styles task complete'}));
});

/*------------------------------------------------------------------
 [Browsersync]
 -------------------------------------------------------------------*/
gulp.task("browser-sync", "Keep multiple browsers & devices in sync when building websites", function () {
  browserSync.init({
    proxy: config.browsersync.proxy,
    notify: false
  });
});

/*------------------------------------------------------------------
 [Watch files and folders]
 -------------------------------------------------------------------*/
gulp.task("watch", "Watch SCSS files", function () {
  watch(config.path.scss + "/**/*.scss", {src: config.path.scss}, function () {
    gulp.start("sass");
  });
});

/*------------------------------------------------------------------
 [Default task]
 -------------------------------------------------------------------*/
gulp.task("default", gulpSequence("serve"));

/*------------------------------------------------------------------
 [Compile task]
 -------------------------------------------------------------------*/
gulp.task("compile", gulpSequence("sass", "minify-css"));

/*------------------------------------------------------------------
 [Serve task]
 -------------------------------------------------------------------*/
gulp.task("serve", gulpSequence("sass", "watch", "browser-sync"));
