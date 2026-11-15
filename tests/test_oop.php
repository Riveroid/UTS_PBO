<?php
declare(strict_types=1);

/**
 * Mobile Battle Government (MBG)
 * Comprehensive OOP Unit & Integration Test Suite
 * 
 * Kelompok 1 - Pemrograman Berorientasi Objek
 * Universitas Muhammadiyah Sukabumi
 */

require_once __DIR__ . '/../bootstrap.php';

use MBG\Core\Fighter;
use MBG\Core\CharacterFactory;
use MBG\Core\DamageCalculator;
use MBG\Core\BattleEngine;
use MBG\Arenas\Arena;
use MBG\Characters\Bahlul;
use MBG\Characters\Tifuzia;
use MBG\Characters\BrownTeddy;
use MBG\Characters\Fufufifi;
use MBG\Characters\WiliWonka;

class MBGTestSuite
{
    private int $passed = 0;
    private int $failed = 0;
    private array $results = [];

    public function runAll(): void
    {
        echo "========================================================\n";
        echo "  MBG (MOBILE BATTLE GOVERNMENT) - OOP TEST SUITE\n";
        echo "========================================================\n\n";

        $this->test1_ObjectInstantiation();
        $this->test2_Inheritance();
        $this->test3_Encapsulation();
        $this->test4_MethodOverriding();
        $this->test5_Polymorphism();
        $this->test6_SkillCooldownAndEnergy();
        $this->test7_DamageMitigationFormula();
        $this->test8_BattleEngineCombatFlow();
        $this->test9_ArenaIntegration();
        $this->test10_VictoryAndKnockoutCondition();

        echo "\n--------------------------------------------------------\n";
        echo "TEST SUMMARY:\n";
        echo "TOTAL TESTS: " . ($this->passed + $this->failed) . "\n";
        echo "PASSED: {$this->passed} \033[32m[SUCCESS]\033[0m\n";
        echo "FAILED: {$this->failed} " . ($this->failed > 0 ? "\033[31m[ERROR]\033[0m" : "") . "\n";
        echo "========================================================\n";

        if ($this->failed > 0) {
            exit(1);
        }
    }

    private function assert(string $testName, bool $condition, string $details = ''): void
    {
        if ($condition) {
            $this->passed++;
            echo " [PASS] {$testName}\n";
            if ($details) echo "        -> {$details}\n";
        } else {
            $this->failed++;
            echo " [FAIL] {$testName}\n";
            if ($details) echo "        -> ERROR: {$details}\n";
        }
    }

    private function test1_ObjectInstantiation(): void
    {
        echo "[1. PENGUJIAN INSTANSIASI OBJEK]\n";
        $bahlul = CharacterFactory::create('bahlul');
        $tifuzia = CharacterFactory::create('tifuzia');
        $teddy = CharacterFactory::create('brown_teddy');
        $fufufifi = CharacterFactory::create('fufufifi');
        $wili = CharacterFactory::create('wili_wonka');

        $this->assert("Instansiasi Bahlul", $bahlul instanceof Bahlul, "Nama: {$bahlul->getName()}, MaxHP: {$bahlul->getMaxHealth()}");
        $this->assert("Instansiasi Tifuzia", $tifuzia instanceof Tifuzia, "Nama: {$tifuzia->getName()}, Speed: {$tifuzia->getSpeed()}");
        $this->assert("Instansiasi Brown Teddy", $teddy instanceof BrownTeddy, "Nama: {$teddy->getName()}, Defense: {$teddy->getDefense()}");
        $this->assert("Instansiasi Fufufifi", $fufufifi instanceof Fufufifi, "Nama: {$fufufifi->getName()}, Attack: {$fufufifi->getAttack()}");
        $this->assert("Instansiasi Wili Wonka", $wili instanceof WiliWonka, "Nama: {$wili->getName()}, Speed: {$wili->getSpeed()}");
    }

    private function test2_Inheritance(): void
    {
        echo "\n[2. PENGUJIAN INHERITANCE (PEWARISAN KELAS)]\n";
        $characters = [
            'Bahlul' => new Bahlul(),
            'Tifuzia' => new Tifuzia(),
            'Brown Teddy' => new BrownTeddy(),
            'Fufufifi' => new Fufufifi(),
            'Wili Wonka' => new WiliWonka()
        ];

        foreach ($characters as $name => $char) {
            $this->assert("{$name} inherits Fighter", $char instanceof Fighter, "Class " . get_class($char) . " adalah turunan sah dari Fighter");
        }
    }

    private function test3_Encapsulation(): void
    {
        echo "\n[3. PENGUJIAN ENKAPSULASI (DATA HIDING & BOUNDS)]\n";
        $fighter = new Bahlul();
        $initialHp = $fighter->getHealth();

        // Uji 1: HP tidak boleh bernilai negatif
        $fighter->takeDamage(999999);
        $this->assert("Enkapsulasi: HP tidak pernah negatif", $fighter->getHealth() === 0, "HP setelah damage masif: {$fighter->getHealth()} (Bukan minus)");

        // Uji 2: Heal tidak boleh melebihi MaxHealth
        $fighter->setHealth(500);
        $fighter->heal(999999);
        $this->assert("Enkapsulasi: Heal dibatasi MaxHealth", $fighter->getHealth() === $fighter->getMaxHealth(), "HP saat ini: {$fighter->getHealth()}, MaxHP: {$fighter->getMaxHealth()}");

        // Uji 3: Ultimate Energy dibatasi 0 - 100%
        $fighter->addEnergy(999);
        $this->assert("Enkapsulasi: Ultimate energy maksimal 100%", $fighter->getUltimateEnergy() === 100, "Energy: {$fighter->getUltimateEnergy()}%");
        $fighter->setUltimateEnergy(-50);
        $this->assert("Enkapsulasi: Ultimate energy minimal 0%", $fighter->getUltimateEnergy() === 0, "Energy: {$fighter->getUltimateEnergy()}%");
    }

    private function test4_MethodOverriding(): void
    {
        echo "\n[4. PENGUJIAN METHOD OVERRIDING]\n";
        $bahlul = new Bahlul();
        $target = new Tifuzia();
        
        $bahlul->setUltimateEnergy(0);
        $result = $bahlul->attack($target);
        // Overridden attack() in Bahlul adds +5% passive bonus on top of base 10%
        $this->assert("Bahlul overrode attack() with passive energy gain", $bahlul->getUltimateEnergy() === 15, "Energy naik +15% per serangan (10 base + 5 passive)");
    }

    private function test5_Polymorphism(): void
    {
        echo "\n[5. PENGUJIAN POLIMORFISME]\n";
        /** @var Fighter[] $roster */
        $roster = [
            CharacterFactory::create('bahlul'),
            CharacterFactory::create('tifuzia'),
            CharacterFactory::create('brown_teddy'),
            CharacterFactory::create('fufufifi'),
            CharacterFactory::create('wili_wonka')
        ];

        $targetDummy = CharacterFactory::create('brown_teddy');

        foreach ($roster as $fighter) {
            // Pemanggilan polimorfis: method sama dieksekusi melalui referensi parent class
            $result = $fighter->attack($targetDummy);
            $this->assert("Polymorphic call on {$fighter->getName()}", isset($result['finalDamage']) && $result['finalDamage'] > 0, "Damage dealt: {$result['finalDamage']}");
        }
    }

    private function test6_SkillCooldownAndEnergy(): void
    {
        echo "\n[6. PENGUJIAN SKILL COOLDOWN & PERSYARATAN ENERGI]\n";
        $fufufifi = new Fufufifi();
        $target = new Bahlul();

        // Eksekusi skill 1
        $res1 = $fufufifi->useSpecialSkill(0, $target);
        $this->assert("Skill 1 berhasil digunakan pertama kali", $res1['success'], $res1['message']);

        // Coba gunakan skill 1 lagi langsung (harus gagal karena cooldown)
        $res2 = $fufufifi->useSpecialSkill(0, $target);
        $this->assert("Skill 1 tertolak karena Cooldown", !$res2['success'], $res2['message']);

        // Coba ultimate tanpa energi 100%
        $fufufifi->setUltimateEnergy(50);
        $resUlti = $fufufifi->useUltimateSkill($target);
        $this->assert("Ultimate tertolak saat energi < 100%", !$resUlti['success'], $resUlti['message']);

        // Beri energi 100% lalu eksekusi ultimate
        $fufufifi->setUltimateEnergy(100);
        $resUltiSuccess = $fufufifi->useUltimateSkill($target);
        $this->assert("Ultimate berhasil saat energi 100%", $resUltiSuccess['success'], $resUltiSuccess['message']);
        $this->assert("Ultimate me-reset energi kembali ke 0%", $fufufifi->getUltimateEnergy() === 0, "Energy: {$fufufifi->getUltimateEnergy()}%");
    }

    private function test7_DamageMitigationFormula(): void
    {
        echo "\n[7. PENGUJIAN FORMULA DAMAGE & MITIGASI DEFENSE]\n";
        $attacker = new Bahlul(); // Attack 90
        $targetLowDef = new WiliWonka(); // Defense 32
        $targetHighDef = new BrownTeddy(); // Defense 55

        $calcLow = DamageCalculator::calculateDamage($attacker, $targetLowDef, 1.0, 0, false);
        $calcHigh = DamageCalculator::calculateDamage($attacker, $targetHighDef, 1.0, 0, false);

        $this->assert("Defense tinggi menerima damage lebih kecil", $calcHigh['finalDamage'] <= $calcLow['finalDamage'], 
            "Target Def {$targetLowDef->getDefense()} terima {$calcLow['finalDamage']} dmg | Target Def {$targetHighDef->getDefense()} terima {$calcHigh['finalDamage']} dmg");
    }

    private function test8_BattleEngineCombatFlow(): void
    {
        echo "\n[8. PENGUJIAN ALUR PERTARUNGAN BATTLE ENGINE]\n";
        $p1 = new Bahlul();
        $p2 = new Tifuzia();
        $engine = new BattleEngine($p1, $p2, null, 'pvp');

        $turn1 = $engine->executeAction('p1', 'attack');
        $this->assert("Turn 1 P1 dieksekusi", $turn1['playerAction']['success'], $turn1['playerAction']['message']);

        $turn2 = $engine->executeAction('p2', 'attack');
        $this->assert("Turn 2 P2 dieksekusi", $turn2['playerAction']['success'], $turn2['playerAction']['message']);

        $state = $engine->getBattleState();
        $this->assert("Battle State tercatat dengan statistik valid", $state['statistics']['p1']['hits'] === 1 && $state['statistics']['p2']['hits'] === 1);
    }

    private function test9_ArenaIntegration(): void
    {
        echo "\n[9. PENGUJIAN INTEGRASI ARENA PERTARUNGAN]\n";
        $arenas = Arena::getAllArenas();
        $this->assert("Tersedia minimal 4 arena pertarungan", count($arenas) >= 4, "Total arena: " . count($arenas));
        $arena = Arena::getById('bundaran_demokrasi');
        $this->assert("Pencarian Arena by ID berhasil", $arena->getName() === 'Bundaran Demokrasi', "Nama Arena: {$arena->getName()}");
    }

    private function test10_VictoryAndKnockoutCondition(): void
    {
        echo "\n[10. PENGUJIAN KONDISI KEMENANGAN & K.O.]\n";
        $p1 = new Bahlul();
        $p2 = new Tifuzia();
        $engine = new BattleEngine($p1, $p2, null, 'pvp');

        // Berikan damage fatal ke P2
        $p2->takeDamage(99999);
        $engine->executeAction('p1', 'attack'); // Picu evaluasi game over

        $state = $engine->getBattleState();
        $this->assert("Game Over terdeteksi saat HP lawan habis", $state['isGameOver'] === true);
        $this->assert("Pemenang tercatat secara akurat", $state['winner'] === $p1->getName(), "Winner: {$state['winner']}");
    }
}

// Jalankan Test Suite
$suite = new MBGTestSuite();
$suite->runAll();
