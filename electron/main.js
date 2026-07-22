import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// electron-updater is CommonJS — use createRequire to import it from ESM main
const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win = null;

// ─── Push updater events to the renderer window ────────────────────────────
function sendUpdaterStatus(event, data = {}) {
  if (win && !win.isDestroyed()) {
    win.webContents.send('updater:status', { event, ...data });
  }
}

// ─── Configure autoUpdater ─────────────────────────────────────────────────
function setupAutoUpdater() {
  // Silent in dev — only active in packaged builds
  if (VITE_DEV_SERVER_URL) return;

  autoUpdater.autoDownload = true;          // download silently in background
  autoUpdater.autoInstallOnAppQuit = false; // we control the install via IPC

  autoUpdater.on('checking-for-update', () => {
    sendUpdaterStatus('checking');
  });

  autoUpdater.on('update-available', (info) => {
    sendUpdaterStatus('available', { version: info.version, releaseNotes: info.releaseNotes });
  });

  autoUpdater.on('update-not-available', () => {
    sendUpdaterStatus('not-available');
  });

  autoUpdater.on('download-progress', (progress) => {
    sendUpdaterStatus('progress', {
      percent: Math.round(progress.percent),
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    sendUpdaterStatus('downloaded', { version: info.version });
  });

  autoUpdater.on('error', (err) => {
    sendUpdaterStatus('error', { message: err?.message || 'Unknown updater error' });
  });

  // Check 4 seconds after launch so the window is fully ready
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {/* silent fail in case no internet */});
  }, 4000);
}

function createWindow() {
  const preloadPath = fs.existsSync(path.join(__dirname, 'preload.mjs'))
    ? path.join(__dirname, 'preload.mjs')
    : path.join(__dirname, 'preload.js');

  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    center: true,
    frame: false,
    resizable: true,
    transparent: false,
    backgroundColor: '#e8def8',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  ipcMain.on('window:minimize', () => {
    if (win) win.minimize();
  });

  ipcMain.on('window:close', () => {
    if (win) win.close();
  });

  // ── Updater IPC: renderer triggers install + quit ─────────────────────────
  ipcMain.on('updater:install', () => {
    autoUpdater.quitAndInstall(false, true); // isSilent=false, isForceRunAfter=true
  });

  createWindow();
  setupAutoUpdater();
});
