import { BrowserWindow, app } from 'electron';

let wnd: BrowserWindow | null = null;

function createWindow() {
  wnd = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  wnd.loadFile('views/index.html');
  wnd.on('closed', function wndClosed() {
    wnd = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function allWindowsClosed() {
  if ('darwin' !== process.platform) {
    app.quit();
  }
});

app.on('activate', function appActivated() {
  if (null === wnd) {
    createWindow();
  }
});
