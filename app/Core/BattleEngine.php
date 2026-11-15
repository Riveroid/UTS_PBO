<?php
declare(strict_types=1);

namespace MBG\Core;

use MBG\Arenas\Arena;
use MBG\Interfaces\FighterInterface;

/**
 * Class BattleEngine
 * Mesin utama pengatur alur pertarungan, validasi aksi, eksekusi giliran, dan penentuan kemenangan.
 */
class BattleEngine
{
    private Fighter $player1;
    private Fighter $player2;
    private Arena $arena;
    private string $gameMode; // 'pvai', 'pvp', 'training'
    private string $difficulty; // 'easy', 'normal', 'hard'
    private int $timerSeconds;
    private int $turnCount;
    private array $combatLog = [];
    
    // Telemetry & Statistics
    private int $p1TotalDamage = 0;
    private int $p2TotalDamage = 0;
    private int $p1Hits = 0;
    private int $p2Hits = 0;
    private int $p1Combo = 0;
    private int $p2Combo = 0;
    private int $p1HighestCombo = 0;
    private int $p2HighestCombo = 0;
    private int $p1SkillsUsed = 0;
    private int $p2SkillsUsed = 0;
    private ?string $winner = null;
    private bool $isGameOver = false;

    public function __construct(
        Fighter $player1,
        Fighter $player2,
        ?Arena $arena = null,
        string $gameMode = 'pvai',
        string $difficulty = 'normal',
        int $timerSeconds = 99
    ) {
        $this->player1 = $player1;
        $this->player2 = $player2;
        $this->arena = $arena ?: Arena::getAllArenas()[0];
        $this->gameMode = $gameMode;
        $this->difficulty = $difficulty;
        $this->timerSeconds = $timerSeconds;
        $this->turnCount = 1;

        $this->combatLog[] = [
            'type' => 'announcement',
            'message' => "Pertarungan Dimulai! {$this->player1->getName()} VS {$this->player2->getName()} di {$this->arena->getName()}!"
        ];
    }

    /**
     * Mengeksekusi aksi dari salah satu petarung ('p1' atau 'p2').
     */
    public function executeAction(string $actorKey, string $action, array $params = []): array
    {
        if ($this->isGameOver) {
            return [
                'success' => false,
                'message' => "Pertandingan telah selesai. Pemenang: {$this->winner}!"
            ];
        }

        $actor = ($actorKey === 'p1') ? $this->player1 : $this->player2;
        $opponent = ($actorKey === 'p1') ? $this->player2 : $this->player1;

        $result = [];

        switch ($action) {
            case 'attack':
                $result = $actor->attack($opponent);
                if ($result['success']) {
                    if ($actorKey === 'p1') {
                        $this->p1Hits++;
                        $this->p1Combo++;
                        $this->p1HighestCombo = max($this->p1HighestCombo, $this->p1Combo);
                        $this->p1TotalDamage += $result['finalDamage'];
                    } else {
                        $this->p2Hits++;
                        $this->p2Combo++;
                        $this->p2HighestCombo = max($this->p2HighestCombo, $this->p2Combo);
                        $this->p2TotalDamage += $result['finalDamage'];
                    }
                }
                break;

            case 'special_1':
                $result = $actor->useSpecialSkill(0, $opponent);
                if ($result['success']) {
                    if ($actorKey === 'p1') {
                        $this->p1SkillsUsed++;
                        $this->p1TotalDamage += $result['damageDealt'];
                    } else {
                        $this->p2SkillsUsed++;
                        $this->p2TotalDamage += $result['damageDealt'];
                    }
                }
                break;

            case 'special_2':
                $result = $actor->useSpecialSkill(1, $opponent);
                if ($result['success']) {
                    if ($actorKey === 'p1') {
                        $this->p1SkillsUsed++;
                        $this->p1TotalDamage += $result['damageDealt'];
                    } else {
                        $this->p2SkillsUsed++;
                        $this->p2TotalDamage += $result['damageDealt'];
                    }
                }
                break;

            case 'ultimate':
                $result = $actor->useUltimateSkill($opponent);
                if ($result['success']) {
                    if ($actorKey === 'p1') {
                        $this->p1SkillsUsed++;
                        $this->p1TotalDamage += $result['damageDealt'];
                    } else {
                        $this->p2SkillsUsed++;
                        $this->p2TotalDamage += $result['damageDealt'];
                    }
                }
                break;

            default:
                return ['success' => false, 'message' => "Aksi tidak dikenali."];
        }

        // Catat ke log
        if (isset($result['message'])) {
            $this->combatLog[] = [
                'turn' => $this->turnCount,
                'actor' => $actor->getName(),
                'action' => $action,
                'message' => $result['message']
            ];
        }

        // Mode Training: Regenerasi HP lawan agar tidak pernah kalah permanen
        if ($this->gameMode === 'training' && $opponent->getHealth() < 200) {
            $opponent->heal(1000);
            $this->combatLog[] = [
                'type' => 'training_event',
                'message' => "[Training Mode] HP {$opponent->getName()} dipulihkan kembali ke 100%!"
            ];
        }

        // Periksa kondisi kemenangan (kecuali training mode)
        if ($this->gameMode !== 'training') {
            $this->checkVictoryConditions();
        }

        // Perbarui cooldown
        $actor->tickCooldowns();
        $this->turnCount++;

        // Jika mode Player VS AI dan aktornya adalah P1, picu giliran AI
        $aiResult = null;
        if ($this->gameMode === 'pvai' && $actorKey === 'p1' && !$this->isGameOver) {
            $aiAction = $this->computeAiMove();
            $aiResult = $this->executeAction('p2', $aiAction['action']);
        }

        return [
            'playerAction' => $result,
            'aiAction' => $aiResult,
            'battleState' => $this->getBattleState()
        ];
    }

    /**
     * Menghitung keputusan langkah AI berdasarkan status HP, energi, cooldown, dan tingkat kesulitan
     */
    public function computeAiMove(): array
    {
        $ai = $this->player2;
        $human = $this->player1;
        $diff = strtolower($this->difficulty);

        // 1. TINGKAT KESULITAN HARD (BRUTAL / EXPERT):
        // Memaksimalkan damage, menggunakan jurus begitu cooldown selesai, dan eksekusi instan
        if ($diff === 'hard') {
            if ($ai->getUltimateEnergy() >= 100) {
                return ['action' => 'ultimate'];
            }

            $specialSkills = $ai->getSpecialSkills();
            // Jika darah pemain sekarat (< 25%), prioritaskan jurus dengan damage terbesar
            if (isset($specialSkills[1]) && $specialSkills[1]->isReady()) {
                return ['action' => 'special_2'];
            }
            if (isset($specialSkills[0]) && $specialSkills[0]->isReady()) {
                return ['action' => 'special_1'];
            }
            return ['action' => 'attack'];
        }

        // 2. TINGKAT KESULITAN EASY (PEMULA):
        // Lebih pasif, jarang menggunakan jurus, memberi ruang bagi pemain pemula
        if ($diff === 'easy') {
            if ($ai->getUltimateEnergy() >= 100 && mt_rand(1, 100) <= 35) {
                return ['action' => 'ultimate'];
            }

            $specialSkills = $ai->getSpecialSkills();
            if (isset($specialSkills[1]) && $specialSkills[1]->isReady() && mt_rand(1, 100) <= 25) {
                return ['action' => 'special_2'];
            }
            if (isset($specialSkills[0]) && $specialSkills[0]->isReady() && mt_rand(1, 100) <= 30) {
                return ['action' => 'special_1'];
            }
            return ['action' => 'attack'];
        }

        // 3. TINGKAT KESULITAN NORMAL (STANDAR):
        // Keseimbangan antara strategi dan tantangan yang adil
        if ($ai->getUltimateEnergy() >= 100 && mt_rand(1, 100) <= 85) {
            return ['action' => 'ultimate'];
        }

        $specialSkills = $ai->getSpecialSkills();
        if (isset($specialSkills[1]) && $specialSkills[1]->isReady() && mt_rand(1, 100) <= 60) {
            return ['action' => 'special_2'];
        }

        if (isset($specialSkills[0]) && $specialSkills[0]->isReady() && mt_rand(1, 100) <= 70) {
            return ['action' => 'special_1'];
        }

        return ['action' => 'attack'];
    }

    /**
     * Memeriksa kondisi kemenangan pertandingan
     */
    private function checkVictoryConditions(): void
    {
        if (!$this->player1->isAlive() && !$this->player2->isAlive()) {
            $this->isGameOver = true;
            $this->winner = 'DRAW';
            $this->combatLog[] = ['type' => 'game_over', 'message' => "PERTANDINGAN BERAKHIR SERI (DOUBLE K.O.)!"];
        } elseif (!$this->player2->isAlive()) {
            $this->isGameOver = true;
            $this->winner = $this->player1->getName();
            $this->combatLog[] = ['type' => 'game_over', 'message' => "K.O.! {$this->player1->getName()} MEMENANGKAN PERTANDINGAN!"];
        } elseif (!$this->player1->isAlive()) {
            $this->isGameOver = true;
            $this->winner = $this->player2->getName();
            $this->combatLog[] = ['type' => 'game_over', 'message' => "K.O.! {$this->player2->getName()} MEMENANGKAN PERTANDINGAN!"];
        }
    }

    /**
     * Mengembalikan snapshot status terkini pertarungan
     */
    public function getBattleState(): array
    {
        return [
            'player1' => $this->player1->getStats(),
            'player2' => $this->player2->getStats(),
            'arena' => $this->arena->toArray(),
            'gameMode' => $this->gameMode,
            'difficulty' => $this->difficulty,
            'turnCount' => $this->turnCount,
            'isGameOver' => $this->isGameOver,
            'winner' => $this->winner,
            'statistics' => [
                'p1' => [
                    'totalDamage' => $this->p1TotalDamage,
                    'hits' => $this->p1Hits,
                    'highestCombo' => $this->p1HighestCombo,
                    'skillsUsed' => $this->p1SkillsUsed
                ],
                'p2' => [
                    'totalDamage' => $this->p2TotalDamage,
                    'hits' => $this->p2Hits,
                    'highestCombo' => $this->p2HighestCombo,
                    'skillsUsed' => $this->p2SkillsUsed
                ]
            ],
            'recentLogs' => array_slice($this->combatLog, -8)
        ];
    }

    public function getPlayer1(): Fighter { return $this->player1; }
    public function getPlayer2(): Fighter { return $this->player2; }
    public function getArena(): Arena { return $this->arena; }
    public function getGameMode(): string { return $this->gameMode; }
    public function setGameMode(string $mode): void
    {
        $this->gameMode = in_array($mode, ['pvai', 'pvp', 'training'], true) ? $mode : 'pvai';
    }
}

