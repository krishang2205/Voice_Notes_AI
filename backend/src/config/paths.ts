import path from 'path';
import os from 'os';

export const getDataDir = (): string => {
    // In production (Electron), we want to use %APPDATA%/VoiceNotesAI/uploads
    // In development, we can keep using local uploads folder or the same AppData loop

    // Check if we are potentially in an Electron context via env vars or simple logic
    const appName = 'VoiceNotesAI';

    // Cross-platform data directory
    const homeDir = os.homedir();

    let baseDir: string;

    if (process.platform === 'win32') {
        baseDir = process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming');
    } else if (process.platform === 'darwin') {
        baseDir = path.join(homeDir, 'Library', 'Application Support');
    } else {
        baseDir = process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config');
    }

    return path.join(baseDir, appName, 'uploads');
};

export const UPLOAD_DIR = getDataDir();
