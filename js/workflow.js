var fs = require('fs');
var Path = require("path");
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var minifyCSS = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var uglify = require("gulp-uglify");
var htmlmin = require('gulp-htmlmin');

/**
 * -----------------------------------------------------------------
 * HTML 文件相关操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-htmlmin - 压缩 html 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {gulp stream}   stream
 * @return {gulp stream}   stream
 */
 var minifyHTML = (stream) => {
  return stream.pipe(htmlmin({collapseWhitespace:true}))
}


/**
 * -----------------------------------------------------------------
 * CSS 文件相关操作
 * ----------------------------------------------------------------- 
 */
/**
 * gulp-postcss - 添加兼容性前缀
 * @author Alexee
 * @date   2017-07-21
 * @param  {gulp stream}   stream 
 * @return {gulp stream}   stream     
 */
var prefixCSS = (stream) => {
  return stream.pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]));
}

/**
 * gulp-cssnano - 压缩 css 文件
 * @author Alexee
 * @date   2017-07-21
 * @param  {gulp stream}   stream 
 * @return {gulp stream}   stream
 */
var compressCSS = (stream) => {
  return stream.pipe(minifyCSS({
    safe: true,
    reduceTransforms: false,
    advanced: false,
    compatibility: 'ie7',
    keepSpecialComments: 0
  }));
}

/**
 * -----------------------------------------------------------------
 * JS 文件相关操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-uglify - 压缩 js 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {gulp stream}   stream 
 * @return {gulp stream}   stream
 */
var uglifyJS = (stream) => {
  return stream.pipe(uglify({
    mangle: true,//类型：Boolean 默认：true 是否修改变量名
    compress: true //类型：Boolean 默认：true 是否完全压缩
  }))
}



/**
 * -----------------------------------------------------------------
 * 通用操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-rename - 重命名
 * @author Alexee
 * @date   2017-07-21
 * @param  {gulp stream}   stream
 * @param  {string}        newName [新的文件名]
 * @return {gulp stream}   stream
 */
var renameALL = (stream, { newName }) => {
  return stream.pipe(rename(newName))
}





const FUNCS = {
  // html
  'htmlmin': minifyHTML,
  // css
  'prefix': prefixCSS,
  'compress': compressCSS,
  // js
  'uglify': uglifyJS,
  // common
  'rename': renameALL
}

/**
 * 处理 html 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   newName     [文件重命名]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
 var handleHTML = (actionsName, src, dist, newName, callback) => {
  console.log(actionsName, src, dist, newName, callback);
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    stream = FUNCS[element](stream, { newName });
  })
  return stream.pipe(gulp.dest(dist));
}



/**
 * 处理 css 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   newName     [文件重命名]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
var handleCSS = (actionsName, src, dist, newName, callback) => {
  console.log(actionsName, src, dist, newName, callback);
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    stream = FUNCS[element](stream, { newName });
  })
  return stream.pipe(gulp.dest(dist));
}

/**
 * 处理 js 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   newName     [文件重命名]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
var handleJS = (actionsName, src, dist, newName, callback) => {
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    stream = FUNCS[element](stream, { newName });
  })
  return stream.pipe(gulp.dest(dist));
}

var handleALL = (url, csspath, cssname, callback) => {
  // return gulp.src(url)
  // .pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]))
  // .pipe(minifyCSS({
  //  safe: true,
  //  reduceTransforms: false,
  //  advanced: false,
  //  compatibility: 'ie7',
  //  keepSpecialComments: 0
  // }))
  // .pipe(rename(cssname))
  // .pipe(gulp.dest(csspath));
}