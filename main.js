const {app, BrowserWindow} = require("electron");

function createWindow () {
    const win = new BrowserWindow({
        width : 1000,
        height : 720,
        webPreferences : {
            nodeIntegration: true,
            webviewTag: true       
        }
    });
    win.setMenu(null);
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

