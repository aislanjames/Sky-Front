import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import browserSyncPackage from 'browser-sync';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import replace from 'gulp-replace';

const sassCompiler = gulpSass(sass);
const browserSync = browserSyncPackage.create();

// Compilar SASS para CSS e minificar
function buildStyles() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(replace('../fonts/', 'fonts/')) // Ajuste os caminhos conforme necessário
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Copiar HTML para dist
function copyHtml() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Copiar e otimizar imagens
async function copyImages() {
  return gulp.src('src/assets/img/**/*')
    .pipe(imagemin([
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('dist/assets/img'));
}

// Copiar JS para dist
function copyJs() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

function copyFonts() {
  return gulp.src('node_modules/bootstrap-icons/font/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
}


// Servir e observar mudanças
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('src/scss/**/*.scss', buildStyles);
  gulp.watch('src/*.html', copyHtml);
  gulp.watch('src/assets/img/**/*', copyImages);
  gulp.watch('src/js/**/*.js', copyJs);
}

// Definir tarefas
gulp.task('build', gulp.parallel(buildStyles, copyHtml, copyImages, copyJs, copyFonts));
gulp.task('watch', gulp.series('build', serve));