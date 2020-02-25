var gulp = require("gulp");
var browserSync = require('browser-sync'); // 浏览器实时响应
var sass = require('gulp-sass'); // sass编译
var sourcemaps = require("gulp-sourcemaps"); // sourcemap
var del = require('del'); // 删除文件
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer'); // css前缀补全
var minifycss = require('gulp-clean-css'); // css压缩
var replace = require('gulp-replace'); // 文本替换
var rev = require('gulp-rev');//添加md5值
var revReplace = require('gulp-rev-replace');
var htmlminify = require("gulp-html-minify");

var env = 'dist';
var outPath = 'dist';
// 监视文件改动并重新载入
gulp.task('serve', function () {
    browserSync.init({
        server: "src"
    });
    gulp.watch('src/cdh/super/sass/*.scss', ['autoprefixer']);
    gulp.watch(["src/dvd/**/*.html", "src/cdh/super/sass/*.scss", "src/js/**/*.js"]).on('change', browserSync.reload);
});

//autoFx，压缩css
gulp.task('autoprefixer', function () {
    /*if (env == 'dist') {
        return gulp.src('src/dvd/sass/super*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0', 'Firefox >= 20'],
                remove: false //是否去掉不必要的前缀 默认：true
            }))
            .pipe(minifycss()) //执行压缩
            .pipe(gulp.dest('src/dvd/css'));
    } else {
        return gulp.src('src/dvd/sass/super*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest('src/dvd/css'))
    }*/
});

gulp.task("build:js", function () {
    // 改动过的js文件压缩 加md5 放到dist的js目录下面
    gulp.src(['src/js/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/js/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('rev/js'));
});

gulp.task("build:css", function () {
    // css压缩处理
    gulp.src('src/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/css/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest("rev/css/"));
});

//处理页面
gulp.task('build:html', function () {
    gulp.src('src/dvd/**/*.html')
        .pipe(htmlminify())
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/dvd/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest("rev/html/"));
});

//处理页面
gulp.task('dev:html', function () {
    gulp.src('src/dvd/**/*.html')
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/dvd/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest("rev/html/"));
});

//部分文件直接复制
gulp.task('build:cdn', function () {
    gulp.src('src/cdn/**/*.*').pipe(gulp.dest(outPath + "/cdn/"));
});

gulp.task('replace', function () {
    var manifest = gulp.src("rev/**/rev-manifest.json");
    return gulp.src("src/*.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(htmlminify())
        .pipe(gulp.dest("dist"));
});

//清除之前生成的文件
gulp.task('clean', function (cb) {
    return del(['dist/*'], cb);
});

gulp.task('default', function (cb) {
    console.log('开发环境：gulp dev');
    console.log('生成打包：gulp dist');
});

/* 开发环境 */
gulp.task('dev', ['build:js', 'build:css', 'build:cdn', 'dev:html'], function () {

});

/* 正式环境 */
gulp.task('build', ['build:js', 'build:css', 'build:cdn', 'build:html'], function () {

});


