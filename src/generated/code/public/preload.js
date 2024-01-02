const {ipcRenderer } = require('electron');
const path = require('path');

const params = new URLSearchParams(global.location.search);
const pluginFile = params.get("plugin");
const logModeTxt = params.get("log");
const isLogMode = logModeTxt === 'true' || logModeTxt === true;
const dataFile = params.get("file");
const isPackaged = params.get("isPackaged") === 'true';


window.electron = {
    openDialog: (method, config) => { return (ipcRenderer.invoke('dialog', method, config)) },
    getPath: (path) => { return (ipcRenderer.invoke('getPath', path)) },
    getAppPath: () => { return (ipcRenderer.invoke('getAppPath')) },
    openPluginEditor: (path) => { return (ipcRenderer.invoke('openPluginEditor', path)) },
    onCanClose: (callback) => { ipcRenderer.on('can-close', callback) },
    removeOnCanClose: (callback) => { ipcRenderer.removeListener('can-close', callback) },
    canCloseProcessed: (canClose) => { return (ipcRenderer.invoke('can-close-processed', canClose)) },
    onLogMsg: (callback) => { ipcRenderer.on('show-log-msg', callback) },
    removeOnLogMsg: (callback) => { ipcRenderer.removeListener('show-log-msg', callback) },
    logMsg: (msg) => { ipcRenderer.invoke('log-msg', msg) },
    showLogWindow: (value) => { ipcRenderer.invoke('show-log-window', value) },
    onLogWindowVisibility: (callback) => { ipcRenderer.on('log-window-visibility', callback) },
    removeOnLogWindowVisibility: (callback) => { ipcRenderer.removeListener('log-window-visibility', callback) },
    showDebugger: (value) => { ipcRenderer.invoke('show-debugger', value) },
    onDebuggerVisibility: (callback) => { ipcRenderer.on('debugger-visibility', callback) },
    removeOnDebuggerVisibility: (callback) => { ipcRenderer.removeListener('debugger-visibility', callback) },
    isPluginMode: pluginFile !== null,
    isLogMode: isLogMode,
    fileToOpen: dataFile || pluginFile,
    resourcesPath: isPackaged ? path.join(process.resourcesPath, 'resources') : path.join(__dirname, '../resources'),
}