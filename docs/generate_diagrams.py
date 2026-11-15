import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set clean styling
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['axes.edgecolor'] = '#333333'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_class_diagram():
    fig, ax = plt.subplots(figsize=(14, 10), dpi=300)
    ax.set_xlim(0, 140)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(70, 96, "UML CLASS DIAGRAM - MBG: MOBILE BATTLE GOVERNMENT", 
            fontsize=16, fontweight='bold', ha='center', color='#0f172a')
    ax.text(70, 93, "Arsitektur Pemrograman Berorientasi Objek (PBO) - PHP 8.3", 
            fontsize=11, fontstyle='italic', ha='center', color='#475569')

    def draw_box(x, y, w, h, title, stereotype="", attrs=[], methods=[], bg='#f8fafc', border='#2563eb'):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
                                      facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(rect)
        
        # Header line
        curr_y = y + h - 2.5
        if stereotype:
            ax.text(x + w/2, curr_y, stereotype, fontsize=8, fontstyle='italic', ha='center', color='#475569')
            curr_y -= 2.2
        ax.text(x + w/2, curr_y, title, fontsize=10, fontweight='bold', ha='center', color='#0f172a')
        curr_y -= 2.0
        ax.plot([x, x+w], [curr_y, curr_y], color=border, linewidth=1)
        curr_y -= 1.8

        # Attributes
        for a in attrs:
            ax.text(x + 1.5, curr_y, a, fontsize=7.5, family='monospace', color='#1e293b')
            curr_y -= 1.8

        if methods:
            ax.plot([x, x+w], [curr_y, curr_y], color=border, linewidth=1)
            curr_y -= 1.8
            # Methods
            for m in methods:
                ax.text(x + 1.5, curr_y, m, fontsize=7.5, family='monospace', color='#0f172a')
                curr_y -= 1.8

    # 1. FighterInterface
    draw_box(10, 68, 32, 22, "FighterInterface", "<<interface>>", [
        "+ getName(): string",
        "+ getHealth(): int",
        "+ getAttack(): int",
        "+ getDefense(): int",
        "+ isAlive(): bool"
    ], [
        "+ attack(target): array",
        "+ takeDamage(int): int",
        "+ heal(int): int"
    ], bg='#f0fdf4', border='#16a34a')

    # 2. Abstract Class Fighter
    draw_box(52, 54, 42, 36, "Fighter", "<<abstract>>", [
        "# name: string",
        "# health: int",
        "# maxHealth: int",
        "# attack: int",
        "# defense: int",
        "# speed: int",
        "# ultimateEnergy: int (0-100)",
        "# specialSkills: Skill[]",
        "# ultimateSkill: Skill"
    ], [
        "+ attack(target): array",
        "+ takeDamage(int): int",
        "+ heal(int): int",
        "+ useSpecialSkill(idx, target)",
        "+ useUltimateSkill(target)",
        "+ resetForBattle(): void",
        "+ {abstract} activatePassive()",
        "+ {abstract} getSpecialAbilityDesc()"
    ], bg='#eff6ff', border='#1d4ed8')

    # Connect Interface to Abstract Class
    ax.annotate("", xy=(52, 79), xytext=(42, 79),
                arrowprops=dict(arrowstyle="-|>", linestyle="dashed", color="#16a34a", lw=1.5))
    ax.text(47, 81, "implements", fontsize=7.5, ha='center', color='#16a34a')

    # 3. 5 Child Classes at bottom
    child_classes = [
        ("Bahlul", 4, [
            "- activeGoblins: int",
            "- etanolWaveCharge: float",
            "- crowdControlActive: bool",
            "- summonerChant: string",
            "- totalSummonsCount: int"
        ], [
            "+ summonGoblins(int): int",
            "+ chargeEtanolWave(float)",
            "+ toggleCrowdControl(bool)",
            "+ getGoblinHordeStatus()"
        ]),
        ("Tifuzia", 30, [
            "- inspectionRounds: int",
            "- diplomaVerified: bool",
            "- noiseDecibel: float",
            "- academicShieldActive: bool",
            "- controversyStreak: int"
        ], [
            "+ conductDiplomaAudit()",
            "+ triggerNoisePollution()",
            "+ deployAcademicShield()",
            "+ getAuditSummary()"
        ]),
        ("BrownTeddy", 56, [
            "- affectionMeter: int",
            "- hugsGivenCount: int",
            "- fluffinessArmor: float",
            "- kissMultiplier: float",
            "- cutenessOverload: bool"
        ], [
            "+ hugOpponent(target)",
            "+ blowKiss(target)",
            "+ triggerCutenessOverload()",
            "+ getAffectionStatus()"
        ]),
        ("Fufufifi", 82, [
            "- critiqueStacks: int",
            "- protestSupportLevel: float",
            "- argumentIntensity: int",
            "- megaphonePower: float",
            "- publicRallyActive: bool"
        ], [
            "+ launchSharpCritique()",
            "+ waveProtestBanner()",
            "+ amplifyMegaphone(float)",
            "+ getRevolutionStatus()"
        ]),
        ("WiliWonka", 108, [
            "- trendingRank: int",
            "- chocolateSupply: int",
            "- viralViewersCount: int",
            "- fypBonusActive: bool",
            "- stagePresence: float"
        ], [
            "+ eatSpecialChocolate()",
            "+ broadcastViralContent()",
            "+ triggerFYPAlgorithm()",
            "+ getTrendingMetrics()"
        ])
    ]

    for name, cx, attrs, methods in child_classes:
        draw_box(cx, 10, 24, 34, name, "<<child class>>", attrs, methods, bg='#fffbeb', border='#d97706')
        # Inheritance arrows pointing up to Fighter
        mid_x = cx + 12
        ax.plot([mid_x, mid_x], [44, 49], color="#d97706", lw=1.2)
        ax.plot([mid_x, 73], [49, 49], color="#d97706", lw=1.2)

    # Arrow head to Fighter
    ax.annotate("", xy=(73, 54), xytext=(73, 49),
                arrowprops=dict(arrowstyle="-|>", color="#d97706", lw=1.5))
    ax.text(76, 51, "extends", fontsize=8, color="#d97706")

    # 4. Engine & Helper Classes on right
    draw_box(102, 54, 34, 36, "BattleEngine", "", [
        "- player1: Fighter",
        "- player2: Fighter",
        "- arena: Arena",
        "- gameMode: string",
        "- combatLog: array",
        "- isGameOver: bool"
    ], [
        "+ executeAction(actor, act)",
        "+ computeAiMove(): array",
        "+ checkVictoryConditions()",
        "+ getBattleState(): array"
    ], bg='#fdf2f8', border='#db2777')

    # Association between BattleEngine and Fighter
    ax.annotate("", xy=(94, 72), xytext=(102, 72),
                arrowprops=dict(arrowstyle="->", color="#db2777", lw=1.5))
    ax.text(98, 74, "1..2", fontsize=7.5, color="#db2777")

    plt.tight_layout()
    out_file = os.path.join(ASSETS_DIR, "class_diagram.png")
    plt.savefig(out_file, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Class diagram created successfully at {out_file}!")

def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 90)
    ax.axis('off')

    ax.text(60, 86, "USE CASE DIAGRAM - MBG: MOBILE BATTLE GOVERNMENT", 
            fontsize=15, fontweight='bold', ha='center', color='#0f172a')

    # System boundary box
    sys_box = patches.FancyBboxPatch((30, 8), 65, 74, boxstyle="round,pad=0.2",
                                     facecolor='#f8fafc', edgecolor='#64748b', linewidth=1.5)
    ax.add_patch(sys_box)
    ax.text(62.5, 78, "Sistem Pertarungan MBG", fontsize=12, fontweight='bold', ha='center', color='#1e293b')

    # Draw Actor Left: Pemain (Player)
    def draw_actor(x, y, name):
        ax.plot([x, x], [y+5, y+2], color='#0f172a', lw=2) # body
        ax.plot([x-3, x+3], [y+4, y+4], color='#0f172a', lw=2) # arms
        ax.plot([x, x-3], [y+2, y-3], color='#0f172a', lw=2) # leg L
        ax.plot([x, x+3], [y+2, y-3], color='#0f172a', lw=2) # leg R
        head = patches.Circle((x, y+7), 2, facecolor='#f8fafc', edgecolor='#0f172a', lw=2)
        ax.add_patch(head)
        ax.text(x, y-6, name, fontsize=10, fontweight='bold', ha='center', color='#0f172a')

    draw_actor(15, 45, "Pemain\n(Keyboard / Gamepad)")
    draw_actor(107, 45, "Sistem AI\n(Komputer)")

    # Use Cases (Ellipses)
    use_cases = [
        ("Memilih Mode Permainan\n(Arcade, PvP, Training)", 62.5, 68),
        ("Memilih Karakter Petarung\n(5 Roster Hero)", 62.5, 57),
        ("Koneksi Wireless Gamepad\n(QR Code Scan Android)", 62.5, 46),
        ("Melakukan Serangan & Combo\n(Basic Attack & Movement)", 62.5, 35),
        ("Mengaktifkan Special Skill & Ultimate\n(Symmetrical VFX Cut-in)", 62.5, 24),
        ("Melihat Statistik Pertandingan & Rematch", 62.5, 13)
    ]

    for title, uc_x, uc_y in use_cases:
        ellipse = patches.Ellipse((uc_x, uc_y), 32, 7.5, facecolor='#eff6ff', edgecolor='#2563eb', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(uc_x, uc_y, title, fontsize=8, ha='center', va='center', color='#1e293b', fontweight='bold')

        # Connect to Player
        ax.plot([19, uc_x - 16], [45, uc_y], color='#3b82f6', lw=1.2)

        # Connect AI to combat use cases
        if uc_y in [35, 24]:
            ax.plot([103, uc_x + 16], [45, uc_y], color='#ef4444', lw=1.2, linestyle='--')

    plt.tight_layout()
    out_file = os.path.join(ASSETS_DIR, "use_case_diagram.png")
    plt.savefig(out_file, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Use case diagram created successfully at {out_file}!")

def create_activity_diagram():
    fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    ax.text(50, 116, "ACTIVITY DIAGRAM - COMBAT FLOW PERTARUNGAN", 
            fontsize=14, fontweight='bold', ha='center', color='#0f172a')

    # Initial node
    init_node = patches.Circle((50, 110), 2.5, facecolor='#0f172a', edgecolor='#0f172a')
    ax.add_patch(init_node)

    activities = [
        ("Inisialisasi Pertandingan & Karakter (GameManager)", 100),
        ("Input Pemain (Keyboard Fisik / WebSocket Gamepad Android)", 88),
        ("Validasi Enkapsulasi: Cooldown & Energi (Fighter)", 76),
        ("Perhitungan Damage & Mitigasi Defense (DamageCalculator)", 62),
        ("Update HP, Akumulasi Energi, & Terapkan Efek Pasif", 48),
        ("Periksa Kondisi K.O. / Kemenangan (BattleEngine)", 34),
        ("Tampilkan Hasil Pertandingan & Telemetri Pertarungan", 16)
    ]

    for text, ay in activities:
        box = patches.FancyBboxPatch((15, ay - 4), 70, 8, boxstyle="round,pad=0.5",
                                     facecolor='#f0fdf4', edgecolor='#16a34a', lw=1.5)
        ax.add_patch(box)
        ax.text(50, ay, text, fontsize=9, fontweight='bold', ha='center', va='center', color='#14532d')

    # Connect nodes with arrows
    arrow_props = dict(arrowstyle="->", color="#16a34a", lw=1.5)
    ax.annotate("", xy=(50, 104), xytext=(50, 107.5), arrowprops=arrow_props)
    ax.annotate("", xy=(50, 92), xytext=(50, 96), arrowprops=arrow_props)
    ax.annotate("", xy=(50, 80), xytext=(50, 84), arrowprops=arrow_props)
    ax.annotate("", xy=(50, 66), xytext=(50, 72), arrowprops=arrow_props)
    ax.annotate("", xy=(50, 52), xytext=(50, 58), arrowprops=arrow_props)
    ax.annotate("", xy=(50, 38), xytext=(50, 44), arrowprops=arrow_props)

    # Decision diamond after check victory
    diamond = patches.Polygon([[50, 29], [56, 25], [50, 21], [44, 25]], 
                              facecolor='#fef3c7', edgecolor='#d97706', lw=1.5)
    ax.add_patch(diamond)
    ax.annotate("", xy=(50, 29), xytext=(50, 30), arrowprops=arrow_props)

    # Decision branches
    ax.text(52, 23, "K.O.?", fontsize=7.5, color='#b45309', fontweight='bold')
    
    # Yes -> Finish
    ax.annotate("", xy=(50, 20), xytext=(50, 21), arrowprops=arrow_props)
    ax.text(52, 19, "Ya", fontsize=8, color='#15803d', fontweight='bold')

    # No -> Loop back to Choose Action
    ax.plot([44, 10, 10, 15], [25, 25, 88, 88], color='#dc2626', lw=1.3, linestyle='--')
    ax.annotate("", xy=(15, 88), xytext=(11, 88), arrowprops=dict(arrowstyle="->", color="#dc2626", lw=1.3))
    ax.text(7, 56, "Tidak (Ronde Lanjut)", fontsize=7.5, color='#dc2626', fontweight='bold', rotation=90)

    # Final Node (Bullseye)
    final_outer = patches.Circle((50, 5), 3, facecolor='none', edgecolor='#0f172a', lw=1.5)
    final_inner = patches.Circle((50, 5), 1.8, facecolor='#0f172a', edgecolor='#0f172a')
    ax.add_patch(final_outer)
    ax.add_patch(final_inner)
    ax.annotate("", xy=(50, 8), xytext=(50, 12), arrowprops=arrow_props)

    plt.tight_layout()
    out_file = os.path.join(ASSETS_DIR, "activity_diagram.png")
    plt.savefig(out_file, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Activity diagram created successfully at {out_file}!")

def create_websocket_diagram():
    fig, ax = plt.subplots(figsize=(13, 8.5), dpi=300)
    ax.set_xlim(0, 130)
    ax.set_ylim(0, 90)
    ax.axis('off')

    ax.text(65, 86, "ARSITEKTUR WEBSOCKET RFC 6455 & DUAL ANDROID GAMEPAD", 
            fontsize=15, fontweight='bold', ha='center', color='#0f172a')
    ax.text(65, 83, "Sistem Kontrol Nirkabel Berlatensi Rendah MBG Pure PHP 8.3", 
            fontsize=10.5, fontstyle='italic', ha='center', color='#475569')

    def draw_card(x, y, w, h, title, items, bg='#f8fafc', border='#2563eb', title_color='#0f172a'):
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3",
                                     facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + w/2, y + h - 3, title, fontsize=10, fontweight='bold', ha='center', color=title_color)
        ax.plot([x + 2, x + w - 2], [y + h - 4.5, y + h - 4.5], color=border, lw=1)
        curr_y = y + h - 7
        for it in items:
            ax.text(x + 2.5, curr_y, it, fontsize=7.8, family='monospace', color='#1e293b')
            curr_y -= 2.2

    # Left: Smartphone Android Controllers (Player 1 & 2)
    draw_card(5, 12, 35, 66, "SMARTPHONE ANDROID\n(Wireless Gamepad)", [
        "Client: Mobile Web Browser",
        "Interface: controller.html",
        "------------------------------",
        "• QR Code Quick Pairing",
        "• Virtual Touch D-Pad (L/R/U/D)",
        "• Action Buttons: ATK/S1/S2/ULT",
        "• PointerEvent Capture API",
        "  (Zero slip on touch drag)",
        "• Auto-reconnect WebSockets",
        "• Low Latency JSON Streaming",
        "------------------------------",
        "Payload Out:",
        '{"type":"input",',
        ' "role":"p2",',
        ' "action":"attack",',
        ' "state":"down"}'
    ], bg='#fef2f2', border='#ef4444', title_color='#991b1b')

    # Middle: Pure PHP 8.3 WebSocket Server
    draw_card(47.5, 12, 35, 66, "PHP 8.3 WEBSOCKET SERVER\n(app/Core/WebSocketServer.php)", [
        "Core Engine: server_ws.php",
        "Port: 8086 (TCP Streaming)",
        "------------------------------",
        "• Pure PHP (Zero Dependencies)",
        "• RFC 6455 Handshake Protocol",
        "  - SHA-1 + Base64 Hash Handshake",
        "  - Sec-WebSocket-Accept Gen",
        "• socket_select() Multiplexing",
        "• spl_object_id() Client Tracker",
        "• Frame Masking / Unmasking XOR",
        "• Opcode 0x1 (Text), 0x8 (Close)",
        "• Room & Role Dispatcher:",
        "  - Hubungkan P1 / P2 ke Host",
        "  - Watchdog Keep-Alive"
    ], bg='#f0fdf4', border='#16a34a', title_color='#166534')

    # Right: Desktop Web Arcade Client (Host)
    draw_card(90, 12, 35, 66, "HOST ARCADE DISPLAY\n(HTML5 Canvas & PHP OOP)", [
        "Frontend: index.html & game.js",
        "Backend: REST API PHP 8.3",
        "------------------------------",
        "• Local IP QR Generator",
        "• WebSocket Host Connection",
        "• Dual Input Arbitration:",
        "  - isP2Human() Mode Switch",
        "  - CPU AI Auto-Disable on P2",
        "  - p1Keys vs p2Keys Isolation",
        "  - Independent Action Locks",
        "• Symmetrical VFX Render:",
        "  - P1 Left Cut-in / P2 Right",
        "• HUD Badge: P2 📱 / P2 ⌨ / CPU",
        "• Deterministic Combat Engine"
    ], bg='#eff6ff', border='#2563eb', title_color='#1e40af')

    # Flow arrows
    # Phone to WS Server
    ax.annotate("", xy=(47.5, 48), xytext=(40, 48),
                arrowprops=dict(arrowstyle="<->", color="#dc2626", lw=2))
    ax.text(43.75, 51, "WS Frame\nRFC 6455", fontsize=7.5, fontweight='bold', ha='center', color='#dc2626')

    # WS Server to Host
    ax.annotate("", xy=(90, 48), xytext=(82.5, 48),
                arrowprops=dict(arrowstyle="<->", color="#2563eb", lw=2))
    ax.text(86.25, 51, "Forwarded\nInput Event", fontsize=7.5, fontweight='bold', ha='center', color='#2563eb')

    # Direct pairing via QR
    ax.annotate("", xy=(90, 22), xytext=(40, 22),
                arrowprops=dict(arrowstyle="<-", linestyle="dashed", color="#6b7280", lw=1.5))
    ax.text(65, 24, "Scan Dual QR Code untuk Pairing Otomatis (LAN)", fontsize=8, fontstyle='italic', ha='center', color='#4b5563')

    plt.tight_layout()
    out_file = os.path.join(ASSETS_DIR, "websocket_architecture_diagram.png")
    plt.savefig(out_file, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"WebSocket Architecture diagram created successfully at {out_file}!")

if __name__ == '__main__':
    create_class_diagram()
    create_use_case_diagram()
    create_activity_diagram()
    create_websocket_diagram()
