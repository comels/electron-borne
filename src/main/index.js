import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserView, BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'

let mainWindow
let currentView

// fonction pour fermer la view actuelle après 1 minute
ipcMain.on('close-view-due-to-inactivity', () => {
  if (currentView) {
    mainWindow.removeBrowserView(currentView)
    currentView = null
  }
})

// fonction pour fermer la vue actuelle
ipcMain.on('close-current-view', () => {
  if (currentView) {
    mainWindow.removeBrowserView(currentView)
    currentView = null
  }
})

// fonction pour naviguer en arrière
ipcMain.on('navigate-back', () => {
  if (currentView && currentView.webContents.canGoBack()) {
    currentView.webContents.goBack()
  }
})

// fonction pour naviguer en avant
ipcMain.on('navigate-forward', () => {
  if (currentView && currentView.webContents.canGoForward()) {
    currentView.webContents.goForward()
  }
})

// fonction pour créer une nouvelle fenêtre
function createNewWindow(url) {
  currentView = new BrowserView({
    webPreferences: {
      contextIsolation: true
    }
  })
  mainWindow.setBrowserView(currentView)
  currentView.setAutoResize({ width: true, height: true })
  const { width, height } = mainWindow.getBounds()
  currentView.setBounds({ x: 0, y: 80, width: width, height: height - 90 })
  currentView.webContents.loadURL(url)
  currentView.webContents.setWindowOpenHandler(({ url }) => {
    // Charge l'URL dans la même BrowserView
    currentView.webContents.loadURL(url)
    return { action: 'deny' } // Empêche l'ouverture d'une nouvelle fenêtre
  })
  currentView.webContents.openDevTools()
}

// écoute l'événement pour ouvrir une nouvelle fenêtre
ipcMain.on('open-new-window', (event, url) => {
  createNewWindow(url)
})

// fonction pour créer la fenêtre principale
function createWindow() {
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    kiosk: true,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? {} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.webContents.openDevTools()
}

// écoute l'événement de fermeture de la fenêtre
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ferme l'application lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
