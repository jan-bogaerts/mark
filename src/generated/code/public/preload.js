const {ipcRenderer } = require('electron');
const path = require('path');

console.log(path.join(__dirname, '../resources'));
const params = new URLSearchParams(global.location.search);
const pluginFile = params.get("plugin");
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
    isPluginMode: pluginFile !== null,
    fileToOpen: dataFile || pluginFile,
    resourcesPath: isPackaged ? path.join(process.resourcesPath, 'resources') : path.join(__dirname, '../resources'),
}