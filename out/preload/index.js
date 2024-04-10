"use strict";
const electron = require("electron");
const dotenv = require("dotenv");
dotenv.config();
const api = {
  openNewWindow: (url) => electron.ipcRenderer.send("open-new-window", url),
  closeCurrentView: () => electron.ipcRenderer.send("close-current-view"),
  navigateBack: () => electron.ipcRenderer.send("navigate-back"),
  navigateForward: () => electron.ipcRenderer.send("navigate-forward"),
  sendActivityDetected: () => electron.ipcRenderer.send("activity-detected"),
  quitApp: () => electron.ipcRenderer.send("quit-app"),
  getPassword: () => process.env.PASSWORD,
  // Ajouter une méthode pour écouter les événements IPC
  on: (channel, func) => {
    const validChannels = ["update-view-status"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  // Ajouter une méthode pour retirer les écouteurs d'événements IPC
  removeListener: (channel, func) => {
    const validChannels = ["update-view-status"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.removeListener(channel, func);
    }
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electronAPI", api);
  } catch (error) {
    console.error("Erreur lors de l'exposition de l'API Electron :", error);
  }
} else {
  window.electronAPI = api;
}
