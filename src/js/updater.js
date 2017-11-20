var updater = {
    contextmenu: function () {
        var self = this;
        var menu = new Menu();
        // reload - 正常重新加载当前窗口
        // forcereload - 忽略缓存并重新加载当前窗口
        // toggledevtools - 在当前窗口中切换开发者工具
        menu.append(new MenuItem({
            label: '刷新',
            role: 'reload'
        }));
        // menu.append(new MenuItem({
        //     label: '强制刷新',
        //     role: 'forcereload'
        // }));
        menu.append(new MenuItem({
            label: '开发者工具',
            role: 'toggledevtools'
        }));
        menu.append(new MenuItem({
            label: '检查更新',
            click: () => {
                self.updateDetect(self.app);
            }
        }));

        window.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            menu.popup(remote.getCurrentWindow());
        }, false)
    },
    // 获取文件资源
    getHttpsData: function(filepath, success, error) {
        console.log('get url', filepath);

        // 回调缺省时候的处理
        success = success || function() {};
        error = error || function() {};

        var url = 'https://raw.githubusercontent.com/SuperAL/splice/master/' + filepath + '?r=' + Math.random();

        https.get(url, function(res) {
            console.log('res is', res);
            var statusCode = res.statusCode;

            if (statusCode !== 200) {
                // 出错回调
                error();
                // 消耗响应数据以释放内存
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', function(chunk) {
                rawData += chunk;
            });

            console.log('rawData is', rawData);
            // 请求结束
            res.on('end', function() {
                // 成功回调
                success(rawData);
            }).on('error', function(e) {
                // 出错回调
                error();
            });
        }).on('error', (e) => {
            error('文件获取失败');
            console.error(e);
        });
    },
    // 创建路径对应的文件夹（如果没有）
    createPath: function (path) {
        // 路径有下面这几种
        // 1. /User/...      OS X
        // 2. E:/mydir/...   window
        // 3. a/b/...        下面3个相对地址，与系统无关
        // 4. ./a/b/...
        // 5. ../../a/b/...

        path = path.replace(/\\/g, '/');

        var pathHTML = '.';
        if (path.slice(0,1) == '/') {
            pathHTML = '/';
        } else if (/:/.test(path)) {
            pathHTML = '';
        }

        path.split('/').forEach(function(filename) {
            if (filename) {
                // 如果是数据盘地址，忽略
                if (/:/.test(filename) == false) {
                    pathHTML = pathHTML + '/' + filename;
                    // 如果文件不存在
                    if(!fs.existsSync(pathHTML)) {
                        // console.log('路径' + pathHTML + '不存在，新建之');
                        fs.mkdirSync(pathHTML);
                    }
                } else {
                    pathHTML = filename;
                }
            }
        });
    },
    /*
     * 复制目录中的所有文件包括子目录
     * @param{ String } 需要复制的目录
     * @param{ String } 复制到指定的目录
     */
    copy: function (src, dst) {
        var self = this;

        if (!fs.existsSync(src)) {
            return;
        }

        // 读取目录中的所有文件/目录
        var paths = fs.readdirSync(src);

        paths.forEach(function (dir) {
            var _src = path.join(src, dir),
            _dst = path.join(dst, dir),
            readable, writable;

            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }

                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                } else {
                    // 作为文件夹处理
                    self.createPath(_dst);
                    self.copy(_src, _dst);
                }
            });
        });
    },
    // 更新检测
    updateDetect: function(app) {
        var self = this;
        
        /**
         * -----------------------------------------------------------------
         * app 相关 ↓
         * ----------------------------------------------------------------- 
         */
        var detectLoading = {
            show() {
                app.loadingMsg = '检查更新';
                app.isLoading = true;
            },
            hide() {
                app.loadingMsg = '处理中...';
                app.manually = true; // 不触发 watch 里的其他代码
                app.isLoading = false;
            }
        };
        detectLoading.show();


        // 信息提示的统一处理
        var showMsg = function(msg) {
            detectLoading.hide();
            // 取消 loading
            loading.stop();
            // 按钮状态还原
            btnTxt('重试');

            app.msg = msg ? msg : '更新检测失败';
            app.showMsg = true;
            setTimeout(() => {
                app.showMsg = false;
            }, 3000);
        };
        // 升级过程中的百分比进度
        var percentProgress = {
            len: 2, // 2 作为资源覆盖的时间
            current: 0,
            init: function(length) {
                this.len += length; 
                this.go(0);
                return this;
            },
            forward: function(steps) {
                this.current = +steps ? +steps + this.current : ++this.current;
                this.update();
            },
            go: function(to) {
                this.current = +to || 0;
                this.update();
            },
            update: function() {
                app.updateBtnText = parseInt((this.current/this.len)*100) +'%';
            },
            hasProgress: function() {
                return app.updateBtnText.indexOf('%') !== -1;
            }
        }
        // 按钮文字切换
        var btnTxt = function(txt) {
            app.updateBtnText = txt;
        }
        // 显示升级提示
        var showUpdate = function(current, latest) {
            detectLoading.hide();

            app.updateBtnText = '一键升级';
            app.updateInfo.current = current;
            app.updateInfo.latest = latest;
            app.needUpdating = true;
        }
        var loading = {
            start: function() {
                app.updateLoading = true;
            },
            stop: function() {
                app.updateLoading = false;
            },
            isLoading: function() {
                return app.updateLoading;
            }
        }
        document.getElementById('dialogBtn').addEventListener('click', function(e) {
            location.reload();
        });
        var done = function(progress, autoload, content) {
            console.log('progress is', progress);
            progress.forward(2); // 百分比进度到百分百
            console.log('progress is', progress);
            // 关闭 loading
            loading.stop();
            if (autoload) {
                setTimeout(function() {
                    // 升级成功，重载中...
                    // 提示信息
                    btnTxt('升级成功，重载中...')
                    location.reload();
                }, 3000);
            } else {
                if (content) {app.dialogTitle = '模块安装提示';
                    app.dialogContent = content;
                    app.showDialogBtn = true;
                    app.dialogBtn = '重启应用';
                    app.showDialog = true;
                    
                } else {
                    location.reload();
                }
            }
        }
        /**
         * -----------------------------------------------------------------
         * app 相关 ↑
         * -----------------------------------------------------------------
         */



        // 0.0.00 这种版本转换为可直接比较的内容
        // > '1.1.01'.version()
        // < "010101"
        String.prototype.version = function() {
            return this.split('.').map(function(seed) {
                if (seed.length == 1) {
                    seed = '0' + seed;
                }
                return seed;
            }).join('');
        };



        // 1. 获取 github 远程的 package.json 数据
        self.getHttpsData('package.json', function(strJSONRemotePackage) {
            // string to JSON
            try {
                var jsonRemotePackage = JSON.parse(strJSONRemotePackage);
            } catch (e) {
                showMsg('远程 package.json 解析异常：' + e.message);
                return;
            }

            // 读取本地
            var pathLocalPackage = path.join(__dirname, '../package.json'); // 路径：package.json相对于当前文件所在的文件夹

            // 对比本地版本和线上版本
            var strJSONLocalPackage = fs.readFileSync(pathLocalPackage, 'utf8');
            // string to JSON
            try {
                var jsonLocalPackage = JSON.parse(strJSONLocalPackage);
            } catch (e) {
                showMsg('本地 package.json 解析异常：' + e.message);
                return;
            }



            // 版本比对
            var versionLocal = jsonLocalPackage.version;
            var versionRemote = jsonRemotePackage.version;

            // 判断本地版本是否小于远程版本
            if (versionLocal.version() < versionRemote.version()) {
                // 求得远程版本的一些数据（升级文件序列，升级描述）
                var manifest = jsonRemotePackage.manifest;
                var objTargetVersion = null;
                manifest.forEach(function(obj) {
                    if (obj.version === versionRemote) {
                        objTargetVersion = obj;
                    }
                });

                if (!objTargetVersion) {
                    showMsg('信息异常，当前版本 ' + versionLocal + ' 无法升级');
                    return;
                }

                // 获取升级日志
                var logs = objTargetVersion.logs;

                // 显示升级提示
                showUpdate(versionLocal, versionRemote);

                document.getElementById('showLogs').addEventListener('click', function() {
                    let content = `<ol>`;
                    logs.forEach(item => {
                        content += `<li>${item}</li>`
                    })
                    content += `</ol>`;
                    app.dialogTitle = '升级日志';
                    app.dialogContent = content;
                    app.showDialogBtn = false;
                    app.showDialog = true;
                })

                // 临时文件夹目录
                var dirUpdate = path.join(__dirname, versionRemote);
                
                console.log('升级按钮点击事件');
                // 点击升级按钮
                $('#updateBtn').on('click', function(e) {
                    e.preventDefault();
                    console.log('updateBtn click');
                    if (loading.isLoading() || progress.hasProgress())  return;
                    console.log('updateBtn working');
                    loading.start();
                    // 这里有一个稍稍复杂的逻辑处理，就是
                    // 升级文件的合并
                    // 用户可能升级的时候，一次性跨度多个版本
                    // a版本升级7个文件
                    // b版本就只需要升级1个文件
                    // 如果只按照最新的b版本升级，就会出现问题
                    // 因此，需要遍历出本地版本和线上版本之间的所有文件内容
                    // 首先，package.json 是必须的
                    var arrFile = ['package.json']; // 路径：文件位置相对于项目根目录
                    var packages = [];
                    manifest.forEach(function(obj) {
                        if (obj.version && obj.version.version() > versionLocal.version()) {
                            obj.files.forEach(function(filepath) {
                                if (arrFile.indexOf(filepath) === -1) {
                                    arrFile.push(filepath);
                                }
                            });
                            // 需要安装的模块
                            obj.packages.forEach(function(package) {
                                if (packages.indexOf(package) === -1) {
                                    packages.push(package);
                                }
                            });
                        }
                    });

                    // 文件个数，百分比进度
                    var length = arrFile.length;
                    console.log('length', length);

                    // 开始升级进度提示
                    var progress = percentProgress.init(length);

                    // 循环获取文件资源
                    var start = 0;
                    var step = function() {
                        var filepath = arrFile[start],
                            action = 'modify';
                        if (filepath) {
                            // ["README.md", "css/style.css|delete"]
                            var splitFilepath = filepath.split('|');
                            if (splitFilepath.length === 2) {
                                filepath = splitFilepath[0];
                                action = splitFilepath[1];
                            }
                            // "./README.md" => "README.md"
                            filepath = filepath.replace(/^\.\//, '');
                            // 绝对地址
                            // filepath = path.join(__dirname, filepath);

                            // 删除操作
                            if (action === 'delete') {
                                if (fs.existsSync(filepath)) {
                                    fs.unlinkSync(filepath);
                                }

                                // 进度更新
                                start++;
                                progress.forward();

                                // 下一个文件
                                step();
                                return;
                            }

                            // 建立以版本号为名称的临时文件夹
                            if (!fs.existsSync(dirUpdate)) {
                                fs.mkdirSync(dirUpdate);
                            }

                            // 之前已经获得，直接写入
                            if (filepath === 'package.json') {
                                // 写入文件
                                fs.writeFileSync(path.join(dirUpdate, filepath), strJSONRemotePackage);
                                // 进度更新
                                start++;
                                progress.forward();
                                // 下一个文件
                                step();
                                return;
                            }

                            // 获取文件内容
                            self.getHttpsData(filepath, function(data) {
                                // 如果更新文件路径较深，例如'src/css/style.css'
                                var arrFilepath = filepath.split('/');
                                if (arrFilepath.length > 1) {
                                    arrFilepath.pop();
                                    // 深度创建文件资源
                                    self.createPath(path.join(dirUpdate, arrFilepath.join('/')));
                                }
                                // 写入文件
                                fs.writeFileSync(path.join(dirUpdate, filepath), data);

                                // 进度更新
                                start++;
                                progress.forward();

                                // 下一个文件
                                step();
                            }, function() {
                                // 错误提示
                                showMsg(filepath + ' 获取失败');
                                // 取消 loading
                                loading.stop();
                                // 按钮状态还原
                                btnTxt('重试');
                            });
                        } else {
                            // 资源全部获取完毕，更新中...                           
                            self.copy(dirUpdate, path.join(__dirname, '../')); // 路径：项目根目录相对于当前文件所在的文件夹

                            

                            // 安装新增模块
                            if (packages.length > 0) {
                                console.log('需要安装新模块');
                                self.install(packages, function(stdout, stderr) {
                                    console.log('stdout, stderr', stdout, stderr);
                                    // showMsg(`<b>执行 npm install 安装新增模块时输出如下</b>：
                                    //     ${stdout}
                                    //     ${stderr}
                                    //     <b>如有问题，请自行在应用根目录安装如下模块</b>：
                                    //     ${packages.join(', ')}`);
                                    let content = `<b>如有问题，请自行在应用根目录安装新增的 npm 模块</b>：
                                                    ${packages.join(', ')}
                                                    <br/>
                                                    <b>执行 npm install 安装新增模块时输出如下</b>：
                                                    <br/>
                                                    ${stdout}
                                                    ${stderr}
                                                    `;
                                    // 确认信息后点击重启应用
                                    done(progress, false, content);
                                }, function(error) {
                                    console.log('error', error);
                                    // showMsg(`<b>执行 npm install 安装新增模块时出错</b>：
                                    //     ${error}
                                    //     <b>请自行在应用根目录安装如下模块</b>：
                                    //     ${packages.join(', ')}`);
                                    let content = `<b>请自行在应用根目录安装新增的 npm 模块</b>：
                                                    ${packages.join(', ')}
                                                    <br/>
                                                    <b>执行 npm install 安装新增模块时出错</b>：
                                                    <br/>
                                                    ${error}
                                                    `;
                                    // 确认信息后点击重启应用
                                    done(progress, false, content);
                                })
                            } else {
                                console.log('无新增模块');
                                // 自动重启应用
                                done(progress, true);
                            }
                            
                        }
                    };
                    step();
                });
            } else {
                showMsg('当前 ' + versionLocal + ' 已经是最新版本');
            }
        }, showMsg);
    },
    // npm install packages
    install: function(packages = [], success, fail) {
        if (packages.length === 0) {
            fail('无需要安装的模块');
        }

        // 回调缺省时候的处理
        success = success || function() {};
        fail = fail || function() {};

        let cmd = `npm i -S ${packages.join(' ')}`;
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(`exec error: ${error}`);
                fail(error);
                return;
            }

            // 提示：如果出问题可以自己下载
            success(stdout, stderr);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    },
    init: function (app) {
        this.app = app;
        // 右键菜单
        this.contextmenu();
        // 版本检测
        this.updateDetect(app);
    }   
};
