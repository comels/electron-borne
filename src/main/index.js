// Importation des modules nécessaires à partir d'Electron et d'autres packages.
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserView, BrowserWindow, app, ipcMain, screen, shell } from 'electron'
import { join } from 'path'

let mainWindow
let currentView = null // Initialisé à null pour indiquer qu'aucune vue n'est chargée au démarrage.
let inactivityTimer

// Crée la fenêtre principale de l'application avec des paramètres prédéfinis.
function createWindow() {
  try {
    // Récupère les dimensions de l'écran principal pour la fenêtre.
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    // Initialisation de la fenêtre principale avec des options spécifiques.
    mainWindow = new BrowserWindow({
      width,
      height,
      show: false, // La fenêtre ne s'affichera pas immédiatement après sa création.
      // kiosk: true, // Active le mode kiosque.
      autoHideMenuBar: true, // Empêche la barre de menu de se cacher automatiquement.
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'), // Chemin vers le script de préchargement.
        sandbox: false // Désactive le mode sandbox pour permettre plus de fonctionnalités.
      }
    })

    // Affiche la fenêtre une fois qu'elle est prête à être montrée.
    mainWindow.on('ready-to-show', () => mainWindow.show())

    // Gère les tentatives d'ouverture de nouvelles fenêtres par les pages web.
    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url) // Ouvre l'URL dans le navigateur par défaut.
      return { action: 'deny' } // Empêche Electron d'ouvrir la nouvelle fenêtre.
    })

    // Charge le contenu de la fenêtre principale à partir d'une URL ou d'un fichier local.
    const loadURL =
      is.dev && process.env['ELECTRON_RENDERER_URL']
        ? process.env['ELECTRON_RENDERER_URL']
        : join(__dirname, '../renderer/index.html')
    mainWindow.loadURL(loadURL)

    // Ouvre les outils de développement pour faciliter le débogage.
    // if (is.dev) mainWindow.webContents.openDevTools()
  } catch (error) {
    console.error('Erreur lors de la création de la fenêtre principale:', error)
  }
}

// Crée et configure une nouvelle BrowserView pour afficher le contenu web.
function createNewWindow(url) {
  // Supprime la vue actuelle si elle existe pour en créer une nouvelle.
  if (currentView !== null) {
    mainWindow.removeBrowserView(currentView)
  }

  currentView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // Chemin vers le script de préchargement.
      contextIsolation: true // Isolation de contexte pour une sécurité accrue.
    }
  })

  // Configure et ajoute la nouvelle vue à la fenêtre principale.
  mainWindow.setBrowserView(currentView)
  currentView.setAutoResize({ width: true, height: true }) // Active le redimensionnement automatique.

  const { width, height } = mainWindow.getBounds()
  currentView.setBounds({ x: 0, y: 80, width, height: height - 90 }) // Définit la position et la taille de la vue.
  currentView.webContents.loadURL(url) // Charge l'URL spécifiée dans la vue.

  // Configure la gestion des liens pour rester dans la même vue.
  currentView.webContents.setWindowOpenHandler(({ url }) => {
    currentView.webContents.loadURL(url)
    return { action: 'deny' } // Empêche l'ouverture de nouvelles fenêtres.
  })

  // Ouvre les outils de développement pour cette vue.
  // if (is.dev) currentView.webContents.openDevTools()

  // Écouteurs d'événements pour détecter l'activité de l'utilisateur et réinitialiser le minuteur d'inactivité.
  currentView.webContents.executeJavaScript(
    `
    document.addEventListener('mousemove', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('scroll', () => { window.electronAPI.sendActivityDetected(); });
    document.addEventListener('keydown', () => { window.electronAPI.sendActivityDetected(); });
    `,
    true
  )

  currentView.webContents.executeJavaScript(
    `
      let touchStartX = 0;
      let touchEndX = 0;

      function handleTouchStart(event) {
          touchStartX = event.changedTouches[0].screenX;
      }

      function handleTouchEnd(event) {
          touchEndX = event.changedTouches[0].screenX;
          handleSwipeGesture();
      }

      function handleSwipeGesture() {
          if (touchEndX < touchStartX) {
              // Swipe Left
              window.electronAPI.sendSwipeAction('swipe-left');
          } else if (touchEndX > touchStartX) {
              // Swipe Right
              window.electronAPI.sendSwipeAction('swipe-right');
          }
      }

      document.addEventListener('touchstart', handleTouchStart, false);
      document.addEventListener('touchend', handleTouchEnd, false);
    `,
    true
  )

  // Informe le processus de rendu qu'une nouvelle vue est active.
  mainWindow.webContents.send('update-view-status', true)
}

// Réinitialise le minuteur d'inactivité pour fermer la vue courante après un délai.
function resetInactivityTimer() {
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    closeCurrentView()
  }, 180000) // Définit le délai d'inactivité à 3 minutes.
}

// Handler IPC pour la réinitialisation du minuteur d'inactivité suite à une activité détectée.
ipcMain.on('browser-view-swipe', (event, action) => {
  if (currentView) {
    // Assurez-vous que currentView est accessible
    if (action === 'swipe-left' && currentView.webContents.canGoBack()) {
      currentView.webContents.goBack()
    } else if (action === 'swipe-right' && currentView.webContents.canGoForward()) {
      currentView.webContents.goForward()
    }
  }
})

ipcMain.on('activity-detected', () => {
  resetInactivityTimer()
})

// Handlers IPC pour gérer les interactions de l'utilisateur avec la vue courante.
ipcMain.on('close-current-view', () => {
  closeCurrentView()
})

ipcMain.on('navigate-back', () => {
  if (currentView && currentView.webContents.canGoBack()) {
    currentView.webContents.goBack() // Navigue vers la page précédente.
  }
})

ipcMain.on('navigate-forward', () => {
  if (currentView && currentView.webContents.canGoForward()) {
    currentView.webContents.goForward() // Navigue vers la page suivante.
  }
})

ipcMain.on('open-new-window', (event, url) => {
  createNewWindow(url) // Ouvre une nouvelle fenêtre avec l'URL spécifiée.
})

// Ferme la vue courante et informe le processus de rendu.
function closeCurrentView() {
  if (currentView) {
    mainWindow.removeBrowserView(currentView)
    currentView = null // Réinitialise la vue courante à null.
    mainWindow.webContents.send('update-view-status', false) // Informe que la vue est fermée.
  }
}

// Gère le cycle de vie de l'application.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron') // Définit l'ID de l'application.
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window)) // Optimise les raccourcis.
  createWindow() // Crée la fenêtre principale au démarrage de l'application.
})

app.on('activate', () => {
  // Recrée la fenêtre principale si l'application est réactivée sans fenêtres ouvertes.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  // Quitte l'application si toutes les fenêtres sont fermées, sauf sur macOS.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
