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

use MBG\Core\GameManager;

// Parse input payload (both JSON body and form parameters)
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
if (!is_array($jsonBody)) {
    $jsonBody = [];
}

$input = array_merge($_GET, $_POST, $jsonBody);
$action = $input['action'] ?? 'state';

try {
    switch ($action) {
        case 'start':
            $p1 = (string) ($input['p1'] ?? 'bahlul');
            $p2 = (string) ($input['p2'] ?? 'tifuzia');
            $arena = (string) ($input['arena'] ?? 'ruang_sidang');
            $mode = (string) ($input['mode'] ?? 'pvai');
            $difficulty = (string) ($input['difficulty'] ?? 'normal');

            $engine = GameManager::startMatch($p1, $p2, $arena, $mode, $difficulty);

            echo json_encode([
                'status' => 'success',
                'message' => 'Pertandingan baru berhasil diinisialisasi.',
                'battleState' => $engine->getBattleState()
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        case 'move':
            $engine = GameManager::getActiveBattle();
            if (!$engine) {
                // If no active session, start a default battle
                $engine = GameManager::startMatch('bahlul', 'tifuzia');
            }

            // Sync mode if provided (e.g. dynamic switch to pvp when P2 smartphone connects)
            if (!empty($input['mode'])) {
                $engine->setGameMode((string) $input['mode']);
            }

            $actor = (string) ($input['actor'] ?? 'p1');
            $move = (string) ($input['move'] ?? 'attack');

            $result = $engine->executeAction($actor, $move);
            GameManager::saveActiveBattle($engine);

            echo json_encode([
                'status' => 'success',
                'action' => $move,
                'actor' => $actor,
                'result' => $result
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        case 'state':
            $engine = GameManager::getActiveBattle();
            if (!$engine) {
                echo json_encode([
                    'status' => 'idle',
                    'message' => 'Tidak ada sesi pertarungan aktif.',
                    'battleState' => null
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                break;
            }

            echo json_encode([
                'status' => 'success',
                'battleState' => $engine->getBattleState()
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        case 'reset':
            GameManager::resetBattle();
            echo json_encode([
                'status' => 'success',
                'message' => 'Sesi pertarungan berhasil direset.'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => "Aksi '{$action}' tidak dikenal."
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
