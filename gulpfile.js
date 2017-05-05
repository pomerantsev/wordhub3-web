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
  assets: './assets/',
  clientCode: './client-code',
  serviceWorker: './service-worker',
  sharedCode: './shared-code',
  serverCode: './server-code',
  dest: './dist/'
};

const mainClientFile = basePaths.clientCode + '/client.jsx';
const serviceWorkerFile = basePaths.serviceWorker + '/service-worker.js';

const folders = {
  scripts: 'scripts',
  styles: 'styles',
  images: 'images'
};



/* ---------- Scripts ---------- */

gulp.task('eslint', () => {
  return gulp.src([
    basePaths.serverCode + '/**/*.{js,jsx}',
    basePaths.clientCode + '/**/*.{js,jsx}',
    basePaths.serviceWorker + '/**/*.js',
    basePaths.sharedCode + '/**/*.{js,jsx}'
  ])
    .pipe($.plumber(notify))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

function getCommonScriptsTransform (file, opts) {
  process.env.BABEL_ENV = 'browser';
  return browserify({
    entries: [file],
    debug: opts.debug
  }).transform('babelify')
    .bundle();
}

gulp.task('scripts:dev', ['eslint'], () => {
  process.env.NODE_ENV = 'development';
  return getCommonScriptsTransform(mainClientFile, {debug: true})
    .on('error', error => {
      notify(error);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.envify(process.env))
    .pipe(gulp.dest(basePaths.dest + folders.scripts));
});

gulp.task('scripts:prod', ['eslint'], () => {
  process.env.NODE_ENV = 'production';
  return getCommonScriptsTransform(mainClientFile, {debug: false})
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.envify(Object.assign({}, process.env, {
      NODE_ENV: process.env.NODE_ENV_PROD,
      API_SERVER: process.env.API_SERVER_PROD
    })))
    .pipe($.uglify())
    .pipe(gulp.dest(basePaths.dest + folders.scripts));
});



gulp.task('service-worker:dev', ['eslint'], () => {
  process.env.NODE_ENV = 'development';
  return getCommonScriptsTransform(serviceWorkerFile, {debug: true})
    .on('error', error => {
      notify(error);
      this.emit('end');
    })
    .pipe(source('service-worker.js'))
    .pipe(buffer())
    .pipe($.envify(process.env))
    .pipe(gulp.dest(basePaths.dest));
});

gulp.task('service-worker:prod', ['eslint'], () => {
  process.env.NODE_ENV = 'production';
  return getCommonScriptsTransform(serviceWorkerFile, {debug: false})
    .pipe(source('service-worker.js'))
    .pipe(buffer())
    .pipe($.envify(Object.assign({}, process.env, {
      NODE_ENV: process.env.NODE_ENV_PROD,
      API_SERVER: process.env.API_SERVER_PROD
    })))
    .pipe($.uglify())
    .pipe(gulp.dest(basePaths.dest));
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
  return gulp.src(basePaths.assets + folders.styles + '/main.scss')
    .pipe($.plumber(notify))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(basePaths.dest + folders.styles));
});

gulp.task('styles:prod', () => {
  return gulp.src(basePaths.assets + folders.styles + '/main.scss')
    .pipe($.sass())
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.cssnano())
    .pipe(gulp.dest(basePaths.dest + folders.styles));
});



/* ---------- Images ---------- */

gulp.task('images:dev', () => {
  return gulp.src(basePaths.assets + folders.images + '/**/*')
    .pipe(gulp.dest(basePaths.dest + folders.images));
});

gulp.task('images:prod', () => {
  return gulp.src(basePaths.assets + folders.images + '/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest(basePaths.dest + folders.images));
});



gulp.task('copy', () => {
  return gulp.src(basePaths.assets + '/*')
    .pipe(gulp.dest(basePaths.dest));
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
  'service-worker:dev',
  'styles:dev',
  'images:dev',
  'copy'
]);

gulp.task('connect:dev', ['build:dev'], () => {
  $.connect.server({
    root: basePaths.dest,
    host: '0.0.0.0',
    port: 9000
  });
});

gulp.task('watch', ['connect:dev'], () => {
  $.watch([
    basePaths.serverCode + '/**/*.{js,jsx}',
    basePaths.clientCode + '/**/*.{js,jsx}',
    basePaths.sharedCode + '/**/*.{js,jsx}'
  ], () => {
    gulp.start('scripts:dev');
  });

  $.watch(basePaths.serviceWorker + '/**/*.js', () => {
    gulp.start('service-worker:dev');
  });

  $.watch(basePaths.assets + folders.styles + '/**/*.scss', () => {
    gulp.start('styles:dev');
  });

  $.watch(basePaths.assets + folders.images + '/**/*', () => {
    gulp.start('images:dev');
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
      'service-worker:prod',
      'styles:prod',
      'images:prod',
      'copy'
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
