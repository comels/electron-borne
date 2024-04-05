import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserView, BrowserWindow, app, ipcMain, screen, shell } from 'electron'
import { join } from 'path'

let mainWindow
let currentView = null // Définir explicitement à null pour clarifier l'état initial
let inactivityTimer

// Fonction pour créer la fenêtre principale
function createWindow() {
  try {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    mainWindow = new BrowserWindow({
      width,
      height,
      show: false,
      // kiosk: true,
      autoHideMenuBar: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    mainWindow.on('ready-to-show', () => mainWindow.show())

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    const loadURL =
      is.dev && process.env['ELECTRON_RENDERER_URL']
        ? process.env['ELECTRON_RENDERER_URL']
        : join(__dirname, '../renderer/index.html')
    mainWindow.loadURL(loadURL)

    // mainWindow.webContents.openDevTools()
  } catch (error) {
    console.error('Erreur lors de la création de la fenêtre principale:', error)
  }
}

// Fonction pour créer et gérer une nouvelle BrowserView
function createNewWindow(url) {
  if (currentView !== null) {
    mainWindow.removeBrowserView(currentView) // Supprimer la vue actuelle si elle existe
  }

  currentView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true
    }
  })

  mainWindow.setBrowserView(currentView)
  currentView.setAutoResize({ width: true, height: true })

  const { width, height } = mainWindow.getBounds()
  currentView.setBounds({ x: 0, y: 80, width, height: height - 90 })
  currentView.webContents.loadURL(url)

  // Gérer les hyperliens pour rester dans la même BrowserView
  currentView.webContents.setWindowOpenHandler(({ url }) => {
    currentView.webContents.loadURL(url)
    return { action: 'deny' }
  })

  currentView.webContents.openDevTools()

  currentView.webContents.executeJavaScript(
    `
    document.addEventListener('mousemove', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('scroll', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('keydown', () => { window.electronAPI.sendActivityDetected(); });
`,
    true
  )

  // Notifier le renderer qu'une BrowserView est ouverte
  mainWindow.webContents.send('update-view-status', true)
}

// Fonction pour réinitialiser le minuteur d'inactivité
function resetInactivityTimer() {
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    closeCurrentView()
  }, 3000) // 30 secondes
}

// IPC Handler pour réinitialiser le minuteur d'inactivité
ipcMain.on('activity-detected', () => {
  resetInactivityTimer()
})

// IPC Handlers pour fermer la vue, naviguer en arrière/en avant et ouvrir une nouvelle fenêtre
ipcMain.on('close-current-view', () => {
  closeCurrentView()
})

ipcMain.on('navigate-back', () => {
  if (currentView && currentView.webContents.canGoBack()) {
    currentView.webContents.goBack()
  }
})

ipcMain.on('navigate-forward', () => {
  if (currentView && currentView.webContents.canGoForward()) {
    currentView.webContents.goForward()
  }
})

ipcMain.on('open-new-window', (event, url) => {
  createNewWindow(url)
})

function closeCurrentView() {
  if (currentView) {
    mainWindow.removeBrowserView(currentView)
    currentView = null
    mainWindow.webContents.send('update-view-status', false)
  }
}

// Configuration du cycle de vie de l'app
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))
  createWindow()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
