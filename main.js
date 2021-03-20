const {app, BrowserWindow} = require("electron")

function createWindow () {
    const win = new BrowserWindow({
        width : 800,
        height : 650,
        webPreferences : {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    win.loadFile("betim-application/ui/browser-window.html");
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})
  
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})