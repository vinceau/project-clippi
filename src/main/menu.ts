import { App } from "electron";

export const getMenuTemplate = (app: App): Electron.MenuItemConstructorOptions[] => {

    const application: Electron.MenuItemConstructorOptions = {
        label: "Application",
        submenu: [{
            label: "About",
            role: "orderFrontStandardAboutPanel"
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            accelerator: "Command+Q",
            click: () => {
                app.quit();
            }
        }
        ]
    };

    const edit: Electron.MenuItemConstructorOptions = {
        label: "Edit",
        submenu: [{
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            role: "undo"
        },
        {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            role: "redo"
        },
        {
            type: "separator"
        },
        {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            role: "cut"
        },
        {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            role: "copy"
        },
        {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            role: "paste"
        },
        {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            role: "selectAll"
        }
        ]
    };

    return [
        application,
        edit,
        {
            type: "separator"
        },
        {
            label: "Quit",
            click: () => {
                app.quit();
            }
        }
    ];
};
