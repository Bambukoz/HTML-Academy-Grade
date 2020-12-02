/* eslint-disable no-undef */
'use strict';

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const sync = require(`browser-sync`).create();
const sassGlob = require(`gulp-sass-glob`);
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imageMin = require(`gulp-imagemin`);
const imageWebp = require(`gulp-webp`);
const svgStore = require(`gulp-svgstore`);
const del = require(`del`);
// const minify = require(`gulp-minify`);
// const htmlMin = require(`gulp-htmlmin`);
const ghPages = require(`gulp-gh-pages`);

// Css

const css = () => {
  return gulp.src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(sync.stream());
};

exports.css = css;

// Images

const images = () => {
  return gulp.src(`source/img/**/*.{jpg,png,svg}`)
    .pipe(imageMin([
      imageMin.optipng({
        optimizationLevel: 3
      }),
      imageMin.mozjpeg({
        progressive: true
      }),
      imageMin.svgo(),
    ]))
    .pipe(gulp.dest(`source/img`));
};

exports.images = images;

// WebP

const webp = () => {
  return gulp.src(`source/img/**/*.{jpg,png}`)
    .pipe(imageWebp({
      quality: 90
    }))
    .pipe(gulp.dest(`source/img/webp`));
};

exports.webp = webp;

// Sprite

const sprite = () => {
  return gulp.src(`source/img/svg/icon-*.svg`)
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
};

exports.sprite = sprite;

// HTML

const html = () => {
  return gulp.src(`source/**/*.html`)
    // .pipe(htmlMin({
    //   removeComments: true,
    //   collapseWhitespace: false
    // }))
    .pipe(gulp.dest(`build`));
};

exports.html = html;

// JS

const js = () => {
  return gulp.src(`source/js/**/*.js`)
    // .pipe(minify({
    //   ext: {
    //     min: `.min.js`
    //   }
    // }))
    .pipe(gulp.dest(`build/js`));
};

exports.js = js;

// Copy

const copy = () => {
  return gulp.src([
    `source/fonts/**/*`,
    `source/img/**/*`,
    `source/js/**/*`
  ], {
    base: `source`
  })
    .pipe(gulp.dest(`build`));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del(`build`);
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: `build`
    },
    cors: true,
    open: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Deploy

const deploy = () => {
  return gulp.src(`build/**/*`)
    .pipe(ghPages());
};

exports.deploy = deploy;

// Refresh
const refresh = (done) => {
  sync.reload();
  done();
};

exports.refresh = refresh;

// Watcher

const watch = () => {
  gulp.watch(`source/*.html`, gulp.series(`html`, `refresh`));
  gulp.watch(`source/sass/**/*.scss`, gulp.series(`css`));
  gulp.watch(`source/img/icon-*.svg`, gulp.series(`sprite`, `html`, `refresh`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`js`, `refresh`));
};

const build = gulp.series(
    clean,
    copy,
    css,
    js,
    html
);

exports.build = build;

// Start

exports.default = gulp.series(
    gulp.parallel(
        build
    ),
    gulp.parallel(
        watch,
        server
    )
);
