const gulp = require('gulp')
const clean = require('gulp-clean')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const runSequence = require('run-sequence')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()


// eslint 检测
gulp.task('lint', function() {
  gulp.src(['./src/js/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// 压缩 js
gulp.task('js', function() {
  gulp.src(['./src/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.reload({
            stream: true
        }));
})

// 编译 sass
gulp.task('sass', function() {
  gulp.src(['./src/sass/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
})

// 压缩图片
gulp.task('imagemin', function() {
  gulp.src(['./src/img/*', './src/img/*/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
})

// 清除文件
gulp.task('clean', function(cb) {
  gulp.src(['./dist/']).pipe(clean())
})

// 监视文件变动
gulp.task('watch', function() {
  gulp.watch(['./src/js/*.js', './resources/assets/js/*/*.js'], ['js'])
  gulp.watch(['./src/sass/*.scss'], ['sass'])
})

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  gulp.watch(['./src/js/*.js'], ['lint', 'js'])
  gulp.watch(['./src/sass/*.scss'], ['sass'])
  gulp.watch(["./*.html"]).on('change', browserSync.reload)
})

gulp.task('build', ['clean'], function(){
  runSequence['js', 'sass','imagemin']
})
gulp.task('default', ['serve'])