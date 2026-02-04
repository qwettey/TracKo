@echo off
title TracKo - Kaju Tedarik Takip
echo.
echo  ████████╗██████╗  █████╗  ██████╗██╗  ██╗ ██████╗ 
echo  ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔═══██╗
echo     ██║   ██████╔╝███████║██║     █████╔╝ ██║   ██║
echo     ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║
echo     ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗╚██████╔╝
echo     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ 
echo.
echo  Kaju Tedarik Zinciri Yonetim Sistemi
echo  =====================================
echo.

cd /d "%~dp0"

echo [1/2] Bagimliliklar kontrol ediliyor...
if not exist "node_modules" (
    echo Node modules bulunamadi, yukleniyor...
    npm install
)

echo [2/2] Uygulama baslatiliyor...
echo.
echo Tarayicinizda acilacak: http://localhost:3000
echo Kapatmak icin bu pencereyi kapatin veya CTRL+C basin.
echo.

start "" http://localhost:3000
npm run dev
