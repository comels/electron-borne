"use strict";
const utils = require("@electron-toolkit/utils");
const electron = require("electron");
const path = require("path");
let mainWindow;
let currentView = null;
let inactivityTimer;
function createWindow() {
  try {
    const primaryDisplay = electron.screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    mainWindow = new electron.BrowserWindow({
      width,
      height,
      show: false,
      // La fenêtre ne s'affichera pas immédiatement après sa création.
      kiosk: false,
      // Active le mode kiosque.
      autoHideMenuBar: true,
      // Empêche la barre de menu de se cacher automatiquement.
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        // Chemin vers le script de préchargement.
        sandbox: false
        // Désactive le mode sandbox pour permettre plus de fonctionnalités.
      }
    });
    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(true, "normal");
    });
    mainWindow.webContents.setWindowOpenHandler((details) => {
      electron.shell.openExternal(details.url);
      return { action: "deny" };
    });
    const loadURL = utils.is.dev && process.env["ELECTRON_RENDERER_URL"] ? process.env["ELECTRON_RENDERER_URL"] : path.join(__dirname, "../renderer/index.html");
    mainWindow.loadURL(loadURL);
    if (utils.is.dev)
      mainWindow.webContents.openDevTools();
  } catch (error) {
    console.error("Erreur lors de la création de la fenêtre principale:", error);
  }
}
function createNewWindow(url) {
  if (currentView !== null) {
    mainWindow.removeBrowserView(currentView);
  }
  currentView = new electron.BrowserView({
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      // Chemin vers le script de préchargement.
      contextIsolation: true
      // Isolation de contexte pour une sécurité accrue.
    }
  });
  mainWindow.setBrowserView(currentView);
  currentView.setAutoResize({ width: true, height: true });
  const { width, height } = mainWindow.getBounds();
  currentView.setBounds({ x: 0, y: 80, width, height: height - 90 });
  currentView.webContents.loadURL(url);
  currentView.webContents.setWindowOpenHandler(({ url: url2 }) => {
    currentView.webContents.loadURL(url2);
    return { action: "deny" };
  });
  currentView.webContents.executeJavaScript(
    `
    document.addEventListener('mousemove', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('scroll', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('keydown', () => { window.electronAPI.sendActivityDetected(); });
    `,
    true
  );
  mainWindow.webContents.send("update-view-status", true);
}
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    closeCurrentViewWithClearCache();
  }, 18e4);
}
electron.ipcMain.on("browser-view-swipe", (event, action) => {
  if (currentView) {
    if (action === "swipe-left" && currentView.webContents.canGoBack()) {
      currentView.webContents.goBack();
    } else if (action === "swipe-right" && currentView.webContents.canGoForward()) {
      currentView.webContents.goForward();
    }
  }
});
electron.ipcMain.on("activity-detected", () => {
  resetInactivityTimer();
});
electron.ipcMain.on("close-current-view", () => {
  closeCurrentView();
});
electron.ipcMain.on("navigate-back", () => {
  if (currentView && currentView.webContents.canGoBack()) {
    currentView.webContents.goBack();
  }
});
electron.ipcMain.on("navigate-forward", () => {
  if (currentView && currentView.webContents.canGoForward()) {
    currentView.webContents.goForward();
  }
});
electron.ipcMain.on("open-new-window", (event, url) => {
  createNewWindow(url);
});
function closeCurrentView() {
  if (currentView) {
    currentView.webContents.session.clearStorageData().then(() => {
      mainWindow.removeBrowserView(currentView);
      currentView = null;
      mainWindow.webContents.send("update-view-status", false);
    });
  }
}
function closeCurrentViewWithClearCache() {
  if (currentView) {
    currentView.webContents.session.clearCache().then(() => {
      mainWindow.removeBrowserView(currentView);
      currentView = null;
      mainWindow.webContents.send("update-view-status", false);
    });
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => utils.optimizer.watchWindowShortcuts(window));
  createWindow();
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0)
    createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.on("quit-app", () => {
  electron.app.quit();
});
