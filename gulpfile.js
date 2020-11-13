const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('compile-sass',()=>{
    // from where to get the files
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','Src/scss/*.scss'])
    .pipe(sass()) // pipe to compile the sass
    .pipe(gulp.dest('Src/css')) // move it in the destination file
    .pipe(browserSync.stream()) // for brower injection
});

//move the js file
gulp.task('move-js',function(){
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/tether/dist/js/tether.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/jaaulde-cookies/lib/jaaulde-cookies.js'])
    .pipe(gulp.dest('Src/js'))
    .pipe(browserSync.stream()) // for brower injection
});

//run server
// watch for any changes in scr/scss folder and reload the browser
// watch for html changes
gulp.task('launch-server',['compile-sass'],function(){
    browserSync.init({
        server:'./Src'
    })
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss','Src/scss/*.scss'],['compile-sass'])
    gulp.watch('Src/*.html').on('change',browserSync.reload)
})

//this will trigger all the tasks
gulp.task('default',['move-js','launch-server']);