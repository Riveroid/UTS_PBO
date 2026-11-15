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

use MBG\Core\CharacterFactory;

try {
    $requestedId = $_GET['id'] ?? null;

    if ($requestedId) {
        $fighter = CharacterFactory::create((string) $requestedId);
        echo json_encode([
            'status' => 'success',
            'data' => $fighter->getStats()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        $characters = CharacterFactory::getAllCharacters();
        echo json_encode([
            'status' => 'success',
            'count' => count($characters),
            'data' => $characters
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
