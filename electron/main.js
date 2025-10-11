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

    // URL Loading Strategy
    // -------------------
    // In Development:
    // We rely on the Vite dev server running on port 5173.
    // The Electron window waits for this port to be active before loading.

    // In Production:
    // The frontend assets (HTML/CSS/JS) are compiled by Vite into the 'dist' folder.
    // We assume these assets are packaged within the Electron app (e.g., in the 'app.asar').
    // The path usually resolves to __dirname if 'files' config is correct.

    const isDev = !app.isPackaged;
    const devUrl = 'http://localhost:5173';
    // const prodPath = path.join(__dirname, 'frontend/dist/index.html'); 
    // We will ensure electron-builder copies frontend/dist to output

    if (isDev) {
        mainWindow.loadURL(devUrl).catch((err) => {
            console.log('Error loading dev URL:', err);
            console.log('Waiting for frontend to start...');
            setTimeout(() => mainWindow.loadURL(devUrl), 3000);
        });
    } else {
        // Load local file in production
        // We need to verify where "index.html" ends up. 
        // Typically: path.join(__dirname, 'index.html') if files are flat,
        // or path.join(__dirname, 'dist', 'index.html').
        // Let's assume we copy 'dist' content to root of app bundle or keep 'dist' folder.

        const indexPath = path.join(__dirname, 'dist', 'index.html');
        mainWindow.loadFile(indexPath).catch((err) => {
            console.error('Failed to load production index.html:', err);
        });
    }

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
    });
}

// Backend Management
// Backend Management
const { spawn } = require('child_process');
let backendProcess = null;
let tray = null;
let isQuitting = false;

function createTray(mainWindow) {
    const iconPath = path.join(__dirname, 'assets', 'icon.png'); // Placeholder
    const icon = nativeImage.createFromPath(iconPath);

    tray = new Tray(icon);
    tray.setToolTip('Voice Notes AI');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => mainWindow.show()
        },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

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

    if (mainWindow) {
        createTray(mainWindow);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// App Menu
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    isQuitting = true;
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) {
            backendProcess.kill();
        }
        app.quit();
    }
});
