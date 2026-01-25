/**
 * DemonSprite
 * Handles sprite creation and animation for Demon enemies
 */
export default class DemonSprite {
  /**
   * Create demon sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Legs (digitigrade - bent like goat legs, dark red)
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x8b0000, 1); // Dark red
    parts.leftLeg.fillRect(-7, 8, 5, 10);
    // Lower leg (bent back)
    parts.leftLeg.fillRect(-9, 14, 5, 8);
    // Hoof
    parts.leftLeg.fillStyle(0x000000, 1);
    parts.leftLeg.fillRect(-10, 20, 6, 3);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x8b0000, 1);
    parts.rightLeg.fillRect(2, 8, 5, 10);
    // Lower leg (bent back)
    parts.rightLeg.fillRect(4, 14, 5, 8);
    // Hoof
    parts.rightLeg.fillStyle(0x000000, 1);
    parts.rightLeg.fillRect(4, 20, 6, 3);
    
    // Tail (long and pointed)
    parts.tail = scene.add.graphics();
    parts.tail.fillStyle(0xcc0000, 1); // Bright red
    parts.tail.fillTriangle(0, 8, -4, 16, 2, 12);
    // Tail tip (spade)
    parts.tail.fillStyle(0x8b0000, 1);
    parts.tail.fillTriangle(-4, 16, -6, 18, -2, 18);
    
    // Body (muscular and lean - red)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0xcc0000, 1); // Bright red
    parts.body.fillRect(-10, -6, 20, 14);
    // Chest muscles
    parts.body.fillStyle(0xb30000, 1);
    parts.body.fillEllipse(-4, -2, 6, 8);
    parts.body.fillEllipse(4, -2, 6, 8);
    
    // Wings (bat-like, folded)
    parts.leftWing = scene.add.graphics();
    parts.leftWing.fillStyle(0x4a0000, 1); // Very dark red
    parts.leftWing.fillTriangle(-10, -4, -16, -2, -12, 4);
    // Wing membrane
    parts.leftWing.fillStyle(0x660000, 0.7);
    parts.leftWing.fillTriangle(-10, -3, -14, -1, -11, 3);
    
    parts.rightWing = scene.add.graphics();
    parts.rightWing.fillStyle(0x4a0000, 1);
    parts.rightWing.fillTriangle(10, -4, 16, -2, 12, 4);
    // Wing membrane
    parts.rightWing.fillStyle(0x660000, 0.7);
    parts.rightWing.fillTriangle(10, -3, 14, -1, 11, 3);
    
    // Arms (muscular with claws)
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0xcc0000, 1);
    parts.leftArm.fillRect(-14, -2, 5, 10);
    // Clawed hand
    parts.leftArm.fillCircle(-11, 10, 3);
    parts.leftArm.fillStyle(0x000000, 1);
    parts.leftArm.fillRect(-13, 10, 1, 4); // Claws
    parts.leftArm.fillRect(-11, 10, 1, 4);
    parts.leftArm.fillRect(-9, 10, 1, 4);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0xcc0000, 1);
    parts.rightArm.fillRect(9, -2, 5, 10);
    // Clawed hand
    parts.rightArm.fillCircle(11, 10, 3);
    parts.rightArm.fillStyle(0x000000, 1);
    parts.rightArm.fillRect(9, 10, 1, 4); // Claws
    parts.rightArm.fillRect(11, 10, 1, 4);
    parts.rightArm.fillRect(13, 10, 1, 4);
    
    // Neck
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0xcc0000, 1);
    parts.neck.fillRect(-4, -8, 8, 4);
    
    // Head (demonic with angular features)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xcc0000, 1);
    parts.head.fillRect(-7, -18, 14, 12);
    // Jaw
    parts.head.fillRect(-6, -8, 12, 3);
    
    // Horns (curved and menacing)
    parts.horns = scene.add.graphics();
    parts.horns.fillStyle(0x1a1a1a, 1); // Black
    // Left horn
    parts.horns.fillTriangle(-7, -18, -9, -22, -6, -20);
    parts.horns.fillTriangle(-9, -22, -11, -20, -8, -20);
    // Right horn
    parts.horns.fillTriangle(7, -18, 9, -22, 6, -20);
    parts.horns.fillTriangle(9, -22, 11, -20, 8, -20);
    
    // Eyes (glowing yellow/orange)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xff6600, 1); // Orange glow
    parts.eyes.fillCircle(-4, -14, 3);
    parts.eyes.fillCircle(4, -14, 3);
    parts.eyes.fillStyle(0xffff00, 1); // Yellow center
    parts.eyes.fillCircle(-4, -14, 1.5);
    parts.eyes.fillCircle(4, -14, 1.5);
    
    // Fangs
    parts.fangs = scene.add.graphics();
    parts.fangs.fillStyle(0xffffff, 1);
    parts.fangs.fillTriangle(-4, -8, -3, -5, -2, -8);
    parts.fangs.fillTriangle(4, -8, 3, -5, 2, -8);
    
    // Nose (small and pointed)
    parts.nose = scene.add.graphics();
    parts.nose.fillStyle(0xb30000, 1);
    parts.nose.fillTriangle(0, -12, -2, -10, 2, -10);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.tail);
    container.add(parts.leftWing);
    container.add(parts.rightWing);
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.body);
    container.add(parts.rightArm);
    container.add(parts.neck);
    container.add(parts.head);
    container.add(parts.horns);
    container.add(parts.eyes);
    container.add(parts.nose);
    container.add(parts.fangs);
    
    return parts;
  }

  /**
   * Update demon animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   */
  static updateAnimation(parts, animationTime) {
    // Menacing, prowling movement (faster than troll, smoother than orc)
    const prowlAmount = Math.sin(animationTime * 0.01) * 1.5;
    
    // Body moves smoothly
    parts.body.y = -6 + Math.abs(prowlAmount);
    parts.neck.y = Math.abs(prowlAmount);
    parts.head.y = Math.abs(prowlAmount);
    parts.horns.y = Math.abs(prowlAmount);
    parts.eyes.y = Math.abs(prowlAmount);
    parts.nose.y = Math.abs(prowlAmount);
    parts.fangs.y = Math.abs(prowlAmount);
    
    // Tail swishes menacingly
    const tailSwish = Math.sin(animationTime * 0.015) * 0.3;
    parts.tail.rotation = tailSwish;
    parts.tail.y = 8 + Math.abs(prowlAmount);
    
    // Wings flap slightly (breathing motion)
    const wingFlap = Math.sin(animationTime * 0.006) * 0.15;
    parts.leftWing.rotation = -0.2 + wingFlap;
    parts.leftWing.y = Math.abs(prowlAmount);
    parts.rightWing.rotation = 0.2 - wingFlap;
    parts.rightWing.y = Math.abs(prowlAmount);
    
    // Digitigrade legs (bent, prowling stance)
    const legProwl = Math.sin(animationTime * 0.01) * 3;
    parts.leftLeg.y = 8 + Math.abs(prowlAmount) + Math.abs(legProwl);
    parts.leftLeg.rotation = legProwl * 0.07;
    parts.rightLeg.y = 8 + Math.abs(prowlAmount) + Math.abs(-legProwl);
    parts.rightLeg.rotation = -legProwl * 0.07;
    
    // Arms ready to strike
    const armProwl = Math.sin(animationTime * 0.01) * 2.5;
    parts.leftArm.y = -2 + Math.abs(prowlAmount) - armProwl;
    parts.leftArm.rotation = -armProwl * 0.08;
    parts.rightArm.y = -2 + Math.abs(prowlAmount) + armProwl;
    parts.rightArm.rotation = armProwl * 0.08;
    
    // Eyes glow pulse
    const glowPulse = Math.sin(animationTime * 0.005);
    parts.eyes.alpha = 0.8 + glowPulse * 0.2;
  }
}
