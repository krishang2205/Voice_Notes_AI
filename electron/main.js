const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For MVP simplicity as requested, typically strict for prod
        },
    });

    // In dev, load localhost. In prod, load index.html
    // For now, we assume dev mode on localhost:5173 (Vite default)
    const devUrl = 'http://localhost:5173';

    win.loadURL(devUrl).catch(() => {
        console.log('Waiting for frontend to start...');
        setTimeout(() => win.loadURL(devUrl), 3000);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
