/**
 * -----------------------------------------------------------------
 * workflow.js
 * ----------------------------------------------------------------- 
 */
var fs = require('fs');
var path = require("path");
var gulp = require('gulp');
var gulpif = require('gulp-if');
var postcss = require('gulp-postcss');
var minifyCSS = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var uglify = require("gulp-uglify");
var htmlmin = require('gulp-htmlmin');
var prettify = require('gulp-jsbeautifier');

// 通过 css 生成精灵图
var spriter = require('gulp-sprite-generator2');
// css 中 url 引入的图片转 base64
var base64 = require('gulp-base64');

// json 文件处理
var jsonMinify = require('gulp-json-minify');

// 图片压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// 精灵图处理
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

// usemin
var usemin = require('gulp-usemin2');
// var cleanCSS = require('gulp-clean-css');

// for loading
var watch = require('gulp-watch');
var pathExists = require('path-exists');




/**
 * -----------------------------------------------------------------
 * updater.js
 * ----------------------------------------------------------------- 
 */
var stat = fs.stat;
var https = require('https');
var remote = require('electron').remote;
var { dialog, Menu, MenuItem, shell } = remote;

// 为了实现自动安装新增依赖的功能
var exec = require('child_process').exec;

/**
 * -----------------------------------------------------------------
 * index.js
 * ----------------------------------------------------------------- 
 */
 var objectMerge = require('object-merge');

