#  项目地址
[Github 仓库本体（发布版，下载地址在这里的 release 里）](https://github.com/SuperAL/splice)
[Github 仓库分身（开发版，clone 或 fork 这个）](https://github.com/SuperAL/splice-dev)

# splice
> GUI workflow for Front-End developers based on Electron

## 功能

### 实现前端常用的文件处理功能：
1. HTML：
	- 压缩 html
	- 通过 html 中的注释来合并 css / js
2. CSS：
	- 添加兼容性前缀
	- 压缩 css
	- 图片转 base64
	- 精灵图
		- 处理 css 文件并生成相应的精灵图
3. JS：
	- 压缩 js
4. IMAGE：
	- 压缩图片
	- 将多张图片合成精灵图并生成相应的 css
5. JSON：
	- 压缩 json
6. 通用：
	- 格式化
		- 格式化 JavaScript, JSON, HTML 和 CSS 等文件
	- 文件重命名
	- 自定义设置
		- 设置文件的导出目录

### 其他：
- 快捷键：
	- 刷新页面：`Ctrl+Alt+R`
	- 开启或关闭开发者工具：`Ctrl+Alt+T`
- 右键菜单：
	- 刷新：刷新页面
	- 开发者工具：开启或关闭开发者工具
	- 检查更新：检查是否有新版本
	- 重启应用：刷新解决不了的问题就重启吧
- 在线更新：
  - 打开应用后默认检查更新，右键菜单也可以点击检查更新
  - 当 github 上存在更新的版本时，显示 **一键升级** 按钮
  - 更新思路：替换文件，自动安装新增的 npm 模块（可能安装失败，可以到应用根目录 `...resources/app/` 手动安装）
  - 要是更新后出了问题，操作项的表单有点奇怪（有重复的表单元素之类的 ），就打开开发者工具，选择 Application 标签，找到 Local Storage，然后删掉缓存的数据，再右键刷新下 Splice 应用，应该就能恢复正常了（老天保佑！）

## 截图

### 界面：
![WIN](http://upload-images.jianshu.io/upload_images/448830-7ee0b68edacb73b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![MAC](http://upload-images.jianshu.io/upload_images/448830-2d76fb76b8f08257.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 简单操作：
![压缩并重命名图片](http://upload-images.jianshu.io/upload_images/448830-f58f7b1d6340d8f2.gif?imageMogr2/auto-orient/strip)

## 下载地址

- [win zip](https://github.com/SuperAL/splice/releases/download/1.1.2/splice-win32-x64-v1.1.2.zip)（解压了找到 `splice.exe` 双击打开就能用）
- [win installer](https://github.com/SuperAL/splice/releases/download/1.1.2/splice-1.1.2.Setup.exe)（双击该文件进行安装，与开箱即用版差别就是该安装器小了 5MB，(＃￣▽￣＃)）
- [mac](https://github.com/SuperAL/splice/releases/download/1.1.2/Splice-darwin-x64.zip)

## 开发
1. 拉取项目
```bash
git clone https://github.com/SuperAL/splice-dev.git
```
下面是针对 splice 仓库的 clone 操作，现在用上面的方法即可
```bash
git clone https://github.com/SuperAL/splice.git --depth=1
# 解释一下那个 `--depth=1`，代表只获取最新的 commit 记录。
# 因为之前的一些误操作，不小心将打包后的文件也上传到了 git，即使文件删掉了记录还是存在，因此记录文件超级大，直接导致 `clone` 超级慢。
# 加上 `--depth=1` 可以解决 `clone` 慢的问题。
```
2. 安装依赖
```bash
npm install
```
3. 运行项目
```bash
npm run start
```
4. 打包项目
```bash
# win 64位
npm run pack:win

# win 32位
npm run pack:win32

# mac，需要使用 mac 电脑
npm run pack:mac
```

第二种打包方式（使用了 [electron-forge](https://www.npmjs.com/package/electron-forge)，该方式打包的 `exe` 版本比 `electron-packager` 大一点点）
```bash
# 全局安装 electron-forge
npm install electron-forge -g

# 打包你当前使用的平台的版本
electron-forge package

# 制作安装器（installer）
electron-forge make
```

## 使用到的文件操作相关模块

#### 工具类
- [gulp](https://www.npmjs.com/package/gulp)
- [gulp-if](https://www.npmjs.com/package/gulp-if)

#### html 压缩
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)

#### 通过 html 文件处理 css、js 文件的合并
- [gulp-usemin2](https://www.npmjs.com/package/gulp-usemin2)

#### css 压缩、添加兼容前缀
- [gulp-postcss](https://www.npmjs.com/package/gulp-postcss)
- [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano)
- [autoprefixer](https://www.npmjs.com/package/autoprefixer)

#### 将 css 中通过 url 引入的图片转成 base64
- [gulp-base64](https://www.npmjs.com/package/gulp-base64)

#### 通过 css 生成精灵图
- [gulp-sprite-generator2](https://www.npmjs.com/package/gulp-sprite-generator2)

#### js 压缩
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

#### 图片压缩
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
- [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)

#### 精灵图处理
- [gulp.spritesmith](https://www.npmjs.com/package/gulp.spritesmith)
- [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer)
- [merge-stream](https://www.npmjs.com/package/merge-stream)

#### json 文件压缩
- [gulp-json-minify](https://www.npmjs.com/package/gulp-json-minify)

#### JavaScript, JSON, HTML 和 CSS 代码格式化
- [gulp-jsbeautifier](https://www.npmjs.com/package/gulp-jsbeautifier)

#### 文件重命名
- [gulp-rename](https://www.npmjs.com/package/gulp-rename)

#### 监听文件变化，显示 loading 效果
- [gulp-watch](https://www.npmjs.com/package/gulp-watch)
- [path-exists](https://www.npmjs.com/package/path-exists)

## 协议

[GNU General Public License v3.0](LICENSE)
本项目仅供学习交流和私人使用，禁止用作商业用途

## Final Words
Inspiration comes from [sprite-it](https://github.com/HelKyle/sprite-it), Big thanks to [HelKyle](https://github.com/HelKyle). 
