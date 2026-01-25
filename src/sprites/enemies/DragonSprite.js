/**
 * DragonSprite
 * Handles sprite creation and animation for Dragon enemies
 * Dragons are larger and more detailed than other enemies
 */
export default class DragonSprite {
  /**
   * Create dragon sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Tail (long and serpentine - black/grey)
    parts.tail = scene.add.graphics();
    parts.tail.fillStyle(0x2f2f2f, 1); // Dark grey
    // Tail base (thick)
    parts.tail.fillEllipse(0, 16, 12, 8);
    // Tail segments (getting thinner)
    parts.tail.fillEllipse(-6, 20, 10, 6);
    parts.tail.fillEllipse(-10, 24, 8, 5);
    parts.tail.fillEllipse(-13, 27, 6, 4);
    // Tail tip (pointed)
    parts.tail.fillTriangle(-15, 27, -18, 29, -16, 30);
    // Tail spikes
    parts.tail.fillStyle(0x1a1a1a, 1); // Very dark grey
    parts.tail.fillTriangle(-2, 16, -1, 13, 0, 16);
    parts.tail.fillTriangle(-6, 20, -5, 17, -4, 20);
    parts.tail.fillTriangle(-10, 24, -9, 21, -8, 24);
    
    // Back legs (powerful and reptilian)
    parts.leftBackLeg = scene.add.graphics();
    parts.leftBackLeg.fillStyle(0x3a3a3a, 1); // Medium grey
    parts.leftBackLeg.fillRect(-12, 12, 8, 14);
    // Thigh muscle
    parts.leftBackLeg.fillEllipse(-8, 14, 10, 8);
    // Foot with claws
    parts.leftBackLeg.fillStyle(0x2f2f2f, 1);
    parts.leftBackLeg.fillEllipse(-8, 28, 10, 5);
    parts.leftBackLeg.fillStyle(0x000000, 1);
    parts.leftBackLeg.fillRect(-11, 28, 2, 5); // Claws
    parts.leftBackLeg.fillRect(-8, 28, 2, 5);
    parts.leftBackLeg.fillRect(-5, 28, 2, 5);
    
    parts.rightBackLeg = scene.add.graphics();
    parts.rightBackLeg.fillStyle(0x3a3a3a, 1);
    parts.rightBackLeg.fillRect(4, 12, 8, 14);
    // Thigh muscle
    parts.rightBackLeg.fillEllipse(8, 14, 10, 8);
    // Foot with claws
    parts.rightBackLeg.fillStyle(0x2f2f2f, 1);
    parts.rightBackLeg.fillEllipse(8, 28, 10, 5);
    parts.rightBackLeg.fillStyle(0x000000, 1);
    parts.rightBackLeg.fillRect(5, 28, 2, 5); // Claws
    parts.rightBackLeg.fillRect(8, 28, 2, 5);
    parts.rightBackLeg.fillRect(11, 28, 2, 5);
    
    // Body (large and muscular - black/grey)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0x3a3a3a, 1); // Medium grey
    parts.body.fillRect(-18, -8, 36, 22);
    // Chest (lighter grey)
    parts.body.fillStyle(0x505050, 1); // Light grey
    parts.body.fillRect(-14, -4, 28, 14);
    // Belly scales (lighter)
    parts.body.fillStyle(0x6a6a6a, 1); // Lighter grey
    parts.body.fillEllipse(0, 4, 24, 10);
    // Scale details
    parts.body.fillStyle(0x2f2f2f, 1);
    for (let i = -12; i <= 12; i += 6) {
      parts.body.fillCircle(i, 2, 2);
      parts.body.fillCircle(i + 3, 6, 2);
    }
    
    // Wings (large bat-like wings with finger bones)
    parts.leftWing = scene.add.graphics();
    parts.leftWing.fillStyle(0x1a1a1a, 1); // Very dark grey
    
    // Main wing membrane (scalloped bat wing shape using multiple triangles)
    // First section (top finger)
    parts.leftWing.fillTriangle(-18, -6, -24, -10, -22, -2);
    parts.leftWing.fillTriangle(-22, -2, -24, -10, -26, -4);
    
    // Second section (middle finger)
    parts.leftWing.fillTriangle(-18, -2, -26, -4, -28, 0);
    parts.leftWing.fillTriangle(-18, 0, -28, 0, -32, 2);
    
    // Third section (lower finger)
    parts.leftWing.fillTriangle(-18, 2, -32, 2, -34, 4);
    parts.leftWing.fillTriangle(-18, 4, -34, 4, -32, 6);
    
    // Bottom section
    parts.leftWing.fillTriangle(-18, 6, -32, 6, -28, 8);
    parts.leftWing.fillTriangle(-18, 8, -28, 8, -22, 9);
    
    // Wing finger bones (dark lines)
    parts.leftWing.lineStyle(2, 0x000000, 1);
    parts.leftWing.lineBetween(-18, -6, -24, -10);
    parts.leftWing.lineBetween(-18, -2, -30, -6);
    parts.leftWing.lineBetween(-18, 2, -34, 0);
    parts.leftWing.lineBetween(-18, 6, -28, 8);
    
    // Wing arm bone (main support)
    parts.leftWing.lineStyle(3, 0x2f2f2f, 1);
    parts.leftWing.lineBetween(-18, -6, -18, 8);
    
    // Membrane veins (subtle)
    parts.leftWing.lineStyle(1, 0x3a3a3a, 0.5);
    parts.leftWing.lineBetween(-20, -4, -26, -6);
    parts.leftWing.lineBetween(-22, 0, -32, 0);
    parts.leftWing.lineBetween(-20, 4, -30, 6);
    
    parts.rightWing = scene.add.graphics();
    parts.rightWing.fillStyle(0x1a1a1a, 1);
    
    // Main wing membrane (scalloped bat wing shape - mirrored)
    // First section (top finger)
    parts.rightWing.fillTriangle(18, -6, 24, -10, 22, -2);
    parts.rightWing.fillTriangle(22, -2, 24, -10, 26, -4);
    
    // Second section (middle finger)
    parts.rightWing.fillTriangle(18, -2, 26, -4, 28, 0);
    parts.rightWing.fillTriangle(18, 0, 28, 0, 32, 2);
    
    // Third section (lower finger)
    parts.rightWing.fillTriangle(18, 2, 32, 2, 34, 4);
    parts.rightWing.fillTriangle(18, 4, 34, 4, 32, 6);
    
    // Bottom section
    parts.rightWing.fillTriangle(18, 6, 32, 6, 28, 8);
    parts.rightWing.fillTriangle(18, 8, 28, 8, 22, 9);
    
    // Wing finger bones (dark lines)
    parts.rightWing.lineStyle(2, 0x000000, 1);
    parts.rightWing.lineBetween(18, -6, 24, -10);
    parts.rightWing.lineBetween(18, -2, 30, -6);
    parts.rightWing.lineBetween(18, 2, 34, 0);
    parts.rightWing.lineBetween(18, 6, 28, 8);
    
    // Wing arm bone (main support)
    parts.rightWing.lineStyle(3, 0x2f2f2f, 1);
    parts.rightWing.lineBetween(18, -6, 18, 8);
    
    // Membrane veins (subtle)
    parts.rightWing.lineStyle(1, 0x3a3a3a, 0.5);
    parts.rightWing.lineBetween(20, -4, 26, -6);
    parts.rightWing.lineBetween(22, 0, 32, 0);
    parts.rightWing.lineBetween(20, 4, 30, 6);
    
    // Front legs (smaller than back legs)
    parts.leftFrontLeg = scene.add.graphics();
    parts.leftFrontLeg.fillStyle(0x3a3a3a, 1);
    parts.leftFrontLeg.fillRect(-16, 4, 6, 12);
    // Hand with claws
    parts.leftFrontLeg.fillCircle(-13, 18, 4);
    parts.leftFrontLeg.fillStyle(0x000000, 1);
    parts.leftFrontLeg.fillRect(-16, 18, 2, 4); // Claws
    parts.leftFrontLeg.fillRect(-13, 18, 2, 4);
    parts.leftFrontLeg.fillRect(-10, 18, 2, 4);
    
    parts.rightFrontLeg = scene.add.graphics();
    parts.rightFrontLeg.fillStyle(0x3a3a3a, 1);
    parts.rightFrontLeg.fillRect(10, 4, 6, 12);
    // Hand with claws
    parts.rightFrontLeg.fillCircle(13, 18, 4);
    parts.rightFrontLeg.fillStyle(0x000000, 1);
    parts.rightFrontLeg.fillRect(10, 18, 2, 4); // Claws
    parts.rightFrontLeg.fillRect(13, 18, 2, 4);
    parts.rightFrontLeg.fillRect(16, 18, 2, 4);
    
    // Neck (thick and powerful)
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0x3a3a3a, 1);
    parts.neck.fillRect(-8, -12, 16, 8);
    // Neck scales
    parts.neck.fillStyle(0x2f2f2f, 1);
    parts.neck.fillCircle(-4, -10, 1.5);
    parts.neck.fillCircle(0, -10, 1.5);
    parts.neck.fillCircle(4, -10, 1.5);
    
    // Head (large and reptilian - more dragon-like)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0x3a3a3a, 1);
    // Main skull (wider at back, narrower at snout)
    parts.head.fillRect(-8, -22, 16, 10);
    // Snout (elongated and tapered)
    parts.head.fillRect(-6, -28, 12, 6);
    parts.head.fillRect(-5, -30, 10, 2);
    // Snout tip (pointed)
    parts.head.fillTriangle(-5, -30, 0, -32, 5, -30);
    // Lower jaw (strong and angular)
    parts.head.fillRect(-6, -12, 12, 4);
    parts.head.fillTriangle(-6, -12, -4, -8, -2, -12);
    parts.head.fillTriangle(6, -12, 4, -8, 2, -12);
    // Jaw muscles
    parts.head.fillStyle(0x2f2f2f, 1);
    parts.head.fillEllipse(-6, -16, 4, 6);
    parts.head.fillEllipse(6, -16, 4, 6);
    // Brow ridges (prominent)
    parts.head.fillStyle(0x505050, 1);
    parts.head.fillRect(-7, -20, 5, 2);
    parts.head.fillRect(2, -20, 5, 2);
    // Scales on head
    parts.head.fillStyle(0x2f2f2f, 1);
    parts.head.fillCircle(-4, -24, 1);
    parts.head.fillCircle(0, -26, 1);
    parts.head.fillCircle(4, -24, 1);
    
    // Horns (large, curved, and menacing)
    parts.horns = scene.add.graphics();
    parts.horns.fillStyle(0x1a1a1a, 1); // Very dark grey/black
    // Left horn (curved back)
    parts.horns.fillTriangle(-8, -22, -10, -28, -7, -24);
    parts.horns.fillTriangle(-10, -28, -12, -32, -9, -28);
    parts.horns.fillTriangle(-12, -32, -13, -34, -11, -32);
    // Right horn (curved back)
    parts.horns.fillTriangle(8, -22, 10, -28, 7, -24);
    parts.horns.fillTriangle(10, -28, 12, -32, 9, -28);
    parts.horns.fillTriangle(12, -32, 13, -34, 11, -32);
    // Horn ridges
    parts.horns.fillStyle(0x000000, 1);
    parts.horns.fillRect(-11, -30, 1, 2);
    parts.horns.fillRect(-12, -33, 1, 2);
    parts.horns.fillRect(10, -30, 1, 2);
    parts.horns.fillRect(11, -33, 1, 2);
    
    // Eyes (glowing and menacing)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xff0000, 1); // Red glow
    parts.eyes.fillCircle(-4, -20, 3);
    parts.eyes.fillCircle(4, -20, 3);
    parts.eyes.fillStyle(0xffff00, 1); // Yellow center
    parts.eyes.fillCircle(-4, -20, 2);
    parts.eyes.fillCircle(4, -20, 2);
    // Pupils (slitted like reptile)
    parts.eyes.fillStyle(0x000000, 1);
    parts.eyes.fillRect(-4.5, -21, 1, 3);
    parts.eyes.fillRect(3.5, -21, 1, 3);
    
    // Nostrils
    parts.nostrils = scene.add.graphics();
    parts.nostrils.fillStyle(0x000000, 1);
    parts.nostrils.fillCircle(-3, -26, 1.5);
    parts.nostrils.fillCircle(3, -26, 1.5);
    // Nostril smoke effect
    parts.nostrils.fillStyle(0x808080, 0.5);
    parts.nostrils.fillCircle(-3, -28, 2);
    parts.nostrils.fillCircle(3, -28, 2);
    
    // Teeth/fangs
    parts.teeth = scene.add.graphics();
    parts.teeth.fillStyle(0xffffff, 1);
    // Upper fangs
    parts.teeth.fillTriangle(-5, -24, -4, -20, -3, -24);
    parts.teeth.fillTriangle(5, -24, 4, -20, 3, -24);
    // Lower fangs
    parts.teeth.fillTriangle(-4, -12, -3, -8, -2, -12);
    parts.teeth.fillTriangle(4, -12, 3, -8, 2, -12);
    // Smaller teeth
    parts.teeth.fillTriangle(-2, -24, -1.5, -22, -1, -24);
    parts.teeth.fillTriangle(2, -24, 1.5, -22, 1, -24);
    
    // Spikes along back
    parts.backSpikes = scene.add.graphics();
    parts.backSpikes.fillStyle(0x1a1a1a, 1);
    parts.backSpikes.fillTriangle(-12, -8, -10, -14, -8, -8);
    parts.backSpikes.fillTriangle(-4, -8, -2, -14, 0, -8);
    parts.backSpikes.fillTriangle(4, -8, 6, -14, 8, -8);
    parts.backSpikes.fillTriangle(12, -8, 14, -14, 16, -8);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.tail);
    container.add(parts.leftWing);
    container.add(parts.rightWing);
    container.add(parts.leftBackLeg);
    container.add(parts.rightBackLeg);
    container.add(parts.leftFrontLeg);
    container.add(parts.body);
    container.add(parts.backSpikes);
    container.add(parts.rightFrontLeg);
    container.add(parts.neck);
    container.add(parts.head);
    container.add(parts.horns);
    container.add(parts.nostrils);
    container.add(parts.eyes);
    container.add(parts.teeth);
    
    return parts;
  }

  /**
   * Update dragon animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   */
  static updateAnimation(parts, animationTime) {
    // Powerful, majestic movement (slow and deliberate)
    const breathAmount = Math.sin(animationTime * 0.006) * 2;
    
    // Body breathing motion
    parts.body.y = Math.abs(breathAmount);
    parts.body.scaleY = 1 + Math.sin(animationTime * 0.006) * 0.05;
    parts.backSpikes.y = Math.abs(breathAmount);
    parts.neck.y = Math.abs(breathAmount);
    parts.head.y = Math.abs(breathAmount);
    parts.horns.y = Math.abs(breathAmount);
    parts.eyes.y = Math.abs(breathAmount);
    parts.nostrils.y = Math.abs(breathAmount);
    parts.teeth.y = Math.abs(breathAmount);
    
    // Head slight bob
    parts.head.rotation = Math.sin(animationTime * 0.005) * 0.05;
    parts.horns.rotation = Math.sin(animationTime * 0.005) * 0.05;
    parts.eyes.rotation = Math.sin(animationTime * 0.005) * 0.05;
    parts.nostrils.rotation = Math.sin(animationTime * 0.005) * 0.05;
    parts.teeth.rotation = Math.sin(animationTime * 0.005) * 0.05;
    
    // Wings flap majestically
    const wingFlap = Math.sin(animationTime * 0.004) * 0.3;
    parts.leftWing.rotation = -0.3 + wingFlap;
    parts.leftWing.y = Math.abs(breathAmount);
    parts.leftWing.scaleY = 1 + Math.sin(animationTime * 0.004) * 0.1;
    parts.rightWing.rotation = 0.3 - wingFlap;
    parts.rightWing.y = Math.abs(breathAmount);
    parts.rightWing.scaleY = 1 + Math.sin(animationTime * 0.004) * 0.1;
    
    // Tail swishes powerfully
    const tailSwish = Math.sin(animationTime * 0.008) * 0.4;
    parts.tail.rotation = tailSwish;
    parts.tail.y = Math.abs(breathAmount);
    
    // Legs stomp (heavy movement)
    const legStomp = Math.sin(animationTime * 0.007) * 2;
    parts.leftBackLeg.y = Math.abs(breathAmount) + Math.abs(legStomp);
    parts.leftBackLeg.rotation = legStomp * 0.04;
    parts.rightBackLeg.y = Math.abs(breathAmount) + Math.abs(-legStomp);
    parts.rightBackLeg.rotation = -legStomp * 0.04;
    
    // Front legs (smaller movement)
    const frontLegMove = Math.sin(animationTime * 0.007) * 1.5;
    parts.leftFrontLeg.y = Math.abs(breathAmount) - frontLegMove;
    parts.leftFrontLeg.rotation = -frontLegMove * 0.05;
    parts.rightFrontLeg.y = Math.abs(breathAmount) + frontLegMove;
    parts.rightFrontLeg.rotation = frontLegMove * 0.05;
    
    // Eyes glow pulse (menacing)
    const glowPulse = Math.sin(animationTime * 0.003);
    parts.eyes.alpha = 0.85 + glowPulse * 0.15;
    
    // Nostril smoke pulse
    parts.nostrils.alpha = 0.6 + Math.sin(animationTime * 0.004) * 0.3;
  }
}
