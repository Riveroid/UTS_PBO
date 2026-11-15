<?php
declare(strict_types=1);

namespace MBG\Arenas;

/**
 * Class Arena
 * Merepresentasikan arena pertarungan dengan tema, latar belakang visual, dan musik latar.
 */
class Arena
{
    private string $id;
    private string $name;
    private string $description;
    private string $backgroundTheme;
    private array $skyColors;
    private array $groundColors;
    private array $ambientElements;

    public function __construct(
        string $id,
        string $name,
        string $description,
        string $backgroundTheme,
        array $skyColors = ['#0D1B2A', '#1B263B'],
        array $groundColors = ['#415A77', '#778DA9'],
        array $ambientElements = []
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->backgroundTheme = $backgroundTheme;
        $this->skyColors = $skyColors;
        $this->groundColors = $groundColors;
        $this->ambientElements = $ambientElements;
    }

    public static function getAllArenas(): array
    {
        return [
            new self(
                id: 'ruang_sidang',
                name: 'Ruang Sidang Paripurna',
                description: 'Aula megah berkubah hijau dengan jejeran meja rapat anggota dan panggung pimpinan dewan.',
                backgroundTheme: 'parliament_hall',
                skyColors: ['#1A3636', '#40534C'],
                groundColors: ['#677D6A', '#D6EFD8'],
                ambientElements: ['pilar_marmer', 'palu_sidang_raksasa', 'mikrofon_podium']
            ),
            new self(
                id: 'bundaran_demokrasi',
                name: 'Bundaran Demokrasi',
                description: 'Persimpangan jalan ibu kota dengan monumen megah tempat aspirasi rakyat digelorakan di bawah langit malam.',
                backgroundTheme: 'city_square',
                skyColors: ['#10002B', '#240046'],
                groundColors: ['#3C096C', '#5A189A'],
                ambientElements: ['lampu_jalan_neon', 'pohon_bercahaya', 'gedung_pencakar_langit']
            ),
            new self(
                id: 'studio_viral',
                name: 'Studio Panggung Viral',
                description: 'Panggung siaran langsung televisi dengan lampu sorot gemerlap, monitor LED raksasa, dan blitz kamera.',
                backgroundTheme: 'broadcast_studio',
                skyColors: ['#2B0938', '#59114D'],
                groundColors: ['#892268', '#C33C7F'],
                ambientElements: ['kamera_crane', 'lighting_rig', 'layar_livestream']
            ),
            new self(
                id: 'lembah_mistis',
                name: 'Lembah Etanol Hijau',
                description: 'Kawasan industri kimia fiktif penuh uap energi misterius dan bebatuan kristal tempat para goblin berkumpul.',
                backgroundTheme: 'mystic_valley',
                skyColors: ['#0A192F', '#172A45'],
                groundColors: ['#303C55', '#64FFDA'],
                ambientElements: ['tangki_etanol', 'kristal_hijau', 'portal_bayangan']
            )
        ];
    }

    public static function getById(string $id): ?self
    {
        foreach (self::getAllArenas() as $arena) {
            if ($arena->getId() === $id) {
                return $arena;
            }
        }
        return self::getAllArenas()[0]; // Default fallback
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getDescription(): string { return $this->description; }
    public function getBackgroundTheme(): string { return $this->backgroundTheme; }
    public function getSkyColors(): array { return $this->skyColors; }
    public function getGroundColors(): array { return $this->groundColors; }
    public function getAmbientElements(): array { return $this->ambientElements; }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'backgroundTheme' => $this->backgroundTheme,
            'skyColors' => $this->skyColors,
            'groundColors' => $this->groundColors,
            'ambientElements' => $this->ambientElements
        ];
    }
}

