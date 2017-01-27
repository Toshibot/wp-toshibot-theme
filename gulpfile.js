
// Requires

var gulp = require('gulp');
var php = require('gulp-connect-php');
var del = require('del');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

//
// Clean
// ==========================================================================

// Clean Dist Folder
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

//
// Browser Preview
// ==========================================================================

// PHP Server
gulp.task('php', function() {
    php.server({base: 'build', port: 8005, keepalive: true});
});

// Browser Preview and Synchronisation
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
        port: '8081',
    });
});

//
// CSS
// ==========================================================================

// Compile SASS
gulp.task('sass', function(){
  return gulp.src('app/scss/styles.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('app/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

// Migrate CSS Plugins
gulp.task('css-plugins', function() {
    return gulp.src('app/css/plugins/**/*.css')
        .pipe(gulp.dest('dist/css/plugins'))
});

// CSS Build Sequence - Compile Sass, then Minify CSS
gulp.task('build-css', function(callback) {
    runSequence('sass', 'minify-css', 'css-plugins', callback)
});


//
// JS
// ==========================================================================

// Global
// ======

// Concatenate JS Files into one main.js file
gulp.task('concat', function () {
    return gulp.src(['app/js/_dev/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js'));
});

// Compress and migrate main.js file
gulp.task('compress', function (callback) {
    return gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// Migrate JS Plugins
gulp.task('js-plugins', function() {
    return gulp.src('app/js/plugins/*.js')
        .pipe(gulp.dest('dist/js/plugins'));
});

// JS Build Sequence
gulp.task('build-js', function(callback) {
    runSequence('concat', 'compress', 'js-plugins', callback);
});

//
// Migrate HTML, Fonts, Images and Icons
// ==========================================================================

// Copy Fonts to 'dist'
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

// Copy HTML to 'dist'
gulp.task('html', function() {
    return gulp.src(['app/*.{html,htm,php,css}'])
        .pipe(gulp.dest('dist'));
});

// Template parts
gulp.task('template-parts', function(){
    return gulp.src(['app/template-parts/**/*'])
        .pipe(gulp.dest('dist/template-parts'))
});

// Copy Images to 'dist'
gulp.task('images', function() {
    return gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
});

// Copy icons to 'dist'
gulp.task('icons', function() {
    return gulp.src('app/*.{png,ico}')
        .pipe(gulp.dest('dist'));
});

// Migration Sequence
gulp.task('migrate-assets', function(callback) {
    runSequence('fonts', 'html', 'template-parts', 'images', 'icons', callback);
});

//
// Main Build Sequence
// ==========================================================================

gulp.task('global-build-sequence', function(callback) {
    runSequence('clean:dist', 'migrate-assets', 'build-js', 'build-css', 'browserSync', callback);
});

//
// Global Gulp Build and Watch Task
// ==========================================================================

gulp.task('default', ['global-build-sequence'], function() {
    
    // Watch SCSS Files for Changes
    gulp.watch('app/scss/**/*.scss', ['build-css']);

    // Watch JS Files for Changes
    gulp.watch('app/js/**/*.js', ['build-js']);

    // Watch HTML, HTM and PHP files for Changes
    gulp.watch('app/*.{html,htm,php,png,css}', ['html']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/css/*.css', browserSync.reload);
    gulp.watch('dist/*.{html,htm,php}', browserSync.reload); 
    gulp.watch('dist/js/**/*.js', browserSync.reload); 
});

