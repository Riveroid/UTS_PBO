<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../bootstrap.php';

use MBG\Arenas\Arena;

try {
    $requestedId = $_GET['id'] ?? null;

    if ($requestedId) {
        $arena = Arena::getById((string) $requestedId);
        echo json_encode([
            'status' => 'success',
            'data' => $arena->toArray()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        $arenas = Arena::getAllArenas();
        $arenaList = array_map(fn(Arena $a) => $a->toArray(), $arenas);
        echo json_encode([
            'status' => 'success',
            'count' => count($arenaList),
            'data' => $arenaList
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
