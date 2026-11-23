"use strict";
// Desktop Windows do Fluir: navegador dedicado com isolamento, sem Node no site.
// O usuário baixa um instalador .exe; não é a instalação PWA pelo navegador.
const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

const ORIGIN = "https://fluir-sistema.vercel.app";
const START = ORIGIN + "/html/login.html";
const ID = "br.com.fluir.desktop";
let mainWindow;

function isInternalNavigation(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.origin === ORIGIN;
  } catch {
    return false;
  }
}
function openExternal(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" && !isInternalNavigation(raw)) {
      void shell.openExternal(url.toString());
    }
  } catch {}
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Fluir | Organização da Vida",
    width: 1260,
    height: 820,
    minWidth: 375,
    minHeight: 580,
    show: false,
    backgroundColor: "#faf8fd",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false,
      devTools: !app.isPackaged,
      partition: "persist:fluir-desktop"
    }
  });
  const contents = mainWindow.webContents;
  contents.setWindowOpenHandler(({ url }) => {
    if (isInternalNavigation(url)) {
      void contents.loadURL(url);
    } else {
      openExternal(url);
    }
    return { action: "deny" };
  });
  contents.on("will-navigate", (event, url) => {
    if (isInternalNavigation(url)) return;
    event.preventDefault();
    openExternal(url);
  });
  // Se o site estiver fora do ar, não mostrar página técnica de Chromium.
  contents.on("did-fail-load", (_event, code, _description, validatedURL, isMainFrame) => {
    if (!isMainFrame || code === -3 || !isInternalNavigation(validatedURL)) return;
    void mainWindow.loadFile(path.join(__dirname, "offline.html"));
  });
  contents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  contents.on("will-attach-webview", (event) => event.preventDefault());
  mainWindow.once("ready-to-show", () => mainWindow.show());
  void mainWindow.loadURL(START);
  mainWindow.on("closed", () => { mainWindow = null; });
}
app.setAppUserModelId(ID);
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
