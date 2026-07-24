const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  platform: process.platform,

  // ── Auto-updater bridge ─────────────────────────────────────────────────
  // Renderer calls this to register a listener for updater events
  onUpdaterEvent: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('updater:status', handler);
    // Return cleanup fn so React useEffect can unsubscribe
    return () => ipcRenderer.removeListener('updater:status', handler);
  },
  // Renderer calls this to trigger quit-and-install
  installUpdate: () => ipcRenderer.send('updater:install'),
  // Renderer calls this to manually trigger an update check
  checkForUpdates: () => ipcRenderer.send('updater:check'),

  // ── Database Bridge ─────────────────────────────────────────────────────
  db: {
    getProgress: () => ipcRenderer.invoke('db:getProgress'),
    saveProgress: (data) => ipcRenderer.invoke('db:saveProgress', data)
  }
});
