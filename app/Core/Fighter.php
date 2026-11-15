<?php
declare(strict_types=1);

namespace MBG\Core;

use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Abstract Class Fighter
 * Kelas Induk (Parent Class) untuk seluruh karakter petarung pada game MBG.
 * Mengimplementasikan konsep Abstraksi, Enkapsulasi, dan Polimorfisme.
 */
abstract class Fighter implements FighterInterface
{
    // =========================================================================
    // ENCAPSULATION: Protected & Private Properties
    // =========================================================================
    protected string $name;
    protected string $title;
    protected string $description;
    protected int $health;
    protected int $maxHealth;
    protected int $attack;
    protected int $defense;
    protected int $speed;
    protected int $ultimateEnergy; // 0 - 100%
    protected bool $isStunned;
    protected int $stunDuration;
    
    // Modifiers for buffs / debuffs
    protected float $attackModifier = 1.0;
    protected float $defenseModifier = 1.0;
    protected float $speedModifier = 1.0;

    // Skills & Passive
    /** @var Skill[] */
    protected array $specialSkills = [];
    protected ?Skill $ultimateSkill = null;
    protected string $passiveName = '';
    protected string $passiveDescription = '';
    
    // Visual theme attributes
    protected string $spriteId = '';
    protected array $colorPalette = [];

    /**
     * Konstruktor Kelas Fighter
     */
    public function __construct(
        string $name,
        string $title,
        string $description,
        int $health,
        int $attack,
        int $defense,
        int $speed,
        string $spriteId = '',
        array $colorPalette = []
    ) {
        $this->name = $name;
        $this->title = $title;
        $this->description = $description;
        $this->maxHealth = max(100, $health);
        $this->health = $this->maxHealth;
        $this->attack = max(10, $attack);
        $this->defense = max(5, $defense);
        $this->speed = max(5, $speed);
        $this->ultimateEnergy = 0;
        $this->isStunned = false;
        $this->stunDuration = 0;
        $this->spriteId = $spriteId ?: strtolower(str_replace(' ', '_', $name));
        $this->colorPalette = $colorPalette ?: ['#E63946', '#F4B942', '#1B1B24'];

        // Panggil inisialisasi skill unik yang diimplementasikan oleh child class
        $this->initSkills();
    }

    /**
     * Abstraction: Setiap Child Class wajib menginisialisasi set skill uniknya sendiri.
     */
    abstract public function initSkills(): void;

    /**
     * Abstraction: Setiap Child Class wajib mengimplementasikan perilaku pasifnya.
     */
    abstract public function activatePassive(): array;

    /**
     * Abstraction: Deskripsi kemampuan unik karakter.
     */
    abstract public function getSpecialAbilityDescription(): string;

    // =========================================================================
    // COMBAT METHODS (BEHAVIOR & LOGIC)
    // =========================================================================

    /**
     * Serangan dasar (Basic Attack) ke target petarung lawan.
     */
    public function attack(FighterInterface $target): array
    {
        if (!$this->isAlive()) {
            return [
                'success' => false,
                'message' => "{$this->name} sudah KO dan tidak dapat menyerang."
            ];
        }

        if ($this->isStunned) {
            return [
                'success' => false,
                'message' => "{$this->name} sedang terkena efek stun dan tidak dapat bergerak!"
            ];
        }

        // Damage calculation formula
        $effectiveAttack = (int) round($this->getEffectiveAttack());
        $isCritical = (mt_rand(1, 100) <= 15); // 15% crit chance
        $critMultiplier = $isCritical ? 1.5 : 1.0;
        $rawDamage = (int) round($effectiveAttack * $critMultiplier);

        // Target defense mitigation
        $targetDefense = $target->getDefense();
        $mitigation = $targetDefense / (100.0 + $targetDefense);
        $finalDamage = (int) max(5, round($rawDamage * (1.0 - $mitigation)));

        // Berikan damage ke lawan
        $actualDamage = $target->takeDamage($finalDamage);

        // Tambah energi ultimate saat berhasil menyerang (+10%)
        $energyGained = 10;
        $this->addEnergy($energyGained);

        // Cek trigger pasif jika ada
        $passiveResult = $this->activatePassive();

        return [
            'success' => true,
            'action' => 'basic_attack',
            'attacker' => $this->name,
            'target' => $target->getName(),
            'rawDamage' => $rawDamage,
            'isCritical' => $isCritical,
            'finalDamage' => $actualDamage,
            'targetRemainingHealth' => $target->getHealth(),
            'targetIsAlive' => $target->isAlive(),
            'energyGained' => $energyGained,
            'currentEnergy' => $this->ultimateEnergy,
            'passiveTriggered' => $passiveResult['triggered'] ?? false,
            'passiveMessage' => $passiveResult['message'] ?? '',
            'message' => $isCritical 
                ? "CRITICAL HIT! {$this->name} menghantam {$target->getName()} sebesar {$actualDamage} damage!" 
                : "{$this->name} menyerang {$target->getName()} dengan basic attack ({$actualDamage} damage)."
        ];
    }

    /**
     * Mengurangi HP petarung berdasarkan damage yang diterima.
     * Enkapsulasi menjamin HP tidak pernah bernilai negatif.
     */
    public function takeDamage(int $damage): int
    {
        $damage = max(0, $damage);
        $actualDamage = min($this->health, $damage);
        $this->health -= $actualDamage;
        
        // Energi ultimate bertambah sedikit saat menerima damage (+5%)
        $this->addEnergy(5);

        return $actualDamage;
    }

    /**
     * Memulihkan HP petarung.
     * Enkapsulasi menjamin HP tidak melebihi maxHealth.
     */
    public function heal(int $amount): int
    {
        if (!$this->isAlive()) {
            return 0;
        }
        $amount = max(0, $amount);
        $actualHeal = min($amount, $this->maxHealth - $this->health);
        $this->health += $actualHeal;
        return $actualHeal;
    }

    /**
     * Menambahkan energi ultimate (0 - 100%).
     */
    public function addEnergy(int $amount): void
    {
        $this->ultimateEnergy = min(100, max(0, $this->ultimateEnergy + $amount));
    }

    /**
     * Menggunakan Special Skill berdasarkan indeks (0 atau 1).
     */
    public function useSpecialSkill(int $skillIndex, FighterInterface $target): array
    {
        if (!$this->isAlive()) {
            return ['success' => false, 'message' => "{$this->name} sudah KO!"];
        }

        if ($this->isStunned) {
            return ['success' => false, 'message' => "{$this->name} sedang ter-stun!"];
        }

        if (!isset($this->specialSkills[$skillIndex])) {
            return ['success' => false, 'message' => "Skill indeks #{$skillIndex} tidak ditemukan!"];
        }

        $skill = $this->specialSkills[$skillIndex];
        $result = $skill->execute($this, $target);

        if ($result['success']) {
            $this->addEnergy(15); // Bonus energi dari special skill
        }

        return $result;
    }

    /**
     * Menggunakan Ultimate Skill berkekuatan penuh (memerlukan 100% energi).
     */
    public function useUltimateSkill(FighterInterface $target): array
    {
        if (!$this->isAlive()) {
            return ['success' => false, 'message' => "{$this->name} sudah KO!"];
        }

        if ($this->isStunned) {
            return ['success' => false, 'message' => "{$this->name} sedang ter-stun!"];
        }

        if ($this->ultimateSkill === null) {
            return ['success' => false, 'message' => "Karakter tidak memiliki Ultimate Skill!"];
        }

        if ($this->ultimateEnergy < 100) {
            return [
                'success' => false,
                'message' => "Energi ultimate {$this->name} belum penuh ({$this->ultimateEnergy}% / 100%)!"
            ];
        }

        // Eksekusi ultimate
        $result = $this->ultimateSkill->execute($this, $target);

        if ($result['success']) {
            // Reset ultimate energy ke 0
            $this->ultimateEnergy = 0;
            $result['isUltimate'] = true;
            $result['message'] = "★ ULTIMATE MOVE ★ " . $result['message'];
        }

        return $result;
    }

    /**
     * Memperbarui cooldown skill pada setiap ronde atau detik pertempuran.
     */
    public function tickCooldowns(): void
    {
        foreach ($this->specialSkills as $skill) {
            $skill->reduceCooldown(1);
        }

        if ($this->isStunned) {
            $this->stunDuration--;
            if ($this->stunDuration <= 0) {
                $this->isStunned = false;
                $this->stunDuration = 0;
            }
        }
    }

    /**
     * Memberikan status Stun ke petarung.
     */
    public function applyStun(int $duration = 1): void
    {
        $this->isStunned = true;
        $this->stunDuration = max(1, $duration);
    }

    /**
     * Reset status petarung untuk pertempuran baru.
     */
    public function resetForBattle(): void
    {
        $this->health = $this->maxHealth;
        $this->ultimateEnergy = 0;
        $this->isStunned = false;
        $this->stunDuration = 0;
        $this->attackModifier = 1.0;
        $this->defenseModifier = 1.0;
        $this->speedModifier = 1.0;

        foreach ($this->specialSkills as $skill) {
            $skill->resetCooldown();
        }
        if ($this->ultimateSkill !== null) {
            $this->ultimateSkill->resetCooldown();
        }
    }

    // =========================================================================
    // ENCAPSULATION: Getters and Setters with Validation
    // =========================================================================

    public function getName(): string
    {
        return $this->name;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getHealth(): int
    {
        return $this->health;
    }

    public function setHealth(int $health): void
    {
        // Enkapsulasi: HP dibatasi antara 0 dan maxHealth
        $this->health = min($this->maxHealth, max(0, $health));
    }

    public function getMaxHealth(): int
    {
        return $this->maxHealth;
    }

    public function setMaxHealth(int $maxHealth): void
    {
        $this->maxHealth = max(100, $maxHealth);
        $this->health = min($this->health, $this->maxHealth);
    }

    public function getAttack(): int
    {
        return $this->attack;
    }

    public function getEffectiveAttack(): float
    {
        return $this->attack * $this->attackModifier;
    }

    public function setAttack(int $attack): void
    {
        $this->attack = max(1, $attack);
    }

    public function getDefense(): int
    {
        return (int) round($this->defense * $this->defenseModifier);
    }

    public function setDefense(int $defense): void
    {
        $this->defense = max(1, $defense);
    }

    public function getSpeed(): int
    {
        return (int) round($this->speed * $this->speedModifier);
    }

    public function setSpeed(int $speed): void
    {
        $this->speed = max(1, $speed);
    }

    public function getUltimateEnergy(): int
    {
        return $this->ultimateEnergy;
    }

    public function setUltimateEnergy(int $energy): void
    {
        $this->ultimateEnergy = min(100, max(0, $energy));
    }

    public function isAlive(): bool
    {
        return $this->health > 0;
    }

    public function isStunned(): bool
    {
        return $this->isStunned;
    }

    public function getSpecialSkills(): array
    {
        return $this->specialSkills;
    }

    public function getUltimateSkill(): ?Skill
    {
        return $this->ultimateSkill;
    }

    public function getPassiveName(): string
    {
        return $this->passiveName;
    }

    public function getPassiveDescription(): string
    {
        return $this->passiveDescription;
    }

    public function getSpriteId(): string
    {
        return $this->spriteId;
    }

    public function getColorPalette(): array
    {
        return $this->colorPalette;
    }

    public function setAttackModifier(float $mod): void
    {
        $this->attackModifier = max(0.2, min(3.0, $mod));
    }

    public function setDefenseModifier(float $mod): void
    {
        $this->defenseModifier = max(0.2, min(3.0, $mod));
    }

    public function setSpeedModifier(float $mod): void
    {
        $this->speedModifier = max(0.2, min(3.0, $mod));
    }

    /**
     * Mengembalikan seluruh statistik karakter dalam format array asosiatif (mudah dikonversi ke JSON).
     */
    public function getStats(): array
    {
        $skillsData = [];
        foreach ($this->specialSkills as $skill) {
            $skillsData[] = $skill->toArray();
        }

        return [
            'name' => $this->name,
            'title' => $this->title,
            'description' => $this->description,
            'health' => $this->health,
            'maxHealth' => $this->maxHealth,
            'attack' => $this->attack,
            'defense' => $this->defense,
            'speed' => $this->speed,
            'ultimateEnergy' => $this->ultimateEnergy,
            'isAlive' => $this->isAlive(),
            'isStunned' => $this->isStunned,
            'specialSkills' => $skillsData,
            'ultimateSkill' => $this->ultimateSkill ? $this->ultimateSkill->toArray() : null,
            'passive' => [
                'name' => $this->passiveName,
                'description' => $this->passiveDescription
            ],
            'spriteId' => $this->spriteId,
            'colorPalette' => $this->colorPalette
        ];
    }
}
