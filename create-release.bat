@echo off
echo ===============================================
echo    GarageMeet - Crear Release de Escritorio
echo ===============================================
echo.

echo Paso 1: Construyendo aplicacion de escritorio...
call npm run build-desktop

if %errorlevel% neq 0 (
    echo Error: No se pudo construir la aplicacion
    pause
    exit /b 1
)

echo.
echo Paso 2: Creando archivo ZIP para distribucion...
powershell -Command "Compress-Archive -Path 'dist-desktop\GarageMeet-win32-x64\*' -DestinationPath 'GarageMeet-Desktop-v1.0.0.zip' -Force"

if %errorlevel% neq 0 (
    echo Error: No se pudo crear el archivo ZIP
    pause
    exit /b 1
)

echo.
echo ===============================================
echo          ¡RELEASE CREADO EXITOSAMENTE!
echo ===============================================
echo.
echo Archivo de distribucion creado:
echo   GarageMeet-Desktop-v1.0.0.zip
echo.
echo Ahora puedes:
echo   1. Subirlo a GitHub Releases
echo   2. Compartirlo en Google Drive/OneDrive
echo   3. Subirlo a tu servidor web
echo.
echo Tamano del archivo:
powershell -Command "Get-ChildItem 'GarageMeet-Desktop-v1.0.0.zip' | Select-Object @{Name='Size(MB)';Expression={[math]::Round($_.Length/1MB,2)}} | Format-Table -HideTableHeaders"
echo.
pause
