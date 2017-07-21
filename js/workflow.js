var fs = require('fs');
var Path = require("path");
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var minifyCSS = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');


/**
 * -----------------------------------------------------------------
 * CSS 文件相关操作
 * ----------------------------------------------------------------- 
 */
/**
 * prefix - 添加兼容性前缀
 * @author Alexee
 * @date   2017-07-21
 * @param  {gulp stream}   stream 
 * @return {gulp stream}   stream     
 */
var prefixCSS = (stream) => {
  return stream.pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]));
}

/**
 * compress - 压缩 css 文件
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
 * 通用操作
 * -----------------------------------------------------------------
 */
/**
 * rename - 重命名
 * @author Alexee
 * @date   2017-07-21
 * @param  {gulp stream}   stream
 * @param  {string}   		 newName [新的文件名]
 * @return {gulp stream}   stream
 */
 var renameALL = (stream, { newName }) => {
 	return stream.pipe(rename(newName))
 }

const cssFUNCS = {
  'prefix': prefixCSS,
  'compress': compressCSS,
  'rename': renameALL
}

var handleCSS = (actionsName, url, csspath, newName, callback) => {
  let stream = gulp.src(url);
  actionsName.forEach(function(element) {
  	console.log(`执行操作：${element}`);
    stream = cssFUNCS[element](stream, { newName });
  })
  return stream.pipe(gulp.dest(csspath));
}



var handleJS = (url, csspath, cssname, callback) => {
  // return gulp.src(url)
  // .pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]))
  // .pipe(minifyCSS({
  // 	safe: true,
  // 	reduceTransforms: false,
  // 	advanced: false,
  // 	compatibility: 'ie7',
  // 	keepSpecialComments: 0
  // }))
  // .pipe(rename(cssname))
  // .pipe(gulp.dest(csspath));
}

var handleALL = (url, csspath, cssname, callback) => {
  // return gulp.src(url)
  // .pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]))
  // .pipe(minifyCSS({
  // 	safe: true,
  // 	reduceTransforms: false,
  // 	advanced: false,
  // 	compatibility: 'ie7',
  // 	keepSpecialComments: 0
  // }))
  // .pipe(rename(cssname))
  // .pipe(gulp.dest(csspath));
}