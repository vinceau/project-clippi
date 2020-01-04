import { App } from "electron";

export const getMenuTemplate = (app: App, platform: string): Electron.MenuItemConstructorOptions[] => {
    const menuItems: Electron.MenuItemConstructorOptions[] = [];

    const application: Electron.MenuItemConstructorOptions = {
        label: (platform === "win32") ? "File" : "Application",
        submenu: [{
            label: "About",
            role: "orderFrontStandardAboutPanel"
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            accelerator: (platform === "darwin") ? "Command+Q" : undefined,
            click: () => {
                app.quit();
            }
        }
        ]
    };
    menuItems.push(application);

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
    menuItems.push(edit);

    if (platform === "darwin") {
        menuItems.push(
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
        );
    }
    return menuItems;
};
