// import {app,BrowserWindow,ipcMain, Tray, screen } from "electron";
// import * as path from 'path';
// import * as url from 'url';
//
// let MainTray: Tray | undefined;
// let TrayWindow: BrowserWindow | undefined;
//
// const WINDOW_SIZE_DEFAULT  ={
//   width:200,
//   height:300,
//   margin: {
//     x:0,
//     y:0
//   }
// };
//
// export function InitTray() {
//   new Tray(path.join(__dirname, `./build/electron/trayicon.png`));
//   createWindow();
//
//   MainTray.on("click", function(event) {
//     ipcMain.emit("tray-window-clicked", {window:TrayWindow, tray:MainTray});
//     toggleTrayWindow();
//   });
//
//   alignWindow();
//   ipcMain.emit("tray-window-ready", {window:TrayWindow, tray:MainTray});
// }

// function createWindow() {
//   TrayWindow = new BrowserWindow({
//     width:WINDOW_SIZE_DEFAULT.width,
//     height:WINDOW_SIZE_DEFAULT.height,
//     maxWidth:WINDOW_SIZE_DEFAULT.width,
//     maxHeight:WINDOW_SIZE_DEFAULT.height,
//     show:false,
//     frame:false,
//     fullscreenable:false,
//     resizable:false,
//     useContentSize:false,
//     transparent:true,
//     alwaysOnTop:true,
//     webPreferences: {
//       backgroundThrottling: false
//     }
//   });
//
//   //disabling Window menu
//   TrayWindow.setMenu(null);
//   TrayWindow.loadURL(`file:///${path.join(__dirname,"index.html")}#/tray`);
//
//   TrayWindow.hide();
//   TrayWindow.on("blur",()=> {
//     if (!TrayWindow) return;
//     if (!TrayWindow.webContents.isDevToolsOpened()) {
//       TrayWindow.hide();
//       ipcMain.emit("tray-window-hidden", {window:TrayWindow, tray:MainTray} )
//     }
//   });
//   TrayWindow.on("close", function(event) {
//     if (!TrayWindow) return;
//     event.preventDefault();
//     TrayWindow.hide();
//   });
// }
//
// function toggleTrayWindow() {
//   if (!TrayWindow) return;
//   if (TrayWindow.isVisible()) {
//     TrayWindow.hide();
//   } else {
//     TrayWindow.show();
//   }
//   ipcMain.emit("tray-window-hidden",{window:TrayWindow, tray:MainTray})
// }
//
// function alignWindow() {
//   if (!TrayWindow) return;
//   const position = calculateWindowPosition();
//   if(!position) return;
//
//   TrayWindow.setBounds({
//     width:WINDOW_SIZE_DEFAULT.width,
//     height: WINDOW_SIZE_DEFAULT.height,
//     x: position.x,
//     y: position.y
//   });
// }
//
// function calculateWindowPosition() {
//   return {x: 0,y:0};
//}
