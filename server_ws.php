<?php
declare(strict_types=1);

/**
 * Entry-point script untuk menjalankan MBG WebSocket Controller Server.
 * Jalankan via terminal:
 * php server_ws.php
 */

require_once __DIR__ . '/bootstrap.php';

use MBG\Core\WebSocketServer;

// Tangkap argumen port opsional (default 8088)
$port = 8088;
if (!empty($argv[1]) && is_numeric($argv[1])) {
    $port = (int) $argv[1];
}

$server = new WebSocketServer('0.0.0.0', $port);
$server->start();

