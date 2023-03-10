const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer'); 
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Compilando o sass, adicionando autoprefixed e dando refresh na pagina
function compilaSass() {
    return gulp.src('./scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream())
        
}
// Tarefa do Sass
gulp.task('sass', compilaSass);

function pluginsCSS() {
    return gulp.src('./css/lib/*.css')
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
}

gulp.task('plugincss', pluginsCSS);

// Concatenando todos os scripts em apenas um arquivo: all.js
function gulpJs() {
    return gulp.src('./js/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./js/')) 
        .pipe(browserSync.stream())  
}
// Tarefa do concat
gulp.task('alljs', gulpJs);

function pluginsJs() {
    return gulp.src(['./js/lib/aos.min.js', './js/lib/swiper.min.js'])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());  
}
gulp.task('pluginjs', pluginsJs);

// Função do browserSync
function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}
// Tarefa do browserSync
gulp.task('browser-sync', browser);


// Função do watch para alterações em scss e html
function watch() {
    gulp.watch('./scss/*.scss', compilaSass);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./js/scripts/*.js', gulpJs);
    gulp.watch('./js/lib/*.js', pluginsJs);
    gulp.watch('./css/lib/*.css', pluginsCSS);

}
// Tarefa do watch
gulp.task('watch', watch);


// Tarefas default que executa o watch e o browserSync em Paralelo
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugincss', 'alljs', 'pluginjs'));