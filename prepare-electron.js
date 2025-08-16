const fs = require('fs');
const path = require('path');

// Ruta del archivo index.html generado por Angular
const indexPath = path.join(__dirname, 'dist/garage-meet/browser/index.html');

console.log('🔧 Preparando aplicación para Electron...');

// Verificar si el archivo existe
if (!fs.existsSync(indexPath)) {
    console.error('❌ Error: No se encontró el archivo index.html. Ejecuta "npm run build" primero.');
    process.exit(1);
}

// Leer el contenido del archivo
let content = fs.readFileSync(indexPath, 'utf8');

// Cambiar el base href de "/" a "./"
const originalBaseHref = '<base href="/">';
const electronBaseHref = '<base href="./">';

if (content.includes(originalBaseHref)) {
    content = content.replace(originalBaseHref, electronBaseHref);

    // Escribir el archivo modificado
    fs.writeFileSync(indexPath, content, 'utf8');

    console.log('✅ Base href cambiado de "/" a "./" para Electron');
    console.log('📍 Archivo modificado:', indexPath);
} else if (content.includes(electronBaseHref)) {
    console.log('✅ La aplicación ya está preparada para Electron');
} else {
    console.log('⚠️ No se encontró el tag base href esperado');
}

console.log('🚀 Preparación completada');
