'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { startService } from './devices'
import { adbQuit } from './adb'
import { addEventHook } from './handlers'
import { Qlib } from 'qmsl'
import { Scheduler } from 'qia'
import db from '../db'
import path from 'path'
import log from 'electron-log'

const useQPST = db.read().get('useQPST').value()
const logLevel = db.read().get('logLevel').value() || 'warn'

log.transports.file.level = logLevel

let mainWindow
let d3Window
let vueWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/main.html`
  : `file://${__dirname}/main.html`

const d3URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/d3.html`
  : `file://${__dirname}/d3.html`

const vueURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/vue.html`
  : `file://${__dirname}/vue.html`

function createWindow () {
  const options = {
    height: 500,
    width: 900,
    show: false,
    frame: true,
    center: true,
    fullscreenable: false,
    resizable: true,
    title: 'Bella',
    vibrancy: 'ultra-dark',
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      backgroundThrottling: false,
      webSecurity: false,
      plugins: true
    }
  }
  if (process.platform !== 'darwin') {
    options.show = true
    options.frame = false
    options.transparent = false
    options.icon = `${__static}/logo.png`
  }

  mainWindow = new BrowserWindow(options)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createD3Window () {
  const options = {
    height: 500,
    width: 960,
    show: true,
    frame: true,
    center: true,
    fullscreenable: false,
    resizable: true,
    title: 'Bella',
    vibrancy: 'ultra-dark',
    maximizable: true,
    parent: mainWindow
  }

  d3Window = new BrowserWindow(options)

  d3Window.loadURL(d3URL)

  d3Window.on('closed', () => {
    d3Window = null
  })
}

function createVueWindow () {
  const options = {
    height: 700,
    width: 500,
    show: true,
    frame: true,
    center: true,
    fullscreenable: false,
    resizable: true,
    title: 'Bella',
    vibrancy: 'ultra-dark',
    maximizable: false,
    webPreferences: {
      webSecurity: false
    },
    parent: mainWindow
  }

  vueWindow = new BrowserWindow(options)
  vueWindow.setMenu(null)
  vueWindow.loadURL(vueURL)

  vueWindow.on('closed', () => {
    vueWindow = null
  })
}

ipcMain.on('open-d3-window', (evt) => {
  if (!d3Window) {
    createD3Window()
  } else {
    d3Window.focus()
  }
})

ipcMain.on('open-vue-window', (evt) => {
  if (!vueWindow) {
    createVueWindow()
  } else {
    vueWindow.focus()
  }
})

app.on('ready', () => {
  createWindow()
  startService()
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    await adbQuit()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// locate QDART executable path
let qmslPath
let Q
try {
  const QIA = new Scheduler()
  log.info(`QIA avaiable at ${QIA.dllpath}`)

  qmslPath = path.join(path.dirname(QIA.dllpath), 'QMSL_MSVC10R.dll')
} catch (e) {
  log.warn('QIA not avaiable!')
}

try {
  Q = new Qlib(qmslPath)
  log.info(`QMSL avaiable at ${qmslPath}`)

  // set phonems mode
  if (useQPST) {
    Q.setLibraryMode(1)
  } else {
    Q.setLibraryMode(0)
  }

  log.info('LibrayVersion: ', Q.getLibraryVersion())
  log.info('Capabilities: ', Q.getLibraryCapabilities())

  addEventHook((evt) => {
    evt.$Q = Q
  })
} catch (e) {
  console.log('QMSL not avaiable!')
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
