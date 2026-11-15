# MBG: MOBILE BATTLE GOVERNMENT
### Game Fighting 2D Arcade Berbasis Object-Oriented Programming (OOP) PHP 8.3
**Tugas Ujian Tengah Semester (UTS) Mata Kuliah Pemrograman Berorientasi Objek**  
**Program Studi Teknik Informatika, Fakultas Sains dan Teknologi**  
**Universitas Muhammadiyah Sukabumi (UMMI) - Tahun Akademik 2026/2027**

---

## 👥 IDENTITAS KELOMPOK 1 LMS

- **Dosen Pengampu:** Prajoko, M.Kom.
- **Mata Kuliah:** Pemrograman Berorientasi Objek (PBO)
- **Anggota Kelompok:**
  1. **Muhamad Mulqi Adiyat Abdilah Ruswandi** (NIM: `2530521082`) - *Ketua Kelompok*
  2. **Akazasa Sitanala** (NIM: `2530521088`)
  3. **Ahmi Sulaeman** (NIM: `2530521083`)
  4. **Muhammad Kirei Abdillah** (NIM: `2530521075`)
  5. **Mochammad Fauzan Dzakwan Rahadian** (NIM: `2530521074`)

---

## 🎮 TENTANG GAME MBG

**MBG: MOBILE BATTLE GOVERNMENT** adalah permainan aksi pertarungan 2D (*arcade fighting game*) berkecepatan 60 frame per detik yang mengombinasikan mekanisme klasik pertarungan duel (terinspirasi dari fighting game legendaris seperti *Tekken* dan *Street Fighter*) dengan tema satire orisinal birokrasi pemerintahan fiktif.

Game ini dikembangkan sebagai media pembuktian nyata penerapan konsep **Object-Oriented Programming (OOP)** pada bahasa pemrograman modern **PHP 8.3**. Seluruh komputasi statistik, inisialisasi karakter, kalkulasi damage, formula mitigasi pertahanan, manajemen energi ultimate, dan penegakan cooldown jurus ditenagai langsung oleh backend PHP sebagai **Single Source of Truth** melalui arsitektur REST JSON API.

---

## 🌟 FITUR UTAMA SISTEM

1. **5 Karakter Petarung Orisinal (Roster Hero):**
   - **Bahlul (The Goblin Summoner):** Petarung mistis ber-HP tebal (1150 HP) dengan jurus *Tsunami Etanol*, *Goblin Summon* (memanggil minion goblin hijau ke arena), dan Ultimate *Goblin Apocalypse*. Pasif: *Goblin Power* (+5% akumulasi energi).
   - **Tifuzia (The Diploma Inspector):** Petarung berkecepatan tinggi dengan jurus audit hukum *Mana Ijazah?*, *Bacot Overload* (gelombang teks multi-hit), dan Ultimate *Sidang Terbuka* (efek stun palu pengadilan). Pasif: *Noise Pollution*.
   - **Brown Teddy (The Affection Attacker):** Tanker berdaya tahan tertinggi (1200 HP, 55 DEF) dengan jurus *Kiss Attack*, *Teddy Hug*, dan Ultimate *Love Bomb*. Pasif: *Attention Seeker* (+50% bonus defense saat HP kritis <30%).
   - **Fufufifi (The Government Critic):** Demonstran aktivis pembela rakyat dengan jurus orasi *Kritik Tajam* (menghancurkan defense lawan -25%), *Aspirasi Rakyat* (knockback masif), dan Ultimate *Revolusi Argumen*. Pasif: *Voice of People*.
   - **Wili Wonka (The Viral Opportunist):** Petarung terlincah (Speed 68) dengan jurus *Chocolate Lick* (self-heal 45 HP + 20% Attack buff), *Jilat Panggung*, dan Ultimate *Viral Moment*. Pasif: *FYP Hunter*.

2. **4 Arena Pertarungan Tematik:**
   - 🏛 *Ruang Sidang Paripurna* (Gedung DPR berkarpet merah dan lambang negara).
   - 🗽 *Bundaran Demokrasi* (Monumen tugu obelisk kota saat senja).
   - 📺 *Studio Panggung Viral* (Panggung lampu sorot dan video wall LED).
   - 🧪 *Lembah Etanol Hijau* (Lembah kimia bioluminescent dengan uap gas hijau).

3. **3 Mode Permainan:**
   - ⚔️ **1P VS CPU (Arcade):** Bertarung melawan algoritma kecerdasan buatan (AI) yang dinamis.
   - 👥 **1P VS 2P (Local Dual Play):** Bermain berdua dalam satu keyboard dengan tombol kontrol independen.
   - 🥋 **Training Dojo:** Arena latihan tanpa batas waktu dan regenerasi HP otomatis untuk menguji combo.

4. **Engine Audio & Visual Mandiri (Zero External Dependency):**
   - *Procedural Pixel Art Renderer:* Karakter, animasi langkah, pukulan, efek stun, dan partikel digambar langsung pada HTML5 Canvas 2D.
   - *Web Audio Synthesizer:* Efek suara 8-bit (pukulan, swing, ledakan, gong KO, fanfare kemenangan, dan BGM chiptune) disintesis secara matematis tanpa dependensi file eksternal.
   - *CRT Scanline Filter:* Efek layar tabung arcade retro yang dapat diaktifkan/dinonaktifkan secara instan.

5. **Wireless Smartphone Controller (Dual QR Codes & Real-Time WebSocket):**
   - Mendukung kontrol ganda: bermain menggunakan keyboard laptop lokal ATAU smartphone Android/iOS secara nirkabel (*wireless gamepad*).
   - Menampilkan **2 QR Code mandiri** di antarmuka game (Player 1 - Biru & Player 2 - Merah). Cukup scan via kamera HP untuk langsung terhubung.
   - Ditenagai server WebSocket murni PHP 8.3 OOP (`MBG\Core\WebSocketServer`) tanpa library eksternal dengan latensi instan (<5ms).
   - Dilengkapi *Multi-touch Virtual D-Pad*, tombol aksi arcade responsif, tombol layar penuh (*Fullscreen*), dan *Haptic Vibration Feedback* saat terkena damage atau melancarkan jurus.

---

## 🏛 PENERAPAN PRINSIP PEMROGRAMAN BERORIENTASI OBJEK (OOP)

Proyek MBG menerapkan empat pilar utama OOP secara terstruktur:

1. **Abstraksi (Abstraction):**
   - Mendefinisikan kontrak interface `FighterInterface` dan kelas abstrak `abstract class Fighter` di namespace `MBG\Core`.
   - Memaksa setiap child class mengimplementasikan method abstrak `activatePassive()` dan `getSpecialAbilityDescription()`.
2. **Enkapsulasi (Encapsulation):**
   - Seluruh properti inti (`health`, `maxHealth`, `defense`, `attack`, `ultimateEnergy`) dideklarasikan dengan visibilitas `protected` atau `private`.
   - Data hiding dan boundary checking: Nilai HP divalidasi `min($maxHealth, max(0, $health))` sehingga tidak pernah bernilai negatif saat menerima massive damage, dan heal tidak melebihi kapasitas maksimum. Energi ultimate terkunci dalam rentang 0-100%.
3. **Pewarisan (Inheritance):**
   - Kelima karakter (`Bahlul`, `Tifuzia`, `BrownTeddy`, `Fufufifi`, `WiliWonka`) mewarisi fungsionalitas dasar `Fighter` menggunakan kata kunci `extends`.
   - Masing-masing kelas anak menambahkan minimal 5 atribut spesifik dan 4 method operasional unik.
4. **Polimorfisme (Polymorphism):**
   - Setiap kelas anak melakukan *Method Overriding* pada method `attack(FighterInterface $target)` untuk menyematkan efek pasif uniknya sendiri.
   - Kelas `BattleEngine` mengeksekusi serangan secara polimorfis melalui kontrak antarmuka tanpa perlu mengetahui tipe konkret kelas anak.
5. **Factory Pattern:**
   - Kelas `CharacterFactory` menginstansiasi objek petarung secara dinamis menggunakan ekspresi `match` modern di PHP 8.3.

---

## 📁 STRUKTUR DIREKTORI PROJECT

```
MBG/
├── app/
│   ├── Arenas/
│   │   └── Arena.php              # Definisi 4 arena tematik
│   ├── Characters/
│   │   ├── Bahlul.php             # Child Class: The Goblin Summoner
│   │   ├── BrownTeddy.php         # Child Class: The Affection Attacker
│   │   ├── Fufufifi.php           # Child Class: The Government Critic
│   │   ├── Tifuzia.php            # Child Class: The Diploma Inspector
│   │   └── WiliWonka.php          # Child Class: The Viral Opportunist
│   ├── Core/
│   │   ├── BattleEngine.php       # Mesin utama alur tempur & AI
│   │   ├── CharacterFactory.php   # Factory pattern instansiasi petarung
│   │   ├── DamageCalculator.php   # Formula matematis damage & mitigasi
│   │   ├── Fighter.php            # Abstract Parent Class petarung
│   │   ├── GameManager.php        # State pertempuran & session manager
│   │   └── WebSocketServer.php    # Server WebSocket RFC 6455 murni PHP OOP
│   ├── Interfaces/
│   │   ├── FighterInterface.php   # Kontrak operasional fighter
│   │   └── SkillInterface.php     # Kontrak eksekusi skill
│   └── Skills/
│       └── Skill.php              # Entitas concrete skill & cooldown
│
├── docs/
│   ├── assets/                    # Logo kampus & tangkapan layar antarmuka
│   ├── Laporan_Praktikum_MBG.docx # Laporan praktikum akademik lengkap (Word)
│   ├── Laporan_Praktikum_MBG.pdf  # Ekspor PDF resmi laporan praktikum
│   ├── Naskah_Video_Presentasi_MBG.docx # Naskah 2-Column AV Script video presentasi
│   └── Naskah_Video_Presentasi_MBG.pdf  # Ekspor PDF resmi naskah presentasi
│
├── public/
│   ├── api/
│   │   ├── arenas.php             # REST API daftar arena
│   │   ├── battle.php             # REST API eksekusi aksi tempur
│   │   ├── characters.php         # REST API statistik 5 karakter
│   │   └── network.php            # REST API auto-detect IP LAN server
│   ├── css/
│   │   └── style.css              # Styling neon retro arcade cabinet
│   ├── js/
│   │   ├── audio.js               # Web Audio API 8-bit sound synthesizer
│   │   ├── game.js                # Game loop & API orchestrator
│   │   ├── qrcode.min.js          # Generator QR code offline mandiri
│   │   ├── renderer.js            # Backdrop arena & partikel renderer
│   │   └── sprites.js             # Procedural Canvas 2D sprite generator
│   ├── controller.html            # Antarmuka Gamepad Wireless HP Android
│   └── index.html                 # Antarmuka game web interaktif
│
├── tests/
│   └── test_oop.php               # Suite pengujian otomatis CLI (33 assertions)
│
├── bootstrap.php                  # PSR-4 autoloader & session bootstrap
├── composer.json                  # Metadata package & autoloader config
├── run_game.bat                   # Skrip 1-klik Windows (Web Server + WebSocket)
├── run_game.sh                    # Skrip 1-klik Linux / macOS
├── server_ws.php                  # Runner WebSocket Controller Server
└── README.md                      # Dokumentasi komprehensif project
```

---

## ⚙️ PERSYARATAN SISTEM (SYSTEM REQUIREMENTS)

1. **PHP:** Versi 8.2 ke atas (Direkomendasikan PHP 8.3+).
2. **Web Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau browser berbasis Chromium terkini dengan dukungan HTML5 Canvas dan Web Audio API.
3. **OS:** Windows 10/11, Linux, atau macOS.

---

## 🚀 PANDUAN INSTALASI & MENJALANKAN APLIKASI

### Cara 1: Menjalankan Sekali Klik (Windows Batch Script):
Cukup klik ganda file `run_game.bat` pada direktori root project. Skrip akan otomatis:
1. Memulai PHP built-in web server pada `http://localhost:8000`.
2. Membuka peramban default langsung ke antarmuka permainan `http://localhost:8000/?page=menu`.

### Cara 2: Menjalankan Manual Melalui Terminal:
Buka terminal (PowerShell / Command Prompt / Bash), arahkan ke direktori project, lalu jalankan built-in web server PHP:

```bash
cd "D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG"
php -S localhost:8000 -t public
```

Buka peramban web dan akses URL:
```
http://localhost:8000/?page=menu
```

### Navigasi URL GET Parameters (State Persistence):
Game mendukung navigasi berbasis URL parameter sehingga status sesi tetap aman saat direfresh (`F5`):
- Menu Utama: `http://localhost:8000/?page=menu`
- Pemilihan Karakter: `http://localhost:8000/?page=select&mode=pvai`
- Arena Pertarungan: `http://localhost:8000/?page=battle&p1=bahlul&p2=tifuzia&arena=ruang_sidang&mode=pvai`

### Menjalankan Unit Test OOP (Pengujian Otomatis):
Untuk memverifikasi seluruh integritas 4 pilar OOP dan perhitungan matematika pertarungan:

```bash
php tests/test_oop.php
```

Output pengujian akan menampilkan status kelulusan **33 dari 33 pengujian sukses (100% PASS)** tanpa error.

---

## 🎮 PANDUAN KONTROL KEYBOARD (HOW TO PLAY)

| Aksi Pertarungan | Player 1 (Kiri) | Player 2 (Kanan / PvP) |
|---|:---:|:---:|
| **Bergerak Kiri / Kanan** | `A` / `D` | `←` / `→` atau Numpad `4` / `6` |
| **Lompat (Airborne Jump)** | `W` / `Spasi` | `↑` atau Numpad `8` |
| **Jongkok (Crouch / Sneak)** | `S` | `↓` atau Numpad `5` |
| **Basic Attack (Pukulan Ringan)** | `J` | `Numpad 1` / `1` / `I` |
| **Special Skill 1** | `K` | `Numpad 2` / `2` / `O` |
| **Special Skill 2** | `L` | `Numpad 3` / `3` / `P` |
| **Ultimate Move (100% Energi)** | `U` | `Numpad 0` / `0` / `[` |

---

## 📊 HASIL PENGUJIAN OTOMATIS (TEST RESULTS)

| No | Kategori Pengujian PBO | Jumlah Uji | Hasil Verifikasi | Status |
|:---:|---|:---:|---|:---:|
| 1 | Instansiasi Objek (Instantiation) | 5 | 5 Karakter terinstansiasi dengan stats valid | **PASS** |
| 2 | Pewarisan Kelas (Inheritance) | 5 | 5 Karakter terbukti `instanceof Fighter` | **PASS** |
| 3 | Enkapsulasi & Data Hiding | 4 | HP tidak minus, heal terkunci max, energi 0-100% | **PASS** |
| 4 | Method Overriding | 1 | `Bahlul::attack()` mengeksekusi pasif energi (+5%) | **PASS** |
| 5 | Polimorfisme (Polymorphic Calls) | 5 | Eksekusi attack seragam via referensi parent | **PASS** |
| 6 | Cooldown & Batas Energi | 5 | Cooldown menolak spam, ultimate butuh 100% energi | **PASS** |
| 7 | Formula Damage & Mitigasi Defense | 1 | Defense tinggi menerima damage lebih kecil | **PASS** |
| 8 | Alur Pertarungan Battle Engine | 3 | Eksekusi giliran turn, combo counter, dan battle log | **PASS** |
| 9 | Integrasi Arena Pertarungan | 2 | 4 Arena terverifikasi dengan tema mandiri | **PASS** |
| 10 | Kondisi Kemenangan & K.O. | 2 | Deteksi K.O. saat HP 0 dan pencatatan pemenang | **PASS** |
| **TOTAL** | **Seluruh Kategori Pengujian** | **33** | **Tingkat Kelulusan Sistem: 100%** | **SUCCESS** |

---

## 📄 DOKUMEN AKADEMIK TERSEDIA

1. **Laporan Praktikum:**
   - DOCX: `D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\Laporan_Praktikum_MBG.docx`
   - PDF: `D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\Laporan_Praktikum_MBG.pdf`
2. **Naskah Video Presentasi (Two-Column AV Script):**
   - DOCX: `D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\Naskah_Video_Presentasi_MBG.docx`
   - PDF: `D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\Naskah_Video_Presentasi_MBG.pdf`

---
*MBG: Mobile Battle Government © 2026 Kelompok 1 LMS - Teknik Informatika Universitas Muhammadiyah Sukabumi.*

