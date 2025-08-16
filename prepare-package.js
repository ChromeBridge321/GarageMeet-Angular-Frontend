const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando aplicación para empaquetado con Electron...');

// Rutas
const distBrowserPath = path.join(__dirname, 'dist/garage-meet/browser');
const mainJsSource = path.join(__dirname, 'main.js');
const packageJsonSource = path.join(__dirname, 'package.json');
const faviconSource = path.join(__dirname, 'public/favicon.ico');

// Verificar que el directorio de destino existe
if (!fs.existsSync(distBrowserPath)) {
    console.error('❌ Error: El directorio dist/garage-meet/browser no existe. Ejecuta "npm run build:electron" primero.');
    process.exit(1);
}

// 1. Copiar main.js
const mainJsDest = path.join(distBrowserPath, 'main.js');
if (fs.existsSync(mainJsSource)) {
    fs.copyFileSync(mainJsSource, mainJsDest);
    console.log('✅ main.js copiado');
} else {
    console.error('❌ Error: No se encontró main.js en la raíz del proyecto');
    process.exit(1);
}

// 2. Crear package.json específico para la aplicación empaquetada
const packageJsonContent = {
    "name": "garage-meet-desktop",
    "version": "1.0.0",
    "description": "GarageMeet Desktop Application",
    "main": "main.js",
    "author": "GarageMeet Team",
    "license": "MIT"
};

const packageJsonDest = path.join(distBrowserPath, 'package.json');
fs.writeFileSync(packageJsonDest, JSON.stringify(packageJsonContent, null, 2));
console.log('✅ package.json creado');

// 3. Copiar favicon directamente al directorio principal
const faviconDest = path.join(distBrowserPath, 'favicon.ico');
if (fs.existsSync(faviconSource)) {
    fs.copyFileSync(faviconSource, faviconDest);
    console.log('✅ favicon.ico copiado');
} else {
    console.log('⚠️ favicon.ico no encontrado, se omite');
}

console.log('🚀 Preparación para empaquetado completada');
console.log('📍 Directorio preparado:', distBrowserPath);
