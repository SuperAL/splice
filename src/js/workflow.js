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
 * gulp-usemin gulp-rev - 合并 html 引用的 css、js
 * @author Alexee
 * @date   2017-07-26
 * @param  {[type]}   stream [description]
 * @return {[type]}          [description]
 */
var useminHTML = (stream, {isUglify, isRev}) => {
  return stream.pipe(usemin({
    // cssmin: cleanCSS(), // 使用 css 压缩会导致无法生成最终的 css 文件
    jsmin: isUglify && uglify() , 
    rev: isRev

    // 以下为 gulp-usemin 用法
    // css: [ minifyCSS(), rev() ],    
    // html: [ htmlmin({ collapseWhitespace: true }) ],
    // js: [ uglify(), rev() ],
    // inlinejs: [ uglify() ]
    // inlinecss: [ cleanCss(), 'concat' ]
  }))
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
  return stream.pipe(postcss([autoprefixer()]));
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
 * gulp-base64 - 图片转 base64
 * @author Alexee
 * @date   2017-11-23
 * @param  {[type]}   stream [description]
 * @param  {[String]}   exclude [正则筛选不处理的图片路径]
 * @return {[String]}   maxImageSize [最大处理图片大小]
 */
 var base64CSS = (stream, {exclude, maxImageSize}) => {
  console.log('exclude is', exclude, maxImageSize);
  console.log('exclude is', exclude.split(/[,，]/).map(item => item ? new RegExp(item) : null));
  return stream.pipe(base64({
    exclude: exclude.split(/[,，]/).map(item => item ? new RegExp(item) : null),
    maxImageSize: +maxImageSize ? +maxImageSize : 10000, // bytes 
    debug: true
  }));
}

var spriteCSS = (stream, {dest, pattern, imgName, cssName, imgPath, isImgMin, imgDest, isCssMin, cssDest, callback}) => {
  let reg = new RegExp(pattern);
  var spriteOutput;
  spriteOutput = stream
      .pipe(spriter({
          baseUrl: "./",
          spriteSheetName: imgName.trim() ? imgName : "[name].sprite.png", // 会自动把 [name] 替换成正在处理文件名
          styleSheetName: cssName,
          spriteSheetPath: imgPath,
          padding: 4,
          filter: [
              function(image) {
                return reg.test(image.url) // 只对名称符合正则的图片进行雪碧图合并
              }
          ]
      }))

  let imgFinal = path.resolve(dest, imgDest);
  let cssFinal = path.resolve(dest, cssDest);

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteOutput.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulpif(isImgMin, imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
    // imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
    pngquant()
    ])))
    .pipe(gulp.dest(imgFinal));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteOutput.css
  .pipe(gulpif(isCssMin, minifyCSS({
    safe: true,
    reduceTransforms: false,
    advanced: false,
    compatibility: 'ie7',
    keepSpecialComments: 0
  })))
  .pipe(gulp.dest(cssFinal));

  // 监听 img 和 css 文件的生成，都生成成功后再停止 loading
  // let watchFilepathImg = path.resolve(imgFinal, '*.{jpeg,jpg,png,gif,svg,JPEG,JPG,PNG,GIF,SVG}');
  let watchFilepathImg = path.resolve(imgFinal, '*.*');
  // let watchFilepathCss = path.resolve(cssFinal, '*.css');
  let watchFilepathCss = path.resolve(cssFinal, '*.*');
  let isImgFin = !pathExists.sync(imgFinal), isCssFin = !pathExists.sync(cssFinal);
  console.log(watchFilepathImg, isImgFin, watchFilepathCss, isCssFin);


  console.log('watching:', watchFilepathImg, watchFilepathCss);
  if (isImgFin && isCssFin) {
    setTimeout(() => {
      callback('finished');
    }, 3000)
  } else {
    let watcherImg = watch(watchFilepathImg, function () {
      if (isCssFin) {
        callback('finished')
      }
      isImgFin = true;
      watcherImg.close();
    });

    let watcherCss = watch(watchFilepathCss, function () {
      console.log('watching:',watchFilepathCss);
      if (isImgFin) {
        callback('finished')
      }
      isCssFin = true;
      watcherCss.close();
    });
  }

  // Return a merged stream to handle both `end` events
  // return merge(imgStream, cssStream);
  return false;
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
var spriteIMG = (stream, {dest, imgName, cssName, imgPath, isImgMin, imgDest, isCssMin, cssDest, callback}) => {
  // Generate our spritesheet
  var spriteData = stream.pipe(spritesmith({
    imgName: imgName,
    cssName: cssName,
    imgPath: imgPath,
    padding: 4
  }));
  let imgFinal = path.resolve(dest, imgDest);
  let cssFinal = path.resolve(dest, cssDest);
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulpif(isImgMin, imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
    // imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
    pngquant()
    ])))
    .pipe(gulp.dest(imgFinal));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
  .pipe(gulpif(isCssMin, minifyCSS({
    safe: true,
    reduceTransforms: false,
    advanced: false,
    compatibility: 'ie7',
    keepSpecialComments: 0
  })))
  .pipe(gulp.dest(cssFinal));

  // 监听 img 和 css 文件的生成，都生成成功后再停止 loading
  // let watchFilepathImg = path.resolve(imgFinal, '*.{jpeg,jpg,png,gif,svg,JPEG,JPG,PNG,GIF,SVG}');
  let watchFilepathImg = path.resolve(imgFinal, '*.*');
  // let watchFilepathCss = path.resolve(cssFinal, '*.css');
  let watchFilepathCss = path.resolve(cssFinal, '*.*');
  let isImgFin = !pathExists.sync(imgFinal), isCssFin = !pathExists.sync(cssFinal);

  // let a = pathExists.sync(imgFinal);  
  // let b = pathExists.sync(cssFinal);

  // console.log('imgFinal pathExists', a);
  // console.log('cssFinal pathExists', b);

  console.log('watching:', watchFilepathImg, watchFilepathCss);
  if (isImgFin && isCssFin) {
    setTimeout(() => {
      callback('finished');
    }, 3000)
  } else {
    let watcherImg = watch(watchFilepathImg, function () {
      if (isCssFin) {
        callback('finished')
      }
      isImgFin = true;
      watcherImg.close();
    });

    let watcherCss = watch(watchFilepathCss, function () {
      console.log('watching:',watchFilepathCss);
      if (isImgFin) {
        callback('finished')
      }
      isCssFin = true;
      watcherCss.close();
    });
  }

  // Return a merged stream to handle both `end` events
  // return merge(imgStream, cssStream);
  return false;
}




/**
 * -----------------------------------------------------------------
 * JSON 文件相关操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-json-minify - 压缩 json 文件
 * @author Alexee
 * @date   2017-10-26
 * @param  {gulp stream}   stream
 * @return {gulp stream}   stream
 */
var minifyJSON = (stream) => {
  return stream.pipe(jsonMinify())
}




/**
 * -----------------------------------------------------------------
 * 通用操作
 * -----------------------------------------------------------------
 */
/**
 * gulp-rename - 重命名
 * @author Alexee
 * @date   2017-07-26
 * @param  {gulp stream}   stream           
 * @param  {[type]}   options.basename [文件名]
 * @param  {[type]}   options.prefix   [前缀]
 * @param  {[type]}   options.suffix   [后缀]
 * @param  {[type]}   options.extname  [扩展名]
 * @return {[type]}                    [description]
 */
var renameALL = (stream, { basename, prefix, suffix, extname}) => {
  console.log(basename, prefix, suffix, extname);
  return stream.pipe(rename({
    basename: basename,
    prefix: prefix,
    suffix: suffix,
    extname: extname
  }))
}

/**
 * 不执行任何操作
 * @author Alexee
 * @date   2017-07-26
 * @param  {[type]}   stream [description]
 * @return {[type]}          [description]
 */
var doNothing = (stream) => {
  return stream;
}

/**
 * gulp-jsbeautifier - Prettify JavaScript, JSON, HTML and CSS.
 * Default value for css: ['.css', '.less', '.sass', '.scss']
 * Default value for html: ['.html']
 * Default value for js: ['.js', '.json']
 * @author Alexee
 * @date   2017-10-26
 * @param  {gulp stream}        stream
 * @param  {Number or String}   space 缩进空格
 * @return {gulp stream}        stream
 */
 var prettifyALL = (stream, {indent = 4, js = [], css = [], html = []}) => {
  // let {indent = 4, js = [], css = [], html = []} = configs;
  [js, css, html] = [js, css, html].map(item => {
    return item.map(suffix => {
      return '.' + suffix;
    })
  })
  return stream.pipe(prettify({
    indent_size: indent,
    js: {
      file_types: ['.js', '.json', ...js]
    },
    css: {
      file_types: ['.css', '.less', '.sass', '.scss', ...css]
    },
    html: {
      file_types: ['.html', ...html]
    }
  }))
}




const FUNCS = {
  // html
  'htmlmin': minifyHTML,
  'usemin': useminHTML,
  // css
  'prefix': prefixCSS,
  'compress': compressCSS,
  'base64': base64CSS,
  'spriter': spriteCSS,
  // js
  'uglify': uglifyJS,
  // image
  'imagemin': imageminIMG,
  'sprite': spriteIMG,
  // json
  'minify': minifyJSON,
  'format': prettifyALL,
  // common
  'rename': renameALL,
  'dest': doNothing
}
const LOGS = {
  // html
  'htmlmin': '压缩 html',
  'usemin': '合并 css/js',
  // css
  'prefix': '添加兼容性前缀',
  'compress': '压缩 css',
  'base64': 'css 中图片转 base64',
  'spriter': '处理 css 生成精灵图',
  // js
  'uglify': '压缩 js',
  // image
  'imagemin': '压缩图片',
  'sprite': '合并生成精灵图',
  // json
  'minify': '压缩 json',
  // common
  'format': '格式化',
  'rename': '文件重命名',
  'dest': '设置导出目录'
}


/**
 * 处理 image 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   configs     [操作设置]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
var handleIMG = (actionsName, src, dist, configs, callback) => {
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    callback(LOGS[element])
    if (element.indexOf('sprite') !== -1) {
      // 精灵图处理函数中单独对 css 和 img 进行了导出操作
      configs.callback = callback;
    } 
    stream = FUNCS[element](stream, configs);
  })
  // 精灵图操作 stream 返回 false
  if (stream) {
    // let watchFilepath = path.resolve(dist, '*.{jpeg,jpg,png,gif,svg}');
    let watchFilepath = path.resolve(dist, '*.*');
    stream.pipe(gulp.dest(dist));
    let watcher = watch(watchFilepath, function () {
      callback('finished')
      watcher.close();
      console.log('watching');
    });
  } 
}


/**
 * 处理 所有 文件
 * @author Alexee
 * @date   2017-07-22
 * @param  {array}   actionsName  [需要执行的操作]
 * @param  {string}   src         [处理的文件地址]
 * @param  {string}   dist        [文件导出地址]
 * @param  {string}   configs     [操作设置]
 * @param  {Function} callback    [文件处理完的回调函数]
 * @return {[type]}               [description]
 */
 var handleALL = (actionsName, src, dist, configs, callback) => {
  let stream = gulp.src(src);
  actionsName.forEach(function(element) {
    console.log(`执行操作：${element}`);
    callback(LOGS[element])
    stream = FUNCS[element](stream, configs);
  })
  let watchFilepath = path.resolve(dist, '*.*');
  stream.pipe(gulp.dest(dist));
  let watcher = watch(watchFilepath, function () {
    callback('finished')
    watcher.close();
    console.log('watching');
  });
}


