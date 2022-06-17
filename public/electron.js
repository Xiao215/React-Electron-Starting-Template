const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Converter",
    width: 1400,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

const menuTemplate = [
  {
    label: "Converter",
    submenu: [
      {
        label: "About",
      },
      {
        label: "Github",
        click() {},
      },
      {
        label: "Quit",
        click() {
          app.quit();
        },
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
      },
    ],
  },
  {
    label: "Files",
    submenu: [
      { label: "Download location" },
      { label: "Set download location" },
    ],
  },
];
if (process.platform === "darwin") {
  menuTemplate.unshift({ label: "" });
}
if (process.env.NODE_ENV !== "production") {
  //production, development, staging, test
  menuTemplate.push({
    label: "DEVELOPER",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        click(item, focusedWindow) {
          //item is useless but need to be added
          focusedWindow.toggleDevTools();
        },
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
      },
    ],
  });
}
