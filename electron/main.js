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
    const isDev = !app.isPackaged;

    if (isDev) {
        console.log('Development mode: Backend should be running separately.');
        return;
    }

    const backendPath = path.join(process.resourcesPath, 'backend');
    console.log(`Starting backend from: ${backendPath}`);

    // In production, backend will be a compiled JS file (server.js) in the backend resource folder
    backendProcess = spawn('node', ['server.js'], {
        cwd: backendPath,
        stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend:', err);
    });
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
