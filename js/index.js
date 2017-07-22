const categoryFUNCS = {
  'HTML': handleHTML,
  'CSS': handleCSS,
  'JS': handleJS,
  'IMAGE': handleIMG,
  '通用': handleALL
}





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
      { name: 'HTML', list: [{ name: '压缩', funcName: 'htmlmin', icon: 'light-up', disabled: false }] },
      { name: 'CSS', list: [{ name: '添加兼容性前缀', funcName: 'prefix', icon: 'home', disabled: false }, { name: '压缩', funcName: 'compress', icon: 'light-up', disabled: false }] },
      { name: 'JS', list: [{ name: '压缩', funcName: 'uglify', icon: 'light-up', disabled: false }] },
      { name: 'IMAGE', list: [{ name: '压缩', funcName: 'imagemin', icon: 'light-up', disabled: false }] },
      { name: '通用', list: [{ name: '重命名', funcName: 'rename', icon: 'home', disabled: false }] }
    ],
    currentCategory: '',
    currentActions: []
  },
  computed: {
    currentActionsName() {
      let arr = [];
      this.currentActions.forEach(function(element) {
        arr.push(element.action.funcName);
      })
      return arr;
    }
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
      this.currentCategory = ((category.name == '通用') && (!!this.currentCategory)) ? this.currentCategory : category.name;

      // 添加操作
      let selected = {
        action: action,
        index: index
      }
      this.currentActions.push(selected);
      // 禁用已选操作
      this.actions[index[0]].list[index[1]].disabled = true;

      console.log(`this.currentCategory: ${this.currentCategory}`);
    },
    deleteAction(action, index) {
      // 删除操作
      this.currentActions.splice(index, 1);

      let idx = action.index;
      // 取消禁用删除的操作
      this.actions[idx[0]].list[idx[1]].disabled = false;

      let isLeftCommon = false;
      for (let item of this.currentActions) {
        let category = this.actions[item.index[0]].name;
        if (category == '通用') {
          isLeftCommon = true;
        }
      }

      // 判断当前操作列表是否为空
      if (!(this.currentActions.length > 0)) {
        this.currentCategory = '';
      }
      if (isLeftCommon) {
        this.currentCategory = '通用';
      }
      console.log(`this.currentCategory: ${this.currentCategory}`);
    }
  }
})




















let drake;

// 处理拖拽排序功能，更新数据
// 经历了两次数据更新，页面渲染
function dropHandler(el, target, source, sibling) {
  console.log(el, target, source, sibling);
  // 删除拖拽的数据 index
  let idx = el.dataset.idx;
  let action = app.currentActions.splice(idx, 1)[0];

  // 获取新的位置
  let newidx = sibling ? (sibling.dataset.idx - 1) : (target.querySelectorAll('.draggable-item').length);

  // 插入到新的位置
  app.$nextTick(function() {
    app.currentActions.splice(newidx, 0, action);
  })
  console.info(app.currentActions);
}

$(document).ready(function() {
  // 初始化拖拽排序
  drake = dragula([document.querySelector('#draggable')]);
  // 处理拖拽排序功能
  drake.on('drop', dropHandler);


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

    // 当前未选择任何操作
    if (app.currentCategory == '') {
      alert(`当前未选择任何操作`);
      return;
    }

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
          // 文件类型 fileType:css
          fileType = fileTypeArr[fileTypeArr.length - 1],
          fileNameArr = results.split("\\"),
          // 文件名 fileName: test.css
          fileName = fileNameArr[fileNameArr.length - 1];
          console.log(fileTypeArr, fileType, fileNameArr, fileName);

        // 判断文件格式
        if (handleFileType(fileType)) {
          var fileDir = Path.dirname(results),
            newName = 'test-result.'+fileType,
            fileroute = '';

          // 当前目录下新建文件夹
          if (config.cssDir !== '') {
            fileDir = fileDir + '\\' + config.cssDir;
          }

          fileroute = fileDir + '\\';
          console.log('保存到目录:' + fileroute);

          var handleFUNC = categoryFUNCS[app.currentCategory];
          //有文件，直接覆盖；没有文件，新建文件
          handleFUNC(app.currentActionsName, results, fileDir, newName, function() {
            console.log(results);
          });
        }

      });
    }
  });
});

/**
 * 判断文件类型
 * @author Alexee
 * @date   2017-07-21
 * @param  {string}   fileType [文件后缀]
 * @return {boolean}           [是否符合格式]
 */
var handleFileType = (fileType) => {
  let typeOptions = {
    'CSS': ['css'],
    'JS': ['js'],
    'HTML': ['html'],
    'IMAGE': ['png', 'jpg','jpeg', 'gif', 'svg']
  }
  let availableType = ['css', 'js', 'html', 'png'];

  // 判断当前文件处理类型
  let currentCategory = app.currentCategory;

  if (currentCategory !== '通用') {
    // 获取当前可处理的文件的类型
    let currentTypes = typeOptions[currentCategory];

    console.log(`type: ${currentTypes.join('/')}`);

    if (currentTypes.indexOf(fileType) == -1) {
      alert(`请拖进 ${currentTypes.join('/')} 文件～`);
    } else {
      return true;
    } 
  } else {
    return true;
  }
}



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