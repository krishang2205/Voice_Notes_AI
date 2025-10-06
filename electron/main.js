const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // IPC Handlers
    ipcMain.handle('window-minimize', () => mainWindow.minimize());
    ipcMain.handle('window-maximize', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.handle('window-close', () => mainWindow.close());
    ipcMain.handle('window-is-maximized', () => mainWindow.isMaximized());

    // In dev, load localhost. In prod, load index.html
    // For now, we assume dev mode on localhost:5173 (Vite default)
    const devUrl = 'http://localhost:5173';

    mainWindow.loadURL(devUrl).catch(() => {
        console.log('Waiting for frontend to start...');
        setTimeout(() => mainWindow.loadURL(devUrl), 3000);
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
