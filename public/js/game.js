/**
 * MBG: MOBILE BATTLE GOVERNMENT - Game Controller & Main Engine
 * Mengintegrasikan input keyboard + touch controls, 60 FPS Canvas loop,
 * animasi ngeskill interaktif di sisi pemain & lawan, screen shake,
 * sinkronisasi REST API PHP 8.3 & fallback client engine, serta URL GET routing.
 */

const DEFAULT_ROSTER = [
    {
        name: "Bahlul",
        title: "The Goblin Summoner",
        description: "Karakter perkasa dengan kemampuan mistis memanggil gerombolan goblin dan melepaskan gelombang energi tsunami kehijauan.",
        health: 1150,
        maxHealth: 1150,
        attack: 90,
        defense: 45,
        speed: 35,
        ultimateEnergy: 0,
        isAlive: true,
        isStunned: false,
        specialSkills: [
            {
                name: "Tsunami Etanol",
                description: "Menghasilkan gelombang energi besar berwarna biru kehijauan yang memberikan damage area dan memperlambat musuh.",
                cooldown: 3,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.6,
                isReady: true
            },
            {
                name: "Goblin Summon",
                description: "Memanggil prajurit goblin kecil yang menyerbu ke arah lawan dan memberikan damage beruntun.",
                cooldown: 4,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.4,
                isReady: true
            }
        ],
        ultimateSkill: {
            name: "Goblin Apocalypse",
            description: "Memanggil sekumpulan goblin raksasa dari portal dimensi yang menghujani musuh dengan rentetan serangan mematikan!",
            cooldown: 0,
            currentCooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.8,
            isReady: true
        },
        passive: {
            name: "Goblin Power",
            description: "Setiap serangan dasar yang berhasil mengenai musuh memberikan tambahan +5% energi ultimate."
        },
        spriteId: "bahlul"
    },
    {
        name: "Tifuzia",
        title: "The Diploma Inspector",
        description: "Petarung berkecepatan tinggi yang menuntut transparansi akademik melalui serangan argumen hukum dan palu sidang.",
        health: 980,
        maxHealth: 980,
        attack: 82,
        defense: 36,
        speed: 60,
        ultimateEnergy: 0,
        isAlive: true,
        isStunned: false,
        specialSkills: [
            {
                name: "Mana Ijazah?",
                description: "Menuntut bukti verifikasi keaslian dokumen akademik yang membingungkan lawan dan memberikan efek slow.",
                cooldown: 3,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.45,
                isReady: true
            },
            {
                name: "Bacot Overload",
                description: "Melancarkan rentetan argumen vokal tanpa henti yang memecah konsentrasi musuh.",
                cooldown: 4,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.55,
                isReady: true
            }
        ],
        ultimateSkill: {
            name: "Sidang Terbuka",
            description: "Menyeret lawan ke dalam ruang sidang paripurna darurat dengan vonis palu sidang raksasa yang melumpuhkan!",
            cooldown: 0,
            currentCooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.7,
            isReady: true
        },
        passive: {
            name: "Noise Pollution",
            description: "Memiliki peluang 25% setiap serangan untuk mendistraksi musuh, memotong attack lawan sebesar 15%."
        },
        spriteId: "tifuzia"
    },
    {
        name: "Brown Teddy",
        title: "The Affection Attacker",
        description: "Karakter tanker bertubuh boneka beruang raksasa dengan pertahanan tebal dan serangan berbasis manipulasi kasih sayang.",
        health: 1200,
        maxHealth: 1200,
        attack: 76,
        defense: 55,
        speed: 40,
        ultimateEnergy: 0,
        isAlive: true,
        isStunned: false,
        specialSkills: [
            {
                name: "Kiss Attack",
                description: "Melontarkan ciuman energi proyektil berbentuk hati berdaya ledak magis.",
                cooldown: 3,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.4,
                isReady: true
            },
            {
                name: "Teddy Hug",
                description: "Menerjang ke depan dan memeluk musuh dengan cengkeraman beruang yang meremukkan tulang.",
                cooldown: 4,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.6,
                isReady: true
            }
        ],
        ultimateSkill: {
            name: "Love Bomb",
            description: "Menjatuhkan bom boneka beruang raksasa penuh confetti mematikan yang meledakkan seluruh arena pertarungan!",
            cooldown: 0,
            currentCooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.6,
            isReady: true
        },
        passive: {
            name: "Attention Seeker",
            description: "Saat HP berada di bawah 30%, insting bertahan hidup meningkat pesat, memberikan tambahan Defense +50%."
        },
        spriteId: "brown_teddy"
    },
    {
        name: "Fufufifi",
        title: "The Government Critic",
        description: "Karakter aktivis vokal pembela aspirasi rakyat dengan serangan orasi kritis yang melemahkan daya tahan musuh.",
        health: 1050,
        maxHealth: 1050,
        attack: 85,
        defense: 42,
        speed: 52,
        ultimateEnergy: 0,
        isAlive: true,
        isStunned: false,
        specialSkills: [
            {
                name: "Kritik Tajam",
                description: "Meluncurkan argumen berbasis data investigasi yang menusuk pertahanan mental lawan dan mengurangi Defense sebesar 25%.",
                cooldown: 3,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.5,
                isReady: true
            },
            {
                name: "Aspirasi Rakyat",
                description: "Membentangkan spanduk aspirasi dan melepaskan gelombang suara orasi publik yang menghempaskan lawan.",
                cooldown: 4,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.7,
                isReady: true
            }
        ],
        ultimateSkill: {
            name: "Revolusi Argumen",
            description: "Menampilkan orasi akbar dengan latar belakang barisan massa demonstrasi pixel art, meluluhlantakkan lawan!",
            cooldown: 0,
            currentCooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.75,
            isReady: true
        },
        passive: {
            name: "Voice of People",
            description: "Setiap kritik dan serangan yang berhasil mengenai lawan mengakumulasi tambahan +8% energi ultimate."
        },
        spriteId: "fufufifi"
    },
    {
        name: "Wili Wonka",
        title: "The Viral Opportunist",
        description: "Karakter lincah dan oportunis berorientasi konten media sosial dengan serangan bertema cokelat dan sorotan kamera viral.",
        health: 940,
        maxHealth: 940,
        attack: 88,
        defense: 32,
        speed: 68,
        ultimateEnergy: 0,
        isAlive: true,
        isStunned: false,
        specialSkills: [
            {
                name: "Chocolate Lick",
                description: "Menikmati cokelat manis yang memberikan suntikan energi: memulihkan 45 HP dan meningkatkan Attack +20%!",
                cooldown: 3,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.35,
                isReady: true
            },
            {
                name: "Jilat Panggung",
                description: "Melakukan aksi sanjungan panggung berlebihan yang mengecoh perhatian musuh dan memotong Attack lawan sebesar 20%.",
                cooldown: 4,
                currentCooldown: 0,
                energyCost: 0,
                damageMultiplier: 1.65,
                isReady: true
            }
        ],
        ultimateSkill: {
            name: "Viral Moment",
            description: "Menyalakan siaran langsung jutaan penonton dengan blitz kamera menyilaukan dan rentetan serangan beruntun hingga masuk Trending #1!",
            cooldown: 0,
            currentCooldown: 0,
            energyCost: 100,
            damageMultiplier: 2.85,
            isReady: true
        },
        passive: {
            name: "FYP Hunter",
            description: "Mendapatkan bonus +15% energi ultimate dan pergerakan lebih gesit ketika berhasil melancarkan combo."
        },
        spriteId: "wili_wonka"
    }
];

const DEFAULT_ARENAS = [
    { id: "ruang_sidang", name: "Ruang Sidang Paripurna (DPR)", description: "Gedung megah dengan karpet merah dan meja pimpinan sidang." },
    { id: "bundaran_demokrasi", name: "Bundaran Demokrasi", description: "Monumen pusat kota tempat aksi massa berkumpul menyuarakan aspirasi." },
    { id: "studio_viral", name: "Studio Panggung Viral", description: "Panggung megah gemerlap lampu sorot kamera siaran langsung." },
    { id: "lembah_etanol", name: "Lembah Etanol Hijau", description: "Kawasan industri distilasi energi dengan pipa uap berkabut." }
];

class MBGGame {
    constructor() {
        this.canvas = document.getElementById('battleCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        // Game Configuration & State
        this.mode = 'pvai'; // 'pvai', 'pvp', 'training'
        this.difficulty = 'normal';
        this.selectedP1 = 'bahlul';
        this.selectedP2 = 'tifuzia';
        this.selectedArena = 'ruang_sidang';

        this.roster = DEFAULT_ROSTER;
        this.arenas = DEFAULT_ARENAS;
        this.battleState = null;
        this.isProcessingMove = false;
        this.moveWatchdogFrames = 0;
        this.gameOverHandled = false;
        this.isPaused = false;

        // Synchronized Ground Y with Arena Floor (340 on 420h canvas)
        this.groundY = 340;
        this.p1BaseX = 200;
        this.p2BaseX = 748;

        // Physical Animation Positions & States (Canvas 2D)
        this.p1Pos = { x: this.p1BaseX, y: this.groundY, facing: 1, vx: 0, vy: 0, isGrounded: true, isCrouching: false, anim: 'idle', tick: 0 };
        this.p2Pos = { x: this.p2BaseX, y: this.groundY, facing: -1, vx: 0, vy: 0, isGrounded: true, isCrouching: false, anim: 'idle', tick: 0 };

        // Key Listeners & Controls
        this.keys = {};
        this.p1Keys = { left: false, right: false, up: false, down: false };
        this.p2Keys = { left: false, right: false, up: false, down: false };
        this.p1Processing = false;
        this.p2Processing = false;
        this.roundTimer = 99;
        this.timerInterval = null;

        // Wireless Android Smartphone Controller (WebSocket & QR)
        this.ws = null;
        this.wsConnected = false;
        this.hostLanIp = window.location.hostname || '127.0.0.1';
        this.wsPort = 8088;
        this.httpPort = window.location.port || 8000;
        this.p1PhoneConnected = false;
        this.p2PhoneConnected = false;
        this.qrP1 = null;
        this.qrP2 = null;

        this.init();
    }

    /**
     * Memeriksa apakah Player 2 dikendalikan oleh manusia (Mode PvP atau Smartphone Controller terhubung).
     */
    isP2Human() {
        return this.mode === 'pvp' || this.p2PhoneConnected;
    }

    async init() {
        this.bindEvents();
        await this.loadRosterAndArenas();
        this.renderCharacterSelectGrid();
        this.startLoop();

        // Initialize Realtime WebSocket Host & Android QR Controller System
        this.initWebSocketHost();
        this.refreshNetworkIp();

        // Handle URL GET Parameters Routing
        this.handleRouting();
    }

    bindEvents() {
        // Keyboard controls (Supports standard keyboard, Numpad, and laptop keys)
        window.addEventListener('keydown', (e) => {
            const key = (e.key || '').toLowerCase();
            const code = (e.code || '').toLowerCase();

            this.keys[key] = true;
            this.keys[code] = true;
            if (code.startsWith('numpad')) {
                this.keys[code] = true;
            }

            // Prevent browser scroll on arrow keys or space during active battle
            if (this.currentScreen === 'screen-battle') {
                const navKeys = [
                    'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ',
                    'numpad1', 'numpad2', 'numpad3', 'numpad4', 'numpad5', 'numpad6', 'numpad8', 'numpad0',
                    'end', 'pagedown', 'insert', 'clear'
                ];
                if (navKeys.includes(key) || navKeys.includes(code)) {
                    e.preventDefault();
                }
            }

            this.handleBattleKey(key, code);
        });

        window.addEventListener('keyup', (e) => {
            const key = (e.key || '').toLowerCase();
            const code = (e.code || '').toLowerCase();
            this.keys[key] = false;
            this.keys[code] = false;
            if (code.startsWith('numpad')) {
                this.keys[code] = false;
            }
        });

        // Anti-stuck: Clear stuck keys when window loses focus (e.g., Alt-Tab or click outside)
        window.addEventListener('blur', () => {
            this.keys = {};
        });

        // Browser back/forward navigation support
        window.addEventListener('popstate', () => {
            this.handleRouting();
        });

        // CRT scanline toggle
        const btnCrt = document.getElementById('btn-crt');
        if (btnCrt) {
            btnCrt.addEventListener('click', () => {
                const scan = document.getElementById('scanlines');
                if (scan) {
                    scan.classList.toggle('off');
                    btnCrt.innerText = scan.classList.contains('off') ? 'CRT: OFF' : 'CRT: ON';
                }
            });
        }

        // Audio toggle
        const btnAudio = document.getElementById('btn-audio');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                const muted = sound.toggleMute();
                btnAudio.innerText = muted ? 'MUTE: ON' : 'MUTE: OFF';
                if (!muted) sound.playSelect();
            });
        }

        // Virtual D-Pad movement button events (supports mouse click/hold & touch on mobile)
        const dpadButtons = [
            { id: 'btn-move-left', key: 'a' },
            { id: 'btn-move-right', key: 'd' },
            { id: 'btn-move-jump', key: 'w' },
            { id: 'btn-move-crouch', key: 's' }
        ];

        dpadButtons.forEach(dp => {
            const el = document.getElementById(dp.id);
            if (el) {
                const press = (e) => {
                    e.preventDefault();
                    this.keys[dp.key] = true;
                };
                const release = (e) => {
                    e.preventDefault();
                    this.keys[dp.key] = false;
                };
                el.addEventListener('pointerdown', press);
                el.addEventListener('pointerup', release);
                el.addEventListener('pointerleave', release);
                el.addEventListener('pointercancel', release);
            }
        });

        // Touch support for on-screen buttons (Instant feedback on mobile)
        const touchButtons = [
            { id: 'btn-attack', move: 'attack' },
            { id: 'btn-skill-1', move: 'special_1' },
            { id: 'btn-skill-2', move: 'special_2' },
            { id: 'btn-skill-ulti', move: 'ultimate' }
        ];

        touchButtons.forEach(btnInfo => {
            const el = document.getElementById(btnInfo.id);
            if (el) {
                el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.executeMove('p1', btnInfo.move);
                }, { passive: false });
            }
        });
    }

    // =========================================================================
    // URL GET PARAMETERS & ROUTING
    // =========================================================================
    updateUrl(paramsObj) {
        try {
            const isHttp = window.location.protocol.startsWith('http');
            const url = new URL(window.location.href);
            url.search = '';
            for (const [key, val] of Object.entries(paramsObj)) {
                if (val !== undefined && val !== null && val !== '') {
                    url.searchParams.set(key, val);
                }
            }
            if (isHttp) {
                window.history.pushState(paramsObj, '', url.toString());
            } else {
                window.location.hash = url.search.replace(/^\?/, '#');
            }
        } catch (e) {
            console.warn("URL routing skipped:", e);
        }
    }

    async handleRouting() {
        let search = window.location.search;
        if (!search && window.location.hash.includes('=')) {
            search = '?' + window.location.hash.replace(/^#/, '');
        }
        const params = new URLSearchParams(search);
        const page = params.get('page') || 'menu';

        // Read AI Difficulty parameter
        const diffParam = params.get('diff') || params.get('difficulty');
        if (diffParam && ['easy', 'normal', 'hard'].includes(diffParam.toLowerCase())) {
            this.setDifficulty(diffParam.toLowerCase(), false);
        }

        if (page === 'select') {
            this.mode = params.get('mode') || 'pvai';
            this.showScreen('screen-char-select', false);
            this.updateCharPreview();
        } else if (page === 'battle') {
            this.mode = params.get('mode') || 'pvai';
            this.selectedP1 = params.get('p1') || 'bahlul';
            this.selectedP2 = params.get('p2') || 'tifuzia';
            this.selectedArena = params.get('arena') || 'ruang_sidang';
            await this.startBattle(false);
        } else {
            this.showScreen('screen-title', false);
        }

        const modal = params.get('modal');
        if (modal) {
            this.openModal(modal, false);
        }
    }

    setDifficulty(diff, updateHistory = true) {
        if (!['easy', 'normal', 'hard'].includes(diff)) diff = 'normal';
        this.difficulty = diff;

        // Update Select screen buttons
        ['easy', 'normal', 'hard'].forEach(d => {
            const btn = document.getElementById(`btn-diff-${d}`);
            if (btn) btn.classList.toggle('active', d === diff);
        });

        // Update Active Label in Select Screen
        const labelEl = document.getElementById('diff-active-label');
        if (labelEl) {
            labelEl.className = `diff-active-badge badge-${diff}`;
            if (diff === 'easy') labelEl.innerText = '🟢 EASY';
            else if (diff === 'normal') labelEl.innerText = '🟡 NORMAL';
            else if (diff === 'hard') labelEl.innerText = '🔴 HARD';
        }

        // Update Description Text
        const descEl = document.getElementById('diff-desc-text');
        if (descEl) {
            if (diff === 'easy') {
                descEl.innerText = 'AI Pemula: Gerak santai, waktu reaksi 700ms, damage -25%, jarang memakai skill.';
            } else if (diff === 'normal') {
                descEl.innerText = 'AI Standar: Respon taktis seimbang, gerakan reguler, frekuensi jurus wajar.';
            } else if (diff === 'hard') {
                descEl.innerText = 'AI Pakar / Brutal: Agresif, aktif melompat & mengelak, reaksi kilat 180ms, +18% damage, instan Ultimate!';
            }
        }

        // Update Header Button
        const headerBtn = document.getElementById('btn-header-diff');
        if (headerBtn) {
            headerBtn.innerText = `AI: ${diff.toUpperCase()}`;
        }

        if (updateHistory) {
            sound.playSelect();
            if (this.currentScreen === 'screen-char-select') {
                this.updateUrl({ page: 'select', mode: this.mode, diff: this.difficulty });
            } else if (this.currentScreen === 'screen-battle') {
                this.updateUrl({
                    page: 'battle',
                    p1: this.selectedP1,
                    p2: this.selectedP2,
                    arena: this.selectedArena,
                    mode: this.mode,
                    diff: this.difficulty
                });
            }
        }
    }

    cycleDifficulty() {
        const order = ['easy', 'normal', 'hard'];
        const nextIdx = (order.indexOf(this.difficulty) + 1) % order.length;
        this.setDifficulty(order[nextIdx], true);
    }

    async loadRosterAndArenas() {
        try {
            const charRes = await fetch('api/characters.php');
            if (charRes.ok) {
                const charJson = await charRes.json();
                if (charJson.status === 'success' && Array.isArray(charJson.data) && charJson.data.length > 0) {
                    this.roster = charJson.data;
                }
            }

            const arenaRes = await fetch('api/arenas.php');
            if (arenaRes.ok) {
                const arenaJson = await arenaRes.json();
                if (arenaJson.status === 'success' && Array.isArray(arenaJson.data) && arenaJson.data.length > 0) {
                    this.arenas = arenaJson.data;
                }
            }
        } catch (err) {
            console.warn("Menggunakan data roster & arena bawaan:", err);
            this.roster = DEFAULT_ROSTER;
            this.arenas = DEFAULT_ARENAS;
        }
    }

    showScreen(screenId, updateHistory = true) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            this.currentScreen = screenId;
        }

        if (updateHistory) {
            if (screenId === 'screen-title') {
                this.updateUrl({ page: 'menu' });
            } else if (screenId === 'screen-char-select') {
                this.updateUrl({ page: 'select', mode: this.mode, diff: this.difficulty });
            } else if (screenId === 'screen-battle') {
                this.updateUrl({
                    page: 'battle',
                    p1: this.selectedP1,
                    p2: this.selectedP2,
                    arena: this.selectedArena,
                    mode: this.mode,
                    diff: this.difficulty
                });
            }
        }

        sound.playSelect();
    }

    openModal(modalId, updateHistory = true) {
        const m = document.getElementById(modalId);
        if (m) m.classList.add('active');
        sound.playSelect();
    }

    closeModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.remove('active');
        sound.playSelect();
    }

    // =========================================================================
    // CHARACTER SELECT LOGIC
    // =========================================================================
    startSelect(mode = 'pvai', updateHistory = true) {
        this.mode = mode;
        this.pvpSelectingP2 = false;
        this.showScreen('screen-char-select', updateHistory);
        this.updateCharPreview();
    }

    renderCharacterSelectGrid() {
        const grid = document.getElementById('char-grid');
        if (!grid || !this.roster.length) return;

        grid.innerHTML = '';
        this.roster.forEach(char => {
            const card = document.createElement('div');
            card.className = `char-card ${this.selectedP1 === char.spriteId ? 'selected-p1' : ''} ${this.selectedP2 === char.spriteId ? 'selected-p2' : ''}`;
            card.id = `card-${char.spriteId}`;

            card.innerHTML = `
                <div class="char-card-badge badge-p1" style="${this.selectedP1 === char.spriteId ? '' : 'display:none;'}">1P</div>
                <div class="char-card-badge badge-p2" style="${this.selectedP2 === char.spriteId ? '' : 'display:none;'}">2P</div>
                <canvas class="char-avatar-canvas" id="canvas-avatar-${char.spriteId}" width="65" height="65"></canvas>
                <div class="char-name">${char.name}</div>
                <div class="char-title">${char.title}</div>
            `;

            card.addEventListener('click', () => {
                this.selectCharacter(char.spriteId);
            });

            grid.appendChild(card);

            setTimeout(() => {
                const cv = document.getElementById(`canvas-avatar-${char.spriteId}`);
                if (cv) {
                    const ctx = cv.getContext('2d');
                    SpriteRenderer.drawFighter(ctx, char, 32, 58, 1, 'idle', 0, 0.85);
                }
            }, 50);
        });
    }

    selectCharacter(charId) {
        sound.playSelect();
        if (this.mode === 'pvai' || this.mode === 'training') {
            this.selectedP1 = charId;
            if (this.selectedP1 === this.selectedP2) {
                const others = this.roster.filter(c => c.spriteId !== charId);
                this.selectedP2 = others[Math.floor(Math.random() * others.length)].spriteId;
            }
        } else {
            // In PvP mode: first click sets P1, next click sets P2, and clicking alternates
            if (!this.pvpSelectingP2) {
                this.selectedP1 = charId;
                this.pvpSelectingP2 = true;
            } else {
                this.selectedP2 = charId;
                this.pvpSelectingP2 = false;
            }
        }
        this.updateCharPreview();
        this.renderCharacterSelectGrid();
    }

    updateCharPreview() {
        const p1Char = this.roster.find(c => c.spriteId === this.selectedP1) || this.roster[0];
        if (!p1Char) return;

        const p1NameElem = document.getElementById('preview-p1-name');
        if (p1NameElem) {
            p1NameElem.innerText = `${p1Char.name} - ${p1Char.title}`;
            document.getElementById('p1-bar-hp').style.width = `${(p1Char.maxHealth / 1200) * 100}%`;
            document.getElementById('p1-bar-atk').style.width = `${(p1Char.attack / 100) * 100}%`;
            document.getElementById('p1-bar-def').style.width = `${(p1Char.defense / 60) * 100}%`;
            document.getElementById('p1-bar-spd').style.width = `${(p1Char.speed / 70) * 100}%`;

            const p1SkillsBox = document.getElementById('preview-p1-skills');
            if (p1SkillsBox && p1Char.specialSkills) {
                p1SkillsBox.innerHTML = `
                    <div class="skill-preview-item"><strong>[Skill 1] ${p1Char.specialSkills[0]?.name}:</strong> ${p1Char.specialSkills[0]?.description}</div>
                    <div class="skill-preview-item"><strong>[Skill 2] ${p1Char.specialSkills[1]?.name}:</strong> ${p1Char.specialSkills[1]?.description}</div>
                    <div class="skill-preview-item"><strong>[Ultimate] ${p1Char.ultimateSkill?.name}:</strong> ${p1Char.ultimateSkill?.description}</div>
                    <div class="skill-preview-item" style="border-left-color: #00ff88;"><strong>[Passive] ${p1Char.passive?.name}:</strong> ${p1Char.passive?.description}</div>
                `;
            }
        }
    }

    // =========================================================================
    // START BATTLE & BACKEND API SYNC (WITH CLIENT-SIDE FALLBACK)
    // =========================================================================
    async startBattle(updateHistory = true) {
        sound.playSelect();
        sound.startBgm();

        const arenaSelect = document.getElementById('select-arena');
        if (arenaSelect && arenaSelect.value) {
            this.selectedArena = arenaSelect.value;
        }

        try {
            const response = await fetch('api/battle.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start',
                    p1: this.selectedP1,
                    p2: this.selectedP2,
                    arena: this.selectedArena,
                    mode: this.isP2Human() ? 'pvp' : this.mode,
                    difficulty: this.difficulty
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    this.battleState = data.battleState;
                    this.setupBattleUI();
                    this.showScreen('screen-battle', updateHistory);
                    this.startRoundTimer();
                    return;
                }
            }
        } catch (err) {
            console.warn("Backend API tidak merespons, beralih ke Client-Side Battle Engine:", err);
        }

        this.initClientSideBattle(updateHistory);
    }

    initClientSideBattle(updateHistory = true) {
        const p1Raw = this.roster.find(c => c.spriteId === this.selectedP1) || this.roster[0];
        const p2Raw = this.roster.find(c => c.spriteId === this.selectedP2) || this.roster[1];
        const arenaRaw = this.arenas.find(a => a.id === this.selectedArena) || this.arenas[0];

        this.battleState = {
            player1: JSON.parse(JSON.stringify(p1Raw)),
            player2: JSON.parse(JSON.stringify(p2Raw)),
            arena: JSON.parse(JSON.stringify(arenaRaw)),
            turn: 1,
            isGameOver: false,
            winner: null,
            telemetry: {
                totalDamageDealt: 0,
                totalHits: 0,
                highestCombo: 0,
                skillsUsed: 0
            }
        };

        this.setupBattleUI();
        this.showScreen('screen-battle', updateHistory);
        this.startRoundTimer();
    }

    setupBattleUI() {
        if (!this.battleState) return;

        this.gameOverHandled = false;
        this.p1Processing = false;
        this.p2Processing = false;
        this.moveWatchdogFrames = 0;
        this.isPaused = false;

        const p1 = this.battleState.player1;
        const p2 = this.battleState.player2;

        document.getElementById('hud-p1-name').innerText = p1.name;
        document.getElementById('hud-p2-name').innerText = p2.name;

        // Reset positions firmly on arena floor line
        this.p1Pos = { x: this.p1BaseX, y: this.groundY, facing: 1, vx: 0, vy: 0, isGrounded: true, isCrouching: false, anim: 'idle', tick: 0 };
        this.p2Pos = { x: this.p2BaseX, y: this.groundY, facing: -1, vx: 0, vy: 0, isGrounded: true, isCrouching: false, anim: 'idle', tick: 0 };

        this.updateHUD();
        this.updateActionButtons();
        const arenaName = (this.battleState.arena && typeof this.battleState.arena === 'object' && this.battleState.arena.name)
            ? this.battleState.arena.name
            : (typeof this.battleState.arena === 'string' ? this.battleState.arena : "Ruang Sidang Paripurna");
        this.appendLog(`ROUND 1 - FIGHT! ${p1.name} VS ${p2.name} di ${arenaName}`);
    }

    startRoundTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.roundTimer = 99;
        const timerElem = document.getElementById('hud-timer');
        if (timerElem) timerElem.innerText = this.roundTimer;

        this.timerInterval = setInterval(() => {
            if (this.battleState && !this.battleState.isGameOver && !this.gameOverHandled && !this.isPaused) {
                this.roundTimer--;
                if (timerElem) timerElem.innerText = this.roundTimer;

                if (this.roundTimer <= 0) {
                    clearInterval(this.timerInterval);
                    this.handleTimeOver();
                }
            }
        }, 1000);
    }

    updateHUD() {
        if (!this.battleState) return;

        const p1 = this.battleState.player1;
        const p2 = this.battleState.player2;

        const p1HpPercent = Math.max(0, (p1.health / p1.maxHealth) * 100);
        const p2HpPercent = Math.max(0, (p2.health / p2.maxHealth) * 100);

        const p1HpFill = document.getElementById('hud-p1-hp-fill');
        const p1HpRed = document.getElementById('hud-p1-hp-red');
        const p1HpText = document.getElementById('hud-p1-hp-text');

        if (p1HpFill) p1HpFill.style.width = `${p1HpPercent}%`;
        if (p1HpRed) setTimeout(() => { p1HpRed.style.width = `${p1HpPercent}%`; }, 200);
        if (p1HpText) p1HpText.innerText = `${Math.max(0, p1.health)} / ${p1.maxHealth}`;

        const p2HpFill = document.getElementById('hud-p2-hp-fill');
        const p2HpRed = document.getElementById('hud-p2-hp-red');
        const p2HpText = document.getElementById('hud-p2-hp-text');

        if (p2HpFill) p2HpFill.style.width = `${p2HpPercent}%`;
        if (p2HpRed) setTimeout(() => { p2HpRed.style.width = `${p2HpPercent}%`; }, 200);
        if (p2HpText) p2HpText.innerText = `${Math.max(0, p2.health)} / ${p2.maxHealth}`;

        const p1EnergyFill = document.getElementById('hud-p1-energy-fill');
        if (p1EnergyFill) {
            p1EnergyFill.style.width = `${p1.ultimateEnergy}%`;
            p1EnergyFill.classList.toggle('ready', p1.ultimateEnergy >= 100);
        }

        const p2EnergyFill = document.getElementById('hud-p2-energy-fill');
        if (p2EnergyFill) {
            p2EnergyFill.style.width = `${p2.ultimateEnergy}%`;
            p2EnergyFill.classList.toggle('ready', p2.ultimateEnergy >= 100);
        }

        // Live HUD Player 2 Control Badge (Smartphone / Local Keyboard / CPU AI)
        const p2Badge = document.querySelector('.hud-player.p2 .hud-pbadge');
        if (p2Badge) {
            if (this.p2PhoneConnected) {
                p2Badge.innerText = 'P2 📱';
                p2Badge.style.background = '#00ff88';
                p2Badge.style.color = '#000';
            } else if (this.mode === 'pvp') {
                p2Badge.innerText = 'P2 ⌨';
                p2Badge.style.background = 'var(--neon-red)';
                p2Badge.style.color = '#fff';
            } else {
                p2Badge.innerText = 'CPU';
                p2Badge.style.background = 'var(--neon-red)';
                p2Badge.style.color = '#fff';
            }
        }
    }

    disableActionButtons() {
        const ids = ['btn-attack', 'btn-skill-1', 'btn-skill-2', 'btn-skill-ulti'];
        ids.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = true;
                btn.classList.remove('ready');
            }
        });
    }

    updateActionButtons() {
        if (!this.battleState) return;
        const p1 = this.battleState.player1;

        if (this.gameOverHandled || this.battleState.isGameOver || (p1 && p1.health <= 0)) {
            this.disableActionButtons();
            return;
        }

        const btnAtk = document.getElementById('btn-attack');
        if (btnAtk) btnAtk.disabled = false;

        const btnS1 = document.getElementById('btn-skill-1');
        const btnS2 = document.getElementById('btn-skill-2');
        const btnUlti = document.getElementById('btn-skill-ulti');

        if (btnS1 && p1.specialSkills && p1.specialSkills[0]) {
            const s1 = p1.specialSkills[0];
            btnS1.disabled = (s1.currentCooldown > 0);
            btnS1.innerHTML = `<span>${s1.name}</span> <span class="key-hint">K</span> ${s1.currentCooldown > 0 ? `(${s1.currentCooldown}s)` : ''}`;
        }

        if (btnS2 && p1.specialSkills && p1.specialSkills[1]) {
            const s2 = p1.specialSkills[1];
            btnS2.disabled = (s2.currentCooldown > 0);
            btnS2.innerHTML = `<span>${s2.name}</span> <span class="key-hint">L</span> ${s2.currentCooldown > 0 ? `(${s2.currentCooldown}s)` : ''}`;
        }

        if (btnUlti && p1.ultimateSkill) {
            const ulti = p1.ultimateSkill;
            const ready = p1.ultimateEnergy >= 100;
            btnUlti.disabled = !ready;
            btnUlti.classList.toggle('ready', ready);
            btnUlti.innerHTML = `<span>★ ${ulti.name}</span> <span class="key-hint">U</span> (${p1.ultimateEnergy}%)`;
        }
    }

    // =========================================================================
    // DYNAMIC COMBAT SYSTEM (FULL ANIMATIONS & SOUNDS)
    // =========================================================================
    async executeMove(actor, move) {
        const isP1 = (actor === 'p1');
        // Independent action processing lock per player (P1 and P2 do not block each other)
        if (isP1 ? this.p1Processing : this.p2Processing) return;
        if (!this.battleState || this.battleState.isGameOver || this.isPaused) return;

        const casterPos = isP1 ? this.p1Pos : this.p2Pos;
        const targetPos = isP1 ? this.p2Pos : this.p1Pos;
        const casterChar = isP1 ? this.battleState.player1 : this.battleState.player2;

        // Pre-validation to avoid locking on unusable skills
        if (move === 'special_1' && casterChar.specialSkills && casterChar.specialSkills[0]?.currentCooldown > 0) {
            this.appendLog(`Skill ${casterChar.specialSkills[0].name} sedang cooldown (${casterChar.specialSkills[0].currentCooldown}s)!`);
            sound.playSelect();
            return;
        }
        if (move === 'special_2' && casterChar.specialSkills && casterChar.specialSkills[1]?.currentCooldown > 0) {
            this.appendLog(`Skill ${casterChar.specialSkills[1].name} sedang cooldown (${casterChar.specialSkills[1].currentCooldown}s)!`);
            sound.playSelect();
            return;
        }
        if (move === 'ultimate' && casterChar.ultimateEnergy < 100) {
            this.appendLog(`Energi ultimate ${casterChar.name} belum mencapai 100% (${casterChar.ultimateEnergy}%)!`);
            sound.playSelect();
            return;
        }

        if (isP1) this.p1Processing = true;
        else this.p2Processing = true;
        this.moveWatchdogFrames = 0;

        // Auto-face opponent when unleashing attack or skill
        casterPos.facing = (targetPos.x >= casterPos.x) ? 1 : -1;

        // Set caster animation state
        casterPos.anim = move;
        casterPos.tick = 0;

        // Extract Skill Name for Dynamic Arcade Callout Badge
        let skillName = '';
        if (move === 'special_1' && casterChar.specialSkills && casterChar.specialSkills[0]) {
            skillName = casterChar.specialSkills[0].name;
        } else if (move === 'special_2' && casterChar.specialSkills && casterChar.specialSkills[1]) {
            skillName = casterChar.specialSkills[1].name;
        } else if (move === 'ultimate' && casterChar.ultimateSkill) {
            skillName = casterChar.ultimateSkill.name;
        }

        // Caster Aura Color Palette
        let auraCol = '#00f0ff';
        if (move === 'special_1') auraCol = '#00ff88';
        if (move === 'special_2') auraCol = '#ffd700';
        if (move === 'ultimate') auraCol = '#ff0055';

        // 1. Trigger Caster Charging Aura at the Player's Side! (Summoning Circle, Speedlines & Badge)
        arenaRenderer.triggerCasterAura(
            casterPos.x,
            casterPos.y,
            move,
            auraCol,
            casterPos.facing,
            casterChar.spriteId,
            skillName
        );

        // 2. Play Audio & Spawn Projectiles/Slashes
        if (move === 'attack') {
            sound.playWhoosh();
            arenaRenderer.spawnAttackSlash(targetPos.x, targetPos.y - 35, '#ffd700');
            arenaRenderer.triggerScreenShake(8, 4);
        } else if (move === 'special_1' || move === 'special_2') {
            sound.playSkill(casterChar.spriteId, move === 'special_1' ? 1 : 2);
            arenaRenderer.spawnSkillVisual(casterChar.spriteId, move, casterPos.x, casterPos.y, targetPos.x, targetPos.y, casterPos.facing);
            arenaRenderer.triggerScreenShake(14, 7);
            if (casterChar.spriteId === 'bahlul' && move === 'special_2') {
                arenaRenderer.spawnMinion(casterPos.x, casterPos.y, casterPos.facing);
            }
        } else if (move === 'ultimate') {
            sound.playUltimate();
            const side = (actor === 'p1') ? 'left' : 'right';
            arenaRenderer.triggerSuperFreeze(casterChar.name, skillName, (actor === 'p1' ? '#ffd700' : '#ff0055'), casterChar.spriteId, side);
            arenaRenderer.spawnSkillVisual(casterChar.spriteId, 'ultimate', casterPos.x, casterPos.y, targetPos.x, targetPos.y, casterPos.facing);
            arenaRenderer.triggerScreenShake(26, 14);
        }

        try {
            const response = await fetch('api/battle.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'move',
                    actor: actor,
                    move: move,
                    mode: this.isP2Human() ? 'pvp' : this.mode,
                    difficulty: this.difficulty
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    this.applyMoveResult(actor, move, data.result.playerAction, data.result.aiAction, data.result.battleState);
                    return;
                }
            }
        } catch (err) {
            // Local fallback
        }

        this.executeMoveLocally(actor, move);
    }

    executeMoveLocally(actor, move) {
        const attacker = (actor === 'p1') ? this.battleState.player1 : this.battleState.player2;
        const defender = (actor === 'p1') ? this.battleState.player2 : this.battleState.player1;
        const targetPos = (actor === 'p1') ? this.p2Pos : this.p1Pos;

        let multiplier = 1.0;
        let isCrit = Math.random() < 0.15;
        let moveName = "Basic Attack";

        if (move === 'special_1' && attacker.specialSkills && attacker.specialSkills[0]) {
            multiplier = attacker.specialSkills[0].damageMultiplier || 1.5;
            moveName = attacker.specialSkills[0].name;
            attacker.specialSkills[0].currentCooldown = attacker.specialSkills[0].cooldown || 3;
        } else if (move === 'special_2' && attacker.specialSkills && attacker.specialSkills[1]) {
            multiplier = attacker.specialSkills[1].damageMultiplier || 1.6;
            moveName = attacker.specialSkills[1].name;
            attacker.specialSkills[1].currentCooldown = attacker.specialSkills[1].cooldown || 4;
        } else if (move === 'ultimate' && attacker.ultimateSkill) {
            if (attacker.ultimateEnergy < 100) {
                this.appendLog(`Energi ultimate ${attacker.name} belum mencapai 100%!`);
                this.isProcessingMove = false;
                return;
            }
            multiplier = attacker.ultimateSkill.damageMultiplier || 2.8;
            moveName = `★ ULTIMATE: ${attacker.ultimateSkill.name}`;
            attacker.ultimateEnergy = 0;
        }

        // Hyperbolic Mitigation Calculation
        const mitigation = 100 / (100 + (defender.defense || 30));
        let baseDmg = (attacker.attack || 80) * multiplier * (0.9 + Math.random() * 0.2);
        if (isCrit) baseDmg *= 1.5;
        const finalDamage = Math.max(15, Math.round(baseDmg * mitigation));

        defender.health = Math.max(0, defender.health - finalDamage);

        // Passive energy gain
        if (move !== 'ultimate') {
            let bonusEnergy = 10;
            if (attacker.spriteId === 'bahlul') bonusEnergy += 5;
            if (attacker.spriteId === 'fufufifi') bonusEnergy += 8;
            attacker.ultimateEnergy = Math.min(100, attacker.ultimateEnergy + bonusEnergy);
        }

        // Floating Damage Number & Sparks on Target
        targetPos.anim = 'hit';
        targetPos.tick = 0;
        this.sendHapticFeedback(actor === 'p1' ? 'p2' : 'p1', isCrit ? 120 : 60);
        arenaRenderer.addDamageText(
            isCrit ? `CRIT! -${finalDamage}` : `-${finalDamage}`,
            targetPos.x,
            targetPos.y - 40,
            isCrit
        );
        arenaRenderer.addSparks(targetPos.x, targetPos.y - 20, isCrit ? 26 : 14);

        if (isCrit) {
            sound.playCrit();
        } else {
            sound.playHit();
        }

        this.appendLog(`${attacker.name} melancarkan ${moveName}! Memberikan ${finalDamage} damage ke ${defender.name}.`, isCrit ? 'log-crit' : (move === 'ultimate' ? 'log-ulti' : ''));

        this.updateHUD();
        this.updateActionButtons();
        this.checkGameOver();

        // AI Retaliation ONLY in single player PVAI Mode when P2 is NOT human
        if (this.mode === 'pvai' && !this.isP2Human() && actor === 'p1' && !this.battleState.isGameOver) {
            const diff = this.difficulty;
            let aiDelay = 450;
            let damageMult = 1.0;
            if (diff === 'easy') {
                aiDelay = 700;
                damageMult = 0.75;
            } else if (diff === 'hard') {
                aiDelay = 180;
                damageMult = 1.18;
            }

            // Decide AI Move (Tactical selection based on difficulty)
            let aiMove = 'attack';
            let aiSkillName = '';
            let aiMultiplier = 1.0;

            if (defender.ultimateEnergy >= 100) {
                const ultiChance = (diff === 'hard') ? 1.0 : (diff === 'normal' ? 0.75 : 0.35);
                if (Math.random() < ultiChance) {
                    aiMove = 'ultimate';
                    aiSkillName = defender.ultimateSkill ? defender.ultimateSkill.name : 'Ultimate Move';
                    aiMultiplier = (defender.ultimateSkill ? defender.ultimateSkill.damageMultiplier : 2.6);
                    defender.ultimateEnergy = 0;
                }
            }
            if (aiMove === 'attack' && defender.specialSkills) {
                const s1 = defender.specialSkills[0];
                const s2 = defender.specialSkills[1];
                const s1Ready = s1 && (s1.currentCooldown <= 0);
                const s2Ready = s2 && (s2.currentCooldown <= 0);
                const skillChance = (diff === 'hard') ? 0.85 : (diff === 'normal' ? 0.55 : 0.25);

                if (Math.random() < skillChance && (s1Ready || s2Ready)) {
                    if (s1Ready && s2Ready) {
                        const pick = Math.random() < 0.5 ? 1 : 2;
                        aiMove = `special_${pick}`;
                        const pickedSkill = pick === 1 ? s1 : s2;
                        aiSkillName = pickedSkill.name;
                        aiMultiplier = pickedSkill.damageMultiplier || 1.5;
                        pickedSkill.currentCooldown = pickedSkill.cooldown || 3;
                    } else if (s1Ready) {
                        aiMove = 'special_1';
                        aiSkillName = s1.name;
                        aiMultiplier = s1.damageMultiplier || 1.5;
                        s1.currentCooldown = s1.cooldown || 3;
                    } else if (s2Ready) {
                        aiMove = 'special_2';
                        aiSkillName = s2.name;
                        aiMultiplier = s2.damageMultiplier || 1.6;
                        s2.currentCooldown = s2.cooldown || 4;
                    }
                }
            }

            setTimeout(() => {
                this.p2Pos.anim = aiMove;
                this.p2Pos.tick = 0;

                let aiCol = '#ff0055';
                if (aiMove === 'special_1') aiCol = '#00ff88';
                if (aiMove === 'special_2') aiCol = '#ffd700';
                if (aiMove === 'ultimate') aiCol = '#ff0055';

                arenaRenderer.triggerCasterAura(this.p2Pos.x, this.p2Pos.y, aiMove, aiCol, this.p2Pos.facing, defender.spriteId, aiSkillName);

                if (aiMove === 'attack') {
                    sound.playWhoosh();
                    arenaRenderer.spawnAttackSlash(this.p1Pos.x, this.p1Pos.y - 35, aiCol);
                    arenaRenderer.triggerScreenShake(8, 4);
                } else if (aiMove === 'special_1' || aiMove === 'special_2') {
                    sound.playSkill(defender.spriteId, aiMove === 'special_1' ? 1 : 2);
                    arenaRenderer.spawnSkillVisual(defender.spriteId, aiMove, this.p2Pos.x, this.p2Pos.y, this.p1Pos.x, this.p1Pos.y, this.p2Pos.facing);
                    arenaRenderer.triggerScreenShake(14, 7);
                    if (defender.spriteId === 'bahlul' && aiMove === 'special_2') {
                        arenaRenderer.spawnMinion(this.p2Pos.x, this.p2Pos.y, this.p2Pos.facing);
                    }
                } else if (aiMove === 'ultimate') {
                    sound.playUltimate();
                    arenaRenderer.triggerSuperFreeze(defender.name, aiSkillName, '#ff0055', defender.spriteId, 'right');
                    arenaRenderer.spawnSkillVisual(defender.spriteId, 'ultimate', this.p2Pos.x, this.p2Pos.y, this.p1Pos.x, this.p1Pos.y, this.p2Pos.facing);
                    arenaRenderer.triggerScreenShake(26, 14);
                }

                setTimeout(() => {
                    const aiMitigation = 100 / (100 + (attacker.defense || 40));
                    let isAiCrit = (diff === 'hard') ? (Math.random() < 0.22) : (Math.random() < 0.12);
                    let rawAiDamage = (defender.attack || 75) * aiMultiplier * damageMult * (0.85 + Math.random() * 0.3);
                    if (isAiCrit) rawAiDamage *= 1.5;
                    const aiDamage = Math.max(10, Math.round(rawAiDamage * aiMitigation));

                    attacker.health = Math.max(0, attacker.health - aiDamage);
                    if (aiMove !== 'ultimate') {
                        defender.ultimateEnergy = Math.min(100, defender.ultimateEnergy + 12);
                    }

                    this.p1Pos.anim = 'hit';
                    this.p1Pos.tick = 0;
                    if (isAiCrit) sound.playCrit();
                    else sound.playHit();

                    arenaRenderer.addDamageText(isAiCrit ? `CRIT! -${aiDamage}` : `-${aiDamage}`, this.p1Pos.x, this.p1Pos.y - 40, isAiCrit);
                    arenaRenderer.addSparks(this.p1Pos.x, this.p1Pos.y - 20, isAiCrit ? 24 : 12);

                    const aiLogName = aiSkillName ? `${aiMove === 'ultimate' ? '★ ULTIMATE: ' : ''}${aiSkillName}` : 'serangan balik';
                    this.appendLog(`${defender.name} membalas dengan ${aiLogName}! Memberikan ${aiDamage} damage ke ${attacker.name}.`, isAiCrit ? 'log-crit' : (aiMove === 'ultimate' ? 'log-ulti' : ''));

                    this.updateHUD();
                    this.updateActionButtons();
                    this.checkGameOver();

                    setTimeout(() => {
                        this.p1Processing = false;
                        this.p2Processing = false;
                        if (this.p1Pos.anim !== 'ko' && this.p1Pos.anim !== 'hit') this.p1Pos.anim = 'idle';
                        if (this.p2Pos.anim !== 'ko' && this.p2Pos.anim !== 'hit') this.p2Pos.anim = 'idle';
                    }, 380);
                }, 200);
            }, aiDelay);
        } else {
            setTimeout(() => {
                if (isP1) this.p1Processing = false;
                else this.p2Processing = false;
                if (this.p1Pos.anim !== 'ko' && this.p1Pos.anim !== 'hit') this.p1Pos.anim = 'idle';
                if (this.p2Pos.anim !== 'ko' && this.p2Pos.anim !== 'hit') this.p2Pos.anim = 'idle';
            }, 380);
        }
    }

    applyMoveResult(actor, move, actionRes, aiRes, newBattleState) {
        this.battleState = newBattleState;

        const isP1 = (actor === 'p1');
        const targetPos = isP1 ? this.p2Pos : this.p1Pos;
        const casterPos = isP1 ? this.p1Pos : this.p2Pos;

        if (actionRes && actionRes.success) {
            const dmg = actionRes.finalDamage || actionRes.damageDealt || 0;
            arenaRenderer.addDamageText(
                actionRes.isCritical ? `CRIT! -${dmg}` : `-${dmg}`,
                targetPos.x,
                targetPos.y - 40,
                actionRes.isCritical
            );
            arenaRenderer.addSparks(targetPos.x, targetPos.y - 20, actionRes.isCritical ? 25 : 12);

            targetPos.anim = 'hit';
            targetPos.tick = 0;
            if (actionRes.isCritical) sound.playCrit();
            else sound.playHit();
            this.sendHapticFeedback(isP1 ? 'p2' : 'p1', actionRes.isCritical ? 120 : 60);

            this.appendLog(actionRes.message, actionRes.isCritical ? 'log-crit' : (move === 'ultimate' ? 'log-ulti' : ''));
        }

        // Only trigger AI response if Player 2 is NOT human
        const aiAction = (!this.isP2Human() && aiRes && aiRes.playerAction) ? aiRes.playerAction : (!this.isP2Human() ? aiRes : null);
        if (aiAction && aiAction.success) {
            const aiMove = aiAction.actionType || (aiAction.isUltimate ? 'ultimate' : 'attack');
            let aiColor = '#ff0055';
            if (aiMove === 'special_1') aiColor = '#00ff88';
            if (aiMove === 'special_2') aiColor = '#ffd700';
            if (aiMove === 'ultimate') aiColor = '#ff0055';

            const aiDelay = (this.difficulty === 'hard' ? 180 : (this.difficulty === 'easy' ? 650 : 420));

            setTimeout(() => {
                this.p2Pos.anim = aiMove;
                this.p2Pos.tick = 0;

                arenaRenderer.triggerCasterAura(
                    this.p2Pos.x,
                    this.p2Pos.y,
                    aiMove,
                    aiColor,
                    this.p2Pos.facing,
                    this.battleState.player2.spriteId,
                    aiAction.skillName || ''
                );

                if (aiMove === 'attack') {
                    sound.playWhoosh();
                    arenaRenderer.spawnAttackSlash(this.p1Pos.x, this.p1Pos.y - 35, aiColor);
                    arenaRenderer.triggerScreenShake(8, 4);
                } else if (aiMove === 'special_1' || aiMove === 'special_2') {
                    sound.playSkill(this.battleState.player2.spriteId, aiMove === 'special_1' ? 1 : 2);
                    arenaRenderer.spawnSkillVisual(this.battleState.player2.spriteId, aiMove, this.p2Pos.x, this.p2Pos.y, this.p1Pos.x, this.p1Pos.y, this.p2Pos.facing);
                    arenaRenderer.triggerScreenShake(14, 7);
                    if (this.battleState.player2.spriteId === 'bahlul' && aiMove === 'special_2') {
                        arenaRenderer.spawnMinion(this.p2Pos.x, this.p2Pos.y, this.p2Pos.facing);
                    }
                } else if (aiMove === 'ultimate') {
                    sound.playUltimate();
                    arenaRenderer.triggerSuperFreeze(this.battleState.player2.name, aiAction.skillName || 'ULTIMATE MOVE', '#ff0055', this.battleState.player2.spriteId, 'right');
                    arenaRenderer.spawnSkillVisual(this.battleState.player2.spriteId, 'ultimate', this.p2Pos.x, this.p2Pos.y, this.p1Pos.x, this.p1Pos.y, this.p2Pos.facing);
                    arenaRenderer.triggerScreenShake(26, 14);
                }

                setTimeout(() => {
                    if (aiAction.isCritical) sound.playCrit();
                    else sound.playHit();
                    const aiDmg = aiAction.finalDamage || aiAction.damageDealt || 0;
                    arenaRenderer.addDamageText(
                        aiAction.isCritical ? `CRIT! -${aiDmg}` : `-${aiDmg}`,
                        this.p1Pos.x,
                        this.p1Pos.y - 40,
                        aiAction.isCritical
                    );
                    arenaRenderer.addSparks(this.p1Pos.x, this.p1Pos.y - 20, aiAction.isCritical ? 24 : 10);
                    this.p1Pos.anim = 'hit';
                    this.p1Pos.tick = 0;
                    this.appendLog(aiAction.message, aiAction.isCritical ? 'log-crit' : (aiMove === 'ultimate' ? 'log-ulti' : ''));
                    this.updateHUD();
                    this.updateActionButtons();
                    this.checkGameOver();
                }, 200);
            }, aiDelay);
        }

        this.updateHUD();
        this.updateActionButtons();
        this.checkGameOver();

        setTimeout(() => {
            if (isP1) this.p1Processing = false;
            else this.p2Processing = false;
            if (this.p1Pos.anim !== 'ko' && this.p1Pos.anim !== 'hit') this.p1Pos.anim = 'idle';
            if (this.p2Pos.anim !== 'ko' && this.p2Pos.anim !== 'hit') this.p2Pos.anim = 'idle';
        }, 380);
    }

    handleBattleKey(key, code = '') {
        if (!this.battleState || this.gameOverHandled) return;

        // Pause Toggle: Escape key only (prevent letter P from conflicting with P2 Skill 2)
        if (key === 'escape') {
            this.togglePause();
            return;
        }

        // If paused or game over, ignore combat action inputs
        if (this.isPaused || this.battleState.isGameOver) return;

        // Player 1 Move Controls: J = Attack, K = Skill 1, L = Skill 2, U = Ultimate
        if (key === 'j') {
            this.executeMove('p1', 'attack');
        } else if (key === 'k') {
            this.executeMove('p1', 'special_1');
        } else if (key === 'l') {
            this.executeMove('p1', 'special_2');
        } else if (key === 'u') {
            this.executeMove('p1', 'ultimate');
        }

        // Player 2 Controls (Active in PVP mode or when P2 Smartphone Controller is connected):
        // Attack: Numpad 1, Number 1, End (NumLock OFF), Comma (,), Key I
        // Skill 1: Numpad 2, Number 2, Period (.), Key O
        // Skill 2: Numpad 3, Number 3, PageDown (NumLock OFF), Slash (/), Key P, Bracket ([)
        // Ultimate: Numpad 0, Number 0, Semicolon (;), Enter, NumpadEnter, Bracket (])
        if (this.isP2Human()) {
            const isP2Attack = (code === 'numpad1' || key === '1' || key === 'end' || key === ',' || key === 'i');
            const isP2Skill1 = (code === 'numpad2' || key === '2' || key === '.' || key === 'o');
            const isP2Skill2 = (code === 'numpad3' || key === '3' || key === 'pagedown' || key === '/' || key === 'p' || key === '[');
            const isP2Ulti = (code === 'numpad0' || key === '0' || key === 'insert' || code === 'numpadenter' || key === 'enter' || key === ';' || key === ']');

            if (isP2Attack) {
                this.executeMove('p2', 'attack');
            } else if (isP2Skill1) {
                this.executeMove('p2', 'special_1');
            } else if (isP2Skill2) {
                this.executeMove('p2', 'special_2');
            } else if (isP2Ulti) {
                this.executeMove('p2', 'ultimate');
            }
        }
    }

    appendLog(msg, customClass = '') {
        const box = document.getElementById('combat-log');
        if (!box) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${customClass}`;
        entry.innerText = `> ${msg}`;
        box.appendChild(entry);
        box.scrollTop = box.scrollHeight;
    }

    checkGameOver() {
        if (!this.battleState || this.gameOverHandled) return;

        const p1 = this.battleState.player1;
        const p2 = this.battleState.player2;

        const p1Dead = p1.health <= 0;
        const p2Dead = p2.health <= 0;

        if (p1Dead || p2Dead || this.battleState.isGameOver) {
            this.gameOverHandled = true;
            this.battleState.isGameOver = true;
            if (this.timerInterval) clearInterval(this.timerInterval);

            if (p1Dead) p1.health = 0;
            if (p2Dead) p2.health = 0;

            const winner = (!p1Dead && p1.health >= p2.health) ? p1 : p2;

            if (p1Dead) {
                this.p1Pos.anim = 'ko';
                this.p1Pos.y = this.groundY;
            }
            if (p2Dead) {
                this.p2Pos.anim = 'ko';
                this.p2Pos.y = this.groundY;
            }

            this.disableActionButtons();
            this.updateHUD();

            sound.playKo();
            arenaRenderer.triggerScreenShake(26, 12);
            arenaRenderer.triggerKoBanner(winner.name);
            this.appendLog(`K. O. ! PERTANDINGAN SELESAI. PEMENANG: ${winner.name.toUpperCase()}!`, 'log-crit');

            setTimeout(() => {
                const winnerEl = document.getElementById('game-over-winner');
                if (winnerEl) winnerEl.innerText = `PEMENANG: ${winner.name.toUpperCase()}!`;

                const stats = document.getElementById('game-over-stats');
                if (stats) {
                    const arenaName = (this.battleState.arena && typeof this.battleState.arena === 'object' && this.battleState.arena.name)
                        ? this.battleState.arena.name
                        : (typeof this.battleState.arena === 'string' ? this.battleState.arena : "Ruang Sidang Paripurna");

                    stats.innerHTML = `
                        <div class="stat-card">
                            <h5>JUARA</h5>
                            <p style="color: var(--neon-gold); font-size: 1.2rem;">${winner.name}</p>
                        </div>
                        <div class="stat-card">
                            <h5>SISA HP</h5>
                            <p>${Math.max(0, winner.health)} / ${winner.maxHealth}</p>
                        </div>
                        <div class="stat-card">
                            <h5>WAKTU TERSISA</h5>
                            <p>${this.roundTimer} Detik</p>
                        </div>
                        <div class="stat-card">
                            <h5>ARENA</h5>
                            <p>${arenaName}</p>
                        </div>
                    `;
                }
                sound.playVictory();
                this.openModal('modal-game-over');
            }, 1800);
        }
    }

    handleTimeOver() {
        if (!this.battleState || this.gameOverHandled) return;
        this.gameOverHandled = true;
        this.battleState.isGameOver = true;

        const p1 = this.battleState.player1;
        const p2 = this.battleState.player2;

        let winnerText = "DRAW! SERI!";
        let winner = p1;
        if (p1.health > p2.health) {
            winnerText = `PEMENANG: ${p1.name} (Unggul HP)`;
            winner = p1;
        } else if (p2.health > p1.health) {
            winnerText = `PEMENANG: ${p2.name} (Unggul HP)`;
            winner = p2;
        }

        this.disableActionButtons();
        this.appendLog(`TIME OVER! ${winnerText}`);
        document.getElementById('game-over-winner').innerText = winnerText;
        sound.playVictory();
        this.openModal('modal-game-over');
    }

    // =========================================================================
    // PAUSE & RESUME SYSTEM (ESC / P KEY OR UI BUTTON)
    // =========================================================================
    togglePause() {
        if (!this.battleState || this.gameOverHandled || this.currentScreen !== 'screen-battle') return;
        this.isPaused = !this.isPaused;
        sound.playSelect();

        const pauseModal = document.getElementById('modal-pause');
        const headerPauseBtn = document.getElementById('btn-header-pause');
        const battlePauseBtn = document.getElementById('btn-battle-pause');
        const pauseDiffVal = document.getElementById('pause-diff-val');

        if (this.isPaused) {
            if (pauseModal) pauseModal.classList.add('active');
            if (headerPauseBtn) headerPauseBtn.innerText = '▶ RESUME';
            if (battlePauseBtn) battlePauseBtn.innerText = '▶ RESUME';
            if (pauseDiffVal) pauseDiffVal.innerText = this.difficulty.toUpperCase();
        } else {
            if (pauseModal) pauseModal.classList.remove('active');
            if (headerPauseBtn) headerPauseBtn.innerText = '⏸ PAUSE';
            if (battlePauseBtn) battlePauseBtn.innerText = '⏸ PAUSE';
        }
    }

    restartBattle() {
        if (this.isPaused) {
            this.togglePause();
        }
        this.closeModal('modal-pause');
        this.closeModal('modal-game-over');
        this.startBattle(false);
    }

    quitBattle() {
        if (this.isPaused) {
            this.togglePause();
        }
        this.closeModal('modal-pause');
        this.closeModal('modal-game-over');
        if (this.timerInterval) clearInterval(this.timerInterval);
        sound.stopBgm();
        this.showScreen('screen-title');
    }

    // =========================================================================
    // ARCADE 2D FIGHTING MOVEMENT & PHYSICS (WALK, JUMP, SNEAK, TEKKEN AUTO-TURN)
    // =========================================================================
    updateMovement() {
        if (!this.battleState || this.gameOverHandled || this.isPaused) return;

        // --- ANTI-STUCK ANIMATION & MOVE WATCHDOG ---
        if (this.p1Pos.anim === 'hit' && this.p1Pos.tick > 18) this.p1Pos.anim = 'idle';
        if (this.p2Pos.anim === 'hit' && this.p2Pos.tick > 18) this.p2Pos.anim = 'idle';
        if (['attack', 'special_1', 'special_2', 'ultimate'].includes(this.p1Pos.anim) && this.p1Pos.tick > 25) {
            this.p1Pos.anim = 'idle';
        }
        if (['attack', 'special_1', 'special_2', 'ultimate'].includes(this.p2Pos.anim) && this.p2Pos.tick > 25) {
            this.p2Pos.anim = 'idle';
        }

        // Safety watchdog to release any accidental move lock
        if (this.p1Processing || this.p2Processing) {
            this.moveWatchdogFrames = (this.moveWatchdogFrames || 0) + 1;
            if (this.moveWatchdogFrames > 40) { // ~0.65 second max lock
                this.p1Processing = false;
                this.p2Processing = false;
                this.moveWatchdogFrames = 0;
            }
        } else {
            this.moveWatchdogFrames = 0;
        }

        // --- REAL 2D FIGHTING AUTO-TURN (TEKKEN / STREET FIGHTER SYSTEM) ---
        // Fighters dynamically turn around to face each other based on horizontal positions!
        if (this.p1Pos.anim !== 'ko' && this.p2Pos.anim !== 'ko') {
            if (this.p1Pos.x <= this.p2Pos.x) {
                this.p1Pos.facing = 1;  // P1 faces Right towards P2
                this.p2Pos.facing = -1; // P2 faces Left towards P1
            } else {
                this.p1Pos.facing = -1; // P1 Turned Around! Faces Left towards P2
                this.p2Pos.facing = 1;  // P2 Turned Around! Faces Right towards P1
            }
        }

        // --- PLAYER 1 MOVEMENT (WASD / SMARTPHONE D-PAD / SINGLE PLAYER ARROWS) ---
        if (this.p1Pos.anim !== 'ko' && this.p1Pos.anim !== 'hit') {
            let p1Moved = false;

            const p1Left = this.p1Keys.left || this.keys['a'] || (!this.isP2Human() && this.keys['arrowleft']);
            const p1Right = this.p1Keys.right || this.keys['d'] || (!this.isP2Human() && this.keys['arrowright']);
            const p1Up = this.p1Keys.up || this.keys['w'] || (!this.isP2Human() && this.keys['arrowup']) || (this.keys[' '] && !this.keys['control']);
            const p1Down = this.p1Keys.down || this.keys['s'] || (!this.isP2Human() && this.keys['arrowdown']);

            // Crouch / Sneak
            if (p1Down && this.p1Pos.isGrounded) {
                this.p1Pos.isCrouching = true;
                this.p1Pos.anim = 'crouch';
            } else {
                this.p1Pos.isCrouching = false;
            }

            // Walk left / right (slower when crouching/sneaking)
            const p1Speed = this.p1Pos.isCrouching ? 2.2 : 5.0;
            if (p1Left) {
                this.p1Pos.x = Math.max(85, this.p1Pos.x - p1Speed);
                p1Moved = true;
            }
            if (p1Right) {
                this.p1Pos.x = Math.min(860, this.p1Pos.x + p1Speed);
                p1Moved = true;
            }

            // Jump (Airborne leap)
            if (p1Up && this.p1Pos.isGrounded) {
                this.p1Pos.vy = -14;
                this.p1Pos.isGrounded = false;
                sound.playJump();
                arenaRenderer.addSparks(this.p1Pos.x, this.groundY, 6, '#00f0ff', 2);
            }

            // Jump Gravity & Air Physics
            if (!this.p1Pos.isGrounded) {
                this.p1Pos.y += this.p1Pos.vy;
                this.p1Pos.vy += 0.8; // gravity

                if (this.p1Pos.y >= this.groundY) {
                    this.p1Pos.y = this.groundY;
                    this.p1Pos.vy = 0;
                    this.p1Pos.isGrounded = true;
                    arenaRenderer.addSparks(this.p1Pos.x, this.groundY, 4, '#00f0ff', 1);
                } else {
                    this.p1Pos.anim = 'jump';
                }
            }

            // Update grounded animation
            if (this.p1Pos.isGrounded && !this.p1Pos.isCrouching) {
                if (p1Moved) {
                    this.p1Pos.anim = 'walk';
                } else if (this.p1Pos.anim === 'walk' || this.p1Pos.anim === 'jump' || this.p1Pos.anim === 'crouch') {
                    this.p1Pos.anim = 'idle';
                }
            }
        }

        // --- PLAYER 2 / CPU MOVEMENT (HUMAN CONTROLLED VIA PHONE / KEYBOARD OR CPU AI) ---
        if (this.p2Pos.anim !== 'ko' && this.p2Pos.anim !== 'hit') {
            if (this.isP2Human()) {
                let p2Moved = false;

                // Dedicated P2 controls: Android Gamepad D-pad + Arrow keys + Numpad
                const p2Left = this.p2Keys.left || this.keys['arrowleft'] || this.keys['numpad4'];
                const p2Right = this.p2Keys.right || this.keys['arrowright'] || this.keys['numpad6'];
                const p2Up = this.p2Keys.up || this.keys['arrowup'] || this.keys['numpad8'];
                const p2Down = this.p2Keys.down || this.keys['arrowdown'] || this.keys['numpad5'] || this.keys['numpad2'];

                if (p2Down && this.p2Pos.isGrounded) {
                    this.p2Pos.isCrouching = true;
                    this.p2Pos.anim = 'crouch';
                } else {
                    this.p2Pos.isCrouching = false;
                }

                const p2Speed = this.p2Pos.isCrouching ? 2.2 : 5.0;
                if (p2Left) {
                    this.p2Pos.x = Math.max(85, this.p2Pos.x - p2Speed);
                    p2Moved = true;
                }
                if (p2Right) {
                    this.p2Pos.x = Math.min(860, this.p2Pos.x + p2Speed);
                    p2Moved = true;
                }

                if (p2Up && this.p2Pos.isGrounded) {
                    this.p2Pos.vy = -14;
                    this.p2Pos.isGrounded = false;
                    sound.playJump();
                    arenaRenderer.addSparks(this.p2Pos.x, this.groundY, 6, '#ff0055', 2);
                }

                if (!this.p2Pos.isGrounded) {
                    this.p2Pos.y += this.p2Pos.vy;
                    this.p2Pos.vy += 0.8;
                    if (this.p2Pos.y >= this.groundY) {
                        this.p2Pos.y = this.groundY;
                        this.p2Pos.vy = 0;
                        this.p2Pos.isGrounded = true;
                        arenaRenderer.addSparks(this.p2Pos.x, this.groundY, 4, '#ff0055', 1);
                    } else {
                        this.p2Pos.anim = 'jump';
                    }
                }

                if (this.p2Pos.isGrounded && !this.p2Pos.isCrouching) {
                    if (p2Moved) {
                        this.p2Pos.anim = 'walk';
                    } else if (this.p2Pos.anim === 'walk' || this.p2Pos.anim === 'jump' || this.p2Pos.anim === 'crouch') {
                        this.p2Pos.anim = 'idle';
                    }
                }
            } else {
                // Dynamic AI Footwork driven by Difficulty (Easy, Normal, Hard)
                const relX = this.p2Pos.x - this.p1Pos.x;
                const absDist = Math.abs(relX);
                const aiDir = relX > 0 ? -1 : 1; // Direction AI must walk to approach P1
                const diff = this.difficulty;

                let idealDist = 240;
                let aiWalkSpeed = 1.8;
                let jumpChance = 0.007;

                if (diff === 'easy') {
                    idealDist = 310;
                    aiWalkSpeed = 0.95;
                    jumpChance = 0.002;
                } else if (diff === 'hard') {
                    idealDist = 160; // Aggressive close-range pressure
                    aiWalkSpeed = 3.2;
                    jumpChance = 0.022; // Active aerial evasion
                }

                if (!this.p1Processing && !this.p2Processing && this.p2Pos.isGrounded) {
                    if (absDist > idealDist + 40) {
                        this.p2Pos.x = Math.max(85, Math.min(860, this.p2Pos.x + aiDir * aiWalkSpeed));
                        this.p2Pos.anim = 'walk';
                    } else if (absDist < idealDist - 30) {
                        this.p2Pos.x = Math.max(85, Math.min(860, this.p2Pos.x - aiDir * aiWalkSpeed));
                        this.p2Pos.anim = 'walk';
                    } else {
                        if (this.p2Pos.anim === 'walk') this.p2Pos.anim = 'idle';
                    }

                    // Tactical Jump evasion (allows jumping over player!)
                    if (Math.random() < jumpChance && this.p2Pos.isGrounded) {
                        this.p2Pos.vy = (diff === 'hard') ? -13.5 : -11;
                        this.p2Pos.isGrounded = false;
                        sound.playJump();
                    }
                }

                if (!this.p2Pos.isGrounded) {
                    this.p2Pos.y += this.p2Pos.vy;
                    this.p2Pos.vy += 0.8;
                    if (this.p2Pos.y >= this.groundY) {
                        this.p2Pos.y = this.groundY;
                        this.p2Pos.vy = 0;
                        this.p2Pos.isGrounded = true;
                        if (this.p2Pos.anim === 'jump') this.p2Pos.anim = 'idle';
                    } else {
                        this.p2Pos.anim = 'jump';
                    }
                }
            }
        }

        // --- SOFT PHYSICAL PUSHOUT (GROUND ONLY) ---
        // When BOTH fighters are on the ground, gently push apart so they don't overlap,
        // but when either is jumping, they can cleanly LEAP OVER each other like Tekken!
        if (this.p1Pos.isGrounded && this.p2Pos.isGrounded) {
            const charBox = 48;
            const dist = Math.abs(this.p1Pos.x - this.p2Pos.x);
            if (dist < charBox) {
                const overlap = (charBox - dist) * 0.5;
                if (this.p1Pos.x <= this.p2Pos.x) {
                    this.p1Pos.x = Math.max(85, this.p1Pos.x - overlap);
                    this.p2Pos.x = Math.min(860, this.p2Pos.x + overlap);
                } else {
                    this.p1Pos.x = Math.min(860, this.p1Pos.x + overlap);
                    this.p2Pos.x = Math.max(85, this.p2Pos.x - overlap);
                }
            }
        }
    }

    // =========================================================================
    // MAIN 60 FPS CANVAS RENDERING LOOP
    // =========================================================================
    startLoop() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update() {
        if (this.isPaused) return;

        this.p1Pos.tick++;
        this.p2Pos.tick++;

        // Arcade 2D Movement Physics (Walk, Jump, Crouch)
        this.updateMovement();

        // Idle floating/breathing physics only when on ground and idle
        if (this.p1Pos.anim === 'idle' && this.p1Pos.isGrounded) {
            this.p1Pos.y = this.groundY + Math.sin(this.p1Pos.tick * 0.08) * 2;
        }
        if (this.p2Pos.anim === 'idle' && this.p2Pos.isGrounded) {
            this.p2Pos.y = this.groundY + Math.sin((this.p2Pos.tick + 20) * 0.08) * 2;
        }

        // Particle & FX updates
        arenaRenderer.updateParticles();
    }

    render() {
        if (!this.ctx || !this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.clearRect(0, 0, w, h);

        // 1. Arena Backdrop, Auras, FX & Particles
        const arenaId = this.battleState ? this.battleState.arena.id : this.selectedArena;
        arenaRenderer.draw(this.ctx, w, h, arenaId);

        // 2. Fighters Rendering (Standing proudly on arena floor)
        if (this.battleState) {
            SpriteRenderer.drawFighter(
                this.ctx,
                this.battleState.player1,
                this.p1Pos.x,
                this.p1Pos.y,
                this.p1Pos.facing,
                this.p1Pos.anim,
                this.p1Pos.tick,
                1.55 // High-res arcade scale
            );

            SpriteRenderer.drawFighter(
                this.ctx,
                this.battleState.player2,
                this.p2Pos.x,
                this.p2Pos.y,
                this.p2Pos.facing,
                this.p2Pos.anim,
                this.p2Pos.tick,
                1.55 // High-res arcade scale
            );
        }

        // 3. Draw Pause Indicator on Canvas when game is paused
        if (this.isPaused) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(5, 7, 15, 0.45)';
            this.ctx.fillRect(0, 0, w, h);
            this.ctx.textAlign = 'center';
            this.ctx.font = "bold 20px 'Press Start 2P', monospace";
            this.ctx.fillStyle = '#00f0ff';
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 15;
            this.ctx.fillText("⏸ PAUSED", w / 2, 45);
            this.ctx.restore();
        }
    }

    // =========================================================================
    // WIRELESS SMARTPHONE CONTROLLER SYSTEM (WEBSOCKET & DUAL QR CODES)
    // =========================================================================
    initWebSocketHost() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = this.hostLanIp || window.location.hostname || 'localhost';
        const wsUrl = `${protocol}//${host}:${this.wsPort}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                this.wsConnected = true;
                this.ws.send(JSON.stringify({
                    type: 'register',
                    role: 'host'
                }));
                this.updateWsHeaderBadge();
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    this.handleWsMessage(msg);
                } catch (e) {}
            };

            this.ws.onclose = () => {
                this.wsConnected = false;
                this.p1PhoneConnected = false;
                this.p2PhoneConnected = false;
                this.updateWsHeaderBadge();
                this.updateWsStatusBadges();
                setTimeout(() => this.initWebSocketHost(), 3000);
            };

            this.ws.onerror = () => {
                this.wsConnected = false;
            };
        } catch (err) {
            this.wsConnected = false;
        }
    }

    handleWsMessage(msg) {
        if (!msg || !msg.type) return;

        // 1. Live Controller Status Broadcast
        if (msg.type === 'status') {
            const prevP2 = this.p2PhoneConnected;
            this.p1PhoneConnected = !!msg.p1_connected;
            this.p2PhoneConnected = !!msg.p2_connected;
            this.updateWsStatusBadges();
            this.updateWsHeaderBadge();
            this.updateHUD();

            // When P2 smartphone connects, automatically activate human PvP mode!
            if (!prevP2 && this.p2PhoneConnected) {
                this.mode = 'pvp';
                this.appendLog("📱 Player 2 Android Controller Terhubung! Mode PvP Aktif.");
                sound.playSelect();
                if (this.battleState) {
                    fetch('api/battle.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'move', move: 'sync', mode: 'pvp' })
                    }).catch(() => {});
                }
            }
            return;
        }

        // Ignore inputs if game is over
        if (!this.battleState || this.battleState.isGameOver) return;

        // 2. Real-time Movement from Smartphone Virtual D-Pad (Direct mapped to player input vectors)
        if (msg.type === 'move') {
            const player = msg.player || 'p1';
            const dir = msg.dir;
            const pressed = !!msg.pressed;

            if (player === 'p1') {
                this.p1Keys[dir] = pressed;
            } else if (player === 'p2') {
                this.p2Keys[dir] = pressed;
            }
            return;
        }

        // 3. Combat Action from Smartphone Buttons
        if (msg.type === 'action') {
            const player = msg.player || 'p1';
            const action = msg.action;

            if (action === 'pause') {
                this.togglePause();
            } else if (['attack', 'special_1', 'special_2', 'ultimate'].includes(action)) {
                this.executeMove(player, action);
            }
        }
    }

    sendHapticFeedback(targetPlayer, durationMs = 80) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'haptic',
                player: targetPlayer,
                duration: durationMs
            }));
        }
    }

    updateWsHeaderBadge() {
        const btn = document.getElementById('btn-header-qr');
        if (!btn) return;

        if (this.p1PhoneConnected && this.p2PhoneConnected) {
            btn.innerHTML = '📱 HP: P1🟢 P2🟢';
            btn.style.borderColor = '#00ff88';
            btn.style.color = '#00ff88';
        } else if (this.p1PhoneConnected) {
            btn.innerHTML = '📱 HP: P1🟢 P2🔴';
            btn.style.borderColor = 'var(--neon-blue)';
            btn.style.color = 'var(--neon-blue)';
        } else if (this.p2PhoneConnected) {
            btn.innerHTML = '📱 HP: P1🔴 P2🟢';
            btn.style.borderColor = 'var(--neon-red)';
            btn.style.color = 'var(--neon-red)';
        } else if (this.wsConnected) {
            btn.innerHTML = '📱 HP CONTROLLER [QR]';
            btn.style.borderColor = 'var(--neon-gold)';
            btn.style.color = 'var(--neon-gold)';
        } else {
            btn.innerHTML = '📱 HP CONTROLLER [QR]';
            btn.style.borderColor = '#666';
            btn.style.color = '#aaa';
        }
    }

    updateWsStatusBadges() {
        const badgeP1 = document.getElementById('badge-p1-conn');
        const dotP1 = document.getElementById('dot-p1-conn');
        const textP1 = document.getElementById('text-p1-conn');

        const badgeP2 = document.getElementById('badge-p2-conn');
        const dotP2 = document.getElementById('dot-p2-conn');
        const textP2 = document.getElementById('text-p2-conn');

        if (badgeP1 && dotP1 && textP1) {
            if (this.p1PhoneConnected) {
                badgeP1.className = 'qr-status-pill connected';
                dotP1.innerText = '🟢';
                textP1.innerText = 'HP P1 Terhubung (Aktif)';
            } else {
                badgeP1.className = 'qr-status-pill waiting';
                dotP1.innerText = '🔴';
                textP1.innerText = 'Menunggu Scan HP P1...';
            }
        }

        if (badgeP2 && dotP2 && textP2) {
            if (this.p2PhoneConnected) {
                badgeP2.className = 'qr-status-pill connected';
                dotP2.innerText = '🟢';
                textP2.innerText = 'HP P2 Terhubung (Aktif)';
            } else {
                badgeP2.className = 'qr-status-pill waiting';
                dotP2.innerText = '🔴';
                textP2.innerText = 'Menunggu Scan HP P2...';
            }
        }
    }

    async refreshNetworkIp() {
        try {
            const res = await fetch('api/network.php');
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    this.hostLanIp = data.ip;
                    this.httpPort = data.httpPort || 8000;
                    this.wsPort = data.wsPort || 8088;

                    const ipInput = document.getElementById('qr-input-ip');
                    if (ipInput) ipInput.value = data.ip;

                    this.updateQrCodes(data.ip, this.httpPort);
                }
            }
        } catch (e) {
            // Local fallback
            this.updateQrCodes(window.location.hostname || '127.0.0.1', window.location.port || 8000);
        }
    }

    openQrModal() {
        this.openModal('modal-qr-controllers');
        const ipInput = document.getElementById('qr-input-ip');
        if (ipInput && !ipInput.value) {
            ipInput.value = this.hostLanIp || window.location.hostname || '127.0.0.1';
        }
        this.updateQrCodes(ipInput ? ipInput.value : this.hostLanIp);
    }

    updateQrCodes(ipAddress, port = null) {
        if (!ipAddress) ipAddress = this.hostLanIp || window.location.hostname || '127.0.0.1';
        this.hostLanIp = ipAddress;
        if (!port) port = this.httpPort || window.location.port || 8000;

        const protocol = window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
        const p1Url = `${protocol}//${ipAddress}:${port}/controller.html?p=1`;
        const p2Url = `${protocol}//${ipAddress}:${port}/controller.html?p=2`;

        // Update link elements
        const linkP1 = document.getElementById('link-p1-qr');
        if (linkP1) {
            linkP1.href = p1Url;
            linkP1.innerText = p1Url;
        }

        const linkP2 = document.getElementById('link-p2-qr');
        if (linkP2) {
            linkP2.href = p2Url;
            linkP2.innerText = p2Url;
        }

        // Render QR Code 1 (Player 1)
        const boxP1 = document.getElementById('qrcode-box-p1');
        if (boxP1 && typeof QRCode !== 'undefined') {
            boxP1.innerHTML = '';
            try {
                this.qrP1 = new QRCode(boxP1, {
                    text: p1Url,
                    width: 140,
                    height: 140,
                    colorDark: '#0a101d',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (e) {}
        }

        // Render QR Code 2 (Player 2)
        const boxP2 = document.getElementById('qrcode-box-p2');
        if (boxP2 && typeof QRCode !== 'undefined') {
            boxP2.innerHTML = '';
            try {
                this.qrP2 = new QRCode(boxP2, {
                    text: p2Url,
                    width: 140,
                    height: 140,
                    colorDark: '#1c0a10',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (e) {}
        }
    }

}

// Global Game Instance
var game = null;

function initMBG() {
    if (!window.game) {
        window.game = game = new MBGGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMBG);
} else {
    initMBG();
}
