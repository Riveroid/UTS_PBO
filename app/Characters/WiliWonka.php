<?php
declare(strict_types=1);

namespace MBG\Characters;

use MBG\Core\Fighter;
use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Class WiliWonka
 * Julukan: The Viral Opportunist
 * Karakter pesolek bertopi pesulap eksentrik dengan ponsel live-streaming yang mengincar FYP dan popularitas media sosial.
 */
class WiliWonka extends Fighter
{
    // =========================================================================
    // ENCAPSULATION: 5 Atribut Spesifik Child Class
    // =========================================================================
    private int $viralFollowers = 50000;
    private int $trendingRank = 12;
    private int $chocolateBars = 5;
    private int $livestreamViewers = 1200;
    private float $hypeMultiplier = 1.0;

    public function __construct()
    {
        parent::__construct(
            name: 'Wili Wonka',
            title: 'The Viral Opportunist',
            description: 'Karakter lincah dan oportunis berorientasi konten media sosial dengan serangan bertema cokelat dan sorotan kamera viral.',
            health: 940,
            attack: 88,
            defense: 32,
            speed: 68,
            spriteId: 'wili_wonka',
            colorPalette: ['#F4A261', '#E76F51', '#7F4F24', '#936639']
        );

        $this->passiveName = 'FYP Hunter';
        $this->passiveDescription = 'Mendapatkan bonus +15% energi ultimate dan pergerakan lebih gesit ketika berhasil melancarkan combo.';
    }

    public function initSkills(): void
    {
        // Special Skill 1: CHOCOLATE LICK
        $this->specialSkills[] = new Skill(
            name: 'Chocolate Lick',
            description: 'Menikmati cokelat manis yang memberikan suntikan energi cepat: memulihkan 45 HP dan meningkatkan Attack +20%!',
            cooldown: 3,
            energyCost: 0,
            damageMultiplier: 1.35,
            effectType: 'buff_heal',
            effectValue: 45.0,
            visualEffect: 'chocolate_splash',
            soundEffect: 'chocolate_bite'
        );

        // Special Skill 2: JILAT PANGGUNG
        $this->specialSkills[] = new Skill(
            name: 'Jilat Panggung',
            description: 'Melakukan aksi sanjungan panggung berlebihan yang mengecoh perhatian musuh dan memotong Attack lawan sebesar 20%.',
            cooldown: 4,
            energyCost: 0,
            damageMultiplier: 1.65,
            effectType: 'distract_debuff',
            effectValue: 0.20,
            visualEffect: 'stage_sparkles',
            soundEffect: 'glamour_twinkle'
        );

        // Ultimate Skill: VIRAL MOMENT
        $this->ultimateSkill = new Skill(
            name: 'Viral Moment',
            description: 'Menyalakan siaran langsung jutaan penonton dengan blitz kamera menyilaukan dan rentetan serangan beruntun hingga masuk Trending #1!',
            cooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.85,
            effectType: 'viral_blitz',
            effectValue: 1.0,
            visualEffect: 'camera_flash_blitz',
            soundEffect: 'camera_shutter'
        );
    }

    // =========================================================================
    // 4 Method Unik Child Class WiliWonka
    // =========================================================================

    /**
     * Method Unik 1: Mengonsumsi cokelat untuk pemulihan stamina
     */
    public function consumeChocolate(int $bars = 1): int
    {
        if ($this->chocolateBars >= $bars) {
            $this->chocolateBars -= $bars;
            $this->heal(50 * $bars);
            $this->setAttackModifier(1.20);
        }
        return $this->chocolateBars;
    }

    /**
     * Method Unik 2: Memulai siaran langsung viral untuk menarik penonton
     */
    public function startLivestream(int $newViewers = 5000): int
    {
        $this->livestreamViewers += $newViewers;
        $this->hypeMultiplier = 1.0 + ($this->livestreamViewers / 20000.0);
        return $this->livestreamViewers;
    }

    /**
     * Method Unik 3: Melesat ke peringkat trending topik teratas
     */
    public function boostTrendingRank(): int
    {
        $this->trendingRank = max(1, $this->trendingRank - 2);
        if ($this->trendingRank === 1) {
            $this->setSpeedModifier(1.30); // Kecepatan +30% saat Trending #1
        }
        return $this->trendingRank;
    }

    /**
     * Method Unik 4: Mengembalikan analitik media sosial
     */
    public function getSocialAnalytics(): array
    {
        return [
            'followers' => $this->viralFollowers,
            'trendingRank' => $this->trendingRank,
            'currentViewers' => $this->livestreamViewers,
            'chocolateRemaining' => $this->chocolateBars,
            'hypeMultiplier' => $this->hypeMultiplier
        ];
    }

    /**
     * Polimorfisme: Override useSpecialSkill() untuk memberikan self-buff saat Chocolate Lick
     */
    public function useSpecialSkill(int $skillIndex, FighterInterface $target): array
    {
        $result = parent::useSpecialSkill($skillIndex, $target);
        if ($result['success']) {
            if ($skillIndex === 0) { // Chocolate Lick
                $this->heal(45);
                $this->setAttackModifier(1.20);
                $result['message'] .= " [Wili Wonka memulihkan 45 HP & Attack meningkat +20%!]";
            } elseif ($skillIndex === 1) { // Jilat Panggung
                if ($target instanceof Fighter) {
                    $target->setAttackModifier(0.80);
                    $result['message'] .= " [Attack {$target->getName()} turun 20% karena terdistraksi!]";
                }
            }
        }
        return $result;
    }

    public function activatePassive(): array
    {
        return [
            'triggered' => true,
            'name' => $this->passiveName,
            'message' => 'FYP Hunter melipatgandakan akumulasi energi melalui aksi panggung yang memikat penonton.'
        ];
    }

    public function getSpecialAbilityDescription(): string
    {
        return "Wili Wonka memanfaatkan kelincahan akrobatik, buff cokelat, dan sorotan blitz kamera viral.";
    }

    public function getViralFollowers(): int { return $this->viralFollowers; }
    public function getTrendingRank(): int { return $this->trendingRank; }
    public function getChocolateBars(): int { return $this->chocolateBars; }
}

