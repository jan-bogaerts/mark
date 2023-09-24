
// Importing required modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require("electron-is-dev");
require('@electron/remote/main').initialize(); // initialize remote module
const mainRemote = require("@electron/remote/main");

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    // for these to work, there also needs to be a div in the header with css style `-webkit-app-region: drag;` to make the window draggable
    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app.
  let url;
  if (isDev) {
    url = 'http://localhost:3000';
  } else {
    url = `file://${path.join(__dirname, '../build/index.html')}`;
  }
  mainWindow.loadURL(url);
  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  mainRemote.enable(mainWindow.webContents);


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('browser-window-focus', () => {
  mainWindow.webContents.send('focused')
})

app.on('browser-window-blur', () => {
  mainWindow.webContents.send('blurred')
})

ipcMain.handle('dialog', async (event, method, params) => {    
  if (method  === 'showErrorBox') {
    dialog.showErrorBox(params.title, params.content.toString());
  } else {
    const result = await dialog[method](params);
    return result;
  }
});
