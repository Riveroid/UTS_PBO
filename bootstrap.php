<?php
declare(strict_types=1);

/**
 * Mobile Battle Government (MBG)
 * Bootstrap & PSR-4 Autoloader
 * 
 * Kelompok 1 - Pemrograman Berorientasi Objek
 * Universitas Muhammadiyah Sukabumi (2026/2027)
 */

define('MBG_ROOT', __DIR__);
define('MBG_APP', __DIR__ . DIRECTORY_SEPARATOR . 'app');

// Standalone PSR-4 Autoloader
spl_autoload_register(function (string $class): void {
    $prefix = 'MBG\\';
    $baseDir = MBG_APP . DIRECTORY_SEPARATOR;

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

// Also include Composer autoloader if present
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Error reporting & Session initiation
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

