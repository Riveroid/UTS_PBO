import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
OUTPUT_SCRIPT = os.path.join(BASE_DIR, 'Naskah_Video_Presentasi_MBG.docx')

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def style_academic_table(table, col_widths=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tblPr = table._tbl.tblPr
    tblBorders = OxmlElement('w:tblBorders')
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), '64748B')
        tblBorders.append(border)
    tblPr.append(tblBorders)

    # Header Row
    for cell in table.rows[0].cells:
        set_cell_background(cell, 'F1F5F9')
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.bold = True
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10.5)
                run.font.color.rgb = RGBColor(15, 23, 42)

    # Data Rows
    for r_idx, row in enumerate(table.rows[1:], start=1):
        bg = 'FFFFFF' if r_idx % 2 != 0 else 'F8FAFC'
        for cell in row.cells:
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=110, bottom=110, left=150, right=150)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(30, 41, 59)

    if col_widths:
        for row in table.rows:
            for c_idx, w in enumerate(col_widths):
                if c_idx < len(row.cells):
                    row.cells[c_idx].width = w

def add_heading_1(doc, text):
    h = doc.add_heading(text, level=1)
    h.paragraph_format.space_before = Pt(16)
    h.paragraph_format.space_after = Pt(8)
    h.paragraph_format.keep_with_next = True
    for r in h.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)
    return h

def add_p(doc, text, bold_prefix=None, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(space_after)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    return p

def build_script():
    doc = Document()

    # Standard Margins (Top 3cm, Left 4cm, Bottom 3cm, Right 3cm)
    for section in doc.sections:
        section.top_margin = Inches(1.18)    # 3 cm
        section.left_margin = Inches(1.57)   # 4 cm
        section.bottom_margin = Inches(1.18) # 3 cm
        section.right_margin = Inches(1.18)  # 3 cm

    # Logo UMMI
    logo_path = os.path.join(ASSETS_DIR, "logo_ummi.png")
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(12)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.8))

    # Title Banner
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(4)
    r = p_title.add_run("NASKAH VIDEO PRESENTASI & DEMONSTRASI SISTEM\n\"MBG: MOBILE BATTLE GOVERNMENT\"")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("Format: Two-Column Audio-Visual (AV) Script | Target Durasi: 12 - 15 Menit\n"
                          "Mata Kuliah: Pemrograman Berorientasi Objek (PBO) - Semester 3 Teknik Informatika UMMI\n"
                          "Dosen Pengampu: Prajoko, M.Kom.")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(10.5)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Presenter Allocation Table
    add_heading_1(doc, "1. PEMBAGIAN PERAN & TUGAS PRESENTER (5 ANGGOTA)")
    tbl_p = doc.add_table(rows=6, cols=4)
    p_data = [
        ("No", "Nama Mahasiswa (NIM)", "Peran Presenter", "Segmen yang Dibawakan"),
        ("1.", "Muhamad Mulqi Adiyat Abdilah Ruswandi\n(2530521082) - Ketua", "Presenter 1 (Lead)", "Opening, Perkenalan Kelompok, Latar Belakang Game MBG, Gambaran Arsitektur Sistem OOP & Real-time WebSocket"),
        ("2.", "Akazasa Sitanala\n(2530521088)", "Presenter 2 (Demo Gameplay)", "Demonstrasi Gameplay, Roster 5 Karakter, Pairing Dual QR Code Smartphone Android Gamepad, & Pertarungan Real-Time PvP"),
        ("3.", "Ahmi Sulaeman\n(2530521083)", "Presenter 3 (OOP Engine 1)", "Penjelasan Abstract Parent Class (Fighter), Interface (FighterInterface), Mekanisme Inheritance, & Factory Pattern"),
        ("4.", "Muhammad Kirei Abdillah\n(2530521075)", "Presenter 4 (OOP Engine 2)", "Penjelasan Enkapsulasi (Boundary HP/Energi), Polimorfisme (Overriding Method), & Symmetrical Visual FX Cut-in"),
        ("5.", "Mochammad Fauzan Dzakwan Rahadian\n(2530521074)", "Presenter 5 (Network & QA)", "Penjelasan Server WebSocket RFC 6455 Pure PHP 8.3, Demonstrasi Unit Test Suite CLI (33 Tests PASS), & Closing")
    ]
    for r_i, row in enumerate(p_data):
        for c_i, val in enumerate(row):
            tbl_p.cell(r_i, c_i).text = val

    style_academic_table(tbl_p, col_widths=[Inches(0.5), Inches(2.2), Inches(1.4), Inches(2.5)])

    # Two-Column AV Script
    add_heading_1(doc, "2. NASKAH AUDIO-VISUAL (AV SCRIPT) LENGKAP")
    add_p(doc, "Petunjuk Teknis: Kolom Visual berisi arahan pergerakan kamera, tampilan layar (screencast antarmuka atau kode sumber), dan demonstrasi interaktif. Kolom Audio berisi transkrip kalimat percakapan lisan yang diucapkan presenter secara natural, lugas, dan percaya diri.")

    tbl_av = doc.add_table(rows=10, cols=3)
    av_rows = [
        ("Waktu / Segmen", "Visual / Tampilan Layar (Screencast & B-Roll)", "Audio / Narasi & Dialog Presenter"),
        ("00:00 - 01:20\n(Segmen 1)", 
         "• Fade in dari logo UMMI ke Title Screen Game MBG.\n• Kamera switch ke webcam Presenter 1 (Mulqi) dengan latar grafis arcade cabinet.\n• Muncul teks nama, NIM, dan peran Mulqi di lower-third layar.",
         "MULQI (Ketua):\n\"Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat pagi/siang kepada Bapak Prajoko, M.Kom., selaku dosen pengampu mata kuliah Pemrograman Berorientasi Objek, serta rekan-rekan mahasiswa semuanya.\n\nKami dari Kelompok 1 Kelas TI Semester 3, Universitas Muhammadiyah Sukabumi, dengan bangga mempersembahkan proyek game fighting 2D arcade berjudul 'MBG: MOBILE BATTLE GOVERNMENT'.\n\nSaya Muhamad Mulqi Adiyat Abdilah Ruswandi selaku ketua kelompok, bersama rekan saya Akazasa Sitanala, Ahmi Sulaeman, Muhammad Kirei Abdillah, dan Mochammad Fauzan Dzakwan Rahadian telah merancang game ini sebagai pembuktian nyata bagaimana prinsip-prinsip OOP modern di PHP 8.3 digabungkan dengan teknologi real-time WebSocket murni dapat menghasilkan game arkade yang interaktif, stabil, dan berstandar rekayasa perangkat lunak tinggi.\""),
        
        ("01:20 - 02:40\n(Segmen 2)",
         "• Screencast layar menu utama: Pilihan 1P VS CPU, 1P VS 2P, Training Dojo, dan Modal OOP Specs.\n• Menampilkan tombol Dual QR Code Controller untuk Player 1 dan Player 2 di antarmuka title screen.",
         "MULQI (Ketua):\n\"MBG mengambil tema satir birokrasi pemerintahan fiktif dengan grafis retro 2D Canvas 60 FPS dan audio synthesizer 8-bit. Di sisi backend, game ini mengimplementasikan logika pertarungan deterministik berbasis OOP PHP 8.3 dengan arsitektur PSR-4 yang bersih.\n\nSalah satu terobosan paling inovatif dalam proyek kami adalah dukungan Multi-Controller Nirkabel. Selain menggunakan keyboard fisik, pemain dapat menghubungkan smartphone Android sebagai gamepad nirkabel secara instan hanya dengan memindai kode QR!\n\nUntuk mendemonstrasikan bagaimana gameplay dan controller nirkabel ini berjalan secara langsung, rekan saya Akazasa Sitanala akan memandu demonstrasi. Kepada Akazasa, dipersilakan.\""),

        ("02:40 - 04:30\n(Segmen 3)",
         "• Layar beralih ke Character Select Screen.\n• Akazasa menunjukkan roster 5 petarung: Bahlul, Tifuzia, Brown Teddy, Fufufifi, dan Wili Wonka.\n• Menyoroti statistik tiap hero (HP, ATK, DEF, SPD) dan deskripsi jurus.",
         "AKAZASA (Gameplay Demo):\n\"Terima kasih, Mulqi. Halo semuanya, saya Akazasa Sitanala. Sekarang kita berada di Character Selection Screen. MBG menghadirkan 5 karakter petarung dengan playstyle yang sangat unik:\n\n1. Bahlul, The Goblin Summoner: Karakter mistis ber-HP tebal (1150 HP) dengan kemampuan memanggil gerombolan minion goblin.\n2. Tifuzia, The Diploma Inspector: Petarung lincah berkecepatan tinggi yang menuntut transparansi akademik melalui serangan palu sidang dan debuff kebisingan.\n3. Brown Teddy: Karakter tanker dengan pertahanan terkuat (55 DEF) yang memanipulasi kasih sayang dan pelukan berdaya hancur tinggi.\n4. Fufufifi: Karakter aktivis vokal pembela aspirasi rakyat dengan orasi kritis penembus pertahanan lawan.\n5. Wili Wonka: Petarung gesit pencari konten viral dengan self-heal dan blitz kamera bertubi-tubi!\n\nSekarang mari kita lihat bagaimana inovasi controller smartphone Android bekerja di MBG!\""),

        ("04:30 - 06:15\n(Segmen 4)",
         "• Kamera switch ke two-shot: Layar laptop menampilkan game dan tangan Akazasa memegang smartphone Android.\n• Akazasa mengklik ikon QR Code Player 2 di game, memindainya dengan kamera smartphone.\n• Ponsel langsung membuka controller.html dan status berubah menjadi 'CONNECTED (P2)'.\n• Akazasa menekan D-Pad dan tombol di HP -> Karakter P2 langsung bergerak responsif di layar laptop!\n• Badge HUD P2 otomatis berubah menampilkan simbol 'P2 📱'.",
         "AKAZASA (Gameplay Demo):\n\"Bisa dilihat di layar, saya mengklik tombol QR Code Player 2. Saya pindai kodenya menggunakan smartphone Android saya, dan dalam waktu kurang dari satu detik, browser HP langsung terhubung ke server WebSocket lokal!\n\nPerhatikan antarmuka di ponsel saya: terdapat virtual D-Pad untuk pergerakan kiri, kanan, lompat, dan jongkok, serta 4 tombol aksi: Basic Attack, Skill 1, Skill 2, dan Ultimate. Tidak ada lag sama sekali! Begitu saya menekan tombol di layar sentuh ponsel, karakter Player 2 di layar laptop langsung bergerak seketika.\n\nSistem ini juga dilengkapi Pointer Capture API, sehingga ketika jari saya bergeser cepat saat kombo, input tombol tidak akan pernah macet atau terlepas! Sekarang mari kita mulai pertempuran seru antara Player 1 (Wili Wonka) melawan Player 2 (Brown Teddy via Smartphone)!\""),

        ("06:15 - 07:45\n(Segmen 5)",
         "• Layar pertarungan berlangsung seru di Arena DPR.\n• P1 (Wili Wonka) menyerang dengan basic attack 'J' dan Skill 'Chocolate Lick'.\n• P2 (Brown Teddy yang dimainkan via HP) membalas dengan 'Teddy Hug'.\n• Brown Teddy mengaktifkan Ultimate 'Love Bomb' -> Banner Ultimate Cut-in muncul di SEBELAH KANAN secara simetris!\n• P1 membalas dengan Ultimate 'Viral Moment' -> Banner Cut-in muncul di SEBELAH KIRI!\n• K.O.! Menampilkan panel hasil pertarungan dan telemetri pertandingan.",
         "AKAZASA (Gameplay Demo):\n\"Pertarungan berjalan sangat adil dan imbang! Perhatikan di layar saat Brown Teddy (Player 2) melepaskan jurus pamungkasnya, Love Bomb: animasi cut-in banner muncul di sebelah kanan secara simetris menghadap ke kiri, sementara jurus ultimate Player 1 muncul dari sebelah kiri.\n\nKedua kontroler berjalan independen tanpa ada interferensi atau freeze sama sekali. Saat pertarungan berakhir, telemetri mencatat seluruh hitungan serangan secara akurat.\n\nLalu, bagaimana arsitektur kelas PHP di balik layar mengatur seluruh logika pertarungan ini? Rekan saya Ahmi Sulaeman akan menjelaskannya.\""),

        ("07:45 - 09:15\n(Segmen 6)",
         "• Screencast menampilkan kode sumber di VS Code: Fighter.php, FighterInterface.php, dan Bahlul.php.\n• Ahmi menjelaskan deklarasi abstract class, protected properties, dan extends.",
         "AHMI (OOP Engine 1):\n\"Terima kasih Akazasa. Saya Ahmi Sulaeman, dan saya akan membedah arsitektur Object-Oriented Programming dari MBG.\n\nPertama, Abstraction dan Interface. Di folder app/Interfaces/FighterInterface.php, kami mendefinisikan kontrak publik seperti attack(), takeDamage(), heal(), dan executeSpecial(). Di app/Core/Fighter.php, kami mendefinisikan abstract class Fighter yang mengimplementasikan interface tersebut dengan 15 atribut protected. Kelas ini sengaja dijadikan abstrak karena secara konseptual tidak ada petarung anonim tanpa identitas; setiap petarung harus berupa karakter konkret.\n\nKedua, Pewarisan atau Inheritance. Setiap hero seperti Bahlul mengekstensi kelas Fighter: 'class Bahlul extends Fighter'. Bahlul mewarisi kalkulasi pertahanan dan manajemen energi, sambil menambahkan 5 atribut privat spesifik seperti activeGoblins dan method unik summonGoblins().\n\nKetiga, Factory Pattern. CharacterFactory menginstansiasi objek petarung secara dinamis menggunakan match expression PHP 8.3. Selanjutnya, penjelasan enkapsulasi dan polimorfisme akan disampaikan oleh Muhammad Kirei.\""),

        ("09:15 - 10:45\n(Segmen 7)",
         "• Screencast menyorot method takeDamage() dan heal() dengan boundary checking.\n• Menyorot method overriding attack() dan pasif unik tiap karakter di PHP.\n• Kirei menjelaskan implementasi enkapsulasi data hiding.",
         "KIREI (OOP Engine 2):\n\"Terima kasih Ahmi. Halo rekan-rekan, saya Muhammad Kirei Abdillah. Saya akan menjelaskan dua pilar utama berikutnya: Enkapsulasi dan Polimorfisme.\n\nPilar pertama: Encapsulation. Untuk menjamin integritas game, seluruh atribut vital seperti health, maxHealth, dan ultimateEnergy dilindungi oleh visibilitas protected. Tidak ada kode luar yang bisa memodifikasi HP sembarangan. Perhatikan method heal(): kami menyematkan boundary checking: 'min($amount, $this->maxHealth - $this->health)'. Artinya, HP tidak akan pernah melebihi MaxHealth. Begitu juga takeDamage(), HP terkunci di angka 0 dan tidak pernah negatif saat K.O.\n\nPilar kedua: Polymorphism. Setiap hero memiliki perilaku pasif yang berbeda melalui method overriding. Ketika BattleEngine mengeksekusi '$fighter->attack()', mesin memanggil method yang sama, namun setiap karakter mengeksekusi pasifnya masing-masing: Bahlul mendapat bonus energi +5%, Tifuzia memicu debuff kebisingan, dan Brown Teddy memicu bonus defense saat sekarat!\n\nSelanjutnya, rekan saya Fauzan akan menjelaskan arsitektur WebSocket server serta pembuktian unit testing otomatis kami.\""),

        ("10:45 - 12:30\n(Segmen 8)",
         "• Screencast menampilkan file server_ws.php dan WebSocketServer.php.\n• Fauzan menyoroti soket multiplexing, handshake SHA-1, dan spl_object_id().\n• Screencast terminal menjalankan perintah: php tests/test_oop.php.\n• Output bergulir menampilkan 33 PASS berturut-turut dengan status 100% LULUS.",
         "FAUZAN (Network & QA):\n\"Terima kasih Kirei. Saya Mochammad Fauzan Dzakwan Rahadian. Di bagian jaringan, kami merancang WebSocketServer.php murni menggunakan ekstensi Socket PHP 8.3 tanpa dependensi eksternal seperti Ratchet. Server ini menangani RFC 6455 Handshake, frame unmasking bitwise XOR, dan menggunakan 'spl_object_id()' untuk melacak koneksi klien tanpa menimbulkan peringatan konversi tipe data di PHP 8.3.\n\nSekarang mari kita uji seluruh logika sistem ini secara ilmiah melalui unit test suite otomatis. Di terminal, kita jalankan: 'php tests/test_oop.php'.\n\nSistem menguji 10 kategori penting PBO:\n1. Alokasi objek kelima karakter: PASS!\n2. Pewarisan sah dari kelas Fighter: PASS!\n3. Enkapsulasi batas HP dan energi: PASS!\n4. Overriding method pasif: PASS!\n5. Polimorfisme penyerangan: PASS!\n6. Validasi cooldown dan energi ultimate: PASS!\n7. Formula mitigasi pertahanan: PASS!\n8. Alur giliran BattleEngine: PASS!\n9. Ketersediaan arena: PASS!\n10. Kondisi kemenangan K.O.: PASS!\n\nSeluruh 33 butir pengujian dinyatakan LULUS 100%! Ini membuktikan keandalan sistem kami tanpa cela.\""),

        ("12:30 - 13:45\n(Segmen 9)",
         "• Layar menampilkan kelima webcam anggota kelompok secara berdampingan (grid 5).\n• Menampilkan teks ucapan terima kasih dan logo Universitas Muhammadiyah Sukabumi.",
         "MULQI (Ketua):\n\"Sebagai penutup, proyek MBG membuktikan bahwa arsitektur OOP PHP 8.3 mampu membangun perangkat lunak game yang canggih, terstruktur rapi, dan responsif. Penggabungan logika berorientasi objek murni dengan server WebSocket nirkabel untuk smartphone memperlihatkan bahwa aplikasi berbasis web dapat memberikan pengalaman bermain yang modern dan kompetitif.\n\nKami mengucapkan terima kasih yang sebesar-besarnya kepada Bapak Prajoko, M.Kom., atas bimbingan dan inspirasinya selama perkuliahan Pemrograman Berorientasi Objek. Terima kasih juga kepada seluruh rekan-rekan yang telah menyaksikan presentasi kami.\n\nDemikian persembahan dari Kelompok 1 TI UMMI. Mohon maaf atas segala kekurangan.\nWabillahi taufiq wal hidayah, Wassalamu'alaikum Warahmatullahi Wabarakatuh!\"")
    ]

    for r_i, row in enumerate(av_rows):
        for c_i, val in enumerate(row):
            tbl_av.cell(r_i, c_i).text = val

    style_academic_table(tbl_av, col_widths=[Inches(1.2), Inches(2.5), Inches(2.9)])

    # Section 3: Q&A Defense Guide
    doc.add_page_break()
    add_heading_1(doc, "3. PANDUAN PERTANYAAN SIDANG / RESPONSI UTS (10 Q&A DEFENSE)")
    add_p(doc, "Berikut adalah kompilasi 10 pertanyaan kritis yang sering diajukan oleh dosen penguji PBO beserta strategi jawaban berbasis kode aktual:")

    qna_list = [
        ("Q1: Di mana letak konkret penerapan Abstraksi dan mengapa Fighter dijadikan Abstract Class?",
         "Jawaban (Ahmi / Mulqi):\nFighter didefinisikan sebagai 'abstract class Fighter' di app/Core/Fighter.php karena konsep petarung umum tidak memiliki wujud fisik konkret di dalam game. Yang bertarung di arena adalah entitas spesifik seperti Bahlul atau Tifuzia. Kelas abstrak ini memaksa setiap child class mengimplementasikan method abstrak 'activatePassive()' dan 'getSpecialAbilityDescription()' sesuai kontrak yang diwajibkan."),

        ("Q2: Bagaimana Enkapsulasi mencegah manipulasi curang (cheat) terhadap status HP karakter?",
         "Jawaban (Kirei):\nSeluruh variabel sensitif (health, maxHealth, ultimateEnergy) diberi visibilitas 'protected' atau 'private'. Tidak ada akses langsung '$fighter->health = 99999'. Seluruh perubahan status dimediasi oleh setter dan method takeDamage() / heal() yang menyematkan boundary checking: 'min($maxHealth, max(0, $health))'. Jika terkena damage 999999, HP terkunci di angka 0 dan tidak pernah minus."),

        ("Q3: Mengapa menggunakan Polimorfisme pada pemanggilan method attack()?",
         "Jawaban (Kirei / Akazasa):\nBattleEngine mengeksekusi serangan melalui referensi parent '$actor->attack($opponent)' tanpa perlu membuat switch-case panjang untuk memeriksa tipe karakter. Setiap child class meng-override attack() untuk menyisipkan bonus pasifnya sendiri (misalnya Bahlul menambah energi +5%, sedangkan Wili Wonka memicu FYP bonus). Ini mematuhi Open/Closed Principle (OCP)."),

        ("Q4: Bagaimana cara kerja sistem Cooldown jurus di backend?",
         "Jawaban (Fauzan):\nSetiap instansiasi Skill menyimpan atribut integer 'cooldown' dan 'currentCooldown'. Ketika jurus digunakan, currentCooldown diisi angka ronde cooldown (misalnya 3). Pada setiap putaran giliran, BattleEngine memanggil 'tickCooldowns()', yang mendekomposisi nilai cooldown sebesar 1 hingga kembali ke 0 (ready). Jika dipanggil saat cooldown > 0, eksekusi ditolak otomatis."),

        ("Q5: Bagaimana formula matematis mitigasi defense bekerja?",
         "Jawaban (Fauzan / Mulqi):\nFormula dihitung di DamageCalculator.php menggunakan rumus rasio hiperbolik: MitigationRatio = Defense / (100 + Defense). Karakter dengan defense 55 (Brown Teddy) akan memitigasi 35.5% damage, sehingga hanya menerima 64.5% dari damage mentah. Formula ini menjamin scaling defense yang adil dan tidak linear."),

        ("Q6: Bagaimana arsitektur komunikasi antara backend PHP dan frontend Canvas?",
         "Jawaban (Mulqi):\nFrontend Canvas bertindak sebagai rendering view dan listener input keyboard yang mengirimkan payload aksi melalui REST JSON API (api/battle.php). Backend PHP memvalidasi state, memproses logika OOP, memperbarui HP/energi, dan mengembalikan snapshot battle state terbaru ke frontend untuk dianimasikan."),

        ("Q7: Mengapa menggunakan pola desain CharacterFactory?",
         "Jawaban (Ahmi):\nCharacterFactory menerapkan Factory Pattern untuk memisahkan proses instansiasi objek dari logika permainan. Dengan menggunakan ekspresi 'match' di PHP 8.3, pembuatan karakter baru di masa depan dapat dilakukan cukup dengan menambahkan baris baru di Factory tanpa mengubah kode BattleEngine sama sekali."),

        ("Q8: Apakah game ini memiliki ketergantungan (dependencies) pada library eksternal?",
         "Jawaban (Fauzan / Mulqi):\nSama sekali tidak. Seluruh sistem PHP menggunakan pustaka bawaan PHP 8.3 standard library. Di sisi frontend, seluruh visual pixel-art digambar secara prosedural pada Canvas 2D, dan seluruh efek suara disintesis secara dinamis menggunakan Web Audio API tanpa file audio atau gambar eksternal yang rentan CORS atau lisensi."),

        ("Q9: Bagaimana cara kerja server WebSocket di PHP tanpa library eksternal (Ratchet / Swoole)?",
         "Jawaban (Fauzan):\nWebSocketServer.php menggunakan fungsi ekstensi soket bawaan PHP (socket_create, socket_bind, socket_listen). Untuk proses handshake RFC 6455, server membaca header Sec-WebSocket-Key dari request HTTP client, menggabungkannya dengan GUID '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', lalu menghasilkan hash SHA-1 biner dan melakukan Base64 encoding. Untuk komunikasi real-time, socket_select() digunakan sebagai non-blocking multiplexer, dan spl_object_id($socket) digunakan sebagai penanda objek soket PHP 8.3."),

        ("Q10: Bagaimana sistem memisahkan kendali antara Player 1 (Keyboard) dan Player 2 (Smartphone Android) tanpa freeze atau konflik aksi?",
         "Jawaban (Akazasa / Mulqi):\nSistem menerapkan isolasi vektor input yang ketat di game.js. Input Player 1 dan Player 2 disimpan dalam struktur data terpisah (this.p1Keys dan this.p2Keys) dengan flag processing independen (p1Processing dan p2Processing). Selain itu, fungsi isP2Human() otomatis mematikan logika AI CPU jika Player 2 terhubung melalui ponsel atau mode PvP, dan Pointer Capture API pada smartphone mencegah tombol macet saat jari digeser melintasi layar sentuh.")
    ]

    for q, a in qna_list:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(8)
        p_q.paragraph_format.space_after = Pt(2)
        r_q = p_q.add_run(q)
        r_q.font.name = 'Times New Roman'
        r_q.font.size = Pt(11)
        r_q.font.bold = True
        r_q.font.color.rgb = RGBColor(30, 41, 59)

        p_a = doc.add_paragraph()
        p_a.paragraph_format.line_spacing = 1.3
        p_a.paragraph_format.space_after = Pt(8)
        r_a = p_a.add_run(a)
        r_a.font.name = 'Times New Roman'
        r_a.font.size = Pt(10.5)

    doc.save(OUTPUT_SCRIPT)
    print(f"Naskah Video Presentasi successfully created at: {OUTPUT_SCRIPT}")

if __name__ == '__main__':
    build_script()
