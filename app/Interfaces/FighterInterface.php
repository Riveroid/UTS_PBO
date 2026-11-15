<?php
declare(strict_types=1);

namespace MBG\Interfaces;

/**
 * Interface FighterInterface
 * Kontrak standar untuk seluruh karakter petarung di game MBG.
 */
interface FighterInterface
{
    public function getName(): string;
    public function getTitle(): string;
    public function getHealth(): int;
    public function getMaxHealth(): int;
    public function getAttack(): int;
    public function getDefense(): int;
    public function getSpeed(): int;
    public function getUltimateEnergy(): int;
    public function isAlive(): bool;
    public function isStunned(): bool;
    
    public function attack(FighterInterface $target): array;
    public function takeDamage(int $damage): int;
    public function heal(int $amount): int;
    public function addEnergy(int $amount): void;
    public function useSpecialSkill(int $skillIndex, FighterInterface $target): array;
    public function useUltimateSkill(FighterInterface $target): array;
    public function activatePassive(): array;
    public function getStats(): array;
    public function resetForBattle(): void;
}

