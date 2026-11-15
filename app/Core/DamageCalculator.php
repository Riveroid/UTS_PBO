<?php
declare(strict_types=1);

namespace MBG\Core;

use MBG\Interfaces\FighterInterface;

/**
 * Class DamageCalculator
 * Bertanggung jawab khusus untuk memproses perhitungan matematis damage pertarungan,
 * mitigasi pertahanan (defense), peluang critical hit, dan pengali combo.
 * (Menerapkan Single Responsibility Principle).
 */
class DamageCalculator
{
    public const CRITICAL_CHANCE_PERCENT = 15;
    public const CRITICAL_MULTIPLIER = 1.5;

    /**
     * Menghitung total damage akhir yang diterima target dari penyerang.
     */
    public static function calculateDamage(
        FighterInterface $attacker,
        FighterInterface $target,
        float $skillMultiplier = 1.0,
        int $comboCount = 0,
        ?bool $forceCritical = null
    ): array {
        $baseAttack = $attacker->getAttack();
        $targetDefense = $target->getDefense();

        // 1. Roll Critical Hit (atau gunakan forceCritical jika ditentukan untuk pengujian)
        $isCritical = $forceCritical !== null ? $forceCritical : (mt_rand(1, 100) <= self::CRITICAL_CHANCE_PERCENT);
        $critBonus = $isCritical ? self::CRITICAL_MULTIPLIER : 1.0;

        // 2. Hitung Pengali Combo (setiap 3 combo +10% damage, maks +50%)
        $comboBonus = 1.0 + min(0.50, floor($comboCount / 3) * 0.10);

        // 3. Raw Damage
        $rawDamage = (int) round($baseAttack * $skillMultiplier * $critBonus * $comboBonus);

        // 4. Formula Mitigasi Pertahanan:
        // Damage Reduction = Defense / (100 + Defense)
        $mitigationRatio = $targetDefense / (100.0 + $targetDefense);
        $finalDamage = (int) max(5, round($rawDamage * (1.0 - $mitigationRatio)));

        return [
            'rawDamage' => $rawDamage,
            'finalDamage' => $finalDamage,
            'isCritical' => $isCritical,
            'comboBonus' => $comboBonus,
            'mitigationPercent' => round($mitigationRatio * 100, 1),
            'targetDefense' => $targetDefense
        ];
    }
}
