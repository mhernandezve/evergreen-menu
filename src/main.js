const { app, BrowserWindow, Tray, Notification } = require('electron')
const { join } = require('path')
const { Octokit } = require("@octokit/rest")
const octokit = new Octokit()

const assetsDirectory = join(__dirname, 'assets')

let tray = undefined
let window = undefined

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
            nodeIntegration: true
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
    tray.on('right-click', showNotification)
    tray.on('double-click', showWindow)
    tray.on('click', function(event) {
        showNotification()
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
    }
})
