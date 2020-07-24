const { shell, BrowserWindow, Notification } = require('electron')
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
  
  // Image does not appear to be supported at all by electron, at least not
  // yet. Perhaps someday this will just start working automatically.
  const image = data.thumbnail_height != null
    ? data.thumbnail
    : 'https://upload.wikimedia.org/wikipedia/en/a/a6/Major_League_Baseball_logo.svg'

  const note = new Notification({
    title: 'Fantasy Alert',
    body: data.title,
    silent: true,
    icon: 'notification.png',
    timeoutType: 'never',
    image: image,
  })
  note.show()
  note.on('click', (event) => {
    shell.openExternal(data.url)
  })
}