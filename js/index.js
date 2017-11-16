// 方法名对照
const categoryFUNCS = {
    'HTML': handleALL,
    'CSS': handleIMG,
    'JS': handleALL,
    'IMAGE': handleIMG,
    'JSON': handleALL,
    '通用': handleALL
}

/**
 * Vue 实例
 */

var customInput = {
    model: {
        prop: 'userValue',
        event: 'change'
    },
    props: ['label', 'userValue', 'placeholder'],
    template: `<div class="form-group">
    <label>{{label}}</label>
    <input type="text" class="form-control" :placeholder="placeholder" :value="userValue"  @input="updateValue($event.target.value)">
  </div>`,
    methods: {
        updateValue(newVal) {
            this.$emit('change', newVal)
        }
    }
}
var customRadio = {
    model: {
        prop: 'userValue',
        event: 'change'
    },
    computed: {
        randomName() {
            return 'radio' + 100 * (Math.random() * Math.random()).toFixed(2);
        }
    },
    props: ['label', 'userValue'],
    template: `
  <div class="form-group">
    <div class="radio" v-for="item in label">
      <label>
        <input type="radio" name="randomName" @change="updateValue($event.target.value)" :value="item" :checked="userValue == item">
        {{ item }}
      </label>
    </div>
  </div>
  `,
    methods: {
        updateValue(newVal) {
            console.log(newVal);
            this.$emit('change', newVal);
        }
    }
}
var customCheckbox = {
    model: {
        prop: 'userValue',
        event: 'change'
    },
    props: ['label', 'userValue'],
    template: `
  <div class="checkbox">
  <label>
  <input type="checkbox" :checked="userValue" @change="updateValue($event.target.checked)"> {{ label }}
  </label>
  </div>
  `,
    methods: {
        updateValue(newVal) {
            console.log(newVal);
            this.$emit('change', newVal);
        }
    }
}

var loader = {
    template: `<div class="loader loader--style" title="0">
    <svg version="1.1" id="loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
    <path opacity="0.2" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
    <path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z">
    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
    </path>
    </svg>
    </div>`
}

let storedActions = getStore('actions');
let defaultActions = [{
        name: 'HTML',
        list: [
            { name: '压缩', funcName: 'htmlmin', icon: 'html', disabled: false }, {
                name: '合并 css / js',
                funcName: 'usemin',
                icon: 'html',
                disabled: false,
                isSolo: true,
                wiki: 'https://www.zybuluo.com/alexlee/note/841903',
                configs: [{
                        type: 'custom-checkbox',
                        label: '是否压缩合并后的 js',
                        key: 'isUglify',
                        value: false
                    }, {
                        type: 'custom-checkbox',
                        label: '是否添加版本号',
                        key: 'isRev',
                        value: false
                    },
                    {
                        type: 'custom-checkbox',
                        label: '是否保存设置',
                        key: 'isSaved',
                        value: false
                    }
                ]
            }
        ]
    },
    {
        name: 'CSS',
        list: [{ name: '添加兼容性前缀', funcName: 'prefix', icon: 'css', disabled: false }, { name: '压缩', funcName: 'compress', icon: 'css', disabled: false }, {
            name: '精灵图',
            funcName: 'spriter',
            icon: 'css',
            disabled: false,
            isSolo: true,
            wiki: 'https://www.zybuluo.com/alexlee/note/932749',
            configs: [{
                    type: 'custom-input',
                    label: '正则筛选想要处理的图片路径',
                    key: 'pattern',
                    value: '',
                    placeholder: '例：png'
                }, {
                    type: 'custom-input',
                    label: '精灵图文件名',
                    key: 'imgName',
                    value: '',
                    placeholder: '默认：css文件名.sprite.png'
                },
                {
                    type: 'custom-input',
                    label: 'css文件名',
                    key: 'cssName',
                    value: 'style.css'
                },
                {
                    type: 'custom-input',
                    label: '生成的css中图片相对地址',
                    key: 'imgPath',
                    value: '../image'
                },
                {
                    type: 'custom-input',
                    label: '精灵图导出地址',
                    key: 'imgDest',
                    value: './dist/image'
                },
                {
                    type: 'custom-input',
                    label: 'css导出地址',
                    key: 'cssDest',
                    value: './dist/css'
                },
                {
                    type: 'custom-checkbox',
                    label: '是否压缩精灵图',
                    key: 'isImgMin',
                    value: true
                },
                {
                    type: 'custom-checkbox',
                    label: '是否压缩css',
                    key: 'isCssMin',
                    value: false
                },
                {
                    type: 'custom-checkbox',
                    label: '是否保存设置',
                    key: 'isSaved',
                    value: false
                }
            ]
        }]
    },
    { name: 'JS', list: [{ name: '压缩', funcName: 'uglify', icon: 'js', disabled: false }] },
    {
        name: 'IMAGE',
        list: [
            { name: '压缩', funcName: 'imagemin', icon: 'img', disabled: false },
            {
                name: '精灵图',
                funcName: 'sprite',
                icon: 'img',
                disabled: false,
                isSolo: true,
                configs: [{
                        type: 'custom-input',
                        label: '精灵图文件名',
                        key: 'imgName',
                        value: 'sprite.png'
                    },
                    {
                        type: 'custom-input',
                        label: 'css文件名',
                        key: 'cssName',
                        value: 'sprite.css'
                    },
                    {
                        type: 'custom-input',
                        label: '生成的css中引用的图片地址',
                        key: 'imgPath',
                        value: 'sprite.png'
                    },
                    {
                        type: 'custom-input',
                        label: '精灵图导出地址',
                        key: 'imgDest',
                        value: './'
                    },
                    {
                        type: 'custom-input',
                        label: 'css导出地址',
                        key: 'cssDest',
                        value: './'
                    },
                    {
                        type: 'custom-checkbox',
                        label: '是否压缩精灵图',
                        key: 'isImgMin',
                        value: true
                    },
                    {
                        type: 'custom-checkbox',
                        label: '是否压缩css',
                        key: 'isCssMin',
                        value: false
                    },
                    {
                        type: 'custom-checkbox',
                        label: '是否保存设置',
                        key: 'isSaved',
                        value: false
                    }
                ]
            }
        ]
    },
    { name: 'JSON', list: [{ name: '压缩', funcName: 'minify', icon: 'json', disabled: false }] },
    {
        name: '通用',
        list: [{
            name: '格式化',
            funcName: 'format',
            icon: 'reset',
            disabled: false,
            configs: [{
                type: 'custom-input',
                label: '缩进',
                key: 'indent',
                value: '', // 默认缩进：4
                placeholder: "默认缩进：4"
            }, {
                type: 'custom-input',
                label: 'JS',
                key: 'js',
                value: '', // 默认后缀：'.js', '.json'
                placeholder: "默认:js,json,可新增,逗号隔开"
            }, {
                type: 'custom-input',
                label: 'CSS',
                key: 'css',
                value: '', // 默认后缀：'.css', '.less', '.sass', '.scss'
                placeholder: "默认:css,less,sass,scss"
            }, {
                type: 'custom-input',
                label: 'HTML',
                key: 'html',
                value: '',
                placeholder: "默认:html"
            }, {
                type: 'custom-checkbox',
                label: '是否保存设置',
                key: 'isSaved',
                value: false
            }]
        }, {
            name: '重命名',
            funcName: 'rename',
            icon: 'reset',
            disabled: false,
            configs: [{
                    type: 'custom-input',
                    label: '文件名',
                    key: 'basename',
                    value: '', // 默认原文件名
                    placeholder: '默认原文件名'
                }, {
                    type: 'custom-input',
                    label: '前缀',
                    key: 'prefix',
                    value: '',
                    placeholder: '例: bonjour-'
                }, {
                    type: 'custom-input',
                    label: '后缀',
                    key: 'suffix',
                    value: '',
                    placeholder: '例: -hola'
                }, {
                    type: 'custom-input',
                    label: '扩展名',
                    key: 'extname',
                    value: '', // 默认原文件扩展名
                    placeholder: '默认原文件扩展名'
                },
                {
                    type: 'custom-checkbox',
                    label: '是否保存设置',
                    key: 'isSaved',
                    value: false
                }
            ]
        }, {
            name: '自定义设置',
            funcName: 'dest',
            icon: 'reset',
            disabled: false,
            configs: [{
                    type: 'custom-input',
                    label: '导出目录',
                    key: 'dest',
                    value: '', // 默认文件当前目录
                    placeholder: '默认文件当前目录'
                },
                // {
                //   type: 'custom-checkbox',
                //   label: '处理完打开文件所在位置',
                //   key: 'openDir',
                //   value: false
                // },
                {
                    type: 'custom-checkbox',
                    label: '是否保存设置',
                    key: 'isSaved',
                    value: false
                }
            ]
        }]
    }
];
var app = new Vue({
    el: '#app',
    data: {
        actions: storedActions ? objectMerge(defaultActions, storedActions) : defaultActions,
        currentCategory: '',
        currentActions: [],
        isLoading: false,
        manually: false,
        loadingMsg: '处理中...',
        isDone: false,
        message: '处理成功',
        needUpdating: false, // 显示升级提示
        updateInfo: {
            current: '',
            latest: ''
        },
        updateBtnText: '一键升级',
        updateLoading: false,
        // 报错、成功信息提示
        showMsg: false,
        msg: '',

        clear: null, // clear setTimeout
        currentStatus: '',
        isSolo: false, // 当前只有一个操作，不能拼接其他操作

        file_types: [], // 全局存放 格式化操作 新增的文件后缀

        // 对话框相关
        showDialogBtn: false,
        showDialog: false,
        dialogTitle: '',
        dialogContent: '',
        dialogBtn: ''
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
    components: {
        customInput,
        customRadio,
        customCheckbox,
        loader
    },
    mounted() {
        updater.init(this);
    },
    watch: {
        isLoading(newVal) {
            if (this.manually) {
                this.manually = false;
                return;
            }
            if (!newVal) {
                let vm = this;
                vm.message = '处理成功';
                if (vm.isDone) {
                    clearTimeout(vm.clear);
                } else {
                    vm.isDone = true;
                }
                vm.clear = setTimeout(() => {
                    vm.isDone = false;
                }, 2000)
            }
        }
    },
    methods: {
        addToCurrent(category, action, index) {
            // 当前 可执行操作 为 不可拼接操作，因此不能添加新操作
            if (this.isSolo) { return; }
            // 操作列表不为空时不能添加 不可拼接操作
            if ((this.currentActions.length > 0) && action.isSolo) { return; }

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
                action: deepClone(action),
                index: index
            }
            console.log('action', action);
            console.log('selected', selected);

            this.currentActions.push(selected);
            // 禁用已选操作
            this.actions[index[0]].list[index[1]].disabled = true;

            if (action.isSolo) {
                // 禁用其他操作
                this.isSolo = true;
            }

            console.log(`this.currentCategory: ${this.currentCategory}`);
        },
        deleteAction(actionWrap, index) {
            // 删除操作
            this.currentActions.splice(index, 1);

            if (actionWrap.action.isSolo) {
                this.isSolo = false;
            }

            let idx = actionWrap.index;
            // 取消禁用删除的操作
            this.actions[idx[0]].list[idx[1]].disabled = false;

            let isLeftCommon = false;
            for (let item of this.currentActions) {
                let category = this.actions[item.index[0]].name;
                if (category !== '通用') {
                    this.currentCategory = category;
                    break;
                } else {
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
        },
        getConfig() {
            console.table(this.currentActions[0].action.configs)
        },
        openExternal(link) {
            shell.openExternal(link);
        },
        // 关闭全屏 loading
        closeLoading() {
            this.manually = true;
            this.isLoading = false;
            this.loadingMsg = '处理中...'; // 重置文字，有可能是 '检查中...'
        },
        // 关闭更新提示框
        closeUpdating() {
            this.manually = true;
            this.needUpdating = false;
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
    drake = dragula([document.querySelector('#draggable')], {
        moves: function(el, source, handle, sibling) {
            console.log(handle);
            if (handle.classList && handle.classList.contains('draggable-item')) {
                return true;
            } else {
                return false;
            }
        }
    });
    // 处理拖拽排序功能
    drake.on('drop', dropHandler);

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
        let fileList = e.dataTransfer.files; //获取文件
        fileList = Array.prototype.slice.call(fileList);
        let filePaths = [];
        fileList.forEach((file) => {
            filePaths.push(file.path);
        })
        handleFiles(filePaths);
    });

    // 选择文件
    $('.get-files')[0].addEventListener('click', function(e) {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, (filePaths) => {
            console.log(filePaths);
            handleFiles(filePaths);
        })
    })
    // 选择文件夹 
    $('.get-directories')[0].addEventListener('click', function(e) {
        dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, (filePaths) => {
            console.log(filePaths);
            handleFiles(filePaths);
        })
    })
});

/**
 * 处理获取到的文件路径
 * @author Alexee
 * @date   2017-08-07
 * @param  {Array}   filePaths [文件路径]
 * @return {[type]}             [description]
 */
var handleFiles = (filePaths) => {
    if (!filePaths) { return; } // 取消选择文件的情况

    // 当前未选择任何操作
    if (app.currentCategory == '') {
        alert(`当前未选择任何操作`);
        return;
    }

    var len = filePaths.length;
    if (len == 0) {
        console.log(filePaths.length);
        return false;
    }



    // 存储需要保存设置信息的操作
    let savedConfigs = [];
    // 存储一次文件处理的所有配置信息
    let configs = {};
    app.file_types = []; // 清空 格式化操作 的新增文件后缀信息
    app.currentActions.forEach(function(element, index) {
        if (!element.action.configs) { return; }
        let cleanConfigs = {};
        element.action.configs.forEach((item, idx) => {
            // 收集 格式化操作 的新增文件后缀信息
            if (['js', 'css', 'html'].indexOf(item.key) !== -1) {
                if (item.value.trim()) {
                    app.file_types.concat(item.value.replace(' ', '').split(/[,，]/g));
                    cleanConfigs[item.key] = item.value;
                }
                // 如果没值，就不传进 configs 里，这样解构对象时就不会报错了
                // Uncaught TypeError: Cannot match against 'undefined' or 'null'.
            } else {
                cleanConfigs[item.key] = item.value;
            }


            // 只要成功获取到文件列表，即代表保存设置生效
            // 判断当前操作 是否存在保存设置属性 及 保存设置是否为 true
            if ((item.key == 'isSaved') && item.value) {
                console.log('isSaved', element);
                savedConfigs.push(element);
            }
        })
        Object.assign(configs, cleanConfigs);
        console.log('configs', configs);
    })

    // 更新操作数据 及 localStorage 数据
    let actions = storedActions ? storedActions : defaultActions;
    actions = deepClone(actions);
    savedConfigs.forEach((element) => {
        let idx = element.index;
        // let configs = actions[idx[0]]['list'][idx[1]]['configs'];
        // 更新当前操作数据
        app.actions[idx[0]]['list'][idx[1]]['configs'] = element.action.configs;
        // 更新存于 localStorage 的操作数据，不同之处在于操作项的 disabled 属性值
        actions[idx[0]]['list'][idx[1]]['configs'] = element.action.configs;
    })
    // 更新 localStorage 数据
    setStore('actions', actions)


    // 判断是否批量操作文件
    let isTotal = app.currentActionsName.indexOf('sprite') !== -1;
    let multiSrc = [];
    let multiFileDir = path.dirname(filePaths[0]);


    // 获取当前操作方法
    var handleFUNC = categoryFUNCS[app.currentCategory];


    //遍历拖进来的文件
    for (var i = 0; i < len; i++) {
        var filepath = filePaths[i];

        // 获取需要批量操作的文件位置
        if (isTotal) {
            // 判断是文件还是文件夹
            // src/**/*.{jpeg,jpg,png,gif,svg}
            let stats = fs.statSync(filepath);
            if (stats && stats.isDirectory()) {
                // 如果是文件夹且文件夹下没有图片时，不会报错，但是会一直处理中，因为没有监测到任何的文件变动
                // 如果有图片，就会处理这些图片
                multiSrc.push(path.join(filepath, '/**/*.{jpeg,jpg,png,gif,svg}'));
                console.log(stats, filepath, path.join(filepath, '/**/*.{jpeg,jpg,png,gif,svg}'), multiSrc)
            } else {
                // 如果是文件，且包含非图片的文件，就会报错：
                // Uncaught Error: Unsupported file type: text/css
                let { fileType } = getFileInfo(filepath);
                // 判断格式，非图片会提示，但不影响精灵图操作
                if (handleFileType(fileType)) {
                    multiSrc.push(filepath);
                }
            }
            continue;
            // 跳过以下内容继续执行 for 语句
        }

        // 分别处理单个文件
        walk(filepath, function(err, results) {
            // results:
            // F:\Projects - relative\slice-workflow - relative\样式优化\style.css
            
            // 克隆配置信息，针对单个文件进行配置信息的再处理
            let singleConfig = deepClone(configs);

            console.log('results is', results);
            let { fileType, fileName } = getFileInfo(results);

            // 判断文件格式
            if (handleFileType(fileType)) {
                let fileDir = path.dirname(results);

                // 如果未设置 basename 和 extname，默认使用原文件的信息
                if (app.currentActionsName.indexOf('rename') !== -1) {
                    let basename = fileName.split('.')[0];
                    let re = new RegExp(basename, 'gi');
                    let extname = fileName.replace(re, '');
                    singleConfig.basename = !!singleConfig.basename ? singleConfig.basename : basename;
                    singleConfig.extname = !!singleConfig.extname ? singleConfig.extname : extname;
                }

                // 判断是否设置了 导出目录，默认导出到当前目录，保存在 configs 变量里是为了让 spriteIMG 操作可以获取到
                singleConfig.dest = !!singleConfig.dest ? path.resolve(fileDir, singleConfig.dest) : fileDir;
                //有文件，直接覆盖；没有文件，新建文件
                app.isLoading = true;
                handleFUNC(app.currentActionsName, results, singleConfig.dest, singleConfig, function(currentStatus) {
                    if (currentStatus == 'finished') {
                        app.isLoading = false;
                        app.currentStatus = '';
                        // 只能打开到路径指向：文件夹，不能进入文件夹，除非指定文件夹内的具体文件名
                        // if (singleConfig.openDir) {
                        //   shell.showItemInFolder(results);
                        // }
                    } else {
                        app.currentStatus = `执行操作：${currentStatus}`;
                    }
                });
            }
        });
    }

    // 批量处理文件（sprite 操作）
    if (isTotal) {
        // 判断是否设置了 导出目录，默认导出到当前目录，保存在 configs 变量里是为了让 spriteIMG 操作可以获取到
        configs.dest = !!configs.dest ? path.resolve(multiFileDir, configs.dest) : multiFileDir;
        //有文件，直接覆盖；没有文件，新建文件
        app.isLoading = true;
        handleFUNC(app.currentActionsName, multiSrc, configs.dest, configs, function(currentStatus) {
            if (currentStatus == 'finished') {
                app.isLoading = false;
                app.currentStatus = '';
                // if (configs.openDir) {
                //   shell.showItemInFolder(multiSrc[0]);
                // }
            } else {
                app.currentStatus = `执行操作：${currentStatus}`;
            }
        });
    }
}



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
        'IMAGE': ['png', 'jpg', 'jpeg', 'gif', 'svg'],
        'JSON': ['json'],
        'format': ['js', 'json', 'css', 'less', 'sass', 'scss', 'html']
    }

    // 获取当前文件处理类型
    let currentCategory = app.currentCategory;
    // 获取当前文件处理方法名数组
    let funcNames = app.currentActionsName;

    // 提示 格式化操作 的文件后缀不支持
    if (funcNames.indexOf('format') !== -1) {
        let currentTypes = typeOptions['format'].concat(app.file_types);
        // 只要处理的文件有格式不对的，都会提示
        if (currentTypes.indexOf(fileType.toLowerCase()) == -1) {
            app.message = `格式化操作支持文件后缀： 
                        ${currentTypes.join(' / ')}`;
            if (app.isDone) {
                clearTimeout(app.clear);
            } else {
                app.isDone = true;
            }
            app.clear = setTimeout(() => {
                app.isDone = false;
            }, 2000)
        } else {
            return true;
        }
    }

    if (currentCategory !== '通用') {
        // 获取当前可处理的文件的类型
        let currentTypes = typeOptions[currentCategory];

        console.log(`type: ${currentTypes.join('/')}`);

        // 只要处理的文件有格式不对的，都会提示
        if (currentTypes.indexOf(fileType.toLowerCase()) == -1) {
            alert(`请拖进 ${currentTypes.join(' / ')} 文件～`);
        } else {
            return true;
        }
    } else {
        return true;
    }
}



// 获取目录路径的文件直到没有子文件夹
var walk = function(dir, done) {
    fs.stat(dir, function(err, stats) {
        if (stats && stats.isDirectory()) {
            fs.readdir(dir, function(err, list) {
                list.forEach(function(file) {
                    file = path.resolve(dir, file);
                    walk(file, done);
                });
            });
        } else {
            done(err, dir);
        }
    });
};

var getFileInfo = function(filepath) {
    let fileTypeArr = filepath.split('.'),
        // 文件类型 fileType: css
        fileType = fileTypeArr[fileTypeArr.length - 1],
        fileNameArr = filepath.split("\\"),
        // 文件名 fileName: test.css
        fileName = fileNameArr[fileNameArr.length - 1];
    return {
        fileType,
        fileName
    }
};

// new Date().Format("yyyy-MM-dd");
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


