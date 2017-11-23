const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const path = require('path')
const url = require('url')

// 开发时使用：自动更新
// build: 打包时需注释掉
// require('electron-reload')(__dirname, { ignored: /node_modules|[\/\\]\./ });


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1000, height: 808, minWidth: 1000, minHeight: 808 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 隐藏菜单栏
  mainWindow.setMenu(null);

  // Open the DevTools.
  // build: 打包时需注释掉
  // mainWindow.webContents.openDevTools()

  // 快捷键 Ctrl+Alt+R 刷新页面 
  globalShortcut.register('Ctrl+Alt+R', function () {
    mainWindow.webContents.reload();
  })

  // 快捷键 Ctrl+Alt+T 开启或关闭开发者工具
  globalShortcut.register('Ctrl+Alt+T', function () {
    mainWindow.webContents.toggleDevTools();
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', function() {
  // Unregister a shortcut.
  // globalShortcut.unregister('ctrl+x');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.