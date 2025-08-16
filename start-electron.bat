@echo off
echo Iniciando GarageMeet en modo desarrollo...
echo.

echo 1. Construyendo la aplicacion Angular...
call npm run build

if %errorlevel% neq 0 (
    echo Error al construir la aplicacion Angular
    pause
    exit /b 1
)

echo.
echo 2. Iniciando Electron...
call npm run electron

pause
