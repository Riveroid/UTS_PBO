/**
 * MBG: MOBILE BATTLE GOVERNMENT - Supercharged Web Audio API Synthesizer
 * Menghasilkan sound effects retro 8-bit & arcade fighting game secara prosedural tanpa file eksternal:
 * - Multi-layered punch & critical impacts (sub-bass drop + snappy crunch transient)
 * - Elemental & character-specific skill audio (bubbling waves, official stamp slam, digital glitch, love sparkle)
 * - Dynamic cinematic ultimate charge & supersonic detonation
 * - Upward spring jumps, crouch rustle, and dual-tone K.O. gong
 * - 16-step driving chiptune battle BGM with bass groove & retro drum beat
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.bgmStep = 0;
        this.userUnlocked = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended' && this.userUnlocked) {
            this.ctx.resume().catch(() => {});
        }
    }

    unlock() {
        this.userUnlocked = true;
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    toggleMute() {
        this.unlock();
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.bgmPlaying) {
            this.stopBgm();
        }
        return this.isMuted;
    }

    playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        try {
            const t = this.ctx.currentTime + startTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(Math.max(10, freq), t);

            gain.gain.setValueAtTime(gainLevel, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {
            // Audio node safety catch
        }
    }

    // Filtered noise generator (transients, whooshes, explosions)
    playNoise(duration = 0.15, gainLevel = 0.15, filterFreq = 1200, filterType = 'bandpass') {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * duration);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = filterType;
            filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
            filter.Q.value = 2.5;

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(gainLevel, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {}
    }

    // Heavy Arcade Punch / Basic Hit (Layered Sub-bass + Crunch transient)
    playHit() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        const now = this.ctx.currentTime;

        // Layer 1: Snappy Noise Transient (Crunch impact)
        this.playNoise(0.06, 0.22, 1600, 'bandpass');

        // Layer 2: Pitch drop body
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 0.11);

            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.11);
        } catch (e) {}

        // Layer 3: Sub-bass punch drop
        try {
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(90, now);
            sub.frequency.exponentialRampToValueAtTime(28, now + 0.15);

            subGain.gain.setValueAtTime(0.35, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            sub.connect(subGain);
            subGain.connect(this.ctx.destination);
            sub.start(now);
            sub.stop(now + 0.15);
        } catch (e) {}
    }

    // Heavy Critical Hit / Crushing Blow
    playCrit() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        const now = this.ctx.currentTime;

        // 1. Heavy Distortion Noise Burst
        this.playNoise(0.25, 0.38, 900, 'lowpass');

        // 2. Deep Sub-bass Drop
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.32);

            gain.gain.setValueAtTime(0.42, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
        } catch (e) {}

        // 3. Metallic High Zing
        this.playTone(1100, 'square', 0.08, 0, 0.16);
        this.playTone(660, 'sawtooth', 0.12, 0.03, 0.18);
    }

    // Quick Swing / Whoosh
    playWhoosh() {
        this.playNoise(0.11, 0.14, 2200, 'bandpass');
    }

    // Springy Arcade Jump
    playJump() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.14);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
        } catch (e) {}
    }

    // Subtle Crouch / Duck Rustle
    playCrouch() {
        this.playNoise(0.06, 0.08, 550, 'lowpass');
    }

    // Special Skill Cast Audio tailored by character & skill
    playSkill(charId = 'bahlul', skillIndex = 1) {
        if (this.isMuted) return;
        this.init();

        // 1. Swirling Arcane Chime (Ascending Power Arpeggio)
        const notes = [330, 440, 554, 659, 880];
        notes.forEach((freq, idx) => {
            this.playTone(freq, 'sine', 0.16, idx * 0.035, 0.12);
        });

        // 2. Distinct Character Flavor
        if (charId === 'bahlul') {
            // Tsunami / Water & Chemical Splash
            this.playNoise(0.35, 0.28, 700, 'bandpass');
            this.playTone(120, 'triangle', 0.3, 0.05, 0.25);
        } else if (charId === 'tifuzia') {
            // Paper flurry + rapid laser scan + gavel slam
            this.playLaser();
            setTimeout(() => this.playSlam(), 150);
        } else if (charId === 'brown_teddy') {
            // Cute shimmer & squeeze pop
            this.playTone(880, 'sine', 0.1, 0, 0.18);
            this.playTone(1320, 'triangle', 0.12, 0.06, 0.2);
            this.playTone(1760, 'sine', 0.18, 0.12, 0.16);
            setTimeout(() => this.playTone(660, 'sine', 0.15, 0, 0.2), 180);
        } else if (charId === 'fufufifi') {
            // Rapid keyboard glitch + megaphone feedback
            this.playTone(740, 'square', 0.04, 0, 0.15);
            this.playTone(880, 'square', 0.04, 0.04, 0.15);
            this.playTone(1100, 'square', 0.06, 0.08, 0.18);
            this.playNoise(0.2, 0.2, 2800, 'bandpass');
        } else if (charId === 'wili_wonka') {
            // Sweet disco sweep & viral camera flash
            this.playTone(523, 'sawtooth', 0.15, 0, 0.15);
            this.playTone(659, 'sawtooth', 0.15, 0.06, 0.15);
            this.playTone(784, 'triangle', 0.2, 0.12, 0.2);
            this.playFlash();
        }
    }

    // Generic Magic sound
    playMagic() {
        this.playSkill('bahlul', 1);
    }

    // Laser / High-speed beam
    playLaser() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.22);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {}
    }

    // Heavy Gavel / Hammer Slam
    playSlam() {
        if (this.isMuted) return;
        this.playNoise(0.35, 0.35, 600, 'lowpass');
        this.playTone(55, 'sawtooth', 0.4, 0, 0.35);
    }

    // Camera flash / Sparkle
    playFlash() {
        this.playTone(1960, 'triangle', 0.06, 0, 0.15);
        this.playTone(2620, 'sine', 0.1, 0.03, 0.15);
    }

    // Epic Ultimate Move Supercharging & Detonation
    playUltimate() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || (this.ctx.state === 'suspended' && !this.userUnlocked)) return;

        const now = this.ctx.currentTime;

        // Phase 1: Rising Dual-Saw Siren Charging (0.0s - 0.45s)
        try {
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc1.frequency.setValueAtTime(180, now);
            osc1.frequency.linearRampToValueAtTime(920, now + 0.45);

            osc2.frequency.setValueAtTime(184, now);
            osc2.frequency.linearRampToValueAtTime(926, now + 0.45);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.36, now + 0.42);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.7);
            osc2.stop(now + 0.7);
        } catch (e) {}

        // Phase 2: Giant Supersonic Detonation (at 400ms)
        setTimeout(() => {
            this.playNoise(0.65, 0.45, 800, 'lowpass');
            this.playTone(45, 'sine', 0.6, 0, 0.45);
            this.playTone(80, 'triangle', 0.4, 0, 0.3);
        }, 380);
    }

    // Menu click / selection
    playSelect() {
        this.playTone(660, 'square', 0.05, 0, 0.12);
    }

    // Dramatic Knockout (K.O.) Gong & Slow-mo Drop
    playKo() {
        if (this.isMuted) return;
        this.init();

        // Dual-tone heavy gong impact
        this.playTone(130.81, 'sawtooth', 0.8, 0, 0.3); // C3
        this.playTone(196.00, 'sine', 0.9, 0, 0.25);     // G3
        this.playTone(65.41, 'sine', 1.1, 0, 0.4);       // C2 sub-bass

        // Descending chromatic slow-down
        const notes = [440, 392, 349, 293, 220, 146];
        notes.forEach((f, idx) => {
            this.playTone(f, 'sawtooth', 0.3, idx * 0.14, 0.18);
        });

        setTimeout(() => {
            this.playNoise(0.7, 0.35, 500, 'lowpass');
        }, 320);
    }

    // Victory Fanfare
    playVictory() {
        if (this.isMuted) return;
        const melody = [
            { f: 523.25, d: 0.14 }, // C5
            { f: 523.25, d: 0.14 },
            { f: 523.25, d: 0.14 },
            { f: 659.25, d: 0.32 }, // E5
            { f: 587.33, d: 0.18 }, // D5
            { f: 659.25, d: 0.18 }, // E5
            { f: 783.99, d: 0.55 }  // G5
        ];

        let timeOffset = 0;
        melody.forEach(item => {
            this.playTone(item.f, 'square', item.d, timeOffset, 0.18);
            timeOffset += item.d + 0.03;
        });
    }

    // 16-Step Retro Arcade Synthwave Battle BGM
    startBgm() {
        if (this.bgmPlaying || this.isMuted) return;
        this.init();
        this.bgmPlaying = true;
        this.bgmStep = 0;

        // Catchy driving 16-step bassline & lead chords (A minor groove)
        const bassNotes = [
            110, 110, 130.81, 110, 146.83, 110, 130.81, 123.47,
            110, 110, 164.81, 146.83, 130.81, 110, 98.00, 123.47
        ];
        const leadNotes = [
            440, 0, 523.25, 0, 659.25, 0, 587.33, 523.25,
            440, 0, 659.25, 0, 783.99, 659.25, 587.33, 493.88
        ];

        this.bgmInterval = setInterval(() => {
            if (!this.bgmPlaying || this.isMuted) return;

            const step = this.bgmStep % 16;
            const bass = bassNotes[step];
            const lead = leadNotes[step];

            // 1. Synth Bassline (triangle wave)
            if (bass > 0) {
                this.playTone(bass, 'triangle', 0.11, 0, 0.08);
            }

            // 2. Chiptune Lead (square wave arpeggio)
            if (lead > 0 && Math.random() > 0.1) {
                this.playTone(lead, 'square', 0.08, 0, 0.04);
            }

            // 3. Drum Section:
            // Kick on steps 0, 4, 8, 12
            if (step % 4 === 0) {
                this.playTone(65, 'sine', 0.08, 0, 0.12);
                this.playNoise(0.02, 0.05, 400, 'lowpass');
            }
            // Snare on steps 2, 6, 10, 14
            if (step % 4 === 2) {
                this.playNoise(0.05, 0.06, 2400, 'bandpass');
            }
            // Hi-hat on odd steps
            if (step % 2 === 1) {
                this.playNoise(0.015, 0.025, 6000, 'highpass');
            }

            this.bgmStep++;
        }, 125); // ~120 BPM groove
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

// Global Sound Engine Instance
const sound = new SoundEngine();

// Clean, unified one-shot user gesture unlocker to ensure zero autoplay warnings
const unlockAudioOnGesture = () => {
    sound.unlock();
};
window.addEventListener('pointerdown', unlockAudioOnGesture, { once: true, passive: true });
window.addEventListener('keydown', unlockAudioOnGesture, { once: true, passive: true });
window.addEventListener('touchstart', unlockAudioOnGesture, { once: true, passive: true });
