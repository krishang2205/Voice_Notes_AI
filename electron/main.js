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
    const devUrl = 'http://localhost:5173';
    mainWindow.loadURL(devUrl).catch(() => {
        console.log('Waiting for frontend to start...');
        setTimeout(() => mainWindow.loadURL(devUrl), 3000);
    });
}

// Backend Management
const { spawn } = require('child_process');
let backendProcess = null;

function startBackend() {
    const backendPath = path.join(__dirname, '../backend'); // Adjust for prod later
    console.log('Starting backend service...');

    // In dev, we might already have it running, but for packaging:
    // backendProcess = spawn('node', ['dist/server.js'], { cwd: backendPath });
    // For now, we'll just log that we would start it here in production
    // or if the user wants to run "all-in-one".

    // Simplistic dev implementation:
    // This is just a placeholder to show WHERE we would spawn it.
    // In real dev, we run `npm run dev:backend` separately.
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) {
            backendProcess.kill();
        }
        app.quit();
    }
});
