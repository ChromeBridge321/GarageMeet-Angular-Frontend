@echo off
echo ===============================================
echo    GarageMeet - Construccion de App Desktop
echo    Configurado para: https://api.garagemeet.site
echo ===============================================
echo.

echo Ejecutando construccion completa...
call npm run build-desktop

if %errorlevel% neq 0 (
    echo Error: No se pudo empaquetar con Electron
    pause
    exit /b 1
)

echo.
echo ===============================================
echo          ¡CONSTRUCCION EXITOSA!
echo ===============================================
echo.
echo Tu aplicacion de escritorio esta lista en:
echo   dist-desktop\GarageMeet-win32-x64\GarageMeet.exe
echo.
echo La aplicacion esta configurada para conectarse a:
echo   https://api.garagemeet.site
echo.
echo Para ejecutarla, navega a esa carpeta y haz doble clic en GarageMeet.exe
echo.
pause
