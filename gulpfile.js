/**
 * Created by Rahul on 19/1/15.
 */

(function () {
  'use strict';
  var gulp = require("gulp");
  var plug = require('gulp-load-plugins')();
  var config = require('./gulp.config');

  gulp.task('minify', function () {
    var DEST = './client/build';
    return gulp.src(config.js_files)
      .pipe(plug.ngAnnotate())
      .pipe(plug.concat('all.js'))
      // This will output the non-minified version
      .pipe(gulp.dest(DEST))
      // This will minify and rename to foo.min.js
      .pipe(plug.uglify())
      .pipe(plug.rename({extname: '.min.js'}))
      .pipe(gulp.dest(DEST));
  });

}());