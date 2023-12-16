
// Importing required modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require("electron-is-dev");
require('@electron/remote/main').initialize(); // initialize remote module
const mainRemote = require("@electron/remote/main");

let mainWindow;
let pluginsWindow;
let logWindow;
let canCloseResolver = null; // a callback to resolve the promise, that is set when the can-close event is sent and main is waiting for a response

const windowConfig = {
  width: 800,
  height: 600,
  autoHideMenuBar: true,
  titleBarStyle: 'hidden',
  titleBarOverlay: true,
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
};

// Load the index.html of the app.
let url;
if (isDev) {
  url = 'http://localhost:3000';
} else {
  url = `file://${path.join(__dirname, '../build/index.html')}`;
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(windowConfig);
  console.log(process.argv);
  const fileIdx = app.isPackaged ? 2 : 5;
  let urlWithParams;
  if (process.argv.length > fileIdx) {
    const path = process.argv[fileIdx];
    urlWithParams = `${url}?file=${path}&isPackaged=${app.isPackaged}`;
  } else { 
    urlWithParams = `${url}?isPackaged=${app.isPackaged}`;
  }
  mainWindow.loadURL(urlWithParams);
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

  mainWindow.on("close", async (event) => {
    event.preventDefault();
    const canCloseProcessed = new Promise((resolve) => { canCloseResolver = resolve });
    mainWindow.webContents.send('can-close');
    const canClose = await canCloseProcessed;
    console.log('canClose', canClose);
    canCloseResolver = null;
    if (canClose) {
      if (pluginsWindow) {
        pluginsWindow.close();
      }
      if (logWindow) {
        logWindow.close();
      }
      mainWindow.destroy();  // important: need to destroy otherwise we are stuck in a loop
    } else {
      event.preventDefault();
    }
  });
  mainWindow.on('focus', () => { mainWindow.webContents.send('focused') });
}

function createPluginWindow (path) {
  return new Promise((resolve, reject) => {
    // Create the browser window.
    if (pluginsWindow) { // not if already open
      resolve();
      return;
    }
    pluginsWindow = new BrowserWindow(windowConfig);
    const urlWithParams = `${url}?plugin=${path}&isPackaged=${app.isPackaged}`;
    pluginsWindow.loadURL(urlWithParams);
    // Automatically open Chrome's DevTools in development mode.
    if (!app.isPackaged) {
      pluginsWindow.webContents.openDevTools();
    }
    mainRemote.enable(pluginsWindow.webContents);

    // Emitted when the window is closed.
    pluginsWindow.on('closed', function () {
      pluginsWindow = null;
      resolve();
    });
    pluginsWindow.on('focus', () => { pluginsWindow.webContents.send('focused') });
  });
}

function createLogWindow() {
  return new Promise((resolve, reject) => {
    // Create the browser window.
    if (logWindow) { // not if already open
      logWindow.focus();
      resolve();
      return;
    }
    logWindow = new BrowserWindow(windowConfig);
    logWindow.setTitle('Log');
    const urlWithParams = `${url}?log=true&isPackaged=${app.isPackaged}`;
    logWindow.loadURL(urlWithParams);
    // Automatically open Chrome's DevTools in development mode.
    if (!app.isPackaged) {
      logWindow.webContents.openDevTools();
    }
    mainRemote.enable(logWindow.webContents);

    // Emitted when the window is closed.
    logWindow.on('closed', function () {
      logWindow = null;
      resolve();
    });
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

ipcMain.handle('getPath', async (event, path) => {
  return app.getPath(path);
});

ipcMain.handle('getAppPath', async (event) => {
  return app.getAppPath();
});


ipcMain.handle('openPluginEditor', async (event, path) => {
  try {
    await createPluginWindow(path);
    return true;
  }
  catch (error) {
    dialog.showErrorDialog(error.message);
    return false;
  }
});

ipcMain.handle('can-close-processed', async (event, canClose) => {
  if (canCloseResolver) {
    canCloseResolver(canClose);
  }
});

ipcMain.handle('log-msg', async (event, msg) => {
  if (logWindow) {
    logWindow.webContents.send('show-log-msg', msg);
  }
});

ipcMain.handle('show-log-window', async (event, value) => {
  try {
    if (value) {
      await createLogWindow();
    } else {
      if (logWindow) {
        logWindow.close();
      }
    }
  } catch (error) {
    dialog.showErrorDialog(error.message);
  }
});