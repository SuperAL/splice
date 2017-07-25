var fs = require('fs');
var Path = require("path");
var gulp = require('gulp');
var gulpif = require('gulp-if');
var postcss = require('gulp-postcss');
var minifyCSS = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var uglify = require("gulp-uglify");
var htmlmin = require('gulp-htmlmin');

// 图片压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// 精灵图处理
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

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
  return stream.pipe(htmlmin({ collapseWhitespace: true }))
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
    mangle: true, //类型：Boolean 默认：true 是否修改变量名
    compress: true //类型：Boolean 默认：true 是否完全压缩
  }))
}




/**
 * -----------------------------------------------------------------
 * IMAGE 文件相关操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-imagemin - 压缩图片(PNG, JPEG, JPG, GIF and SVG)
 * @author Alexee
 * @date   2017-07-22
 * @param  {gulp stream}   stream
 * @return {gulp stream}   stream
 */
var imageminIMG = (stream) => {
  return stream.pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
    imagemin.jpegtran({ progressive: true }),
    // imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
    pngquant()
  ]))
}

/**
 * gulp.spritesmith - 生成精灵图和对应的 css 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {gulp stream}   stream
 * @return {gulp stream}   stream
 */
var spriteIMG = (stream, {dest, imgName, cssName, imgPath, isImgMin, imgDest, isCssMin, cssDest}) => {
  // Generate our spritesheet
  var spriteData = stream.pipe(spritesmith({
    imgName: imgName,
    cssName: cssName,
    imgPath: imgPath,
    padding: 4
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulpif(isImgMin, imagemin()))
    .pipe(gulp.dest(Path.resolve(dest, imgDest)));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
  .pipe(gulpif(isCssMin, minifyCSS({
    safe: true,
    reduceTransforms: false,
    advanced: false,
    compatibility: 'ie7',
    keepSpecialComments: 0
  })))
  .pipe(gulp.dest(Path.resolve(dest, cssDest)));

  // Return a merged stream to handle both `end` events
  // return merge(imgStream, cssStream);
  return false;
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
  // image
  'imagemin': imageminIMG,
  'sprite': spriteIMG,
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

/**
 * 处理 image 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   newName     [文件重命名]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
var handleIMG = (actionsName, src, dist, configs, callback) => {
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    stream = FUNCS[element](stream, configs);
  })
  if (stream) {
    return stream.pipe(gulp.dest(dist));
  }
}


/**
 * 处理 所有 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   newName     [文件重命名]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
 var handleALL = (actionsName, src, dist, newName, callback) => {
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    stream = FUNCS[element](stream, { newName });
  })
  return stream.pipe(gulp.dest(dist));
}
