var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    pkg = require('gulp-packages')(gulp, [
        'autoprefixer',
        'cache',
        'clean-css',
        'file-include',
        'htmlmin',
        'ignore',
        'imagemin',
        'ng-annotate',
        'rename',
        'rev',
        'rev-replace',
        'sass',
        'uglify'
    ]),
    Q = require('q'),
    del = require('del'),
    paths = {
        assets: '../jqchou.github.io/app/',
        build: '../jqchou.github.io/',
        src: 'app/'
    },
    manifest = {
        html: 'manifest.html.json',
        css: 'manifest.css.json',
        img: 'manifest.img.json',
        js: 'manifest.js.json'
    },
    mkRev = function (stream, manifest) {
        return stream.pipe(pkg.rev()).pipe(pkg.rename(function (file) {
            file.extname += '?rev=' + /\-(\w+)(\.|$)/.exec(file.basename)[1];
            if (/\-(\w+)\./.test(file.basename)) {
                file.basename = file.basename.replace(/\-(\w+)\./, '.');
            }
            if (/\-(\w+)$/.test(file.basename)) {
                file.basename = file.basename.replace(/\-(\w+)$/, '');
            }
        })).pipe(pkg.rev.manifest(manifest, {
            merge: true
        })).pipe(gulp.dest('.'));
    };

gulp.task('del-css-img', function () {
    return del([
        paths.assets + 'css',
        paths.assets + 'img',
        manifest.css,
        manifest.img
    ], {
        force: true
    });
});

gulp.task('del-html-js', function () {
    return del([
        paths.build + 'index.html',
        paths.assets + 'html',
        paths.assets + 'js',
        manifest.html,
        manifest.js
    ], {
        force: true
    });
});

/**
 * img
 */
gulp.task('build-img', ['del-css-img'], function () {
    return mkRev(gulp.src(paths.src + '**/img/**/*.*').pipe(pkg.cache(pkg.imagemin({
        progressive: true,
        interlaced: true
    }))).pipe(gulp.dest(paths.build)), manifest.img);
});

/**
 * css
 */
gulp.task('build-css', ['build-img'], function () {
    return mkRev(gulp.src(paths.src + '**/*.scss').pipe(pkg.sass()).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.img)
    })).pipe(gulp.dest(paths.build)).pipe(pkg.cleanCss()).pipe(pkg.rename({
        extname: '.min.css'
    })).pipe(gulp.dest(paths.build)).pipe(pkg.ignore.include('**/*.min.css')), manifest.css);
});

/**
 * html
 */
gulp.task('build-html', ['del-html-js'], function () {
    return mkRev(gulp.src(paths.src + '**/*.html').pipe(pkg.htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest(paths.build)), manifest.html);
});
gulp.task('replace-html', ['build-html'], function () {
    return mkRev(gulp.src(paths.build + '**/*.html').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.html)
    })).pipe(gulp.dest(paths.build)), manifest.html);
});

/**
 * js
 */
gulp.task('build-js', ['replace-html'], function () {
    return mkRev(gulp.src(paths.src + '**/*.js').pipe(pkg.ngAnnotate()).pipe(pkg.rename({
        extname: '.min.js'
    })).pipe(pkg.uglify()).pipe(gulp.dest(paths.build)).pipe(pkg.ignore.include('**/*.min.js')), manifest.js);
});

//替换引用文件路径并重新生成js
gulp.task('replace-js', ['build-js'], function () {
    return mkRev(gulp.src(paths.build + '**/*.js').pipe(pkg.ignore.exclude('**/js/app.router.*')).pipe(pkg.fileInclude({
        //将模版写入js文件中
        prefix: '@@',
        basepath: paths.build,
        filters: {
            replace: function (context) {
                //替换 rev后缀，单引号
                return context.replace(/\.html\?rev=\w+/g, '.html').replace(/\'/g, "\\'");
            }
        }
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.html)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.css)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(gulp.dest(paths.build)).pipe(pkg.ignore.include('**/*.min.js')), manifest.js);
});
gulp.task('build-router', ['replace-js'], function () {
    return mkRev(gulp.src(paths.build + '**/js/app.router.*').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.html)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.css)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(gulp.dest(paths.build)).pipe(pkg.ignore.include('**/*.min.js')), manifest.js);
});

//替换index.html里的链接，并重新生成
gulp.task('build-index', ['build-router'], function () {
    return gulp.src(paths.src + 'index.html').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.css)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(pkg.htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest(paths.build)).on('finish', function () {
        setTimeout(browserSync.reload);
    });
});

//生成CNAME文件
gulp.task('build-CNAME', ['build-index'], function () {
    return gulp.src(paths.src + 'CNAME').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.css)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(pkg.htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest(paths.build)).on('finish', function () {
        setTimeout(browserSync.reload);
    });
});

//生成json文件
gulp.task('build-json', ['build-CNAME'], function () {
    return gulp.src(paths.src + '**/*.json').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.css)
    })).pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(pkg.htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest(paths.build)).on('finish', function () {
        setTimeout(browserSync.reload);
    });
});

//监控文件
gulp.task('watch', ['build-json'], function () {
    gulp.watch([
        paths.src + '**/*.*',
        paths.src + '**/*.*'
    ], ['default']);
    gulp.watch([
        paths.src + '**/*.*',
        paths.src + '**/*.*',
        paths.src + 'index.html'
    ], ['build-index']);
    browserSync.init({
        server: '../jqchou.github.io/app',
        port: 3010,
        ui: {
            port: 3011,
            weinre: {
                port: 3012
            }
        },
        open: false
    });
});

gulp.task('default', ['build-css', 'build-CNAME'], function () {
    gulp.start('build-index');
});