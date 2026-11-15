/**
 * MBG: MOBILE BATTLE GOVERNMENT - Procedural Sprite & Character Animation System
 * Menggambar karakter 2D pixel-art secara prosedural langsung ke HTML5 Canvas.
 * Mendukung scaling dinamis, visual aura ngeskill, lunge attack, recoil hit, dan KO.
 */

class SpriteRenderer {
    static drawFighter(ctx, fighterState, x, y, facing = 1, animState = 'idle', animTick = 0, scaleFactor = 1.55) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(facing * scaleFactor, scaleFactor);

        const id = fighterState.spriteId || 'bahlul';
        const isHurt = animState === 'hit';
        const isDead = animState === 'ko' || !fighterState.isAlive;

        // Dynamic motion offsets based on animation state
        let bobY = Math.sin(animTick * 0.1) * 2.5;
        let lungeX = 0;

        if (animState === 'walk') {
            bobY = Math.abs(Math.sin(animTick * 0.25)) * 5;
        } else if (animState === 'crouch' || animState === 'sneak') {
            bobY = 12;
            ctx.scale(1.18, 0.75); // Squash downward into authentic sneak/crouch posture
        } else if (animState === 'jump') {
            bobY = -5;
            ctx.scale(0.92, 1.12); // Stretch upward into airborne jumping posture
        } else if (animState === 'attack') {
            lungeX = 12;
            bobY = -2;
        } else if (animState === 'special_1' || animState === 'special_2' || animState === 'skill1' || animState === 'skill2') {
            lungeX = 10;
            bobY = -6 + Math.sin(animTick * 0.4) * 3; // Dynamic casting hover/windup
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 18 + Math.sin(animTick * 0.5) * 6;
        } else if (animState === 'ultimate') {
            lungeX = 6;
            bobY = -14 + Math.sin(animTick * 0.25) * 6; // Epic levitation while casting ultimate!
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 28 + Math.sin(animTick * 0.4) * 10;
        } else if (isHurt) {
            lungeX = -10; // Recoil backward
            bobY = 3;
        }

        ctx.translate(lungeX, 0);

        // Hurt flash effect (blinking bright white/red)
        if (isHurt && Math.floor(animTick / 3) % 2 === 0) {
            ctx.filter = 'brightness(2.8) contrast(1.8)';
        }

        // Draw shadow on the ground
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 24, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // KO state: lie down flat on floor
        if (isDead) {
            ctx.rotate(facing * Math.PI / 2.1);
            ctx.translate(0, -18);
        }

        // Active Caster Charging Aura directly on character during skills
        if (animState === 'skill1' || animState === 'skill2' || animState === 'ultimate') {
            const auraCol = animState === 'ultimate' ? '#ffd700' : (animState === 'skill1' ? '#00f0ff' : '#00ff88');
            ctx.save();
            ctx.strokeStyle = auraCol;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = auraCol;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.ellipse(0, -32 + bobY, 26 + Math.sin(animTick * 0.3) * 4, 38, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Rising aura sparkles
            for (let i = 0; i < 4; i++) {
                const spX = (Math.sin(animTick * 0.2 + i * 1.5) * 22);
                const spY = -10 - ((animTick * 2 + i * 20) % 65);
                ctx.fillStyle = auraCol;
                ctx.fillRect(spX, spY, 3, 3);
            }
            ctx.restore();
        }

        // Render specific character geometry
        switch (id) {
            case 'bahlul':
                this.drawBahlul(ctx, bobY, animState, animTick);
                break;
            case 'tifuzia':
                this.drawTifuzia(ctx, bobY, animState, animTick);
                break;
            case 'brown_teddy':
                this.drawBrownTeddy(ctx, bobY, animState, animTick);
                break;
            case 'fufufifi':
                this.drawFufufifi(ctx, bobY, animState, animTick);
                break;
            case 'wili_wonka':
                this.drawWiliWonka(ctx, bobY, animState, animTick);
                break;
            default:
                this.drawBahlul(ctx, bobY, animState, animTick);
        }

        ctx.restore();
    }

    // 1. BAHLUL - The Goblin Summoner (Mystic Green Robes & Staff)
    static drawBahlul(ctx, bobY, animState, animTick) {
        const yOffset = -55 + bobY;

        // Robe body
        ctx.fillStyle = '#103823';
        ctx.beginPath();
        ctx.moveTo(-16, yOffset + 30);
        ctx.lineTo(16, yOffset + 30);
        ctx.lineTo(22, yOffset + 75);
        ctx.lineTo(-22, yOffset + 75);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head & Hood
        ctx.fillStyle = '#0b2416';
        ctx.beginPath();
        ctx.arc(0, yOffset + 18, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Face darkness & Glowing Eyes
        ctx.fillStyle = '#040d08';
        ctx.beginPath();
        ctx.arc(0, yOffset + 20, 12, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Emerald Eyes
        ctx.fillStyle = '#00ff66';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 8;
        ctx.fillRect(2, yOffset + 18, 5, 4);
        ctx.fillRect(9, yOffset + 18, 5, 4);
        ctx.shadowBlur = 0;

        // Staff & Attack Stance
        const staffForward = (animState === 'attack' || animState === 'skill1' || animState === 'skill2') ? 28 : 10;
        const staffAngle = (animState === 'attack') ? -0.4 : (animState === 'skill1' ? -0.6 : 0.1);

        ctx.save();
        ctx.translate(staffForward, yOffset + 35);
        ctx.rotate(staffAngle);
        ctx.fillStyle = '#654321';
        ctx.fillRect(-2, -38, 5, 65);

        // Staff Crystal Orb
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = (animState.startsWith('skill') || animState === 'ultimate') ? 20 : 8;
        ctx.beginPath();
        ctx.arc(0, -42, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // 2. TIFUZIA - The Diploma Inspector (Academic Blazer & Megaphone/Diploma)
    static drawTifuzia(ctx, bobY, animState, animTick) {
        const yOffset = -55 + bobY;

        // Formal Skirt / Pants
        ctx.fillStyle = '#1a2233';
        ctx.fillRect(-12, yOffset + 50, 10, 24);
        ctx.fillRect(2, yOffset + 50, 10, 24);

        // Blazer Suit
        ctx.fillStyle = '#223254';
        ctx.beginPath();
        ctx.roundRect(-16, yOffset + 22, 32, 30, 4);
        ctx.fill();
        ctx.strokeStyle = '#4361ee';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // White Shirt & Red Tie
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-6, yOffset + 22);
        ctx.lineTo(6, yOffset + 22);
        ctx.lineTo(0, yOffset + 34);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e63946';
        ctx.fillRect(-2, yOffset + 28, 4, 12);

        // Head & Hair
        ctx.fillStyle = '#ffd1a4';
        ctx.beginPath();
        ctx.arc(0, yOffset + 12, 13, 0, Math.PI * 2);
        ctx.fill();

        // Stylish Dark Hair
        ctx.fillStyle = '#1c1c24';
        ctx.beginPath();
        ctx.arc(0, yOffset + 9, 14, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-14, yOffset + 8, 6, 16);

        // Eyeglasses
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, yOffset + 10, 7, 5);
        ctx.strokeRect(-9, yOffset + 10, 7, 5);

        // Weapon: Megaphone or Diploma Scroll
        const armForward = (animState === 'attack' || animState === 'skill1' || animState === 'skill2') ? 26 : 14;
        ctx.save();
        ctx.translate(armForward, yOffset + 30);

        // Megaphone
        ctx.fillStyle = '#3a86ff';
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(16, -14);
        ctx.lineTo(16, 14);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Sound waves when attacking or using skill
        if (animState === 'attack' || animState === 'skill1' || animState === 'skill2') {
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(20, 0, 12, -0.6, 0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(28, 0, 20, -0.7, 0.7);
            ctx.stroke();
        }
        ctx.restore();
    }

    // 3. BROWN TEDDY - The Affection Attacker (Fluffy Bear & Hearts)
    static drawBrownTeddy(ctx, bobY, animState, animTick) {
        const yOffset = -55 + bobY;

        // Big round fluffy bear body
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.ellipse(0, yOffset + 45, 24, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Light belly patch
        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.ellipse(0, yOffset + 48, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Big Round Bear Head
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.arc(0, yOffset + 16, 21, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cute Round Ears
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.arc(-15, yOffset - 1, 9, 0, Math.PI * 2);
        ctx.arc(15, yOffset - 1, 9, 0, Math.PI * 2);
        ctx.fill();
        // Inner ears pink
        ctx.fillStyle = '#ff80ab';
        ctx.beginPath();
        ctx.arc(-15, yOffset - 1, 5, 0, Math.PI * 2);
        ctx.arc(15, yOffset - 1, 5, 0, Math.PI * 2);
        ctx.fill();

        // Bear Snout & Nose
        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.ellipse(0, yOffset + 21, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.arc(0, yOffset + 18, 4, 0, Math.PI * 2);
        ctx.fill();

        // Cute Button Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-7, yOffset + 13, 3, 0, Math.PI * 2);
        ctx.arc(7, yOffset + 13, 3, 0, Math.PI * 2);
        ctx.fill();

        // Red Heart Ribbon on chest
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(-6, yOffset + 32, 12, 6);

        // Huge Bear Paws
        const pawForward = (animState === 'attack' || animState === 'skill1' || animState === 'skill2') ? 26 : 14;
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.arc(pawForward, yOffset + 40, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff80ab';
        ctx.beginPath();
        ctx.arc(pawForward, yOffset + 40, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 4. FUFUFIFI - The Government Critic (Protest Bandana & Megaphone)
    static drawFufufifi(ctx, bobY, animState, animTick) {
        const yOffset = -55 + bobY;

        // Jeans Legs
        ctx.fillStyle = '#1e3d59';
        ctx.fillRect(-10, yOffset + 50, 9, 24);
        ctx.fillRect(2, yOffset + 50, 9, 24);

        // Black Activist Hoodie
        ctx.fillStyle = '#17171c';
        ctx.beginPath();
        ctx.roundRect(-15, yOffset + 22, 30, 30, 4);
        ctx.fill();
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Protest Emblem on Chest
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(0, yOffset + 36, 6, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#f5cba7';
        ctx.beginPath();
        ctx.arc(0, yOffset + 12, 13, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#101014';
        ctx.beginPath();
        ctx.arc(0, yOffset + 8, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        // Red/White Activist Bandana Tied Around Forehead
        ctx.fillStyle = '#e63946';
        ctx.fillRect(-13, yOffset + 5, 26, 6);
        // Bandana knot flying behind
        ctx.beginPath();
        ctx.moveTo(-13, yOffset + 8);
        ctx.lineTo(-24, yOffset + 12 + Math.sin(animTick * 0.3) * 4);
        ctx.lineTo(-20, yOffset + 18);
        ctx.closePath();
        ctx.fill();

        // Determined Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(2, yOffset + 12, 4, 3);
        ctx.fillRect(-8, yOffset + 12, 4, 3);

        // Weapon: Megaphone / Protest Banner
        const armForward = (animState === 'attack' || animState === 'skill1' || animState === 'skill2') ? 25 : 12;
        ctx.save();
        ctx.translate(armForward, yOffset + 28);

        // Megaphone
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.lineTo(16, -12);
        ctx.lineTo(16, 12);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.restore();
    }

    // 5. WILI WONKA - The Viral Opportunist (Gold & Chocolate Suit + Camera)
    static drawWiliWonka(ctx, bobY, animState, animTick) {
        const yOffset = -55 + bobY;

        // Purple / Gold Showman Trousers
        ctx.fillStyle = '#4a154b';
        ctx.fillRect(-11, yOffset + 50, 9, 24);
        ctx.fillRect(2, yOffset + 50, 9, 24);

        // Velvet Showman Coat
        ctx.fillStyle = '#7b113a';
        ctx.beginPath();
        ctx.roundRect(-15, yOffset + 22, 30, 30, 4);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Gold Vest & White Ascot
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-5, yOffset + 24, 10, 20);

        // Head
        ctx.fillStyle = '#ffd1a4';
        ctx.beginPath();
        ctx.arc(0, yOffset + 12, 13, 0, Math.PI * 2);
        ctx.fill();

        // Curly Golden Brown Hair
        ctx.fillStyle = '#8d5b4c';
        ctx.beginPath();
        ctx.arc(0, yOffset + 8, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        // Iconic Top Hat
        ctx.fillStyle = '#3a0ca3';
        ctx.fillRect(-15, yOffset - 3, 30, 4); // brim
        ctx.fillRect(-10, yOffset - 18, 20, 16); // crown
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-10, yOffset - 6, 20, 3); // gold band

        // Camera / Microphone in Hand
        const armForward = (animState === 'attack' || animState === 'skill1' || animState === 'skill2') ? 26 : 14;
        ctx.save();
        ctx.translate(armForward, yOffset + 28);

        // Smartphone / Camera on Selfie Stick
        ctx.fillStyle = '#101018';
        ctx.fillRect(-2, -18, 8, 14);
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(-1, -16, 6, 10); // glowing screen

        // Camera lens flash when casting
        if (animState === 'attack' || animState.startsWith('skill') || animState === 'ultimate') {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(8, -12, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }
}
