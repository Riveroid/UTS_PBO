#!/bin/bash
echo "========================================================"
echo "  MBG: MOBILE BATTLE GOVERNMENT"
echo "  Arcade Fighting Game - PHP 8.3 OOP Engine"
echo "  Teknik Informatika - Universitas Muhammadiyah Sukabumi"
echo "========================================================"
echo ""
echo "[1/2] Menjalankan WebSocket Server (0.0.0.0:8088)..."
php server_ws.php &
WS_PID=$!
echo "WebSocket PID: $WS_PID"
echo ""
echo "[2/2] Menjalankan PHP Web Server (0.0.0.0:8000)..."
echo "Buka http://localhost:8000/?page=menu di browser Anda."
echo "Tekan CTRL + C untuk menghentikan server."
echo ""

cleanup() {
    echo ""
    echo "Menghentikan server..."
    kill $WS_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

php -S 0.0.0.0:8000 -t public

