import { app, BrowserWindow, Tray, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
// import fetch from 'node-fetch';
import axios from 'axios';

const fs = require('fs');

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    frame:false,
    resizable:false,
    alwaysOnTop:true,
    fullscreenable:false,
    useContentSize:false,
    transparent:true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

//
var tray = null;
app.on('ready', () => {
  createWindow();
  var iconpath = path.join(__dirname,"./trayicon.png")
  tray = new Tray(iconpath);

  tray.on("click", (event, bounds) => {
    const {x,y} = bounds;
    if (win!=null)  {
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      const {height, width } = win.getBounds();
      if (win.isVisible()) {
        win.hide()
      } else {
        win.setBounds({
          x:x-width/2,
          y,
          height,
          width,
        })
        win.show()
      }
    }
    })
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

//
ipcMain.on('teacher_profile', (event:any, arg:any) => {
  let data = fs.readFileSync(path.join(__dirname,"./data.json"));
  let newdata = JSON.parse(data)
  event.reply('teacher_profile_resp',JSON.parse(data))
  // axios.get('http://localhost:5000/api/teacher_profile')
  // .then(res => event.reply('teacher_profile_resp', res.data))
  // .catch(res => console.log(res));
});

ipcMain.on('student_balance', (event:any, arg:any) => {
  console.log(arg);

  // axios.post('http://localhost:5000/api/update_balance',arg)
  // .then(res => event.reply('student_balance_resp', res.data))
  // .catch(res => console.log(res));

});
