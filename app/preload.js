// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// (Optional) keep versions if you still use it elsewhere:
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  createDirectory: (json) => ipcRenderer.invoke('create-directory', json),
  openModal: (url) => ipcRenderer.send('open-webpage-modal', url)
});
