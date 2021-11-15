const { app, BrowserWindow, Tray, Notification } = require('electron')
const { join } = require('path')
const { Octokit } = require("@octokit/rest")
const octokit = new Octokit()

const assetsDirectory = join(__dirname, 'assets')

let tray = undefined
let window = undefined
let statusWindow = undefined

var ipc = require('electron').ipcMain;

ipc.on('invokeAction', function(event, data){
    var result = processData(data);
    event.sender.send('actionReply', result);
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true
        },
    })

    win.loadFile('index.html')
}

const showNotification = async () => {
    message = await getInfo()
    const notification = {
        title: 'Basic Notification',
        body: message
    }
    new Notification(notification).show()
}

const createTray = () => {
    tray = new Tray(join(assetsDirectory, 'flagTemplate.png'))
    tray.on('right-clthe ick', showNotification)
    tray.on('double-click', showWindow)
    tray.on('click', function(event) {
        // showNotification()
        toggleStatusWindow()
        // if (window.isVisible() && process.defaultApp && event.metaKey) {
        //     window.openDevTools({mode: 'detach'})
        // }
    })
}

const showWindow = () => {
    // const position = getWindowPosition()
    // window.setPosition(position.x, position.y, false)
    window.show()
    window.focus()
}

const getInfo = async () => {
    try {
        result = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
            owner: 'mhernandezve',
            repo: 'fastapi_starter'
        })
        console.log(result.data.workflows[0].name)
        return result.data.workflows[0].name
    } catch (err) {
        console.log(err)
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('ready', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        createTray()
        createStatusWindow()
    }
})


/* status windows */
const path = require('path')

const getStatusWindowPosition = () => {
  const windowBounds = statusWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

const createStatusWindow = () => {
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
  statusWindow.loadURL(`file://${path.join(__dirname, 'status-window.html')}`)

  statusWindow.webContents.on('did-finish-load', ()=>{
      let code = "var btn-close = document.getElementById('btn-close'); btn-close.addEventListener('click',function(){alert('clicked!');});";
              statusWindow.webContents.executeJavaScript(code);
  });

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

