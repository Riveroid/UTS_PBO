<?php
declare(strict_types=1);

namespace MBG\Core;

use MBG\Arenas\Arena;

/**
 * Class GameManager
 * Mengelola state pertempuran di sesi web, routing aksi, dan orkestrasi game engine.
 */
class GameManager
{
    private const SESSION_KEY = 'mbg_active_battle';

    /**
     * Memulai pertandingan baru dan menyimpannya di session.
     */
    public static function startMatch(
        string $p1Id,
        string $p2Id,
        string $arenaId = 'ruang_sidang',
        string $mode = 'pvai',
        string $difficulty = 'normal'
    ): BattleEngine {
        $p1 = CharacterFactory::create($p1Id);
        $p2 = CharacterFactory::create($p2Id);
        $arena = Arena::getById($arenaId);

        $engine = new BattleEngine($p1, $p2, $arena, $mode, $difficulty);
        $_SESSION[self::SESSION_KEY] = serialize($engine);

        return $engine;
    }

    /**
     * Mengambil instance pertarungan aktif dari session.
     */
    public static function getActiveBattle(): ?BattleEngine
    {
        if (isset($_SESSION[self::SESSION_KEY])) {
            $unserialized = @unserialize($_SESSION[self::SESSION_KEY]);
            if ($unserialized instanceof BattleEngine) {
                return $unserialized;
            }
        }
        return null;
    }

    /**
     * Menyimpan kembali instance pertarungan ke session setelah terjadi perubahan state.
     */
    public static function saveActiveBattle(BattleEngine $engine): void
    {
        $_SESSION[self::SESSION_KEY] = serialize($engine);
    }

    /**
     * Mereset / menghapus sesi pertarungan aktif.
     */
    public static function resetBattle(): void
    {
        unset($_SESSION[self::SESSION_KEY]);
    }
}

