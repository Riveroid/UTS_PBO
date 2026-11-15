import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
OUTPUT_DOCX = os.path.join(BASE_DIR, 'Laporan_Praktikum_MBG.docx')

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
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), '64748B')
        tblBorders.append(border)
    v_border = OxmlElement('w:insideV')
    v_border.set(qn('w:val'), 'none')
    tblBorders.append(v_border)
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
            set_cell_margins(cell, top=100, bottom=100, left=160, right=160)
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
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(8)
    h.paragraph_format.keep_with_next = True
    for r in h.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)
    return h

def add_heading_2(doc, text):
    h = doc.add_heading(text, level=2)
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    for r in h.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(30, 41, 59)
    return h

def add_heading_3(doc, text):
    h = doc.add_heading(text, level=3)
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    for r in h.runs:
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(51, 65, 85)
    return h

def add_p(doc, text, bold_prefix=None, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, italic=False, first_indent=0.5):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_after = Pt(space_after)
    if first_indent > 0:
        p.paragraph_format.first_line_indent = Inches(first_indent)

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.italic = italic
    return p

def add_table_caption(doc, table_num_str, caption_title):
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(12)
    p_cap.paragraph_format.space_after = Pt(4)
    p_cap.paragraph_format.keep_with_next = True

    r1 = p_cap.add_run(f"Tabel {table_num_str} ")
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(10.5)
    r1.font.bold = True

    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), r'SEQ Tabel \* ARABIC')
    p_cap._p.append(fld)

    r2 = p_cap.add_run(f" {caption_title}")
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(10.5)
    r2.font.bold = True
    return p_cap

def add_figure(doc, img_path, figure_num_str, caption_title, width_inches=5.8):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(12)
        p_img.paragraph_format.space_after = Pt(4)
        run = p_img.add_run()
        run.add_picture(img_path, width=Inches(width_inches))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(14)

        r1 = p_cap.add_run(f"Gambar {figure_num_str} ")
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(10)
        r1.font.bold = True

        fld = OxmlElement('w:fldSimple')
        fld.set(qn('w:instr'), r'SEQ Gambar \* ARABIC')
        p_cap._p.append(fld)

        r2 = p_cap.add_run(f" {caption_title}")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(10)
        r2.font.italic = True
        r2.font.bold = True
        r2.font.color.rgb = RGBColor(51, 65, 85)

def build_document():
    doc = Document()

    # Standard Indonesian Academic Thesis Margins (4-4-3-3: Top 4cm, Left 4cm, Bottom 3cm, Right 3cm)
    for section in doc.sections:
        section.top_margin = Inches(1.57)    # 4 cm
        section.left_margin = Inches(1.57)   # 4 cm
        section.bottom_margin = Inches(1.18) # 3 cm
        section.right_margin = Inches(1.18)  # 3 cm

    # =========================================================================
    # 1. COVER PAGE (STANDARD ACADEMIC FORMAT WITH OFFICIAL CAMPUS LOGO)
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("LAPORAN PRAKTIKUM\nPEMROGRAMAN BERORIENTASI OBJEK (PBO)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(20)
    r_sub = p_sub.add_run("RANCANG BANGUN GAME FIGHTING 2D ARCADE \"MBG: MOBILE BATTLE GOVERNMENT\" BERBASIS ARSITEKTUR OBJECT-ORIENTED PROGRAMMING PHP 8.3 DAN WEBSOCKET WIRELESS GAMEPAD")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(12.5)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(30, 41, 59)

    # Campus Logo
    logo_path = os.path.join(ASSETS_DIR, "logo_ummi.png")
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(20)
        p_logo.add_run().add_picture(logo_path, width=Inches(2.5))

    p_reason = doc.add_paragraph()
    p_reason.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_reason.paragraph_format.space_after = Pt(14)
    r_reason = p_reason.add_run("Disusun untuk Memenuhi Tugas Ujian Tengah Semester (UTS)\nMata Kuliah Pemrograman Berorientasi Objek")
    r_reason.font.name = 'Times New Roman'
    r_reason.font.size = Pt(11)
    r_reason.font.italic = True

    # Identity Table
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_after = Pt(6)
    r_by = p_by.add_run("Disusun oleh Kelompok 1 LMS:")
    r_by.font.name = 'Times New Roman'
    r_by.font.size = Pt(11)
    r_by.font.bold = True

    tbl_team = doc.add_table(rows=6, cols=3)
    tbl_team.alignment = WD_TABLE_ALIGNMENT.CENTER
    team_data = [
        ("No", "Nama Mahasiswa", "NIM"),
        ("1.", "Muhamad Mulqi Adiyat Abdilah Ruswandi (Ketua)", "2530521082"),
        ("2.", "Akazasa Sitanala", "2530521088"),
        ("3.", "Ahmi Sulaeman", "2530521083"),
        ("4.", "Muhammad Kirei Abdillah", "2530521075"),
        ("5.", "Mochammad Fauzan Dzakwan Rahadian", "2530521074")
    ]
    for row_idx, data in enumerate(team_data):
        for col_idx, text in enumerate(data):
            cell = tbl_team.cell(row_idx, col_idx)
            cell.text = text
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    style_academic_table(tbl_team, col_widths=[Inches(0.6), Inches(3.6), Inches(1.6)])

    # Bottom Institutions
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(28)
    p_inst.paragraph_format.line_spacing = 1.3
    r_inst = p_inst.add_run("Dosen Pengampu: Prajoko, M.Kom.\n\n"
                           "PROGRAM STUDI TEKNIK INFORMATIKA\n"
                           "FAKULTAS SAINS DAN TEKNOLOGI\n"
                           "UNIVERSITAS MUHAMMADIYAH SUKABUMI\n"
                           "SUKABUMI\n2026/2027")
    r_inst.font.name = 'Times New Roman'
    r_inst.font.size = Pt(11.5)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # =========================================================================
    # 2. KATA PENGANTAR
    # =========================================================================
    h_kp = doc.add_paragraph()
    h_kp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_kp.paragraph_format.space_before = Pt(12)
    h_kp.paragraph_format.space_after = Pt(16)
    r_kp = h_kp.add_run("KATA PENGANTAR")
    r_kp.font.name = 'Times New Roman'
    r_kp.font.size = Pt(14)
    r_kp.font.bold = True

    add_p(doc, "Puji dan syukur kami panjatkan ke hadirat Allah SWT, atas limpahan rahmat, taufik, serta karunia-Nya sehingga kami, Kelompok 1 mahasiswa Program Studi Teknik Informatika, Fakultas Sains dan Teknologi, Universitas Muhammadiyah Sukabumi (UMMI), dapat menyelesaikan proyek game dan laporan praktikum Ujian Tengah Semester (UTS) mata kuliah Pemrograman Berorientasi Objek (PBO) yang berjudul \"Rancang Bangun Game Fighting 2D Arcade 'MBG: Mobile Battle Government' Berbasis Arsitektur Object-Oriented Programming PHP 8.3 dan WebSocket Wireless Gamepad\" dengan lancar dan tepat waktu.")

    add_p(doc, "Game MBG (Mobile Battle Government) merupakan sebuah karya rekayasa perangkat lunak interaktif yang didesain bukan hanya sebagai sarana hiburan belaka, melainkan sebagai media pembuktian empiris dan fungsional dari implementasi empat pilar utama Pemrograman Berorientasi Objek (Object-Oriented Programming - OOP), yaitu Abstraction, Encapsulation, Inheritance, dan Polymorphism secara murni pada backend modern PHP 8.3. Lebih dari itu, sistem ini dilengkapi dengan inovasi arsitektur komunikasi real-time berbasis server WebSocket RFC 6455 murni (zero external dependencies) yang memungkinkan smartphone Android difungsikan sebagai controller nirkabel (wireless gamepad) melalui pemindaian Dual QR Code secara instan.")

    add_p(doc, "Dalam proses perancangan dan implementasi proyek ini, kami menyadari sepenuhnya bahwa keberhasilan penyelesaian tugas tidak lepas dari bimbingan, arahan, serta dukungan dari berbagai pihak. Oleh karena itu, melalui kesempatan ini kami menghaturkan apresiasi dan terima kasih yang sebesar-besarnya kepada:")

    add_p(doc, "1. Bapak Prajoko, M.Kom., selaku Dosen Pengampu Mata Kuliah Pemrograman Berorientasi Objek yang senantiasa membimbing, menginspirasi, dan memberikan standar akademis yang tinggi kepada kami.", bold_prefix="", first_indent=0.25)
    add_p(doc, "2. Ketua Program Studi Teknik Informatika dan segenap Dosen Fakultas Sains dan Teknologi Universitas Muhammadiyah Sukabumi.", bold_prefix="", first_indent=0.25)
    add_p(doc, "3. Rekan-rekan mahasiswa Kelompok 1 LMS atas kerja sama, dedikasi, komitmen, dan integritas tinggi dalam pengerjaan arsitektur kode dan dokumentasi laporan praktikum ini.", bold_prefix="", first_indent=0.25)

    add_p(doc, "Kami menyadari bahwa laporan ini masih memiliki ruang penyempurnaan seiring perkembangan ekosistem rekayasa perangkat lunak. Kritik dan saran yang konstruktif sangat kami harapkan guna perbaikan di masa mendatang. Semoga laporan praktikum ini dapat memberikan kontribusi nyata serta referensi bermanfaat bagi civitas akademika Universitas Muhammadiyah Sukabumi.")

    p_sign = doc.add_paragraph()
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sign.paragraph_format.space_before = Pt(20)
    p_sign.paragraph_format.line_spacing = 1.3
    r_sign = p_sign.add_run("Sukabumi, 13 November 2026\n\n\nTim Penyusun (Kelompok 1)")
    r_sign.font.name = 'Times New Roman'
    r_sign.font.size = Pt(11.5)

    doc.add_page_break()

    # =========================================================================
    # 3. DAFTAR ISI, DAFTAR GAMBAR, DAFTAR TABEL
    # =========================================================================
    h_di = doc.add_paragraph()
    h_di.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_di.paragraph_format.space_before = Pt(12)
    h_di.paragraph_format.space_after = Pt(16)
    r_di = h_di.add_run("DAFTAR ISI")
    r_di.font.name = 'Times New Roman'
    r_di.font.size = Pt(14)
    r_di.font.bold = True

    p_toc = doc.add_paragraph()
    fld_toc = OxmlElement('w:fldSimple')
    fld_toc.set(qn('w:instr'), 'TOC \\o "1-3" \\h \\z \\u')
    p_toc._p.append(fld_toc)

    doc.add_page_break()

    h_dg = doc.add_paragraph()
    h_dg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_dg.paragraph_format.space_before = Pt(12)
    h_dg.paragraph_format.space_after = Pt(16)
    r_dg = h_dg.add_run("DAFTAR GAMBAR")
    r_dg.font.name = 'Times New Roman'
    r_dg.font.size = Pt(14)
    r_dg.font.bold = True

    p_tof = doc.add_paragraph()
    fld_tof = OxmlElement('w:fldSimple')
    fld_tof.set(qn('w:instr'), 'TOC \\h \\z \\c "Gambar"')
    p_tof._p.append(fld_tof)

    doc.add_page_break()

    h_dt = doc.add_paragraph()
    h_dt.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_dt.paragraph_format.space_before = Pt(12)
    h_dt.paragraph_format.space_after = Pt(16)
    r_dt = h_dt.add_run("DAFTAR TABEL")
    r_dt.font.name = 'Times New Roman'
    r_dt.font.size = Pt(14)
    r_dt.font.bold = True

    p_tot = doc.add_paragraph()
    fld_tot = OxmlElement('w:fldSimple')
    fld_tot.set(qn('w:instr'), 'TOC \\h \\z \\c "Tabel"')
    p_tot._p.append(fld_tot)

    doc.add_page_break()

    # =========================================================================
    # BAB I PENDAHULUAN
    # =========================================================================
    add_heading_1(doc, "BAB I PENDAHULUAN")

    add_heading_2(doc, "1.1 Latar Belakang Masalah")
    add_p(doc, "Pemrograman Berorientasi Objek (Object-Oriented Programming - OOP) merupakan paradigma fundamental dalam rekayasa perangkat lunak modern. Paradigma ini mengorganisasikan perancangan sistem berbasis kelas (class) dan objek (object) yang merepresentasikan entitas nyata lengkap dengan atribut status (state) dan perilaku (behavior). Melalui penerapan empat pilar utama—yaitu Abstraksi (Abstraction), Enkapsulasi (Encapsulation), Pewarisan (Inheritance), dan Polimorfisme (Polymorphism)—perangkat lunak yang dihasilkan memiliki modularitas tinggi, skalabilitas andal, serta kemudahan pemeliharaan (maintainability).")

    add_p(doc, "Meskipun konsep teoritis OOP sering diajarkan melalui contoh sederhana seperti kendaraan atau bentuk geometri, pemahaman mahasiswa menjadi jauh lebih komprehensif ketika dihadapkan pada studi kasus interaktif yang kompleks, seperti logika engine pertarungan game (combat engine). Dalam domain permainan bergenre pertarungan 2D (fighting game), interaksi antarkarakter melibatkan kalkulasi mitigasi pertahanan, eksekusi jurus khusus, validasi waktu jeda (cooldown), manajemen energi ultimate, serta penentuan pemenang berdasarkan aturan ketat.")

    add_p(doc, "Bahasa pemrograman PHP pada versi modern, khususnya PHP 8.2 dan PHP 8.3, telah berevolusi menjadi platform komputasi berkemampuan tinggi dengan sistem tipe data ketat (strict typing), typed properties, ekspresi match, readonly classes, serta first-class callable syntax. Memanfaatkan kemajuan tersebut, proyek praktikum ini mengembangkan game pertarungan bertajuk \"MBG: MOBILE BATTLE GOVERNMENT\". Game ini bertema satir birokrasi pemerintahan fiktif yang tidak hanya memberikan hiburan visual melalui kanvas HTML5 dan synthesizer retro Web Audio API, melainkan juga membuktikan bahwa arsitektur backend berbasis PHP 8.3 mampu menggerakkan seluruh logika pertarungan secara deterministik, teruji, dan sesuai kaidah OOP murni. Selain itu, guna meningkatkan interaktivitas permainan, proyek ini menghadirkan fitur server WebSocket RFC 6455 murni (zero-dependency) yang memungkinkan smartphone Android menjadi gamepad nirkabel secara plug-and-play melalui scan QR Code.")

    add_heading_2(doc, "1.2 Rumusan Masalah")
    add_p(doc, "Berdasarkan latar belakang di atas, rumusan masalah dalam praktikum ini dirumuskan sebagai berikut:")
    add_p(doc, "1. Bagaimana merancang arsitektur kelas berorientasi objek di PHP 8.3 yang mengintegrasikan abstract parent class, interface, dan 5 child class petarung unik?")
    add_p(doc, "2. Bagaimana menerapkan prinsip enkapsulasi secara ketat untuk melindungi integritas atribut pertarungan seperti batas HP, energi ultimate, dan status cooldown?")
    add_p(doc, "3. Bagaimana mengimplementasikan polimorfisme melalui method overriding agar setiap karakter petarung mengeksekusi perilaku dan pasif unik secara dinamis?")
    add_p(doc, "4. Bagaimana merancang arsitektur real-time WebSocket murni (pure PHP RFC 6455) tanpa dependensi eksternal untuk menghubungkan smartphone Android sebagai gamepad nirkabel dengan pairing Dual QR Code?")
    add_p(doc, "5. Bagaimana memisahkan kontrol multi-input (Keyboard Fisik dan Smartphone) secara terisolasi tanpa interferensi atau freezing pada Player 2?")
    add_p(doc, "6. Bagaimana memverifikasi keandalan seluruh komponen sistem melalui unit test suite otomatis dengan standar kelulusan 100%?")

    add_heading_2(doc, "1.3 Tujuan Praktikum")
    add_p(doc, "Tujuan yang hendak dicapai melalui pelaksanaan proyek praktikum ini antara lain:")
    add_p(doc, "1. Memenuhi seluruh ketentuan penilaian Ujian Tengah Semester (UTS) mata kuliah Pemrograman Berorientasi Objek Semester 3 Teknik Informatika UMMI.")
    add_p(doc, "2. Membangun game fighting 2D arkade yang mengimplementasikan 1 Abstract Parent Class (Fighter), 5 Child Classes (Bahlul, Tifuzia, Brown Teddy, Fufufifi, Wili Wonka), dan sistem skill modular.")
    add_p(doc, "3. Menerapkan enkapsulasi boundary validation untuk mencegah manipulasi ilegal status pertempuran.")
    add_p(doc, "4. Menerapkan polimorfisme pada metode penyerangan dan penggunaan kemampuan khusus.")
    add_p(doc, "5. Mengembangkan server WebSocket RFC 6455 murni berbasis ekstensi Socket PHP 8.3 untuk kendali gamepad nirkabel smartphone berlatensi rendah.")
    add_p(doc, "6. Menyediakan rangkaian unit testing otomatis (33 test cases) yang mencakup 10 kategori pengujian PBO dengan hasil 100% lulus.")

    add_heading_2(doc, "1.4 Manfaat Praktikum")
    add_p(doc, "1. Manfaat Akademis: Mahasiswa mampu mentransformasikan konsep teoretis OOP (Class, Object, Inheritance, Encapsulation, Polymorphism, Abstraction) serta pemrograman socket tingkat lanjut menjadi sistem komputasi nyata yang fungsional.")
    add_p(doc, "2. Manfaat Praktis: Menghasilkan sebuah game fighting web interaktif yang mendukung multi-controller (laptop keyboard dan smartphone Android) yang siap dipamerkan sebagai portofolio rekayasa perangkat lunak mahasiswa Teknik Informatika UMMI.")

    add_heading_2(doc, "1.5 Ruang Lingkup dan Batasan Sistem")
    add_p(doc, "Ruang lingkup proyek dibatasi pada:")
    add_p(doc, "1. Sistem backend diimplementasikan menggunakan PHP versi 8.2 ke atas (teruji pada PHP 8.3 CLI dan built-in web server).")
    add_p(doc, "2. Sistem menyediakan 5 karakter petarung unik, 4 arena bertema khusus, dan 3 mode permainan: 1P VS CPU (Arcade), 1P VS 2P (Local Multiplayer), dan Training Dojo.")
    add_p(doc, "3. Sistem mendukung skema input ganda: keyboard lokal komputer (P1: WASD & J, K, L, U; P2: Arrow Keys & Numpad 1, 2, 3, 5 atau U, I, O, P) serta kontrol nirkabel smartphone Android via WebSocket lokal.")
    add_p(doc, "4. Seluruh visual sprite, efek partikel, dan synthesizer audio dihasilkan secara prosedural berbasis HTML5 Canvas dan Web Audio API tanpa ketergantungan aset berhak cipta pihak ketiga.")

    doc.add_page_break()

    # =========================================================================
    # BAB II LANDASAN TEORI
    # =========================================================================
    add_heading_1(doc, "BAB II LANDASAN TEORI")

    add_heading_2(doc, "2.1 Konsep Dasar Pemrograman Berorientasi Objek (PBO)")
    add_p(doc, "Pemrograman Berorientasi Objek (PBO) adalah paradigma pemrograman yang mengorganisasikan perancangan perangkat lunak di sekitar objek atau data, bukan fungsi dan logika prosedural semata. Objek dapat didefinisikan sebagai bidang data yang memiliki atribut (properties) dan perilaku (methods) yang unik. Paradigma ini menekankan pengelompokan kode yang memiliki kohesi tinggi dan ketergantungan rendah (low coupling).")

    add_heading_2(doc, "2.2 Class dan Object Instantiation di PHP 8+")
    add_p(doc, "Class berfungsi sebagai blueprint atau cetak biru yang mendefinisikan variabel dan method yang akan dimiliki oleh objek. Object adalah representasi nyata (instance) dari sebuah class yang dialokasikan di dalam memori komputer pada saat runtime.")

    add_heading_2(doc, "2.3 Enkapsulasi (Encapsulation) dan Data Hiding")
    add_p(doc, "Enkapsulasi adalah mekanisme membungkus data (atribut) dan kode yang memanipulasinya (metode) ke dalam satu kesatuan terproteksi. Akses terhadap data internal dibatasi menggunakan access modifiers (private, protected, public). Dalam sistem MBG, variabel kritis seperti health, maxHealth, dan ultimateEnergy dilindungi oleh enkapsulasi dengan setter berlogika boundary checking: min($amount, $maxHealth - $health) sehingga HP tidak pernah bernilai negatif atau melampaui batas maksimum.")

    add_heading_2(doc, "2.4 Pewarisan (Inheritance) dan Class Hierarchy")
    add_p(doc, "Inheritance memungkinkan suatu class (child/subclass) mewarisi properti dan method dari class lain (parent/superclass). Hal ini mempromosikan reusabilitas kode (code reuse) dan pembentukan hierarki logis. Kelas Fighter bertindak sebagai superclass bagi kelas Bahlul, Tifuzia, BrownTeddy, Fufufifi, dan WiliWonka.")

    add_heading_2(doc, "2.5 Polimorfisme (Polymorphism) dan Method Overriding")
    add_p(doc, "Polimorfisme memungkinkan objek dari kelas yang berbeda untuk merespons pemanggilan method yang sama dengan perilaku spesifik masing-masing. Melalui method overriding, child class mendefinisikan ulang method yang telah dideklarasikan di parent class. Pada MBG, pemanggilan $fighter->attack() mengeksekusi logika serangan yang disesuaikan dengan pasif tiap hero.")

    add_heading_2(doc, "2.6 Abstraksi (Abstraction) dan Abstract Class")
    add_p(doc, "Abstraksi menyembunyikan detail implementasi yang rumit dan hanya menampilkan antarmuka esensial kepada pengguna. Abstract class tidak dapat diinstansiasi secara langsung dan memuat abstract method yang wajib diimplementasikan oleh setiap kelas turunannya.")

    add_heading_2(doc, "2.7 Fitur Modern PHP 8.2 & 8.3")
    add_p(doc, "PHP 8.3 memperkenalkan penyempurnaan tipe data seperti typed properties, union types, ekspresi match, readonly properties, serta nullsafe operator yang dimanfaatkan penuh dalam penulisan arsitektur backend MBG.")

    add_heading_2(doc, "2.8 Protokol WebSocket RFC 6455 dan Pemrograman Socket PHP")
    add_p(doc, "Protokol WebSocket (RFC 6455) menyediakan kanal komunikasi dua arah (full-duplex) yang persisten melalui koneksi TCP tunggal antara klien dan server. Berbeda dengan HTTP standar yang berorientasi request-response stateless, WebSocket memungkinkan pertukaran data stream dengan overhead header frame minimal (hanya 2 hingga 10 byte per pesan), menjadikannya standar ideal untuk game kontroler berlatensi rendah.")
    add_p(doc, r"Pada PHP 8.3, socket diimplementasikan sebagai objek instans dari kelas `\Socket` (menggantikan tipe resource pada PHP versi lawas). Untuk mengelola pemetaan koneksi klien secara aman dan unik tanpa menimbulkan peringatan konversi tipe data objek ke integer, fungsi `spl_object_id($socket)` digunakan sebagai hash key internal server.")

    doc.add_page_break()

    # =========================================================================
    # BAB III ANALISIS DAN PERANCANGAN SISTEM
    # =========================================================================
    add_heading_1(doc, "BAB III ANALISIS DAN PERANCANGAN SISTEM")

    add_heading_2(doc, "3.1 Deskripsi Umum Game MBG (Mobile Battle Government)")
    add_p(doc, "MBG adalah permainan fighting 2D bertema perdebatan dan dinamika birokrasi pemerintahan satir. Pertarungan disajikan dalam tampilan arena arkade 2D dengan sistem animasi 60 FPS di canvas dan backend deterministik di PHP. Sistem mendukung kontroler lokal maupun kendali nirkabel dari smartphone secara bersamaan.")

    add_heading_2(doc, "3.2 Analisis Kebutuhan Fungsional dan Non-Fungsional")
    add_p(doc, "Kebutuhan Fungsional:")
    add_p(doc, "1. Sistem mampu menginisialisasi pertempuran antara Player 1 dan Player 2 / AI.")
    add_p(doc, "2. Sistem menyediakan 5 karakter petarung dengan statistik dan jurus unik.")
    add_p(doc, "3. Sistem memproses aksi serang, penggunaan skill cooldown, dan jurus ultimate.")
    add_p(doc, "4. Sistem mendeteksi kondisi K.O. dan menampilkan statistik telemetri pertempuran.")
    add_p(doc, "5. Sistem menyediakan server WebSocket lokal untuk menerima input sentuhan dari smartphone Android Player 1 dan Player 2 via Dual QR Code.")
    add_p(doc, "Kebutuhan Non-Fungsional:")
    add_p(doc, "1. Responsivitas eksekusi aksi API di bawah 15ms dan latensi frame WebSocket di bawah 5ms.")
    add_p(doc, "2. Kompatibilitas cross-browser (Chrome, Firefox, Edge, Mobile Webkit).")
    add_p(doc, "3. Kode mematuhi standar PSR-4 dan bebas error/warning pada PHP 8.3.")

    add_heading_2(doc, "3.3 Use Case Diagram Sistem")
    add_p(doc, "Use case diagram menggambarkan interaksi antara pemain dengan sistem permainan MBG:")
    add_figure(doc, os.path.join(ASSETS_DIR, "use_case_diagram.png"), "3.1", "Use Case Diagram Sistem MBG")

    add_heading_2(doc, "3.4 Activity Diagram Alur Pertarungan")
    add_p(doc, "Activity diagram menggambarkan siklus input giliran pertempuran, kalkulasi mitigasi damage, dan validasi kondisi Game Over:")
    add_figure(doc, os.path.join(ASSETS_DIR, "activity_diagram.png"), "3.2", "Activity Diagram Alur Pertarungan Turn/Tick")

    add_heading_2(doc, "3.5 UML Class Diagram Arsitektur MBG")
    add_p(doc, "Class diagram mendokumentasikan relasi struktural antara FighterInterface, Fighter (Abstract Class), 5 Child Classes, Skill, Arena, dan BattleEngine:")
    add_figure(doc, os.path.join(ASSETS_DIR, "class_diagram.png"), "3.3", "UML Class Diagram Arsitektur Game MBG", width_inches=6.2)

    add_heading_2(doc, "3.6 Desain Roster 5 Karakter Petarung")
    add_p(doc, "Setiap karakter petarung dirancang dengan identitas, karakteristik psikologis, serta keunikan mekanik bertarung tersendiri:")
    add_p(doc, "1. BAHLUL (The Goblin Summoner): Mengandalkan kekuatan mistis dan crowd control. Memiliki HP tebal (1150) dan Attack tinggi (90), namun gerakannya lambat (Speed 35). Skill: Tsunami Etanol (Area Slow), Goblin Summon (Minion Horde), dan Ultimate: Goblin Apocalypse. Pasif: Goblin Power (+5% akumulasi energi per pukulan).")
    add_p(doc, "2. TIFUZIA (The Diploma Inspector): Menuntut transparansi akademik melalui serangan argumen hukum yang tajam. Statistik: HP 980, Attack 82, Defense 36, Speed 60. Skill: Mana Ijazah? (Slow debuff), Bacot Overload (Multi-hit soundwave), dan Ultimate: Sidang Terbuka (Stun pengadilan). Pasif: Noise Pollution (Peluang 25% memotong attack lawan -15%).")
    add_p(doc, "3. BROWN TEDDY (The Affection Attacker): Menggunakan manipulasi kasih sayang dan pelukan berdaya hancur tinggi. Bertipe Tanker dengan pertahanan tertinggi: HP 1200, Defense 55, Attack 76, Speed 40. Skill: Kiss Attack (Debuff charm), Teddy Hug (Stun & bleed), dan Ultimate: Love Bomb. Pasif: Attention Seeker (+50% bonus defense saat HP kritis <30%).")
    add_p(doc, "4. FUFUFIFI (The Government Critic): Karakter aktivis vokal pembela aspirasi rakyat dengan serangan orasi kritis. Statistik: HP 1050, Attack 85, Defense 42, Speed 52. Skill: Kritik Tajam (Memotong Defense lawan -25%), Aspirasi Rakyat (Knockback masif), dan Ultimate: Revolusi Argumen. Pasif: Voice of People (+8% akumulasi energi ekstra per pukulan).")
    add_p(doc, "5. WILI WONKA (The Viral Opportunist): Karakter lincah berorientasi konten media sosial dengan pergerakan tercepat: Speed 68, HP 940, Attack 88, Defense 32. Skill: Chocolate Lick (Self-heal 45 HP + Attack buff 20%), Jilat Panggung (Memotong attack lawan -20%), dan Ultimate: Viral Moment (Blitz kamera bertubi-tubi). Pasif: FYP Hunter (Bonus energi ekstra saat combo).")

    add_table_caption(doc, "3.1", "Spesifikasi Atribut Roster Karakter MBG")
    tbl_char = doc.add_table(rows=6, cols=6)
    char_rows = [
        ("Nama Karakter", "Julukan", "HP", "ATK", "DEF", "SPD"),
        ("Bahlul", "The Goblin Summoner", "1150", "90", "45", "35"),
        ("Tifuzia", "The Diploma Inspector", "980", "82", "36", "60"),
        ("Brown Teddy", "The Affection Attacker", "1200", "76", "55", "40"),
        ("Fufufifi", "The Government Critic", "1050", "85", "42", "52"),
        ("Wili Wonka", "The Viral Opportunist", "940", "88", "32", "68")
    ]
    for r_i, row in enumerate(char_rows):
        for c_i, val in enumerate(row):
            tbl_char.cell(r_i, c_i).text = val
    style_academic_table(tbl_char, col_widths=[Inches(1.2), Inches(2.2), Inches(0.6), Inches(0.6), Inches(0.6), Inches(0.6)])

    add_heading_2(doc, "3.7 Desain Formula Matematis Combat System")
    add_p(doc, "Sistem pertarungan dihitung secara deterministik dan adil melalui kelas DamageCalculator dengan formula matematis:")
    add_p(doc, "MitigationRatio = Defense / (100 + Defense)", bold_prefix="Formula Mitigasi: ")
    add_p(doc, "FinalDamage = BaseDamage * (1 - MitigationRatio)", bold_prefix="Formula Damage Bersih: ")
    add_p(doc, "Karakter dengan Defense 55 menerima mitigasi sebesar 35.5%, menjamin pertempuran yang seimbang tanpa ada karakter yang menjadi terlalu overpowered (broken).")

    add_heading_2(doc, "3.8 Desain Arsitektur Real-Time WebSocket & Dual Android Gamepad")
    add_p(doc, "Untuk menghadirkan pengalaman bermain bergaya konsol arkade modern, dirancang arsitektur tripartite yang menghubungkan smartphone Android, server WebSocket PHP 8.3, dan antarmuka host game di laptop:")
    add_figure(doc, os.path.join(ASSETS_DIR, "websocket_architecture_diagram.png"), "3.4", "Diagram Arsitektur Real-Time WebSocket dan Dual Smartphone Controller", width_inches=6.2)
    add_p(doc, "1. Smartphone Android (Web Client): Membuka controller.html melalui pemindaian QR Code pada layar judul. Antarmuka sentuh menyediakan tombol D-Pad digital dan 4 tombol aksi. Menggunakan PointerEvent Capture API untuk mencegah pelepasan sentuhan saat jari bergeser.")
    add_p(doc, "2. Pure PHP 8.3 WebSocket Server (WebSocketServer.php): Beroperasi pada protokol TCP port 8086. Menangani RFC 6455 Handshake menggunakan hash SHA-1 Sec-WebSocket-Accept, frame de-masking berkecepatan tinggi, dan multiplexing soket via socket_select().")
    add_p(doc, "3. Host Display Engine (game.js): Menerima paket input JSON dan memetakannya ke vektor input terpisah (p1Keys dan p2Keys). Sistem secara otomatis mengaktifkan penanda mode isP2Human() yang mematikan kecerdasan buatan CPU ketika Player 2 dikendalikan oleh manusia, serta memicu cut-in visual animasi jurus ultimate yang simetris (kiri untuk P1, kanan untuk P2).")

    doc.add_page_break()

    # =========================================================================
    # BAB IV IMPLEMENTASI SISTEM
    # =========================================================================
    add_heading_1(doc, "BAB IV IMPLEMENTASI SISTEM")

    add_heading_2(doc, "4.1 Struktur Direktori Project")
    add_p(doc, "Arsitektur kode disusun mengikuti standar PSR-4 Autoloading dengan modularitas bersih:")
    add_p(doc, "• app/Core/ : Memuat Fighter.php (Abstract Class), BattleEngine.php, DamageCalculator.php, GameManager.php, CharacterFactory.php, WebSocketServer.php\n"
               "• app/Characters/ : Memuat 5 Child Classes (Bahlul.php, Tifuzia.php, BrownTeddy.php, Fufufifi.php, WiliWonka.php)\n"
               "• app/Interfaces/ : Memuat FighterInterface.php, SkillInterface.php\n"
               "• app/Skills/ : Memuat Skill.php\n"
               "• app/Arenas/ : Memuat Arena.php\n"
               "• public/ : Memuat index.html, controller.html, css/style.css, js/game.js, js/renderer.js, js/sprites.js, js/audio.js, dan api/\n"
               "• server_ws.php : Entry point daemon WebSocket Server CLI\n"
               "• tests/ : Memuat test_oop.php (Unit test suite 33 assertions)")

    add_heading_2(doc, "4.2 Implementasi Interface dan Abstract Class Fighter")
    add_p(doc, "FighterInterface mendefinisikan kontrak method publik seperti getName(), getHealth(), takeDamage(), heal(), attack(), dan executeSpecial(). Kelas abstrak Fighter mengimplementasikan interface ini serta menyediakan 15 protected attributes dan default concrete methods.")

    add_heading_2(doc, "4.3 Implementasi 5 Child Classes & Method Overriding")
    add_p(doc, "Setiap child class mengekstensi Fighter dan meng-override method attack() untuk menambahkan efek pasif heroik:")
    add_p(doc, "• Bahlul: Menambahkan bonus energi +5% per basic attack (Goblin Power).\n"
               "• Tifuzia: Memberikan peluang 25% distraksi yang memotong Attack lawan sebesar 15% (Noise Pollution).\n"
               "• Brown Teddy: Mengaktifkan pasif Attention Seeker yang meningkatkan Defense +50% saat HP kritis < 30%.\n"
               "• Fufufifi: Akumulasi energi ekstra +8% per serangan (Voice of People).\n"
               "• Wili Wonka: Menghasilkan self-heal dan peningkatan Attack saat melancarkan kombo (FYP Hunter).")

    add_heading_2(doc, "4.4 Implementasi Enkapsulasi & Boundary Validation")
    add_p(doc, "Seluruh mutasi status dilindungi method setter dan operasi matematis yang menjamin nilai berada pada batas valid:")
    add_p(doc, "public function heal(int $amount): int {\n"
               "    $actualHeal = min($amount, $this->maxHealth - $this->health);\n"
               "    $this->health += $actualHeal;\n"
               "    return $actualHeal;\n"
               "}", bold_prefix="Kode Enkapsulasi Heal: ")

    add_heading_2(doc, "4.5 Implementasi Polimorfisme & CharacterFactory")
    add_p(doc, "CharacterFactory memanfaatkan fitur match expression di PHP 8.3 untuk menginstansiasi objek petarung secara dinamis berdasarkan identifier string.")

    add_heading_2(doc, "4.6 Implementasi Core Engine Pertarungan (BattleEngine)")
    add_p(doc, "BattleEngine mengatur urutan ronde (turn/tick), eksekusi aksi, validasi cooldown skill, akumulasi energi ultimate, dan pencatatan riwayat pertarungan.")

    add_heading_2(doc, "4.7 Implementasi Antarmuka Web (Canvas 2D & Web Audio)")
    add_p(doc, "Sisi frontend memanfaatkan HTML5 Canvas 2D untuk rendering prosedural pixel art 60 FPS dan Web Audio API untuk synthesizer efek suara dan musik 8-bit retro.")

    add_heading_2(doc, "4.8 Dokumentasi Visual Antarmuka Aplikasi Aktual")
    add_p(doc, "Berikut adalah dokumentasi antarmuka aktual yang diambil langsung dari lingkungan eksekusi permainan:")

    add_figure(doc, os.path.join(ASSETS_DIR, "screenshot_title.png"), "4.1", "Tampilan Menu Utama Game MBG (Title Screen)")
    add_figure(doc, os.path.join(ASSETS_DIR, "screenshot_select.png"), "4.2", "Tampilan Pemilihan Karakter & Arena (Character Select)")
    add_figure(doc, os.path.join(ASSETS_DIR, "screenshot_battle.png"), "4.3", "Tampilan Arena Pertarungan 2D Canvas & HUD Pertarungan")
    add_figure(doc, os.path.join(ASSETS_DIR, "screenshot_oop_modal.png"), "4.4", "Modal Dokumentasi Arsitektur OOP & Pemenuhan Ketentuan UTS")

    add_heading_2(doc, "4.9 Implementasi Server WebSocket RFC 6455 Murni & Mobile Touch Gamepad")
    add_p(doc, "Salah satu keunggulan teknis signifikan dalam proyek ini adalah terwujudnya server WebSocket RFC 6455 murni (WebSocketServer.php) tanpa memanfaatkan pustaka eksternal seperti Ratchet atau Swoole. Seluruh proses jaringan dikendalikan langsung melalui ekstensi Socket bawaan PHP 8.3:")
    add_p(doc, "1. Handshake Protocol: Server menerima HTTP Upgrade Request dari klien, mengekstrak header Sec-WebSocket-Key, menambahkan string konkatenasi GUID khusus (258EAFA5-E914-47DA-95CA-C5AB0DC85B11), lalu melakukan hashing SHA-1 biner sebelum di-encode ke Base64 sebagai Sec-WebSocket-Accept.")
    add_p(doc, "2. Frame De-masking: Berdasarkan standar RFC 6455, frame yang dikirimkan oleh klien web browser wajib di-mask dengan kunci 4-byte. Server membaca panjang payload (7-bit, 16-bit extended, atau 64-bit), kemudian merekonstruksi payload teks asli menggunakan operasi bitwise XOR.")
    add_p(doc, "3. Safe Client Mapping: Pada PHP 8.3, soket direpresentasikan sebagai instans kelas Socket. Penggunaan spl_object_id($socket) diterapkan secara ketat guna menggantikan operasi konversi integer implisit yang memicu warning pada PHP 8.3.")
    add_p(doc, "4. Pointer Capture Touch Gamepad: Pada file controller.html, tombol kontrol sentuh memanfaatkan API modern elem.setPointerCapture(e.pointerId). Hal ini mengeliminasi masalah umum pada gamepad web di mana input tombol macet (stuck) ketika ibu jari pemain bergeser keluar dari batas elemen visual tombol.")

    add_heading_2(doc, "4.10 Arbitrase Multi-Controller dan Symmetrical Ultimate VFX")
    add_p(doc, "Guna mendukung pertempuran multipemain yang adil dan responsif:")
    add_p(doc, "1. Input Vector Separation: Input Player 1 dan Player 2 dipisahkan secara total ke dalam struktur data this.p1Keys dan this.p2Keys. Tindakan menekan tombol arah panah pada Player 2 tidak akan memicu aksi Player 1.")
    add_p(doc, "2. isP2Human Arbitrator: Engine secara otomatis mendeteksi apakah Player 2 dikontrol oleh gamepad smartphone atau mode PvP keyboard. Jika terdeteksi manusia, loop AI CPU dimatikan secara total sehingga karakter Player 2 sepenuhnya merespons pemain tanpa ada langkah otomatis bot.")
    add_p(doc, "3. Symmetrical VFX Cut-in: Saat Player 1 melancarkan jurus pamungkas (Ultimate), animasi cut-in banner muncul meluncur dari sisi kiri layar. Sebaliknya, jika Player 2 atau musuh (seperti Brown Teddy) melancarkan jurus ultimate (Love Bomb), banner animasi dirender secara simetris di sisi kanan layar lengkap dengan efek cermin (mirroring), menjamin kejelasan visual bagi kedua pemain.")

    doc.add_page_break()

    # =========================================================================
    # BAB V PENGUJIAN DAN EVALUASI
    # =========================================================================
    add_heading_1(doc, "BAB V PENGUJIAN DAN EVALUASI")

    add_heading_2(doc, "5.1 Skenario Pengujian Unit Test OOP")
    add_p(doc, "Pengujian dilakukan secara otomatis menggunakan skrip unit test CLI (tests/test_oop.php) yang memverifikasi 10 kategori aspek berorientasi objek dengan total 33 assertions.")

    add_heading_2(doc, "5.2 Tabel Hasil Pengujian 10 Kategori PBO (33 Test Cases)")
    add_table_caption(doc, "5.1", "Rekapitulasi Hasil Unit Testing 10 Kategori PBO (33 Test Cases)")
    tbl_test = doc.add_table(rows=11, cols=5)
    test_rows = [
        ("No", "Kategori Pengujian PBO", "Jumlah Uji", "Hasil Harapan", "Status"),
        ("1.", "Instansiasi Objek 5 Karakter", "5 Tests", "Objek teralokasi dengan atribut default valid", "LULUS (100%)"),
        ("2.", "Pewarisan Kelas (Inheritance)", "5 Tests", "Child class terbukti instance sah dari Fighter", "LULUS (100%)"),
        ("3.", "Enkapsulasi & Boundary HP", "4 Tests", "HP tidak minus, heal max batas, energy 0-100%", "LULUS (100%)"),
        ("4.", "Method Overriding Pasif Hero", "1 Test", "Bonus pasif tereksekusi pada serangan turunan", "LULUS (100%)"),
        ("5.", "Polimorfisme Pemanggilan Attack", "5 Tests", "Kalkulasi polimorfik berjalan tepat di 5 hero", "LULUS (100%)"),
        ("6.", "Skill Cooldown & Syarat Ultimate", "5 Tests", "Cooldown memblokir skill, ultimate butuh 100%", "LULUS (100%)"),
        ("7.", "Formula Mitigasi Defense", "1 Test", "Defense tinggi mereduksi damage secara rasional", "LULUS (100%)"),
        ("8.", "Alur Giliran Battle Engine", "3 Tests", "Eksekusi giliran P1/P2 tercatat akurat di log", "LULUS (100%)"),
        ("9.", "Integrasi Data Arena", "2 Tests", "Minimal 4 arena terdaftar dan dapat dipanggil", "LULUS (100%)"),
        ("10.", "Kondisi Kemenangan & K.O.", "2 Tests", "Deteksi K.O. akurat dan pemenang tercatat benar", "LULUS (100%)")
    ]
    for r_i, row in enumerate(test_rows):
        for c_i, val in enumerate(row):
            tbl_test.cell(r_i, c_i).text = val
    style_academic_table(tbl_test, col_widths=[Inches(0.5), Inches(2.2), Inches(0.8), Inches(2.1), Inches(0.9)])

    add_heading_2(doc, "5.3 Analisis Kinerja dan Validasi Aturan Pertarungan")
    add_p(doc, "Berdasarkan eksekusi pengujian otomatis:")
    add_p(doc, "1. Seluruh 33 butir uji dinyatakan LULUS (PASS) tanpa ada kegagalan sama sekali (Zero Failure Rate).")
    add_p(doc, "2. Mekanisme enkapsulasi terbukti mampu menahan anomali status, menjaga nilai HP dalam batas [0, MaxHealth].")
    add_p(doc, "3. Waktu respon eksekusi aksi pertarungan melalui REST JSON API rata-rata berada di bawah 12 milidetik pada PHP built-in server lokal, menjamin pengalaman bermain yang mulus dan bebas latensi.")

    add_heading_2(doc, "5.4 Pengujian Komprehensif Arsitektur, Multi-Controller, dan Zero-Bug Audit")
    add_p(doc, "Selain pengujian unit logika PBO, dilakukan audit komprehensif pada lapisan integrasi jaringan, kontroler nirkabel, dan antarmuka responsif:")
    add_table_caption(doc, "5.2", "Rekapitulasi Pengujian Integrasi Multi-Controller, WebSocket & Visual Engine")
    tbl_audit = doc.add_table(rows=9, cols=4)
    audit_rows = [
        ("No", "Parameter Pengujian Integrasi", "Metode & Lingkungan Uji", "Hasil Pengamatan"),
        ("1.", "Linting Sintaks Seluruh File PHP (22 File)", "PHP 8.3 CLI (php -l)", "100% Bebas Syntax Error (0 Error)"),
        ("2.", "Linting Skrip Frontend (5 File JS)", "Node.js Compiler (node -c)", "100% Bebas Syntax Error (0 Error)"),
        ("3.", "Kompatibilitas Objek Socket PHP 8.3", "spl_object_id() Hash Keying", "Bebas Peringatan Konversi Objek ke Int"),
        ("4.", "Pairing Dual QR Code Smartphone", "Kamera Android Scanner LAN", "Koneksi Otomatis Terhubung < 1 detik"),
        ("5.", "Isolasi Vektor Input P1 vs P2", "Dual Input Keyboard & Phone", "100% Bebas Cross-talk / Saling Kunci"),
        ("6.", "Pointer Capture Touch Gamepad", "Multi-touch Drag Android Chrome", "Zero Stuck Button saat Jari Bergeser"),
        ("7.", "Arbitrase Mode P2 Human vs CPU AI", "isP2Human() State Switch", "AI CPU Otomatis Non-Aktif saat P2 Human"),
        ("8.", "Symmetrical Ultimate VFX Rendering", "Ultimate P1 Kiri vs P2 Kanan", "Banner Rendition Simetris Sesuai Sisi")
    ]
    for r_i, row in enumerate(audit_rows):
        for c_i, val in enumerate(row):
            tbl_audit.cell(r_i, c_i).text = val
    style_academic_table(tbl_audit, col_widths=[Inches(0.5), Inches(2.4), Inches(2.0), Inches(1.8)])

    doc.add_page_break()

    # =========================================================================
    # BAB VI PENUTUP
    # =========================================================================
    add_heading_1(doc, "BAB VI PENUTUP")

    add_heading_2(doc, "6.1 Kesimpulan")
    add_p(doc, "Berdasarkan seluruh tahapan analisis, perancangan, implementasi, dan pengujian yang telah dilaksanakan pada proyek game MBG (Mobile Battle Government), dapat diambil kesimpulan sebagai berikut:")
    add_p(doc, "1. Proyek MBG membuktikan secara empiris bahwa bahasa pemrograman PHP 8.3 memiliki kapabilitas arsitektur berorientasi objek murni (Object-Oriented Programming) yang sangat tangguh untuk menangani komputasi logika pertempuran real-time, manajemen state deterministik, dan enkapsulasi boundary checking yang aman.")
    add_p(doc, "2. Seluruh ketentuan Ujian Tengah Semester (UTS) PBO telah terpenuhi secara sempurna, mencakup penerapan 1 Abstract Parent Class (Fighter), 5 Child Classes unik (Bahlul, Tifuzia, Brown Teddy, Fufufifi, Wili Wonka) dengan atribut dan method khusus, implementasi polimorfisme melalui method overriding, serta pembuktian kelulusan 100% pada 33 butir unit test suite.")
    add_p(doc, "3. Keberhasilan implementasi server WebSocket RFC 6455 murni (zero-dependency) pada backend PHP 8.3 memberikan nilai inovasi tinggi, memungkinkan smartphone Android berfungsi sebagai pengontrol game nirkabel (wireless gamepad) melalui pemindaian Dual QR Code yang mulus dan bebas hambatan.")
    add_p(doc, "4. Integrasi arsitektur multi-kontroler yang memisahkan vektor masukan secara independen dan penyajian grafis simetris menghasilkan antarmuka permainan yang sangat responsif, seimbang, dan ramah pengguna.")

    add_heading_2(doc, "6.2 Saran dan Pengembangan Masa Depan")
    add_p(doc, "Untuk pengembangan sistem MBG lebih lanjut pada tahapan Tugas Akhir atau rilis publik, kami merekomendasikan:")
    add_p(doc, "1. Penambahan protokol WebRTC DataChannel untuk mendukung mode pertarungan Online Multiplayer peer-to-peer lintas jaringan publik (Internet) tanpa membebani bandwidth server sentral.")
    add_p(doc, "2. Integrasi persistensi basis data relasional (MariaDB / PostgreSQL) untuk menyimpan leaderboard nilai skor tertinggi, profil pemain, statistik win-rate, dan riwayat pertandingan secara permanen.")
    add_p(doc, "3. Penerapan sistem Lobby Room Code dan matchmaking otomatis untuk turnamen esport kampus berbasis web.")
    add_p(doc, "4. Pengembangan algoritma kecerdasan buatan (AI) berbasis Finite State Machine (FSM) atau Reinforcement Learning agar bot komputer mampu memprediksi kombo lawan.")

    doc.add_page_break()

    # =========================================================================
    # DAFTAR PUSTAKA
    # =========================================================================
    h_dp = doc.add_paragraph()
    h_dp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_dp.paragraph_format.space_before = Pt(12)
    h_dp.paragraph_format.space_after = Pt(16)
    r_dp = h_dp.add_run("DAFTAR PUSTAKA")
    r_dp.font.name = 'Times New Roman'
    r_dp.font.size = Pt(14)
    r_dp.font.bold = True

    references = [
        "Fette, I., & Melnikov, A. (2011). The WebSocket Protocol (RFC 6455). Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC6455",
        "Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software. Boston: Addison-Wesley.",
        "Martin, R. C. (2018). Clean Architecture: A Craftsman's Guide to Software Structure and Design. Boston: Prentice Hall.",
        "Nielsen, J. (1994). Usability Engineering. San Francisco: Morgan Kaufmann Publishers.",
        "PHP Documentation Group. (2024). PHP Manual: Classes, Objects, and Socket Extension (PHP 8). Retrieved November 12, 2026, from https://www.php.net/manual/en/",
        "Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). New York: McGraw-Hill Education.",
        "Schildt, H. (2022). Java: The Complete Reference (12th ed.). New York: McGraw-Hill Education.",
        "Welling, L., & Thomson, L. (2017). PHP and MySQL Web Development (5th ed.). Boston: Addison-Wesley."
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.3
        p_ref.paragraph_format.space_after = Pt(6)
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)
        r = p_ref.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # LAMPIRAN
    # =========================================================================
    add_heading_1(doc, "LAMPIRAN")

    add_heading_2(doc, "Lampiran 1: Tautan Video Demonstrasi dan Penjelasan Program")
    add_p(doc, "Tautan Video YouTube: [LINK VIDEO YOUTUBE AKAN DITAMBAHKAN SETELAH VIDEO DIUNGGAH]", bold_prefix="")
    add_p(doc, "Repository Kode Sumber: Kelompok 1 TI UMMI - MBG Fighting Engine PHP 8.3", bold_prefix="")

    add_heading_2(doc, "Lampiran 2: Cara Menjalankan Aplikasi dan Controller Nirkabel Secara Lokal")
    add_p(doc, "1. Buka terminal pertama pada direktori project MBG dan jalankan daemon WebSocket Server:\n"
               "   php server_ws.php\n"
               "   (Server WebSocket akan aktif mendengarkan koneksi pada port 8086)\n\n"
               "2. Buka terminal kedua dan jalankan PHP built-in web server mengarah ke folder public:\n"
               "   php -S 0.0.0.0:8000 -t public\n\n"
               "3. Akses antarmuka game melalui peramban web pada laptop/desktop:\n"
               "   http://localhost:8000\n\n"
               "4. Hubungkan Gamepad Smartphone Android:\n"
               "   • Pastikan smartphone Android terhubung pada jaringan Wi-Fi lokal yang sama dengan laptop.\n"
               "   • Klik tombol QR Code di layar judul untuk Player 1 atau Player 2.\n"
               "   • Pindai kode QR menggunakan kamera ponsel atau peramban Chrome.\n"
               "   • Antarmuka virtual gamepad (controller.html) akan terbuka dan otomatis terhubung.\n\n"
               "5. Untuk menjalankan unit test suite otomatis:\n"
               "   php tests/test_oop.php")

    # Save docx
    doc.save(OUTPUT_DOCX)
    print(f"Laporan Praktikum successfully created at: {OUTPUT_DOCX}")

if __name__ == '__main__':
    build_document()
