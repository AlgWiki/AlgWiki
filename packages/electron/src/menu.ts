import path from "path";

import { Menu, MenuItemConstructorOptions, app, shell } from "electron";
import {
  aboutMenuItem,
  appMenu,
  debugInfo,
  is,
  openNewGitHubIssue,
  openUrlMenuItem,
} from "electron-util";

import config from "./config";

const showPreferences = (): void => {
  // Show the app's preferences here
  // NOTE: either by creating a new BrowserWindow, or triggering an in-app dialog in the renderer proc
};

const helpSubmenu: MenuItemConstructorOptions[] = [
  openUrlMenuItem({
    label: "Website",
    url: "https://github.com/jakzo/alg-wiki",
  }),
  openUrlMenuItem({
    label: "Source Code",
    url: "https://github.com/jakzo/alg-wiki",
  }),
  {
    label: "Report an Issue…",
    click() {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

      openNewGitHubIssue({
        user: "jakzo",
        repo: "alg-wiki",
        body,
      });
    },
  },
];

if (!is.macos) {
  helpSubmenu.push(
    {
      type: "separator",
    },
    aboutMenuItem({
      icon: path.join(__dirname, "static", "icon.png"),
      text: "Created by Your Name",
    })
  );
}

const debugSubmenu: MenuItemConstructorOptions[] = [
  {
    label: "Show Settings",
    click() {
      config.openInEditor();
    },
  },
  {
    label: "Show App Data",
    click() {
      void shell.openPath(app.getPath("userData"));
    },
  },
  {
    type: "separator",
  },
  {
    label: "Delete Settings",
    click() {
      config.clear();
      if (!is.development) app.relaunch(); // nodemon handles restarting in development
      app.quit();
    },
  },
  {
    label: "Delete App Data",
    click() {
      void shell.trashItem(app.getPath("userData"));
      if (!is.development) app.relaunch(); // nodemon handles restarting in development
      app.quit();
    },
  },
];

const macosTemplate: MenuItemConstructorOptions[] = [
  appMenu([
    {
      label: "Preferences…",
      accelerator: "Command+,",
      click() {
        showPreferences();
      },
    },
  ]),
  {
    role: "fileMenu",
    submenu: [
      {
        label: "Custom",
      },
      {
        type: "separator",
      },
      {
        role: "close",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "viewMenu",
  },
  {
    role: "windowMenu",
  },
  {
    role: "help",
    submenu: helpSubmenu,
  },
];

// Linux and Windows
const otherTemplate: MenuItemConstructorOptions[] = [
  {
    role: "fileMenu",
    submenu: [
      {
        label: "Custom",
      },
      {
        type: "separator",
      },
      {
        label: "Settings",
        accelerator: "Control+,",
        click() {
          showPreferences();
        },
      },
      {
        type: "separator",
      },
      {
        role: "quit",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "viewMenu",
  },
  {
    role: "help",
    submenu: helpSubmenu,
  },
];

const template = is.macos ? macosTemplate : otherTemplate;

if (is.development) {
  template.push({
    label: "Debug",
    submenu: debugSubmenu,
  });
}

export const menu = Menu.buildFromTemplate(template);
