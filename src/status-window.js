const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let statusWindow = undefined

const button = document.getElementById('btn-close');
button.addEventListener('click', () => {
  statusWindow.hide();
});

const getStatusWindowPosition = () => {
  const windowBounds = statusWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

const createWindow = () => {
  statusWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  statusWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  statusWindow.on('blur', () => {
    if (!statusWindow.webContents.isDevToolsOpened()) {
      statusWindow.hide()
    }
  })
}

const toggleStatusWindow = () => {
  if (statusWindow.isVisible()) {
    statusWindow.hide()
  } else {
    showStatusWindow()
  }
}

const showStatusWindow = () => {
  const position = getStatusWindowPosition()
  statusWindow.setPosition(position.x, position.y, false)
  statusWindow.show()
  statusWindow.focus()
}

