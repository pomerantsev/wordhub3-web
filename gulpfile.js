'use strict';

const dotenv = require('dotenv');
dotenv.config({silent: true});

const gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  notifier = require('node-notifier'),
  runSequence = require('run-sequence');

const notify = error => {
  notifier.notify({
    title: error.plugin,
    message: error.message
  });
  console.error(error);
};

const basePaths = {
  src: './src/',
  dest: './dist/'
};

const folders = {
  scripts: 'scripts',
  styles: 'styles',
  images: 'images'
};



/* ---------- Scripts ---------- */

gulp.task('eslint', () => {
  return gulp.src(basePaths.src + folders.scripts + '/**/*.{js,jsx}')
    .pipe($.plumber(notify))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

function getCommonScriptsTransform (opts) {
  return browserify({
    entries: [basePaths.src + folders.scripts + '/index.jsx'],
    debug: opts.debug
  }).transform('babelify', {
    presets: ['es2015', 'react'],
    plugins: ['transform-object-rest-spread']
  }).bundle();
}

gulp.task('scripts:dev', ['eslint'], () => {
  return getCommonScriptsTransform({debug: true})
    .on('error', error => {
      notify(error);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.envify(process.env))
    .pipe(gulp.dest(basePaths.dest + folders.scripts))
    .pipe($.livereload());
});

gulp.task('scripts:prod', ['eslint'], () => {
  return getCommonScriptsTransform({debug: false})
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.envify(process.env))
    .pipe($.uglify())
    .pipe(gulp.dest(basePaths.dest + folders.scripts));
});



/* ---------- Styles ---------- */

const autoprefixerOptions = {
  browsers: [
    'last 2 iOS versions',
    'last 5 Android versions',
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'Explorer >= 10']
};

gulp.task('styles:dev', () => {
  return gulp.src(basePaths.src + folders.styles + '/main.scss')
    .pipe($.plumber(notify))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(basePaths.dest + folders.styles))
    .pipe($.livereload());
});

gulp.task('styles:prod', () => {
  return gulp.src(basePaths.src + folders.styles + '/main.scss')
    .pipe($.sass())
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.cssnano())
    .pipe(gulp.dest(basePaths.dest + folders.styles));
});



/* ---------- Images ---------- */

gulp.task('images:dev', () => {
  return gulp.src(basePaths.src + folders.images + '/**/*')
    .pipe(gulp.dest(basePaths.dest + folders.images))
    .pipe($.livereload());
});

gulp.task('images:prod', () => {
  return gulp.src(basePaths.src + folders.images + '/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest(basePaths.dest + folders.images));
});



/* ---------- Html ---------- */

gulp.task('html', () => {
  return gulp.src(basePaths.src + '/*.html')
    .pipe(gulp.dest(basePaths.dest))
    .pipe($.livereload());
});



/* ---------- Gulpfile ---------- */

gulp.task('gulpfile', () => {
  gulp.src('./gulpfile.js')
    .pipe($.plumber(notify))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});



/* ---------- Dev: serve & watch ---------- */

gulp.task('build:dev', [
  'scripts:dev',
  'styles:dev',
  'images:dev',
  'html'
]);

gulp.task('connect:dev', ['build:dev'], () => {
  $.connect.server({
    root: basePaths.dest,
    host: '0.0.0.0',
    port: 9000,
    livereload: true
  });
});

gulp.task('watch', ['connect:dev'], () => {
  $.livereload.listen();

  $.watch(basePaths.src + folders.scripts + '/**/*.{js,jsx}', () => {
    gulp.start('scripts:dev');
  });

  $.watch(basePaths.src + folders.styles + '/**/*.scss', () => {
    gulp.start('styles:dev');
  });

  $.watch(basePaths.src + folders.images + '/**/*', () => {
    gulp.start('images:dev');
  });

  $.watch(basePaths.src + '/*.html', () => {
    gulp.start('html');
  });

  $.watch('./gulpfile.js', () => {
    gulp.start('gulpfile');
  });
});

gulp.task('default', [
  'watch'
]);



/* ---------- Prod: build & serve ---------- */

gulp.task('clean:dist', () => {
  return del([
    basePaths.dest + '**/*'
  ]);
});

gulp.task('build:prod', callback => {
  runSequence(
    'clean:dist',
    [
      'scripts:prod',
      'styles:prod',
      'images:prod',
      'html'
    ],
    callback
  );
});

gulp.task('connect:prod', ['build:prod'], () => {
  $.connect.server({
    root: basePaths.dest,
    host: '0.0.0.0',
    port: 9000,
    keepalive: true
  });
});
