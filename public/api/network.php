<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../../bootstrap.php';

use MBG\Core\WebSocketServer;

$ip = WebSocketServer::getLocalIp();
$httpPort = (int) ($_SERVER['SERVER_PORT'] ?? 8000);
$wsPort = 8088;

// Jika dibuka melalui hostname atau IP tertentu di browser, prioritaskan host tersebut
$hostHeader = $_SERVER['HTTP_HOST'] ?? '';
if (!empty($hostHeader)) {
    $hostParts = explode(':', $hostHeader);
    $browserHost = $hostParts[0];
    if ($browserHost !== 'localhost' && $browserHost !== '127.0.0.1' && filter_var($browserHost, FILTER_VALIDATE_IP)) {
        $ip = $browserHost;
    }
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$wsProtocol = ($protocol === 'https') ? 'wss' : 'ws';

$baseUrl = "{$protocol}://{$ip}:{$httpPort}";
$p1Url = "{$baseUrl}/controller.html?p=1";
$p2Url = "{$baseUrl}/controller.html?p=2";

echo json_encode([
    'status' => 'success',
    'ip' => $ip,
    'httpPort' => $httpPort,
    'wsPort' => $wsPort,
    'wsUrl' => "{$wsProtocol}://{$ip}:{$wsPort}",
    'p1Url' => $p1Url,
    'p2Url' => $p2Url
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

