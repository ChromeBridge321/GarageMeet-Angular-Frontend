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
        icon: path.join(__dirname, 'public/favicon.ico'),
        show: false // No mostrar hasta que esté listo
    });

    // Determinar la URL a cargar
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        // En desarrollo, cargar desde el servidor de desarrollo
        mainWindow.loadURL('http://localhost:4200');
        // Abrir las DevTools en desarrollo
        mainWindow.webContents.openDevTools();
    } else {
        // En producción, cargar desde archivos locales
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/garage-meet/browser/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Emitido cuando la ventana se cierra
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Manejar enlaces externos
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Este método se llamará cuando Electron haya terminado de inicializarse
app.whenReady().then(() => {
    createWindow();

    // En macOS, es común recrear una ventana en la aplicación cuando el
    // icono del dock se hace clic y no hay otras ventanas abiertas
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// En este archivo puedes incluir el resto del código específico del proceso principal
// También puedes ponerlos en archivos separados y requerirlos aquí.

// Configurar el menú de la aplicación
const template = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Cerrar',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Ver',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Ventana',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
