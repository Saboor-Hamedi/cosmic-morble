# Auto-Updater Guide — Cosmic Morble

## How to publish a new release

### Prerequisites
Set your GitHub Personal Access Token (repo scope) as an environment variable:

**PowerShell (current session):**
```powershell
$env:GH_TOKEN = "ghp_your_token_here"
```

**Permanently (System Environment Variables):**
1. Search "Edit the system environment variables" in Windows
2. Click "Environment Variables"
3. Under "User variables", click New
4. Name: `GH_TOKEN`, Value: `ghp_your_token_here`

---

### Publishing a new version

1. **Bump the version** in `package.json`:
   ```json
   "version": "3.2.0"
   ```

2. **Set your token** (if not permanent):
   ```powershell
   $env:GH_TOKEN = "ghp_your_token_here"
   ```

3. **Run:**
   ```powershell
   npm run publish:win
   ```

This will:
- Build the Vite renderer
- Compile the Electron main process
- Package a Windows NSIS installer (.exe) for x64
- Upload the installer + `latest.yml` to a GitHub Release
- The running app will detect the update within ~4 seconds of next launch, download silently, and show the subtle badge

---

## How the auto-updater works

```
App launches
  └─ 4s delay
      └─ autoUpdater.checkForUpdates()
          ├─ update-available  → badge shows "Update available · vX.Y.Z"
          ├─ download-progress → badge shows progress ring + %
          └─ update-downloaded → badge shows "Restart to apply vX.Y.Z" (click to install)
```

The badge lives at `src/features/updater/UpdaterBadge.jsx` and is
completely self-contained — no store, no global state.

---

## Keyboard shortcuts
| Shortcut | Action |
|---|---|
| `Ctrl + T` | Cycle themes |
| `Ctrl + Enter` | Pause / Resume |
| `Ctrl + Alt` | Switch Letters ↔ Words |
| `Escape` | Close Trophy modal |
