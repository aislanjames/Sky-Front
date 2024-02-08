const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Função para compilar SASS para CSS
function buildStyles() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream()); // Adiciona esta linha para injetar mudanças de CSS
}

// Função para iniciar o Browser-Sync
function serve() {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });

  // Observa mudanças nos arquivos SASS, HTML e JS
  gulp.watch('src/scss/**/*.scss', buildStyles);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
}

// Definindo tarefas
gulp.task('build', buildStyles);
gulp.task('watch', gulp.series(buildStyles, serve)); // Modifique esta linha
