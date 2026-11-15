@echo off
title MBG: MOBILE BATTLE GOVERNMENT - Arcade Game Server
echo ========================================================
echo   MBG: MOBILE BATTLE GOVERNMENT
echo   Arcade Fighting Game - PHP 8.3 OOP Engine
echo   Teknik Informatika - Universitas Muhammadiyah Sukabumi
echo ========================================================
echo.
echo [1/2] Menjalankan WebSocket Server (0.0.0.0:8088)...
start "MBG WebSocket Controller Server" php server_ws.php
echo.
echo [2/2] Menjalankan PHP Web Server di http://0.0.0.0:8000 ...
echo Hubungkan HP Android ke Wi-Fi yang sama untuk Wireless Controller!
echo Tekan CTRL + C pada jendela ini untuk menghentikan server.
echo.

start "" "http://localhost:8000/?page=menu"
php -S 0.0.0.0:8000 -t public
pause

