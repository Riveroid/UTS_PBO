<?php
declare(strict_types=1);

namespace MBG\Characters;

use MBG\Core\Fighter;
use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Class BrownTeddy
 * Julukan: The Affection Attacker
 * Karakter berkostum beruang cokelat jenaka yang mengandalkan serangan komedi jarak dekat dan ketahanan fisik tinggi.
 */
class BrownTeddy extends Fighter
{
    // =========================================================================
    // ENCAPSULATION: 5 Atribut Spesifik Child Class
    // =========================================================================
    private int $cuddleCharge = 0;
    private int $attentionMeter = 50; // 0 - 100
    private bool $emergencyShieldActive = false;
    private float $hugImmobilizeRate = 0.40;
    private int $loveBombCount = 0;

    public function __construct()
    {
        parent::__construct(
            name: 'Brown Teddy',
            title: 'The Affection Attacker',
            description: 'Karakter beruang raksasa menggemaskan yang menggunakan afeksi kartun dan pelukan erat untuk menaklukkan musuh.',
            health: 1250,
            attack: 76,
            defense: 55,
            speed: 40,
            spriteId: 'brown_teddy',
            colorPalette: ['#8D6E63', '#D7CCC8', '#FF4081', '#F48FB1']
        );

        $this->passiveName = 'Attention Seeker';
        $this->passiveDescription = 'Ketika HP berada di bawah 30%, Brown Teddy secara otomatis mendapatkan perisai pertahanan ekstra (+50% Defense).';
    }

    public function initSkills(): void
    {
        // Special Skill 1: KISS ATTACK
        $this->specialSkills[] = new Skill(
            name: 'Kiss Attack',
            description: 'Melayangkan kecupan kartun pixel art yang mengejutkan lawan dan menimbulkan damage komedi.',
            cooldown: 3,
            energyCost: 0,
            damageMultiplier: 1.45,
            effectType: 'charm',
            effectValue: 0.15,
            visualEffect: 'pixel_kiss_lips',
            soundEffect: 'cartoon_kiss'
        );

        // Special Skill 2: TEDDY HUG
        $this->specialSkills[] = new Skill(
            name: 'Teddy Hug',
            description: 'Menerjang ke depan dan memeluk musuh dengan erat, mengunci pergerakan lawan dan meremukkan pertahanan.',
            cooldown: 4,
            energyCost: 0,
            damageMultiplier: 1.6,
            effectType: 'immobilize',
            effectValue: 1.0,
            visualEffect: 'bear_hug',
            soundEffect: 'hug_squeeze'
        );

        // Ultimate Skill: LOVE BOMB
        $this->ultimateSkill = new Skill(
            name: 'Love Bomb',
            description: 'Mengumpulkan energi kasih sayang berlebih yang meledak menjadi hujan partikel hati berkilauan ke seluruh arena!',
            cooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.65,
            effectType: 'heart_explosion',
            effectValue: 1.0,
            visualEffect: 'heart_particles_explosion',
            soundEffect: 'heart_blast'
        );
    }

    // =========================================================================
    // 4 Method Unik Child Class BrownTeddy
    // =========================================================================

    /**
     * Method Unik 1: Melakukan gerakan pelukan menghangatkan
     */
    public function performCuddle(int $chargeAmount = 15): int
    {
        $this->cuddleCharge += $chargeAmount;
        $this->heal(25); // Memulihkan sedikit HP
        return $this->cuddleCharge;
    }

    /**
     * Method Unik 2: Meningkatkan meteran pencari perhatian
     */
    public function gainAttention(int $points): int
    {
        $this->attentionMeter = min(100, max(0, $this->attentionMeter + $points));
        return $this->attentionMeter;
    }

    /**
     * Method Unik 3: Mengaktifkan perisai darurat perhatian
     */
    public function deployEmergencyShield(): bool
    {
        $hpRatio = $this->health / $this->maxHealth;
        if ($hpRatio < 0.30 && !$this->emergencyShieldActive) {
            $this->emergencyShieldActive = true;
            $this->setDefenseModifier(1.50); // +50% Defense
            return true;
        }
        return false;
    }

    /**
     * Method Unik 4: Mengembalikan status afeksi dan meter cinta
     */
    public function getLoveMeterStatus(): array
    {
        return [
            'cuddleCharge' => $this->cuddleCharge,
            'attentionMeter' => $this->attentionMeter,
            'shieldActive' => $this->emergencyShieldActive,
            'loveBombsDropped' => $this->loveBombCount
        ];
    }

    /**
     * Polimorfisme: Override takeDamage() untuk memicu passive Attention Seeker saat HP rendah
     */
    public function takeDamage(int $damage): int
    {
        $actual = parent::takeDamage($damage);
        // Periksa pemicu pasif setelah menerima serangan
        $this->deployEmergencyShield();
        return $actual;
    }

    public function activatePassive(): array
    {
        $isTriggered = $this->deployEmergencyShield();
        return [
            'triggered' => $isTriggered,
            'name' => $this->passiveName,
            'message' => $isTriggered 
                ? 'Attention Seeker AKTIF! HP di bawah 30%, pertahanan meningkat +50%!' 
                : 'Attention Seeker dalam kondisi siaga.'
        ];
    }

    public function getSpecialAbilityDescription(): string
    {
        return "Brown Teddy memiliki ketahanan fisik kokoh dan perisai otomatis saat HP menipis.";
    }

    public function getAttentionMeter(): int { return $this->attentionMeter; }
    public function isEmergencyShieldActive(): bool { return $this->emergencyShieldActive; }
}

