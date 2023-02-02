// Импорт пакетов
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const gulpPug = require('gulp-pug')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  // pug
  pug: {
    src: ['src/*.pug', 'src/**/*.pug', 'src/**/**/*.pug'],
    dest: 'dist/'
  },
  // html
  html: {
    src: ['src/*.html', 'src/**/*.html', 'src/**/**/*.html'],
    dest: 'dist/'
  },
  // css
  styles: {
    src: [
      'src/*.css', 'src/**/*.css', 'src/*.scss', 'src/**/*.scss'
    ],
    dest: 'dist/css/'
  },
  // js
  scripts: {
    src: ['src/*.js', 'src/**/*.js', 'src/**/**/*.js'],
    dest: 'dist/js/'
  },
  // imagemin
  images: {
    src: ['src/img/**', 'src/img/**/**', 'src/img/**/**/**'],
    dest: 'dist/img/'
  },
  // copy fonts
  fonts: {
    src: ['src/fonts/**', 'src/fonts/**/**', 'src/fonts/**/**/**'],
    dest: 'dist/fonts/'
  }
}

// Очистить каталог dist, удалить все кроме изображений
// return del(['dist/*', '!dist/img']);
function clean() {
  return del(['dist/*', 'dist/img']);
}

// Обработка html
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// Обработка pug
function pug() {
  return gulp.src(paths.pug.src)
    .pipe(gulpPug())
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

// Обработка Java Script
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

// копирование фамлов из fonts
function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(newer(paths.fonts.dest))
    .pipe(gulp.dest(paths.fonts.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.pug.dest).on('change', browsersync.reload)
  gulp.watch(paths.pug.src, pug)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
  gulp.watch(paths.fonts.src, fonts)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.html = html
exports.pug = pug
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.fonts = fonts
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, pug, gulp.parallel(img, styles, scripts, fonts), watch)