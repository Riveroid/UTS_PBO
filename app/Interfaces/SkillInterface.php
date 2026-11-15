<?php
declare(strict_types=1);

namespace MBG\Interfaces;

/**
 * Interface SkillInterface
 * Kontrak standar untuk skill khusus dan ultimate pada game MBG.
 */
interface SkillInterface
{
    public function getName(): string;
    public function getDescription(): string;
    public function getCooldown(): int;
    public function getCurrentCooldown(): int;
    public function isReady(): bool;
    public function triggerCooldown(): void;
    public function reduceCooldown(int $turns = 1): void;
    public function resetCooldown(): void;
    public function getEnergyCost(): int;
    public function execute(FighterInterface $caster, FighterInterface $target): array;
}

