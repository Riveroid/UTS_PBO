<?php
declare(strict_types=1);

namespace MBG\Characters;

use MBG\Core\Fighter;
use MBG\Interfaces\FighterInterface;
use MBG\Skills\Skill;

/**
 * Class Tifuzia
 * Julukan: The Diploma Inspector
 * Karakter vokal berjas toga yang menyerang dengan lontaran pertanyaan kritis, bukti dokumen, dan gelombang suara.
 */
class Tifuzia extends Fighter
{
    // =========================================================================
    // ENCAPSULATION: 5 Atribut Spesifik Child Class
    // =========================================================================
    private int $diplomaInspectionCount = 0;
    private int $scoldingDecibels = 85;
    private bool $courtSessionActive = false;
    private array $interrogationQuestions = [
        "Mana berkas aslinya?!",
        "Di mana legalisir basahnya?!",
        "Kapan sidang skripsinya?!"
    ];
    private float $mentalDamageRatio = 1.2;

    public function __construct()
    {
        parent::__construct(
            name: 'Tifuzia',
            title: 'The Diploma Inspector',
            description: 'Karakter vokal yang menuntut transparansi akademik dengan serangan berbasis argumentasi hukum dan pertanyaan pedas.',
            health: 980,
            attack: 82,
            defense: 36,
            speed: 60,
            spriteId: 'tifuzia',
            colorPalette: ['#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4']
        );

        $this->passiveName = 'Noise Pollution';
        $this->passiveDescription = 'Serangan verbal memiliki peluang 25% mengganggu konsentrasi lawan dan mengurangi attack lawan sebesar 15%.';
    }

    public function initSkills(): void
    {
        // Special Skill 1: MANA IJAZAH?
        $this->specialSkills[] = new Skill(
            name: 'Mana Ijazah?',
            description: 'Melontarkan pertanyaan audit tajam yang memberikan damage mental dan memperlambat pergerakan musuh sebesar 30%.',
            cooldown: 3,
            energyCost: 0,
            damageMultiplier: 1.5,
            effectType: 'slow',
            effectValue: 0.30,
            visualEffect: 'diploma_scroll',
            soundEffect: 'question_bubble'
        );

        // Special Skill 2: BACOT OVERLOAD
        $this->specialSkills[] = new Skill(
            name: 'Bacot Overload',
            description: 'Melancarkan rentetan omelan beruntun berfrekuensi tinggi yang memunculkan gelembung teks raksasa.',
            cooldown: 4,
            energyCost: 0,
            damageMultiplier: 1.8,
            effectType: 'multi_hit',
            effectValue: 3.0,
            visualEffect: 'speech_bubbles',
            soundEffect: 'rapid_scold'
        );

        // Ultimate Skill: SIDANG TERBUKA
        $this->ultimateSkill = new Skill(
            name: 'Sidang Terbuka',
            description: 'Mengubah arena menjadi ruang sidang terbuka, menghujani lawan dengan palu sidang dan pertanyaan audit yang membuat lawan STUN!',
            cooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.7,
            effectType: 'stun',
            effectValue: 1.0, // Stun 1 ronde
            visualEffect: 'courtroom_gavel',
            soundEffect: 'gavel_bang'
        );
    }

    // =========================================================================
    // 4 Method Unik Child Class Tifuzia
    // =========================================================================

    /**
     * Method Unik 1: Melakukan inspeksi dokumen ijazah
     */
    public function inspectDiploma(FighterInterface $target): string
    {
        $this->diplomaInspectionCount++;
        $randomQ = $this->interrogationQuestions[array_rand($this->interrogationQuestions)];
        return "Tifuzia memeriksa berkas {$target->getName()}: '{$randomQ}' (Inspeksi ke-{$this->diplomaInspectionCount})";
    }

    /**
     * Method Unik 2: Meningkatkan desibel suara omelan
     */
    public function increaseDecibels(int $amount = 10): int
    {
        $this->scoldingDecibels = min(140, $this->scoldingDecibels + $amount);
        $this->attackModifier = 1.0 + (($this->scoldingDecibels - 85) / 200.0);
        return $this->scoldingDecibels;
    }

    /**
     * Method Unik 3: Membuka sesi sidang terbuka di arena
     */
    public function openCourtSession(): void
    {
        $this->courtSessionActive = true;
        $this->setDefenseModifier(1.3);
    }

    /**
     * Method Unik 4: Mengembalikan catatan riwayat audit interogasi
     */
    public function getAuditLog(): array
    {
        return [
            'inspectionCount' => $this->diplomaInspectionCount,
            'currentDecibels' => $this->scoldingDecibels,
            'courtActive' => $this->courtSessionActive,
            'questionPool' => $this->interrogationQuestions
        ];
    }

    /**
     * Polimorfisme: Override attack() untuk menyertakan efek pasif Noise Pollution
     */
    public function attack(FighterInterface $target): array
    {
        $result = parent::attack($target);
        if ($result['success']) {
            // Peluang 25% memicu pasif Noise Pollution
            if (mt_rand(1, 100) <= 25) {
                if ($target instanceof Fighter) {
                    $target->setAttackModifier(0.85); // Debuff attack 15%
                }
                $result['message'] .= " [Passive Noise Pollution: Lawan terdistraksi, Attack berkurang 15%!]";
            }
        }
        return $result;
    }

    public function activatePassive(): array
    {
        return [
            'triggered' => true,
            'name' => $this->passiveName,
            'message' => 'Noise Pollution mengacaukan konsentrasi musuh melalui frekuensi suara tinggi.'
        ];
    }

    public function getSpecialAbilityDescription(): string
    {
        return "Tifuzia melumpuhkan lawan lewat serangan vokal desibel tinggi dan interogasi sidang terbuka.";
    }

    public function getScoldingDecibels(): int { return $this->scoldingDecibels; }
    public function getDiplomaInspectionCount(): int { return $this->diplomaInspectionCount; }
}

