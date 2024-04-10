import { contextBridge, ipcRenderer } from 'electron'
const dotenv = require('dotenv')

dotenv.config()

const api = {
  openNewWindow: (url) => ipcRenderer.send('open-new-window', url),
  closeCurrentView: () => ipcRenderer.send('close-current-view'),
  navigateBack: () => ipcRenderer.send('navigate-back'),
  navigateForward: () => ipcRenderer.send('navigate-forward'),
  sendActivityDetected: () => ipcRenderer.send('activity-detected'),
  quitApp: () => ipcRenderer.send('quit-app'),
  getPassword: () => process.env.PASSWORD,
  // Ajouter une méthode pour écouter les événements IPC
  on: (channel, func) => {
    // Liste des chaînes de canal autorisées pour éviter des vulnérabilités
    const validChannels = ['update-view-status']
    if (validChannels.includes(channel)) {
      // Utiliser ipcRenderer.on de manière sécurisée
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  // Ajouter une méthode pour retirer les écouteurs d'événements IPC
  removeListener: (channel, func) => {
    // Liste des chaînes de canal autorisées
    const validChannels = ['update-view-status']
    if (validChannels.includes(channel)) {
      // Utiliser ipcRenderer.removeListener de manière sécurisée
      ipcRenderer.removeListener(channel, func)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error("Erreur lors de l'exposition de l'API Electron :", error)
  }
} else {
  window.electronAPI = api
}
