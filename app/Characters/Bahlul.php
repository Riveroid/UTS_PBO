<?php
declare(strict_types=1);

namespace MBG\Characters;

use MBG\Core\Fighter;
use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Class Bahlul
 * Julukan: The Goblin Summoner
 * Karakter bertubuh kekar bertopeng mistis yang mengandalkan serangan area dan pasukan goblin.
 * 
 * Mengimplementasikan:
 * - Inheritance (extends Fighter)
 * - Encapsulation (private/protected attributes & validation)
 * - Polymorphism & Method Overriding
 */
class Bahlul extends Fighter
{
    // =========================================================================
    // ENCAPSULATION: 5 Atribut Spesifik Child Class
    // =========================================================================
    private int $activeGoblins = 0;
    private int $totalSummonsCount = 0;
    private float $etanolWaveCharge = 1.0;
    private bool $crowdControlActive = false;
    private string $summonerChant = "Bangkitlah wahai pasukan bayangan!";

    public function __construct()
    {
        parent::__construct(
            name: 'Bahlul',
            title: 'The Goblin Summoner',
            description: 'Karakter perkasa dengan kemampuan mistis memanggil gerombolan goblin dan melepaskan gelombang energi tsunami kehijauan.',
            health: 1150,
            attack: 90,
            defense: 45,
            speed: 35,
            spriteId: 'bahlul',
            colorPalette: ['#2A9D8F', '#264653', '#E76F51', '#E9C46A']
        );

        $this->passiveName = 'Goblin Power';
        $this->passiveDescription = 'Setiap serangan dasar yang berhasil mengenai musuh memberikan tambahan +5% energi ultimate.';
    }

    /**
     * Inisialisasi skill unik Bahlul
     */
    public function initSkills(): void
    {
        // Special Skill 1: TSUNAMI ETANOL
        $this->specialSkills[] = new Skill(
            name: 'Tsunami Etanol',
            description: 'Menghasilkan gelombang energi besar berwarna biru kehijauan yang memberikan damage area dan memperlambat musuh.',
            cooldown: 3,
            energyCost: 0,
            damageMultiplier: 1.6,
            effectType: 'slow',
            effectValue: 0.25,
            visualEffect: 'etanol_wave',
            soundEffect: 'water_blast'
        );

        // Special Skill 2: GOBLIN SUMMON
        $this->specialSkills[] = new Skill(
            name: 'Goblin Summon',
            description: 'Memanggil prajurit goblin kecil yang menyerbu ke arah lawan dan memberikan damage beruntun.',
            cooldown: 4,
            energyCost: 0,
            damageMultiplier: 1.4,
            effectType: 'summon',
            effectValue: 2.0, // Memanggil 2 goblin
            visualEffect: 'goblin_dash',
            soundEffect: 'goblin_laugh'
        );

        // Ultimate Skill: GOBLIN APOCALYPSE
        $this->ultimateSkill = new Skill(
            name: 'Goblin Apocalypse',
            description: 'Memanggil sekumpulan goblin raksasa dari portal dimensi yang menghujani musuh dengan rentetan serangan mematikan!',
            cooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.8,
            effectType: 'area_devastation',
            effectValue: 1.0,
            visualEffect: 'apocalypse_portal',
            soundEffect: 'apocalypse_roar'
        );
    }

    // =========================================================================
    // 4 Method Unik Child Class Bahlul
    // =========================================================================

    /**
     * Method Unik 1: Memanggil goblin peliharaan untuk menambah pasukan
     */
    public function summonGoblins(int $count = 1): int
    {
        $this->activeGoblins += $count;
        $this->totalSummonsCount += $count;
        $this->addEnergy(5 * $count);
        return $this->activeGoblins;
    }

    /**
     * Method Unik 2: Melepaskan gelombang etanol dengan pengisian energi
     */
    public function chargeEtanolWave(float $charge): void
    {
        $this->etanolWaveCharge = min(2.5, max(1.0, $this->etanolWaveCharge + $charge));
    }

    /**
     * Method Unik 3: Mengaktifkan mode Crowd Control
     */
    public function toggleCrowdControl(bool $status): void
    {
        $this->crowdControlActive = $status;
        $this->defenseModifier = $status ? 1.25 : 1.0;
    }

    /**
     * Method Unik 4: Mengembalikan mantra summoner dan status pasukan
     */
    public function getGoblinHordeStatus(): array
    {
        return [
            'activeGoblins' => $this->activeGoblins,
            'totalSummoned' => $this->totalSummonsCount,
            'etanolCharge' => $this->etanolWaveCharge,
            'chant' => $this->summonerChant,
            'ccActive' => $this->crowdControlActive
        ];
    }

    /**
     * Polimorfisme: Override method attack() untuk menerapkan passive Goblin Power
     */
    public function attack(FighterInterface $target): array
    {
        $result = parent::attack($target);
        if ($result['success']) {
            // Passive Bahlul: bonus +5% energi ekstra
            $this->addEnergy(5);
            $result['message'] .= " [Passive Goblin Power: +5% Energi]";
        }
        return $result;
    }

    /**
     * Implementasi Pasif Bahlul
     */
    public function activatePassive(): array
    {
        return [
            'triggered' => true,
            'name' => $this->passiveName,
            'message' => 'Goblin Power mempercepat akumulasi energi ultimate Bahlul.'
        ];
    }

    public function getSpecialAbilityDescription(): string
    {
        return "Bahlul dapat memanggil goblin peliharaan dan melepaskan gelombang etanol berdaya hancur tinggi.";
    }

    // Getters & Setters untuk atribut spesifik Bahlul
    public function getActiveGoblins(): int { return $this->activeGoblins; }
    public function getTotalSummonsCount(): int { return $this->totalSummonsCount; }
    public function getEtanolWaveCharge(): float { return $this->etanolWaveCharge; }
}

