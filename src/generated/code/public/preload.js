const {ipcRenderer } = require('electron');


window.electron = {
    openDialog: (method, config) => { return(ipcRenderer.invoke('dialog', method, config)) }
}