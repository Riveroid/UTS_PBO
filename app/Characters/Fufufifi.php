<?php
declare(strict_types=1);

namespace MBG\Characters;

use MBG\Core\Fighter;
use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Class Fufufifi
 * Julukan: The Government Critic
 * Karakter aktivis berjaket almamater yang mengandalkan megaphone, spanduk tuntutan, dan orasi publik untuk mendebuff lawan.
 */
class Fufufifi extends Fighter
{
    // =========================================================================
    // ENCAPSULATION: 5 Atribut Spesifik Child Class
    // =========================================================================
    private int $criticismPoints = 0;
    private int $protestBannerCount = 1;
    private int $publicSupportMeter = 40; // 0 - 100
    private int $megaphoneVolume = 90;
    private string $movementMotto = "Kebenaran tak bisa dibungkam!";

    public function __construct()
    {
        parent::__construct(
            name: 'Fufufifi',
            title: 'The Government Critic',
            description: 'Karakter demonstran gigih pembela aspirasi rakyat dengan serangan orasi kritis yang melemahkan daya tahan musuh.',
            health: 1050,
            attack: 85,
            defense: 42,
            speed: 52,
            spriteId: 'fufufifi',
            colorPalette: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D']
        );

        $this->passiveName = 'Voice of People';
        $this->passiveDescription = 'Setiap kritik dan serangan yang berhasil mengenai lawan mengakumulasi tambahan +8% energi ultimate.';
    }

    public function initSkills(): void
    {
        // Special Skill 1: KRITIK TAJAM
        $this->specialSkills[] = new Skill(
            name: 'Kritik Tajam',
            description: 'Meluncurkan argumen berbasis data investigasi yang menusuk pertahanan mental lawan dan mengurangi Defense sebesar 25%.',
            cooldown: 3,
            energyCost: 0,
            damageMultiplier: 1.5,
            effectType: 'defense_debuff',
            effectValue: 0.25,
            visualEffect: 'sharp_critique_spark',
            soundEffect: 'megaphone_shout'
        );

        // Special Skill 2: ASPIRASI RAKYAT
        $this->specialSkills[] = new Skill(
            name: 'Aspirasi Rakyat',
            description: 'Membentangkan spanduk aspirasi dan melepaskan gelombang suara orasi publik yang menghempaskan lawan mundur.',
            cooldown: 4,
            energyCost: 0,
            damageMultiplier: 1.7,
            effectType: 'knockback',
            effectValue: 1.5,
            visualEffect: 'protest_banner_wave',
            soundEffect: 'crowd_chant'
        );

        // Ultimate Skill: REVOLUSI ARGUMEN
        $this->ultimateSkill = new Skill(
            name: 'Revolusi Argumen',
            description: 'Menampilkan orasi akbar dengan latar belakang barisan massa demonstrasi pixel art, meluluhlantakkan pertahanan dan serangan musuh!',
            cooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.75,
            effectType: 'mass_debuff_damage',
            effectValue: 0.30, // Debuff 30% attack & defense
            visualEffect: 'revolution_rally',
            soundEffect: 'mass_anthem'
        );
    }

    // =========================================================================
    // 4 Method Unik Child Class Fufufifi
    // =========================================================================

    /**
     * Method Unik 1: Menyuarakan yel-yel tuntutan
     */
    public function chantAspiration(string $customChant = ''): string
    {
        $this->criticismPoints += 10;
        $this->addEnergy(8);
        return $customChant ?: "{$this->name} berseru: '{$this->movementMotto}' (+10 Poin Kritik)";
    }

    /**
     * Method Unik 2: Membentangkan spanduk protes baru
     */
    public function raiseProtestBanner(): int
    {
        $this->protestBannerCount++;
        $this->setAttackModifier(1.15); // +15% attack saat memegang spanduk
        return $this->protestBannerCount;
    }

    /**
     * Method Unik 3: Menggalang dukungan solidaritas massa
     */
    public function rallyPublicSupport(int $boost = 20): int
    {
        $this->publicSupportMeter = min(100, $this->publicSupportMeter + $boost);
        if ($this->publicSupportMeter >= 80) {
            $this->heal(50); // Dukungan rakyat memulihkan stamina
        }
        return $this->publicSupportMeter;
    }

    /**
     * Method Unik 4: Mengembalikan dossier arsip kritik publik
     */
    public function getCriticDossier(): array
    {
        return [
            'criticismPoints' => $this->criticismPoints,
            'bannersHeld' => $this->protestBannerCount,
            'publicSupport' => $this->publicSupportMeter,
            'volume' => $this->megaphoneVolume,
            'motto' => $this->movementMotto
        ];
    }

    /**
     * Polimorfisme: Override useSpecialSkill() untuk menerapkan debuff defense nyata pada target
     */
    public function useSpecialSkill(int $skillIndex, FighterInterface $target): array
    {
        $result = parent::useSpecialSkill($skillIndex, $target);
        if ($result['success'] && $skillIndex === 0) { // Kritik Tajam
            if ($target instanceof Fighter) {
                $target->setDefenseModifier(0.75); // Kurangi defense 25%
                $result['message'] .= " [Pertahanan {$target->getName()} jebol -25%!]";
            }
            $this->addEnergy(8); // Voice of People passive
        }
        return $result;
    }

    public function activatePassive(): array
    {
        return [
            'triggered' => true,
            'name' => $this->passiveName,
            'message' => 'Voice of People mempercepat perolehan energi ultimate melalui setiap serangan kritik.'
        ];
    }

    public function getSpecialAbilityDescription(): string
    {
        return "Fufufifi melemahkan pertahanan musuh melalui rentetan kritik tajam dan orasi massa.";
    }

    public function getCriticismPoints(): int { return $this->criticismPoints; }
    public function getPublicSupportMeter(): int { return $this->publicSupportMeter; }
}

