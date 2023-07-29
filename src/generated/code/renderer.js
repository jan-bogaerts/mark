// renderer.js

const { ipcRenderer } = require('electron');

// Listen for messages from the main process
ipcRenderer.on('message', (event, message) => {
  console.log('Received message:', message);
});

// Send a message to the main process
ipcRenderer.send('message', 'Hello from renderer process!');