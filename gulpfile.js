var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')({ lazy: false });

var runSequence = require('run-sequence');

var source = require('vinyl-source-stream2');
var browserify = require('browserify');

var fs = require('graceful-fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);
var readdir = Promise.promisify(fs.readdir);

var rev = require('./gulp-rev');

var argv = require('optimist').argv;
var minify = !!argv.min;

var _ = require('lodash');

var manifestSettings = { manifestPath: './dist/manifest.json', from: './public', to: './dist' };

var manifest = require('./manifest')(manifestSettings.manifestPath, '/public');

var config = require('./config');

gulp.task('styles', function () {
  return gulp.src(['public/css/home.less', 'public/css/index.less'])
    .pipe($.less({
      paths: [ path.join(__dirname, 'public', 'css') ]
    }))
    .pipe($.ejs(manifest, { ext: '.css' }))
    .pipe(minify ? $.autoprefixer('last 2 versions') : gutil.noop())
    .pipe(minify ? $.csso() : gutil.noop())
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest(manifestSettings))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('public/img/**/*.{gif,png,jpg}')
    /*.pipe($.cache($.imagemin({
     optimizationLevel: 3,
     progressive: true,
     interlaced: true
     })))*/
    .pipe(rev())
    .pipe(gulp.dest('dist/img'))
    .pipe(rev.manifest(manifestSettings))
    .pipe(gulp.dest('dist'));
});

gulp.task('favicon', function () {
  return gulp.src('public/favicon.ico')
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest(manifestSettings))
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src('public/font/**')
    .pipe(rev())
    .pipe(gulp.dest('dist/font'))
    .pipe(rev.manifest(manifestSettings))
    .pipe(gulp.dest('dist'));
});

gulp.task('script-main', function () {

  return readBookmarklets().then(function (bookmarklets) {
    var t = _.defaults({}, { bookmarklet:  bookmarklets}, manifest);

    var bundleStream = browserify({
      entries: './public/js/main.js',
      extensions: ['.jsx'],
      fullPaths: false,
      insertGlobals: false,
      detectGlobals: false,
      debug: !minify
    })
      .transform('reactify')
      .require('./node_modules/react/addons.js', { expose: 'react' })
      .require('./node_modules/es6-promise/dist/commonjs/main.js', { expose: 'promise' })
      .require('./public/bower_components/page.js/index.js', { expose: 'page' })
      .require('./public/bower_components/jquery/dist/jquery.js', { expose: 'jquery' })
      .bundle();

    return bundleStream
      .pipe(source('./public/js/main.js'))
      .pipe($.ejs(t, { ext: '.js' }))
      .on('error', gutil.log)
      .pipe(minify ? $.uglify() : gutil.noop())
      .pipe(rev())
      .pipe(gulp.dest('dist/js'))
      .pipe(rev.manifest(manifestSettings))
      .pipe(gulp.dest('dist'));
  })
});

gulp.task('script-index', function () {

  var bundleStream = browserify({
    entries: './public/js/index.js',
    fullPaths: false,
    builtins: false,
    insertGlobals: false,
    detectGlobals: false,
    debug: !minify
  })
    .require('./public/bower_components/jquery/dist/jquery.js', { expose: 'jquery' })
    .bundle();

  return bundleStream
    .pipe(source('./public/js/index.js'))
    .pipe($.ejs(manifest, { ext: '.js' }))
    .pipe(minify ? $.uglify() : gutil.noop())
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest(manifestSettings))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return gulp.src('dist', { read: false }).pipe($.rimraf());
});

gulp.task('build', function (callback) {
  runSequence('images', 'fonts', 'favicon', 'styles', 'script-main', 'script-index', callback);
});

gulp.task('default', function (callback) {
  runSequence('clean', 'build', callback);
});

gulp.task('watch', function () {
  gulp.watch('public/img/**/*', ['images']);

  gulp.watch('public/font/**/*', ['fonts']);

  gulp.watch('public/css/**/*', ['styles']);

  gulp.watch('public/js/**/*', ['script-main', 'script-index']);

});


gulp.task('compile-bookmarklets', function () {
  readBookmarklets();
  return gulp.src('./bookmarklet/**/_*.js')
    .pipe($.rename(function(path) {
      path.basename = path.basename.substr(1);
    }))
    .pipe($.ejs(_.merge({ config: config }, manifest), { ext: '.js' }))
    .pipe($.uglify())
    .pipe(gulp.dest('./bookmarklet/'));
});

function readBookmarklets() {
  return readdir('./bookmarklet/').then(function (files) {
    return files.filter(function (file) {
      return file.substr(file.length - 3) == '.js'
    })
  }).then(function (files) {
    return Promise.all(files.map(function (file) {
      return Promise.join(Promise.resolve(file), readFile('./bookmarklet/' + file, { encoding: 'utf8' }));
    }))
  }).then(function (files) {
    return files.reduce(function (acc, file) {
      acc[file[0].substr(0, file[0].length - 3)] = file[1];
      return acc;
    }, {});
  })
}