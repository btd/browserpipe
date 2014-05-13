var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')({ lazy: false });

var runSequence = require('run-sequence');

var source = require('vinyl-source-stream2');
var browserify = require('browserify');

var rev = require('./gulp-rev');

var argv = require('optimist').argv;
var minify = !!argv.min;

var manifestSettings = { manifestPath: './dist/manifest.json', from: './public', to: './dist' };

var manifest = require('./manifest')(manifestSettings.manifestPath, '/public');

gulp.task('styles', function () {
    return gulp.src(['public/css/app.less', 'public/css/index.less'])
        .pipe($.less({
            paths: [ path.join(__dirname, 'public', 'css') ]
        }))
        .pipe($.ejs(manifest, { ext: '.css' }))
        .pipe(minify ? $.autoprefixer('last 2 versions') : gutil.noop() )
        .pipe(minify ? $.csso() : gutil.noop() )
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

    var bundleStream = browserify({
        entries: './public/js/main.js',
        extensions: ['.jsx'],
        fullPaths: false,
        builtins: false
    })
        .transform('reactify')
        .require('./node_modules/react/addons.js', { expose: 'react' })
        .require('./public/bower_components/page.js/index.js', { expose: 'page' })
        .require('./public/bower_components/jquery/dist/jquery.js', { expose: 'jquery' })
        .require('./public/bower_components/bootstrap/js/dropdown.js', { expose: 'bootstrap-dropdown' })
        .require('./public/bower_components/bootstrap/js/modal.js', { expose: 'bootstrap-modal' })
        .require('./public/bower_components/messenger/build/js/messenger.js', { expose: 'messenger' })
        .require('./public/bower_components/moco/index.js', { expose: 'moco' })
        .require('./public/bower_components/emitter/index.js', { expose: 'emitter' })
        .require('./public/bower_components/socket.io-client/dist/socket.io.js', { expose: 'socket.io-client'})
        .require('./public/bower_components/bytes/index.js', { expose: 'bytes'})
        .ignore('emitter-component')
        .bundle({
            insertGlobals: false,
            detectGlobals: false,
            debug: !minify
        });

    return bundleStream
        .pipe(source('./public/js/main.js'))
        .pipe($.ejs(manifest, { ext: '.js' }))
        .pipe(minify ? $.uglify() : gutil.noop())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest(manifestSettings))
        .pipe(gulp.dest('dist'));
});

gulp.task('script-index', function () {

    var bundleStream = browserify({
        entries: './public/js/index.js',
        fullPaths: false,
        builtins: false
    })
        .require('./public/bower_components/jquery/dist/jquery.js', { expose: 'jquery' })
        .bundle({
            insertGlobals: false,
            detectGlobals: false,
            debug: !minify
        });

    return bundleStream
        .pipe(source('./public/js/index.js'))
        .pipe($.ejs(manifest, { ext: '.js' }))
        .pipe(minify ? $.uglify(): gutil.noop())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest(manifestSettings))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src('dist', { read: false }).pipe($.clean());
});

gulp.task('build', function(callback) {
    runSequence('images', 'fonts', 'favicon', 'styles', 'script-main', 'script-index', callback);
});

gulp.task('default', function(callback) {
    runSequence('clean', 'build', callback);
});

gulp.task('watch', function() {
    gulp.watch('public/css/**/*', ['styles']);

    gulp.watch('public/js/**/*', ['script-main', 'script-index']);

    gulp.watch('public/img/**/*', ['images']);

    gulp.watch('public/font/**/*', ['fonts']);
});
