'use strict';

const electron = require('electron');
const { Menu } = require('electron');
const app = electron.app;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function createMainMenu() {
	var template = [
	{
		label: "Application",
		submenu: [
		{ label: "About Application", selector: "orderFrontStandardAboutPanel:" },
		{ type: "separator" },
		{ label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
		]
	},
	{
		label: "Edit",
		submenu: [
		{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
		{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
		{ type: "separator" },
		{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
		{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
		{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
		{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]
	}
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}


function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 720
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
		createMainMenu();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	createMainMenu();
});
