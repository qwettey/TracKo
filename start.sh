#!/bin/bash

echo ""
echo " ████████╗██████╗  █████╗  ██████╗██╗  ██╗ ██████╗ "
echo " ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔═══██╗"
echo "    ██║   ██████╔╝███████║██║     █████╔╝ ██║   ██║"
echo "    ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║"
echo "    ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗╚██████╔╝"
echo "    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝"
echo ""
echo " Kaju Tedarik Zinciri Yonetim Sistemi"
echo " ======================================"
echo ""

# Script dizinine geç
cd "$(dirname "$0")"

# Node modules kontrolü
echo "[1/2] Bagimliliklar kontrol ediliyor..."
if [ ! -d "node_modules" ]; then
  echo "Node modules bulunamadi, yukleniyor..."
  npm install
fi

# Uygulamayı başlat
echo "[2/2] Uygulama baslatiliyor..."
echo ""
echo "Tarayicinizda acilacak: http://localhost:3000"
echo "Durdurmak icin CTRL+C basin."
echo ""

# Tarayıcıyı arka planda aç (kısa gecikme ile)
sleep 2 && open http://localhost:3000 &

# Dev server başlat
npm run dev
