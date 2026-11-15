<?php
declare(strict_types=1);

namespace MBG\Core;

use MBG\Characters\Bahlul;
use MBG\Characters\Tifuzia;
use MBG\Characters\BrownTeddy;
use MBG\Characters\Fufufifi;
use MBG\Characters\WiliWonka;

/**
 * Class CharacterFactory
 * Pola Desain Factory untuk menginstansiasi objek petarung secara dinamis dan polimorfis.
 */
class CharacterFactory
{
    /**
     * Membuat instance objek petarung berdasarkan ID string karakter.
     * Mengembalikan referensi parent class Fighter (Polimorfisme).
     */
    public static function create(string $characterId): Fighter
    {
        $id = strtolower(trim(str_replace(['-', ' '], '_', $characterId)));

        return match ($id) {
            'bahlul' => new Bahlul(),
            'tifuzia' => new Tifuzia(),
            'brown_teddy', 'brownteddy', 'teddy' => new BrownTeddy(),
            'fufufifi' => new Fufufifi(),
            'wili_wonka', 'wiliwonka', 'wili' => new WiliWonka(),
            default => new Bahlul()
        };
    }

    /**
     * Menginstansiasi seluruh 5 karakter dan mengembalikan daftar statistiknya.
     */
    public static function getAllCharacters(): array
    {
        $fighters = [
            self::create('bahlul'),
            self::create('tifuzia'),
            self::create('brown_teddy'),
            self::create('fufufifi'),
            self::create('wili_wonka')
        ];

        $result = [];
        foreach ($fighters as $fighter) {
            $result[] = $fighter->getStats();
        }
        return $result;
    }

    /**
     * Memilih satu karakter secara acak (berguna untuk mode AI lawan).
     */
    public static function createRandom(array $excludeIds = []): Fighter
    {
        $available = ['bahlul', 'tifuzia', 'brown_teddy', 'fufufifi', 'wili_wonka'];
        $filtered = array_diff($available, $excludeIds);
        if (empty($filtered)) {
            $filtered = $available;
        }
        $randomKey = array_rand($filtered);
        return self::create($filtered[$randomKey]);
    }
}

