const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Placeholder for future IPC calls
    ping: () => ipcRenderer.invoke('ping'),
});
