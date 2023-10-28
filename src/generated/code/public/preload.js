const {ipcRenderer } = require('electron');

console.log(global.location.search);
const params = new URLSearchParams(global.location.search);
const pluginFile = params.get("plugin");
const dataFile = params.get("file");


window.electron = {
    openDialog: (method, config) => { return (ipcRenderer.invoke('dialog', method, config)) },
    getPath: (path) => { return (ipcRenderer.invoke('getPath', path)) },
    getAppPath: () => { return (ipcRenderer.invoke('getAppPath')) },
    openPluginEditor: (path) => { return (ipcRenderer.invoke('openPluginEditor', path)) },
    isPluginMode: pluginFile !== null,
    fileToOpen: dataFile || pluginFile,
}