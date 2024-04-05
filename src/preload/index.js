import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', {
      openNewWindow: (url) => ipcRenderer.send('open-new-window', url),
      closeCurrentView: () => ipcRenderer.send('close-current-view'),
      navigateBack: () => ipcRenderer.send('navigate-back'),
      navigateForward: () => ipcRenderer.send('navigate-forward'),
      closeViewDueToInactivity: () => ipcRenderer.send('close-view-due-to-inactivity')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
