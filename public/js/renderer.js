/**
 * MBG: MOBILE BATTLE GOVERNMENT - Arena, FX & Full Skill Animation System
 * Mengelola penggambaran arena, efek partikel, animasi aura ngeskill pemain,
 * proyektil visual jurus, screen shake, dan banner sinematik Ultimate Move.
 */

class ArenaRenderer {
    constructor() {
        this.particles = [];
        this.damageTexts = [];
        this.casterAuras = [];
        this.skillVisuals = [];
        this.slashes = [];
        this.minions = [];
        this.tick = 0;

        // Screen Shake Engine
        this.shakeDuration = 0;
        this.shakeIntensity = 0;

        // Super Freeze / Cinematic Ultimate Banner
        this.freezeTimer = 0;
        this.ultimateBanner = null;

        // Retro On-Canvas K.O. Banner
        this.koBannerTimer = 0;
        this.koWinner = null;
    }

    triggerKoBanner(winnerName) {
        this.koBannerTimer = 110;
        this.koWinner = winnerName;
    }

    triggerScreenShake(duration = 14, intensity = 8) {
        this.shakeDuration = duration;
        this.shakeIntensity = intensity;
    }

    triggerSuperFreeze(charName, ultimateName, color = '#ffd700', charId = 'bahlul', side = 'left') {
        this.freezeTimer = 56; // ~0.95 second Mobile Legends style cinematic freeze
        this.ultimateBanner = {
            charName: charName.toUpperCase(),
            ultimateName: ultimateName.toUpperCase(),
            color: color,
            charId: charId,
            side: side,
            maxTimer: 56,
            timer: 56,
            alpha: 1.0
        };
    }

    triggerCasterAura(x, y, moveType, color = '#00f0ff', facing = 1, charId = 'bahlul', skillName = '') {
        this.casterAuras.push({
            x: x,
            y: y,
            moveType: moveType,
            color: color,
            facing: facing,
            charId: charId,
            skillName: skillName,
            tick: 0,
            maxTick: moveType === 'ultimate' ? 50 : 32
        });

        // Add burst ground sparks
        this.addSparks(x, y + 5, moveType === 'ultimate' ? 32 : 18, color, 6);
    }

    spawnAttackSlash(x, y, color = '#00f0ff') {
        this.slashes.push({
            x: x,
            y: y,
            color: color,
            radius: 40,
            tick: 0,
            maxTick: 12
        });
    }

    spawnSkillVisual(charId, skillType, casterX, casterY, targetX, targetY, facing = 1) {
        this.skillVisuals.push({
            charId: charId,
            skillType: skillType,
            casterX: casterX,
            casterY: casterY,
            targetX: targetX,
            targetY: targetY,
            facing: facing,
            x: casterX + (facing * 30),
            y: casterY - 20,
            tick: 0,
            maxTick: (skillType === 'ultimate') ? 70 : 45
        });
    }

    addDamageText(text, x, y, isCrit = false, color = '#ffffff') {
        this.damageTexts.push({
            text: text,
            x: x + (Math.random() * 24 - 12),
            y: y - 20,
            vy: -2.2,
            alpha: 1.0,
            scale: isCrit ? 1.6 : 1.0,
            color: isCrit ? '#ff0055' : color,
            isCrit: isCrit,
            life: 45
        });
    }

    addSparks(x, y, count = 12, color = '#ffd700', speed = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (Math.random() * 0.7 + 0.3) * speed;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 1.5,
                color: color,
                radius: Math.random() * 3.5 + 1.5,
                alpha: 1.0,
                decay: Math.random() * 0.035 + 0.02
            });
        }
    }

    spawnMinion(x, y, direction = 1) {
        for (let i = 0; i < 3; i++) {
            this.minions.push({
                x: x + (direction * (i * 20)),
                y: y,
                vx: direction * (Math.random() * 2 + 5),
                life: 60,
                tick: i * 8
            });
        }
    }

    updateParticles() {
        this.tick++;

        // Super freeze pause countdown
        if (this.freezeTimer > 0) {
            this.freezeTimer--;
            if (this.ultimateBanner) {
                this.ultimateBanner.timer = this.freezeTimer;
            }
        }

        // Screen shake decay
        if (this.shakeDuration > 0) {
            this.shakeDuration--;
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.14; // gravity
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update damage texts
        for (let i = this.damageTexts.length - 1; i >= 0; i--) {
            const dt = this.damageTexts[i];
            dt.y += dt.vy;
            dt.life--;
            if (dt.life < 15) {
                dt.alpha = dt.life / 15;
            }
            if (dt.life <= 0) {
                this.damageTexts.splice(i, 1);
            }
        }

        // Update Caster Auras
        for (let i = this.casterAuras.length - 1; i >= 0; i--) {
            const aura = this.casterAuras[i];
            aura.tick++;
            if (aura.tick >= aura.maxTick) {
                this.casterAuras.splice(i, 1);
            }
        }

        // Update Slashes
        for (let i = this.slashes.length - 1; i >= 0; i--) {
            const s = this.slashes[i];
            s.tick++;
            if (s.tick >= s.maxTick) {
                this.slashes.splice(i, 1);
            }
        }

        // Update Skill Visuals
        for (let i = this.skillVisuals.length - 1; i >= 0; i--) {
            const sv = this.skillVisuals[i];
            sv.tick++;
            // Move projectile smoothly towards target
            const progress = sv.tick / sv.maxTick;
            sv.x = sv.casterX + (sv.targetX - sv.casterX) * Math.min(1.0, progress * 1.5);
            if (sv.tick >= sv.maxTick) {
                this.skillVisuals.splice(i, 1);
            }
        }

        // Update minions
        for (let i = this.minions.length - 1; i >= 0; i--) {
            const m = this.minions[i];
            m.x += m.vx;
            m.tick++;
            m.life--;
            if (m.life <= 0) {
                this.minions.splice(i, 1);
            }
        }
    }

    draw(ctx, width, height, arenaId = 'ruang_sidang') {
        ctx.save();

        // 1. Apply Screen Shake Offset
        if (this.shakeDuration > 0) {
            const intensity = this.shakeIntensity * (this.shakeDuration / 14);
            const shakeX = (Math.random() - 0.5) * intensity * 2;
            const shakeY = (Math.random() - 0.5) * intensity * 2;
            ctx.translate(shakeX, shakeY);
        }

        // 2. Draw Arena Backdrop
        this.drawBackdrop(ctx, width, height, arenaId);

        // 3. Draw Caster Auras & Special Skill Anime Effects (Under fighters)
        this.drawCasterAuras(ctx, width, height);

        // 4. Draw Minions
        this.drawMinions(ctx);

        // 5. Draw Skill Visuals & Projectiles
        this.drawSkillVisuals(ctx);

        // 6. Draw Slashes
        this.drawSlashes(ctx);

        // 7. Draw Particles & Sparks
        this.drawParticles(ctx);

        // 8. Draw Floating Damage Numbers
        this.drawDamageTexts(ctx);

        // 9. Draw Cinematic Ultimate Banner (If active)
        this.drawUltimateBanner(ctx, width, height);

        // 10. Draw Retro Arcade K.O. Banner
        this.drawKoBanner(ctx, width, height);

        ctx.restore();
    }

    drawBackdrop(ctx, width, height, arenaId) {
        const groundY = 340; // Perfectly synchronized with game.js groundY!

        switch (arenaId) {
            case 'ruang_sidang':
                this.drawRuangSidang(ctx, width, height, groundY);
                break;
            case 'bundaran_demokrasi':
                this.drawBundaranDemokrasi(ctx, width, height, groundY);
                break;
            case 'studio_viral':
                this.drawStudioViral(ctx, width, height, groundY);
                break;
            case 'lembah_etanol':
                this.drawLembahEtanol(ctx, width, height, groundY);
                break;
            default:
                this.drawRuangSidang(ctx, width, height, groundY);
        }
    }

    // ARENA 1: Ruang Sidang Paripurna (DPR)
    drawRuangSidang(ctx, width, height, groundY) {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#121422');
        bgGrad.addColorStop(0.6, '#20161c');
        bgGrad.addColorStop(1, '#090a0f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grand Marble Columns
        for (let x = 70; x < width; x += 190) {
            ctx.fillStyle = '#232b3c';
            ctx.fillRect(x, 0, 44, groundY);
            ctx.fillStyle = '#34405a';
            ctx.fillRect(x + 6, 0, 8, groundY);
            ctx.fillStyle = '#181e2b';
            ctx.fillRect(x + 36, 0, 8, groundY);
        }

        // Indonesian Red-White Banner Ribbon
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(width / 2 - 130, 20, 260, 16);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(width / 2 - 130, 36, 260, 16);

        // Golden Parliament Crest Ring
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, 85, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Floor: Lush Red Paripurna Carpet
        ctx.fillStyle = '#7a1921';
        ctx.fillRect(0, groundY, width, height - groundY);
        // Golden trim border line
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, groundY, width, 4);
    }

    // ARENA 2: Bundaran Demokrasi
    drawBundaranDemokrasi(ctx, width, height, groundY) {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGrad.addColorStop(0, '#090c18');
        skyGrad.addColorStop(0.7, '#241a38');
        skyGrad.addColorStop(1, '#4a2545');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, groundY);

        // City Skyline
        ctx.fillStyle = '#101423';
        for (let x = 0; x < width; x += 45) {
            const h = 75 + (Math.sin(x) * 40);
            ctx.fillRect(x, groundY - h, 40, h);
            ctx.fillStyle = '#ffd700';
            if (x % 30 === 0) {
                ctx.fillRect(x + 10, groundY - h + 15, 6, 8);
                ctx.fillRect(x + 24, groundY - h + 30, 6, 8);
            }
            ctx.fillStyle = '#101423';
        }

        // Central Democracy Obelisk
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(width / 2 - 25, groundY);
        ctx.lineTo(width / 2 - 10, 80);
        ctx.lineTo(width / 2, 40);
        ctx.lineTo(width / 2 + 10, 80);
        ctx.lineTo(width / 2 + 25, groundY);
        ctx.closePath();
        ctx.fill();

        // Eternal Flame
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.arc(width / 2, 40, 8 + Math.sin(this.tick * 0.2) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Road Floor
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(0, groundY, width, 3);
    }

    // ARENA 3: Studio Panggung Viral
    drawStudioViral(ctx, width, height, groundY) {
        ctx.fillStyle = '#08090f';
        ctx.fillRect(0, 0, width, height);

        // LED Video Wall
        const wallGrad = ctx.createLinearGradient(0, 0, width, 0);
        wallGrad.addColorStop(0, 'rgba(230, 57, 70, 0.25)');
        wallGrad.addColorStop(0.5, 'rgba(67, 97, 238, 0.35)');
        wallGrad.addColorStop(1, 'rgba(247, 37, 133, 0.25)');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(80, 30, width - 160, groundY - 45);

        // Spotlight Beams
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(80, 0);
        ctx.lineTo(width / 2 - 90, groundY);
        ctx.lineTo(width / 2 + 30, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width - 80, 0);
        ctx.lineTo(width / 2 - 30, groundY);
        ctx.lineTo(width / 2 + 90, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Glossy Floor
        ctx.fillStyle = '#141a29';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(0, groundY, width, 4);
    }

    // ARENA 4: Lembah Etanol Hijau
    drawLembahEtanol(ctx, width, height, groundY) {
        const etGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        etGrad.addColorStop(0, '#03120a');
        etGrad.addColorStop(0.7, '#082516');
        etGrad.addColorStop(1, '#114426');
        ctx.fillStyle = etGrad;
        ctx.fillRect(0, 0, width, groundY);

        // Chemical Pipes
        ctx.fillStyle = '#263238';
        ctx.fillRect(40, 50, width - 80, 24);
        ctx.fillRect(150, 50, 28, groundY - 50);
        ctx.fillRect(width - 180, 50, 28, groundY - 50);

        // Ethanol River Floor
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, groundY, width, 4);

        // Bioluminescent Bubbles
        for (let i = 0; i < 6; i++) {
            const bx = (i * 150 + (this.tick * 1.5)) % width;
            const by = groundY - 20 - ((this.tick * 2 + i * 30) % 120);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.beginPath();
            ctx.arc(bx, by, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // =========================================================================
    // DYNAMIC CASTER CHARGING AURAS (Ngeskill di Sisi Pemain & Lawan)
    // Full Animation: Arcane Rune Circle, Rising Energy Pillar, Anime Speed Lines,
    // Electric Lightning Crackles, and Floating Arcade Skill Badge Callout
    // =========================================================================
    drawCasterAuras(ctx, width = 960, height = 440) {
        this.casterAuras.forEach(aura => {
            const progress = aura.tick / aura.maxTick;
            const alpha = Math.max(0, 1.0 - progress);
            const isSkill = (aura.moveType === 'special_1' || aura.moveType === 'special_2' || aura.moveType === 'ultimate');

            // 1. ANIME ACTION RADIAL SPEED LINES (Emanating across the screen from caster's torso)
            if (isSkill && alpha > 0.05) {
                ctx.save();
                const originX = aura.x;
                const originY = aura.y - 45;
                const lineCount = aura.moveType === 'ultimate' ? 24 : 16;
                const rayLen = Math.max(width, height) * 1.2;

                ctx.strokeStyle = aura.color;
                ctx.shadowColor = aura.color;
                ctx.shadowBlur = 10;
                ctx.lineWidth = aura.moveType === 'ultimate' ? 2.5 : 1.5;
                ctx.globalAlpha = alpha * (aura.moveType === 'ultimate' ? 0.35 : 0.22);

                for (let i = 0; i < lineCount; i++) {
                    const angle = (i / lineCount) * Math.PI * 2 + (aura.tick * 0.02);
                    const innerDist = 65 + (Math.sin(i * 3 + aura.tick * 0.2) * 15);
                    const startX = originX + Math.cos(angle) * innerDist;
                    const startY = originY + Math.sin(angle) * (innerDist * 0.6);
                    const endX = originX + Math.cos(angle) * rayLen;
                    const endY = originY + Math.sin(angle) * rayLen;

                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
                ctx.restore();
            }

            ctx.save();
            ctx.translate(aura.x, aura.y);

            const radius = (aura.moveType === 'ultimate' ? 55 : 42) + (progress * 22);

            // 2. GEOMETRIC ROTATING ARCANE SUMMONING CIRCLE ON ARENA FLOOR
            if (isSkill) {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = aura.color;
                ctx.shadowColor = aura.color;
                ctx.shadowBlur = 18;
                ctx.lineWidth = 2.5;

                // Outer Runic Ellipse
                ctx.beginPath();
                ctx.ellipse(0, 4, radius, radius * 0.36, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Inner Concentric Ellipse
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(0, 4, radius * 0.68, radius * 0.68 * 0.36, 0, 0, Math.PI * 2);
                ctx.stroke();

                // 8 Rotating Floor Arcane Tick Runes
                const glyphAngleOffset = -aura.tick * 0.07;
                for (let g = 0; g < 8; g++) {
                    const ga = glyphAngleOffset + (g * (Math.PI / 4));
                    const gx = Math.cos(ga) * radius;
                    const gy = 4 + Math.sin(ga) * (radius * 0.36);
                    const gnx = Math.cos(ga) * (radius * 0.88);
                    const gny = 4 + Math.sin(ga) * (radius * 0.88 * 0.36);

                    ctx.beginPath();
                    ctx.moveTo(gx, gy);
                    ctx.lineTo(gnx, gny);
                    ctx.stroke();

                    // Runic dots
                    ctx.fillStyle = aura.color;
                    ctx.fillRect(gnx - 1.5, gny - 1.5, 3, 3);
                }

                // Inner 8-Pointed Star Geometry (Rotating Clockwise)
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                const starAngleOffset = aura.tick * 0.05;
                for (let p = 0; p < 16; p++) {
                    const sa = starAngleOffset + (p * (Math.PI / 8));
                    const rDist = (p % 2 === 0) ? (radius * 0.65) : (radius * 0.32);
                    const px = Math.cos(sa) * rDist;
                    const py = 4 + Math.sin(sa) * (rDist * 0.36);
                    if (p === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();

                // Center Pulsing Core
                ctx.fillStyle = aura.color;
                ctx.beginPath();
                ctx.ellipse(0, 4, 8 + Math.sin(aura.tick * 0.3) * 3, (8 + Math.sin(aura.tick * 0.3) * 3) * 0.36, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                // Basic Attack Shockwave
                ctx.strokeStyle = aura.color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.ellipse(0, 4, radius, radius * 0.35, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 3. BLAZING VERTICAL ENERGY PILLAR & FLOATING EMBERS
            if (isSkill) {
                const pillarH = (aura.moveType === 'ultimate') ? 165 : 130;
                const pillarW = (aura.moveType === 'ultimate') ? 56 : 42;

                ctx.save();
                const grad = ctx.createLinearGradient(0, 4, 0, -pillarH);
                grad.addColorStop(0, aura.color);
                grad.addColorStop(0.4, aura.color);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.shadowColor = aura.color;
                ctx.shadowBlur = 24;
                ctx.globalAlpha = alpha * (aura.moveType === 'ultimate' ? 0.65 : 0.42);
                ctx.fillRect(-pillarW / 2, -pillarH, pillarW, pillarH);

                // Upward Rising Light Motes / Floating Plasma Sparks
                ctx.fillStyle = '#ffffff';
                for (let k = 0; k < 6; k++) {
                    const sparkProgress = (aura.tick * 2 + k * 18) % pillarH;
                    const sparkX = Math.sin(aura.tick * 0.3 + k) * (pillarW * 0.38);
                    const sparkY = -sparkProgress;
                    const sparkR = 2.2 + Math.sin(aura.tick * 0.4 + k) * 1.2;

                    ctx.globalAlpha = alpha * (1.0 - (sparkProgress / pillarH));
                    ctx.beginPath();
                    ctx.arc(sparkX, sparkY, sparkR, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();

                // 4. CRACKLING ELECTRIC LIGHTNING ARCS AROUND CASTER SILHOUETTE
                ctx.save();
                ctx.strokeStyle = '#ffffff';
                ctx.shadowColor = aura.color;
                ctx.shadowBlur = 15;
                ctx.lineWidth = 2.2;
                ctx.globalAlpha = alpha * 0.85;

                for (let bolt = 0; bolt < 2; bolt++) {
                    const dir = (bolt === 0) ? -1 : 1;
                    const seed = aura.tick * 3 + bolt * 17;
                    const j1 = Math.sin(seed) * 12;
                    const j2 = Math.cos(seed * 1.4) * 14;
                    const j3 = Math.sin(seed * 2.1) * 10;

                    ctx.beginPath();
                    ctx.moveTo(dir * 18, 0);
                    ctx.lineTo(dir * (14 + j1), -30);
                    ctx.lineTo(dir * (22 + j2), -65);
                    ctx.lineTo(dir * (8 + j3), -100);
                    ctx.lineTo(0, -125);
                    ctx.stroke();
                }
                ctx.restore();

                // 5. FLOATING ARCADE SKILL CALLOUT BADGE ABOVE CASTER HEAD
                if (aura.skillName) {
                    ctx.save();
                    const badgeY = -120;
                    const popScale = 1.0 + Math.max(0, 0.45 - progress * 1.1);

                    ctx.translate(0, badgeY);
                    ctx.scale(popScale, popScale);
                    ctx.globalAlpha = Math.min(1.0, alpha * 1.3);

                    // Measure text
                    ctx.font = "bold 13px 'Press Start 2P', monospace";
                    const iconPrefix = (aura.moveType === 'ultimate') ? "★ ULTIMATE: " : "⚡ ";
                    const fullText = `${iconPrefix}${aura.skillName.toUpperCase()}`;
                    const textWidth = ctx.measureText(fullText).width;
                    const padX = 14;
                    const badgeW = textWidth + padX * 2;
                    const badgeH = 26;

                    // Badge Container Box
                    ctx.fillStyle = 'rgba(7, 11, 20, 0.94)';
                    ctx.fillRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH);

                    // Glowing Neon Border
                    ctx.strokeStyle = aura.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = aura.color;
                    ctx.shadowBlur = 14;
                    ctx.strokeRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH);

                    // Corner Accent Notches
                    ctx.fillStyle = aura.color;
                    ctx.fillRect(-badgeW / 2, -badgeH / 2, 4, 4);
                    ctx.fillRect(badgeW / 2 - 4, -badgeH / 2, 4, 4);
                    ctx.fillRect(-badgeW / 2, badgeH / 2 - 4, 4, 4);
                    ctx.fillRect(badgeW / 2 - 4, badgeH / 2 - 4, 4, 4);

                    // Badge Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(fullText, 0, 1);
                    ctx.restore();
                }
            }

            ctx.restore();
        });
    }

    // =========================================================================
    // FULL SKILL VISUALS & ANIMATIONS (Semua 15 Jurus Spesifik)
    // =========================================================================
    drawSkillVisuals(ctx) {
        this.skillVisuals.forEach(sv => {
            ctx.save();
            ctx.translate(sv.x, sv.y);
            const progress = sv.tick / sv.maxTick;

            // 1. BAHLUL - SKILLS
            if (sv.charId === 'bahlul') {
                if (sv.skillType === 'special_1') {
                    // TSUNAMI ETANOL: Massive Green/Cyan Wave
                    ctx.fillStyle = 'rgba(0, 255, 136, 0.75)';
                    ctx.beginPath();
                    ctx.moveTo(-20, 20);
                    ctx.quadraticCurveTo(0, -60, 40 * sv.facing, 20);
                    ctx.lineTo(-20, 20);
                    ctx.fill();
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                } else if (sv.skillType === 'special_2') {
                    // GOBLIN SUMMON: Flying Goblin Pack
                    ctx.fillStyle = '#00ff66';
                    ctx.beginPath();
                    ctx.arc(0, -10, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(4 * sv.facing, -12, 4, 3);
                } else if (sv.skillType === 'ultimate') {
                    // GOBLIN APOCALYPSE: Dimension Meteor
                    ctx.fillStyle = '#00ff88';
                    ctx.shadowColor = '#00ff88';
                    ctx.shadowBlur = 25;
                    ctx.beginPath();
                    ctx.arc(0, -30, 35, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // 2. TIFUZIA - SKILLS
            else if (sv.charId === 'tifuzia') {
                if (sv.skillType === 'special_1') {
                    // MANA IJAZAH?: Flying Diploma Scrolls
                    ctx.rotate(sv.tick * 0.3);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-18, -10, 36, 20);
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-18, -10, 36, 20);
                    ctx.fillStyle = '#e63946';
                    ctx.fillRect(-4, -4, 8, 8); // Red seal
                } else if (sv.skillType === 'special_2') {
                    // BACOT OVERLOAD: Soundwave Typography
                    ctx.font = "bold 22px 'Rajdhani', sans-serif";
                    ctx.fillStyle = '#00f0ff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 3;
                    const words = ["MANA IJAZAH!?", "HOAX!", "DEBAT KUSIR!", "BOHONG!"];
                    const word = words[Math.floor((sv.tick / 10) % words.length)];
                    ctx.strokeText(word, -40, 0);
                    ctx.fillText(word, -40, 0);
                } else if (sv.skillType === 'ultimate') {
                    // SIDANG TERBUKA: Giant Golden Judge Gavel Slam
                    ctx.fillStyle = '#ffd700';
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 20;
                    ctx.fillRect(-20, -120 + (progress * 100), 40, 60); // Hammer head
                    ctx.fillStyle = '#8b5a2b';
                    ctx.fillRect(-6, -160 + (progress * 100), 12, 70); // Handle
                }
            }

            // 3. BROWN TEDDY - SKILLS
            else if (sv.charId === 'brown_teddy') {
                if (sv.skillType === 'special_1') {
                    // KISS ATTACK: Pulsing Neon Heart
                    const heartScale = 1.2 + Math.sin(sv.tick * 0.3) * 0.3;
                    ctx.scale(heartScale, heartScale);
                    ctx.fillStyle = '#ff1744';
                    ctx.shadowColor = '#ff4081';
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(-8, -8, 10, Math.PI, 0, false);
                    ctx.arc(8, -8, 10, Math.PI, 0, false);
                    ctx.lineTo(0, 12);
                    ctx.closePath();
                    ctx.fill();
                } else if (sv.skillType === 'special_2') {
                    // TEDDY HUG: Giant Clamping Bear Paws
                    ctx.fillStyle = '#8d6e63';
                    ctx.beginPath();
                    ctx.arc(-20, 0, 22, 0, Math.PI * 2);
                    ctx.arc(20, 0, 22, 0, Math.PI * 2);
                    ctx.fill();
                } else if (sv.skillType === 'ultimate') {
                    // LOVE BOMB: Giant Bear Bomb
                    ctx.fillStyle = '#e91e63';
                    ctx.shadowColor = '#ff4081';
                    ctx.shadowBlur = 30;
                    ctx.beginPath();
                    ctx.arc(0, 0, 45, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // 4. FUFUFIFI - SKILLS
            else if (sv.charId === 'fufufifi') {
                if (sv.skillType === 'special_1') {
                    // KRITIK TAJAM: Electric Laser Spear
                    ctx.strokeStyle = '#ffd700';
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 15;
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(-40 * sv.facing, 0);
                    ctx.lineTo(40 * sv.facing, 0);
                    ctx.stroke();
                } else if (sv.skillType === 'special_2') {
                    // ASPIRASI RAKYAT: Huge Protest Banner Wave
                    ctx.fillStyle = '#e63946';
                    ctx.fillRect(-30, -25, 60, 40);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = "bold 14px 'Rajdhani', sans-serif";
                    ctx.fillText("SUARA", -22, -8);
                    ctx.fillText("RAKYAT", -24, 8);
                } else if (sv.skillType === 'ultimate') {
                    // REVOLUSI ARGUMEN: Demonstators Crowd Wave
                    ctx.fillStyle = 'rgba(230, 57, 70, 0.85)';
                    for (let j = 0; j < 5; j++) {
                        ctx.fillRect(-60 + (j * 25), -40, 18, 50);
                    }
                }
            }

            // 5. WILI WONKA - SKILLS
            else if (sv.charId === 'wili_wonka') {
                if (sv.skillType === 'special_1') {
                    // CHOCOLATE LICK: Chocolate Swirl & Healing
                    ctx.fillStyle = '#795548';
                    ctx.beginPath();
                    ctx.arc(0, 0, 22, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#00ff88';
                    ctx.font = "bold 18px 'Rajdhani', sans-serif";
                    ctx.fillText("+45 HP", -25, -30);
                } else if (sv.skillType === 'special_2') {
                    // JILAT PANGGUNG: Dazzling Disco Spotlight
                    ctx.fillStyle = '#ffd700';
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(0, 0, 18, 0, Math.PI * 2);
                    ctx.fill();
                } else if (sv.skillType === 'ultimate') {
                    // VIRAL MOMENT: Camera Flash Blitz & Social Icons
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#00f0ff';
                    ctx.shadowBlur = 30;
                    ctx.beginPath();
                    ctx.arc(0, 0, 35, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.font = "24px sans-serif";
                    ctx.fillText("🔥 👍 ❤️", -35, -45);
                }
            }

            ctx.restore();
        });
    }

    drawSlashes(ctx) {
        this.slashes.forEach(s => {
            ctx.save();
            ctx.translate(s.x, s.y);
            const progress = s.tick / s.maxTick;
            ctx.strokeStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 15;
            ctx.lineWidth = 4 * (1 - progress);
            ctx.beginPath();
            ctx.arc(0, 0, s.radius * (0.8 + progress * 0.4), -0.8, 0.8);
            ctx.stroke();
            ctx.restore();
        });
    }

    drawMinions(ctx) {
        this.minions.forEach(m => {
            ctx.save();
            ctx.translate(m.x, m.y);
            const hop = Math.abs(Math.sin(m.tick * 0.4)) * 9;
            ctx.fillStyle = '#00ff66';
            ctx.beginPath();
            ctx.arc(0, -12 - hop, 8, 0, Math.PI * 2);
            ctx.fill();
            // Pointy Ears
            ctx.beginPath();
            ctx.moveTo(-8, -16 - hop);
            ctx.lineTo(-14, -20 - hop);
            ctx.lineTo(-7, -10 - hop);
            ctx.fill();
            // Red Glowing Eyes
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(2, -14 - hop, 3, 2);
            ctx.restore();
        });
    }

    drawParticles(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    drawDamageTexts(ctx) {
        ctx.save();
        this.damageTexts.forEach(dt => {
            ctx.globalAlpha = Math.max(0, dt.alpha);
            ctx.font = dt.isCrit ? "bold 24px 'Press Start 2P', monospace" : "bold 18px 'Rajdhani', sans-serif";
            ctx.fillStyle = dt.color;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(dt.text, dt.x, dt.y);
            ctx.fillText(dt.text, dt.x, dt.y);
        });
        ctx.restore();
    }

    drawUltimateBanner(ctx, width, height) {
        if (this.freezeTimer <= 0 || !this.ultimateBanner) return;

        const banner = this.ultimateBanner;
        const curT = banner.timer;
        const maxT = banner.maxTimer || 56;
        const isRight = (banner.side === 'right');

        // Dynamic Motion Curve: Slide-In -> Dramatic Cinematic Hold -> Rapid Slash-Out
        let slideX = 0;
        let alpha = 1.0;
        const cutW = Math.min(480, width * 0.52);
        const cutH = 175;
        const cutY = Math.max(160, Math.min(210, height * 0.44));
        const slashOffset = 65; // Slant angle

        if (!isRight) {
            // --- LEFT SIDE (P1 / PLAYER) ---
            if (curT > 46) {
                // 1. Rapid Slide-In (Frames 56 -> 46)
                const entryProgress = (maxT - curT) / (maxT - 46);
                const easeOut = 1 - Math.pow(1 - Math.min(1.0, entryProgress), 3);
                slideX = -cutW * (1 - easeOut);
                alpha = Math.min(1.0, entryProgress * 1.4);
            } else if (curT > 12) {
                // 2. Dramatic Hold & Slow Parallax Creep (Frames 46 -> 12)
                const holdProgress = (46 - curT) / 34;
                slideX = holdProgress * 16;
                alpha = 1.0;
            } else {
                // 3. Slash-Out Exit (Frames 12 -> 0)
                const exitProgress = (12 - curT) / 12;
                slideX = 16 + (exitProgress * exitProgress * 220);
                alpha = Math.max(0, 1.0 - (exitProgress * exitProgress));
            }
        } else {
            // --- RIGHT SIDE (ENEMY / P2) ---
            if (curT > 46) {
                // 1. Rapid Slide-In from Right edge
                const entryProgress = (maxT - curT) / (maxT - 46);
                const easeOut = 1 - Math.pow(1 - Math.min(1.0, entryProgress), 3);
                slideX = (width - cutW) + (cutW * (1 - easeOut));
                alpha = Math.min(1.0, entryProgress * 1.4);
            } else if (curT > 12) {
                // 2. Dramatic Hold & Slow Parallax Creep toward center
                const holdProgress = (46 - curT) / 34;
                slideX = (width - cutW) - (holdProgress * 16);
                alpha = 1.0;
            } else {
                // 3. Slash-Out Exit towards right
                const exitProgress = (12 - curT) / 12;
                slideX = (width - cutW) - 16 + (exitProgress * exitProgress * 220);
                alpha = Math.max(0, 1.0 - (exitProgress * exitProgress));
            }
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        // -------------------------------------------------------------
        // A. Full-Screen Dimming & Manga Action Focus Lines
        // -------------------------------------------------------------
        ctx.fillStyle = 'rgba(4, 7, 16, 0.76)';
        ctx.fillRect(0, 0, width, height);

        // Anime action speedlines converging toward the battlefield
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        const centerX = isRight ? (width * 0.45) : (width * 0.55);
        const centerY = height * 0.52;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2 + (this.tick * 0.03);
            const distInner = 140;
            const distOuter = 650;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle) * distInner, centerY + Math.sin(angle) * (distInner * 0.6));
            ctx.lineTo(centerX + Math.cos(angle) * distOuter, centerY + Math.sin(angle) * (distOuter * 0.6));
            ctx.stroke();
        }
        ctx.restore();

        // -------------------------------------------------------------
        // B. Slanted Cut-In Card (Left or Right Orientation)
        // -------------------------------------------------------------
        ctx.save();
        ctx.beginPath();
        if (!isRight) {
            ctx.moveTo(slideX - 20, cutY);
            ctx.lineTo(slideX + cutW, cutY);
            ctx.lineTo(slideX + cutW - slashOffset, cutY + cutH);
            ctx.lineTo(slideX - 20, cutY + cutH);
        } else {
            ctx.moveTo(slideX + slashOffset, cutY);
            ctx.lineTo(slideX + cutW + 20, cutY);
            ctx.lineTo(slideX + cutW + 20, cutY + cutH);
            ctx.lineTo(slideX, cutY + cutH);
        }
        ctx.closePath();
        ctx.clip();

        // Deep cyber dark gradient
        const bgGrad = ctx.createLinearGradient(slideX, cutY, slideX + cutW, cutY + cutH);
        bgGrad.addColorStop(0, isRight ? '#1b2848' : '#0a101f');
        bgGrad.addColorStop(0.5, '#121a2f');
        bgGrad.addColorStop(1, isRight ? '#0a101f' : '#1b2848');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(slideX - 30, cutY - 10, cutW + 60, cutH + 20);

        // Dynamic manga speedlines inside the cut-in card
        ctx.strokeStyle = banner.color;
        ctx.globalAlpha = alpha * 0.22;
        ctx.lineWidth = 2.5;
        for (let s = -60; s < cutW + 80; s += 32) {
            const sx = slideX + s + ((this.tick * 10) % 32);
            ctx.beginPath();
            if (!isRight) {
                ctx.moveTo(sx, cutY);
                ctx.lineTo(sx - slashOffset, cutY + cutH);
            } else {
                ctx.moveTo(sx + slashOffset, cutY);
                ctx.lineTo(sx, cutY + cutH);
            }
            ctx.stroke();
        }

        // Energy underglow
        const glowGrad = ctx.createLinearGradient(slideX, cutY + cutH, slideX, cutY + cutH - 60);
        glowGrad.addColorStop(0, banner.color);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = alpha * 0.25;
        ctx.fillRect(slideX - 30, cutY + cutH - 60, cutW + 60, 60);

        // 2. Draw Large Close-Up Character Bust
        ctx.globalAlpha = alpha;
        const bustX = !isRight ? (slideX + 130) : (slideX + cutW - 130);
        const bustY = cutY + cutH + 26; // Torso and head centered in the cut-in
        const bustScale = 2.85;
        const bustFacing = !isRight ? 1 : -1; // Face toward the center/opponent!

        if (typeof SpriteRenderer !== 'undefined') {
            SpriteRenderer.drawFighter(
                ctx,
                { spriteId: banner.charId || 'bahlul', isAlive: true },
                bustX,
                bustY,
                bustFacing,
                'ultimate',
                this.tick,
                bustScale
            );
        }

        ctx.restore(); // End clipping

        // -------------------------------------------------------------
        // C. Glowing Card Borders & Diagonal Tech Accents
        // -------------------------------------------------------------
        ctx.save();
        // Outer glowing neon border
        ctx.strokeStyle = banner.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = banner.color;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        if (!isRight) {
            ctx.moveTo(slideX - 20, cutY);
            ctx.lineTo(slideX + cutW, cutY);
            ctx.lineTo(slideX + cutW - slashOffset, cutY + cutH);
            ctx.lineTo(slideX - 20, cutY + cutH);
        } else {
            ctx.moveTo(slideX + slashOffset, cutY);
            ctx.lineTo(slideX + cutW + 20, cutY);
            ctx.lineTo(slideX + cutW + 20, cutY + cutH);
            ctx.lineTo(slideX, cutY + cutH);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner crisp white highlight border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        if (!isRight) {
            ctx.moveTo(slideX - 18, cutY + 2);
            ctx.lineTo(slideX + cutW - 3, cutY + 2);
            ctx.lineTo(slideX + cutW - slashOffset - 2, cutY + cutH - 2);
            ctx.lineTo(slideX - 18, cutY + cutH - 2);
        } else {
            ctx.moveTo(slideX + slashOffset + 2, cutY + 2);
            ctx.lineTo(slideX + cutW + 18, cutY + 2);
            ctx.lineTo(slideX + cutW + 18, cutY + cutH - 2);
            ctx.lineTo(slideX + 2, cutY + cutH - 2);
        }
        ctx.stroke();

        // Decorative Tech Chevrons on slash edge
        ctx.fillStyle = banner.color;
        if (!isRight) {
            const chevX = slideX + cutW - (slashOffset * 0.5) + 6;
            const chevY = cutY + (cutH * 0.5);
            ctx.beginPath();
            ctx.moveTo(chevX, chevY - 14);
            ctx.lineTo(chevX + 12, chevY);
            ctx.lineTo(chevX, chevY + 14);
            ctx.lineTo(chevX - 6, chevY + 14);
            ctx.lineTo(chevX + 6, chevY);
            ctx.lineTo(chevX - 6, chevY - 14);
            ctx.closePath();
            ctx.fill();
        } else {
            const chevX = slideX + (slashOffset * 0.5) - 6;
            const chevY = cutY + (cutH * 0.5);
            ctx.beginPath();
            ctx.moveTo(chevX, chevY - 14);
            ctx.lineTo(chevX - 12, chevY);
            ctx.lineTo(chevX, chevY + 14);
            ctx.lineTo(chevX + 6, chevY + 14);
            ctx.lineTo(chevX - 6, chevY);
            ctx.lineTo(chevX + 6, chevY - 14);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // -------------------------------------------------------------
        // D. Anime Star Lens Flare / Eye Gleam (Mobile Legends Layla Style)
        // -------------------------------------------------------------
        const eyeX = !isRight ? (bustX + 8) : (bustX - 8);
        const eyeY = bustY - 118;

        ctx.save();
        // 1. Horizontal Neon Laser Beam / Glint Streak
        const beamGrad = ctx.createLinearGradient(eyeX - 110, eyeY, eyeX + 110, eyeY);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        beamGrad.addColorStop(0.3, banner.color);
        beamGrad.addColorStop(0.5, '#ffffff');
        beamGrad.addColorStop(0.7, banner.color);
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.shadowColor = banner.color;
        ctx.shadowBlur = 20;
        ctx.fillRect(eyeX - 110, eyeY - 2.5, 220, 5);

        // 2. Pulsing 4-Pointed Star Flare (✦)
        const starSize = 15 + Math.sin(this.tick * 0.45) * 4;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY - starSize);
        ctx.quadraticCurveTo(eyeX, eyeY, eyeX + starSize, eyeY);
        ctx.quadraticCurveTo(eyeX, eyeY, eyeX + starSize, eyeY);
        ctx.quadraticCurveTo(eyeX, eyeY, eyeX - starSize, eyeY);
        ctx.quadraticCurveTo(eyeX, eyeY, eyeX - starSize, eyeY);
        ctx.closePath();
        ctx.fill();

        // Center bright orb
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle glints
        for (let sp = 0; sp < 4; sp++) {
            const spAngle = (sp / 4) * Math.PI * 2 + (this.tick * 0.2);
            const spDist = 18 + Math.sin(this.tick * 0.3 + sp) * 6;
            ctx.fillStyle = banner.color;
            ctx.beginPath();
            ctx.arc(eyeX + Math.cos(spAngle) * spDist, eyeY + Math.sin(spAngle) * spDist, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // -------------------------------------------------------------
        // E. Stylized Arcade & MOBA Typography
        // -------------------------------------------------------------
        ctx.save();
        const textX = !isRight ? (slideX + 235) : (slideX + 45);

        // Pill Badge: ULTIMATE ACTIVATION
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = banner.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(textX, cutY + 22, 185, 22, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 9px 'Press Start 2P', monospace";
        ctx.fillStyle = banner.color;
        ctx.textAlign = 'left';
        ctx.fillText("★ ULTIMATE ACTIVATION", textX + 10, cutY + 37);

        // Character Name
        ctx.font = "900 17px 'Press Start 2P', monospace";
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = banner.color;
        ctx.shadowBlur = 12;
        ctx.fillText(banner.charName, textX, cutY + 75);

        // Skill Name (Large Bold Italic)
        ctx.font = "italic 900 27px 'Rajdhani', sans-serif";
        ctx.fillStyle = banner.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        ctx.fillText(banner.ultimateName, textX, cutY + 110);

        // Arcade Japanese/Cyber Subtitle
        ctx.font = "bold 11px 'Rajdhani', sans-serif";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText("奥義発動 // CLIMAX POWER BURST", textX, cutY + 134);

        ctx.restore();
        ctx.restore();
    }

    drawKoBanner(ctx, width, height) {
        if (!this.koBannerTimer || this.koBannerTimer <= 0) return;
        this.koBannerTimer--;

        ctx.save();
        // Dramatic dark flashing overlay
        const flashAlpha = Math.min(0.75, 0.45 + Math.sin(this.koBannerTimer * 0.18) * 0.2);
        ctx.fillStyle = `rgba(10, 2, 4, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);

        // Giant K.O. Letters
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 30;

        // Pulsing scale
        const scale = 1.0 + Math.max(0, (this.koBannerTimer - 90) * 0.04);
        ctx.save();
        ctx.translate(width / 2, height / 2 - 25);
        ctx.scale(scale, scale);

        ctx.font = "900 72px 'Press Start 2P', monospace";
        ctx.fillStyle = '#ff0055';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.strokeText("K. O. !", 0, 0);
        ctx.fillText("K. O. !", 0, 0);
        ctx.restore();

        // Winner subtitle
        if (this.koWinner) {
            ctx.font = "bold 20px 'Press Start 2P', monospace";
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 18;
            ctx.fillText(`WINNER: ${this.koWinner.toUpperCase()}`, width / 2, height / 2 + 55);
        }

        ctx.restore();
    }
}

const arenaRenderer = new ArenaRenderer();
