const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window:minimize'),
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
});
