const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    // Crear la ventana del navegador
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        },
        icon: path.join(__dirname, 'favicon.ico'),
        show: false
    });

    // Cargar la aplicación Angular desde el build de producción
    const startUrl = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Eliminar la barra de menú
    Menu.setApplicationMenu(null);

    // Manejar el cierre de la ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Manejar navegación externa
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Este método se llama cuando Electron ha terminado de inicializarse
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
