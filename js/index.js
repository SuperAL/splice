var fs = require('fs');
var Path = require("path");
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var minifyCSS = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
console.log('reloadss');

// 可配置信息
var config = {
  // 生成目录
  cssDir: ''
};

// function deleteAction() {
//  // 删除单个自动化操作
//  $(this).parents('.draggable-item').remove();
// }

/**
 * Vue 实例
 */
var app = new Vue({
  el: '#app',
  data: {
    actions: [
      { name: 'CSS', list: [{ name: 'prefix', icon: 'home', disabled: false }, { name: 'compress', icon: 'light-up', disabled: false }] },
      { name: 'JS', list: [{ name: 'prefix', icon: 'home', disabled: false }, { name: 'compress', icon: 'light-up', disabled: false }] },
      { name: '通用', list: [{ name: 'rename', icon: 'home', disabled: false }] }
    ],
    currentCategory: '',
    currentActions: [
      // { name: 'prefix', icon: 'home' }, { name: 'compress', icon: 'light-up' }
    ]
  },
  methods: {
    addToCurrent(category, action, index) {
      // 判断当前操作类型是否可选
      let isCategoryDisabled = !!this.currentCategory && (category.name !== this.currentCategory) && (category.name !== '通用') && (this.currentCategory !== '通用');
      // 判断当前操作是否已经添加
      let isActionSelected = action.disabled;
      if (isCategoryDisabled || isActionSelected) {
        return;
      }

      // 更新当前操作类型
      this.currentCategory = category.name == '通用' ? this.currentCategory : category.name;
      // 添加操作
      let selected = {
        action: action,
        index: index
      }
      this.currentActions.push(selected);
      // 禁用已选操作
      this.actions[index[0]].list[index[1]].disabled = true;
    },
    deleteAction(action, index) {
      // 删除操作
      this.currentActions.splice(index, 1);

      let idx = action.index;
      // 取消禁用删除的操作
      this.actions[idx[0]].list[idx[1]].disabled = false;

      let isLeftCommon = false;
      for(let item of this.currentActions) {
        let category = this.actions[item.index[0]].name;
        if (category == '通用') {
            isLeftCommon = true;
        }
      }
      
      // 判断当前操作列表是否为空
      if (!(this.currentActions.length > 0) || isLeftCommon) {
        this.currentCategory = '';
      }
    }
  }
})























$(document).ready(function() {
  // 初始化拖拽排序
  var drake = dragula([document.querySelector('#draggable')]);
  // 删除单个自动化操作
  // $('.icon-delete-action').on('click', deleteAction)

  //阻止浏览器默认行为
  $(document).on({
    dragleave: function(e) { //拖离
      e.preventDefault();
    },
    drop: function(e) { //拖后放
      e.preventDefault();
    },
    dragenter: function(e) { //拖进
      e.preventDefault();
    },
    dragover: function(e) { //拖来拖去
      e.preventDefault();
    }
  });

  // 拖进后改变 droparea 样式
  $('.j-dragarea').on('dragenter', function(e) {
    e.preventDefault();
    $(this).addClass('dragarea-on');
  });

  // 拖离后改变 droparea 样式
  $('.j-dragarea').on('dragleave', function(e) {
    e.preventDefault();
    $(this).removeClass('dragarea-on');
  });

  // drop只支持原生绑定
  $('.j-dragarea')[0].addEventListener('drop', function(e) {
    e.preventDefault();
    var fileList = e.dataTransfer.files; //获取文件
    var len = fileList.length;

    if (len == 0) {
      return false;
    }

    //遍历拖进来的文件
    for (var i = 0; i < len; i++) {
      var filepath = fileList[i].path;

      walk(filepath, function(err, results) {
        console.log('filepath results', results);
        var fileTypeArr = results.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1],
          fileNameArr = results.split('/'),
          fileName = fileNameArr[fileNameArr.length - 1];

        //过滤非css文件
        if (fileType == 'css') {
          var CSSpath = Path.dirname(results),
            CSSname = fileName.split('.css')[0] + '-result.css',
            fileroute = '';

          // 当前目录下新建文件夹
          if (config.cssDir !== '') {
            CSSpath = CSSpath + '/' + config.cssDir;
          }

          fileroute = CSSpath + '/' + CSSname;
          console.log('保存到目录:' + fileroute);

          // 判断文件是否存在
          // fs.access(fileroute, function(err) {
          //     if (!err) {
          //         //创建CSS文件
          //         createCSS(CSSpath, CSSname, function() {
          //             writeCSS(results, CSSpath, CSSname, function() {
          //                 console.log(results);
          //             });
          //         });
          //     } else {
          //         //如有文件，直接覆盖
          //         writeCSS(results, CSSpath, CSSname, function() {
          //             console.log(results);
          //         });
          //     }
          // });

          //有文件，直接覆盖；没有文件，新建文件
          writeCSS(results, CSSpath, CSSname, function() {
            console.log(results);
          });
        } else {
          alert('请拖进css文件～');
        }
      });
    }
  });
});

// 访问到目录总深路径
var walk = function(dir, done) {
  fs.stat(dir, function(err, stats) {
    if (stats && stats.isDirectory()) {
      fs.readdir(dir, function(err, list) {
        list.forEach(function(file) {
          file = Path.resolve(dir, file);
          walk(file, done);
        });
      });
    } else {
      done(err, dir);
    }
  });
};

var writeCSS = function(url, csspath, cssname, callback) {
  return gulp.src(url)
    .pipe(postcss([autoprefixer({ browsers: ['last 4 versions'] })]))
    // .pipe(minifyCSS({
    //     safe: true,
    //     reduceTransforms: false,
    //     advanced: false,
    //     compatibility: 'ie7',
    //     keepSpecialComments: 0
    // }))
    .pipe(rename(cssname))
    .pipe(gulp.dest(csspath));
}

// 创建css文件
var createCSS = function(path, filename, callback) {
  var enterstr = '\n';
  var time = new Date().Format("yyyy-MM-dd");
  var css = '/* This is the CSS after Prefixer, created by tqtan ' + time + '*/' + enterstr;

  fs.writeFile(path + '/' + filename, css, function() {
    console.log('create file ' + filename + ' success!');
    if (callback) {
      callback();
    }
  });
}

Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}