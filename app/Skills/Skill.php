<?php
declare(strict_types=1);

namespace MBG\Skills;

use MBG\Interfaces\SkillInterface;
use MBG\Interfaces\FighterInterface;

/**
 * Class Skill
 * Merepresentasikan skill aktif (Special Skill atau Ultimate) karakter.
 */
class Skill implements SkillInterface
{
    protected string $name;
    protected string $description;
    protected int $cooldown;
    protected int $currentCooldown;
    protected int $energyCost;
    protected float $damageMultiplier;
    protected string $effectType;
    protected float $effectValue;
    protected string $visualEffect;
    protected string $soundEffect;

    public function __construct(
        string $name,
        string $description,
        int $cooldown = 3,
        int $energyCost = 0,
        float $damageMultiplier = 1.5,
        string $effectType = 'damage',
        float $effectValue = 0.0,
        string $visualEffect = 'slash',
        string $soundEffect = 'hit_heavy'
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->cooldown = max(0, $cooldown);
        $this->currentCooldown = 0;
        $this->energyCost = max(0, $energyCost);
        $this->damageMultiplier = $damageMultiplier;
        $this->effectType = $effectType;
        $this->effectValue = $effectValue;
        $this->visualEffect = $visualEffect;
        $this->soundEffect = $soundEffect;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getCooldown(): int
    {
        return $this->cooldown;
    }

    public function getCurrentCooldown(): int
    {
        return $this->currentCooldown;
    }

    public function isReady(): bool
    {
        return $this->currentCooldown <= 0;
    }

    public function triggerCooldown(): void
    {
        $this->currentCooldown = $this->cooldown;
    }

    public function reduceCooldown(int $turns = 1): void
    {
        if ($this->currentCooldown > 0) {
            $this->currentCooldown = max(0, $this->currentCooldown - $turns);
        }
    }

    public function resetCooldown(): void
    {
        $this->currentCooldown = 0;
    }

    public function getEnergyCost(): int
    {
        return $this->energyCost;
    }

    public function getDamageMultiplier(): float
    {
        return $this->damageMultiplier;
    }

    public function getEffectType(): string
    {
        return $this->effectType;
    }

    public function getEffectValue(): float
    {
        return $this->effectValue;
    }

    public function getVisualEffect(): string
    {
        return $this->visualEffect;
    }

    public function getSoundEffect(): string
    {
        return $this->soundEffect;
    }

    public function execute(FighterInterface $caster, FighterInterface $target): array
    {
        if (!$this->isReady()) {
            return [
                'success' => false,
                'message' => "Skill {$this->name} sedang cooldown ({$this->currentCooldown} ronde)."
            ];
        }

        if ($caster->getUltimateEnergy() < $this->energyCost) {
            return [
                'success' => false,
                'message' => "Energi ultimate tidak mencukupi untuk {$this->name} (butuh {$this->energyCost}%)."
            ];
        }

        // Trigger cooldown
        $this->triggerCooldown();

        // Base damage calculation with multiplier and defense
        $baseAttack = $caster->getAttack();
        $targetDefense = $target->getDefense();
        $rawDamage = (int) round($baseAttack * $this->damageMultiplier);
        
        // Defense formula: reduction = defense / (100 + defense)
        $damageReduction = $targetDefense / (100 + $targetDefense);
        $finalDamage = (int) max(1, round($rawDamage * (1 - $damageReduction)));

        // Apply damage to target
        $actualDamageDealt = $target->takeDamage($finalDamage);

        return [
            'success' => true,
            'skillName' => $this->name,
            'rawDamage' => $rawDamage,
            'damageDealt' => $actualDamageDealt,
            'targetRemainingHealth' => $target->getHealth(),
            'effectType' => $this->effectType,
            'effectValue' => $this->effectValue,
            'visualEffect' => $this->visualEffect,
            'soundEffect' => $this->soundEffect,
            'message' => "{$caster->getName()} menggunakan {$this->name}! Memberikan {$actualDamageDealt} damage ke {$target->getName()}."
        ];
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'cooldown' => $this->cooldown,
            'currentCooldown' => $this->currentCooldown,
            'energyCost' => $this->energyCost,
            'damageMultiplier' => $this->damageMultiplier,
            'effectType' => $this->effectType,
            'effectValue' => $this->effectValue,
            'visualEffect' => $this->visualEffect,
            'soundEffect' => $this->soundEffect,
            'isReady' => $this->isReady()
        ];
    }
}

