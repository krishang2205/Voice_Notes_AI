const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
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
let tray = null;

function createTray(mainWindow) {
    const iconPath = path.join(__dirname, 'assets', 'icon.png'); // Placeholder
    const icon = nativeImage.createFromPath(iconPath);

    tray = new Tray(icon);
    tray.setToolTip('Voice Notes AI');

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
}

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

const http = require('http');

function waitForBackend(retries = 10) {
    return new Promise((resolve, reject) => {
        const tryConnect = (attempt) => {
            if (attempt <= 0) return reject('Backend timed out');

            const req = http.get('http://localhost:3000/health', (res) => {
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    setTimeout(() => tryConnect(attempt - 1), 500);
                }
            });

            req.on('error', () => {
                setTimeout(() => tryConnect(attempt - 1), 500);
            });
            req.end();
        };
        tryConnect(retries);
    });
}

app.whenReady().then(async () => {
    startBackend();

    if (!app.isPackaged) {
        createWindow();
    } else {
        try {
            await waitForBackend();
            createWindow();
        } catch (err) {
            console.error('Backend failed to start', err);
            createWindow();
        }
    }

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
