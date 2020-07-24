const { ipcMain, BrowserWindow } = require('electron')
const axios = require('axios')

let win = BrowserWindow.getFocusedWindow()
win.webContents.on('did-finish-load', () => {
  // Do stuff.
  loop()
  setInterval(loop, 10000)
})

var lastUrl = false
function loop() {
  axios.get('https://www.reddit.com/r/fantasybaseball/new.json?limit=1')
    .then(res => {
      res.data.data.children.forEach(post => {
        const data = post.data
        const url = data.url

        if (url == lastUrl) {
          return
        }

        notify(data)

        lastUrl = url
      });
    })
}

function notify(data) {
  win.send('notify', data)
}