import path from "path";

import { BrowserWindow, Menu, app } from "electron";
// import {autoUpdater} from 'electron-updater';
import contextMenu from "electron-context-menu";
import debug from "electron-debug";
import unhandled from "electron-unhandled";
import { is } from "electron-util";

import config from "./config";
import { menu } from "./menu";

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.company.AppName");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow: BrowserWindow | null;

const createMainWindow = async (): Promise<BrowserWindow> => {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      disableBlinkFeatures: "Auxclick",
    },
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  win.on("closed", () => {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = null;
  });

  if (is.development) {
    await win.loadURL("http://localhost:8080/");
  } else {
    await win.loadFile(
      path.resolve(
        __dirname,
        "..",
        "node_modules",
        "@alg-wiki",
        "website",
        "dist",
        "index.html"
      )
    );
  }

  return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

void (async (): Promise<void> => {
  await app.whenReady();
  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();

  const foo = config.get("foo");
  void mainWindow.webContents.executeJavaScript(
    `console.log('Some config from the main process: ${foo}')`
  );
})();
