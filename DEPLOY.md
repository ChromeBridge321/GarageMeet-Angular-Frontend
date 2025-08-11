# Despliegue en Netlify - GarageMeet Angular Frontend

## Pasos para desplegar en Netlify:

### Opción 1: Despliegue Manual (Drag & Drop)

1. Ve a [netlify.com](https://netlify.com) y crea una cuenta o inicia sesión
2. En el dashboard, busca la sección "Sites" 
3. Arrastra y suelta la carpeta `dist/garage-meet/browser` en el área de "Drag and drop your site output folder here"
4. ¡Tu aplicación estará desplegada en minutos!

### Opción 2: Despliegue desde Git (Recomendado)

1. Sube tu código a GitHub, GitLab o Bitbucket
2. En Netlify, ve a "New site from Git"
3. Conecta tu repositorio
4. Configura los siguientes ajustes:
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist/garage-meet/browser`
   - **Base directory**: (deja en blanco)

### Configuración incluida:

✅ **netlify.toml** - Configuración de build y redirects
✅ **_redirects** - Soporte para Angular routing (SPA)
✅ **Scripts optimizados** - Build para producción
✅ **Environment de producción** - API URLs configuradas

### Variables de entorno (si necesario):

Si necesitas configurar variables de entorno específicas para producción:
1. Ve a Site settings > Environment variables en Netlify
2. Agrega las variables que necesites

### URLs importantes:

- **API Backend**: https://garagemeet.site/api
- **Stripe Key**: Configurada para testing (actualizar en producción)

## Comandos útiles:

```bash
# Build para producción
npm run build:prod

# Servir localmente la versión de producción
npx http-server dist/garage-meet/browser -p 4200

# Test local
npm start
```

## Notas importantes:

- La aplicación está configurada para usar la API en `https://garagemeet.site/api`
- Asegúrate de que el backend esté corriendo en producción
- Actualiza las claves de Stripe para producción real
- El archivo `_redirects` asegura que todas las rutas de Angular funcionen correctamente
