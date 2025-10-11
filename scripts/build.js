const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const ELECTRON_DIR = path.join(ROOT_DIR, 'electron');

// Helper to run commands with consistent output
function run(command, cwd, description) {
    console.log(`\n\x1b[36m[BUILD] ${description}...\x1b[0m`);
    console.log(`> ${command} (in ${cwd})`);

    try {
        execSync(command, {
            cwd,
            stdio: 'inherit',
            env: { ...process.env, FORCE_COLOR: '1' }
        });
        console.log(`\x1b[32m[SUCCESS] ${description} completed.\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31m[ERROR] ${description} failed.\x1b[0m`);
        process.exit(1);
    }
}

// Main Build Flow
async function buildAll() {
    console.log('\x1b[1m\x1b[35mStarting Voice Notes AI Build Process...\x1b[0m');
    const startTime = Date.now();

    // 1. Install Dependencies (Optional, assume installed in CI/Dev usually)
    // run('npm install', ROOT_DIR, 'Installing Root Dependencies');

    // 2. Build Backend
    // Ensure dist folder is clean
    const backendDist = path.join(BACKEND_DIR, 'dist');
    if (fs.existsSync(backendDist)) {
        fs.rmSync(backendDist, { recursive: true, force: true });
    }
    run('npm run build', BACKEND_DIR, 'Building Backend (TypeScript)');
    run('npm prune --production', BACKEND_DIR, 'Pruning Backend Dev Dependencies');

    // 3. Build Frontend
    run('npm run build', FRONTEND_DIR, 'Building Frontend (Vite)');

    // 4. Update Electron Assets
    // Copy frontend dist to electron/dist (or wherever electron loads it from)
    // Actually, Electron loads from localhost in dev, but file:// in prod.
    // We configured electron-builder to take files, but we need to ensure 
    // frontend build output is where Electron expects it.
    // In our main.js, we load `index.html`. We need to copy frontend/dist to electron/dist/frontend or similar.
    // Or just configure electron-builder to grab frontend/dist.

    // For now, let's assume we copy it to electron/app/dist or similar.
    // Let's create a directory for the final bundle if needed.

    // 5. Package Electron
    console.log('\n\x1b[33mReady to package with Electron Builder.\x1b[0m');
    console.log('Run "npm run dist" in the electron directory to finish.');

    // We can trigger it here:
    // run('npm run build', ELECTRON_DIR, 'Packaging Application');

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n\x1b[32m\x1b[1mBuild preparation complete in ${duration}s!\x1b[0m`);
}

buildAll();
