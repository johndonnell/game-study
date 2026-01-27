/**
 * WizardSprite
 * Handles sprite creation and animation for the Mage/Wizard character
 */
export default class WizardSprite {
  /**
   * Create wizard sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Robe bottom (dark blue - flowing)
    parts.robeBottom = scene.add.graphics();
    parts.robeBottom.fillStyle(0x1e3a8a, 1);
    parts.robeBottom.fillRect(-11, 8, 22, 16);
    // Robe trim (gold)
    parts.robeBottom.fillStyle(0xfbbf24, 1);
    parts.robeBottom.fillRect(-11, 22, 22, 2);
    
    // Robe body (medium blue)
    parts.robeBody = scene.add.graphics();
    parts.robeBody.fillStyle(0x2563eb, 1);
    parts.robeBody.fillRect(-10, -6, 20, 14);
    
    // Belt/Sash (gold with ornate buckle)
    parts.sash = scene.add.graphics();
    parts.sash.fillStyle(0xfbbf24, 1);
    parts.sash.fillRect(-10, 6, 20, 3);
    // Buckle gem (red)
    parts.sash.fillStyle(0xdc2626, 1);
    parts.sash.fillCircle(0, 7, 2);
    
    // Left sleeve (behind staff)
    parts.leftSleeve = scene.add.graphics();
    parts.leftSleeve.fillStyle(0x1e3a8a, 1);
    parts.leftSleeve.fillRect(-14, -2, 5, 10);
    // Sleeve trim
    parts.leftSleeve.fillStyle(0x3b82f6, 1);
    parts.leftSleeve.fillRect(-14, 6, 5, 2);
    
    // Left hand
    parts.leftHand = scene.add.graphics();
    parts.leftHand.fillStyle(0xfde68a, 1);
    parts.leftHand.fillCircle(-11, 10, 2.5);
    
    // MAGICAL STAFF (large and visible, held in left hand)
    parts.staff = scene.add.graphics();
    
    // Staff shaft (wooden - brown)
    parts.staff.fillStyle(0x92400e, 1);
    parts.staff.fillRect(-13, -15, 4, 40);
    
    // Staff decorative bands (gold)
    parts.staff.fillStyle(0xfbbf24, 1);
    parts.staff.fillRect(-13, 0, 4, 2);
    parts.staff.fillRect(-13, 10, 4, 2);
    
    // Staff orb at top (large glowing crystal - blue)
    parts.staff.fillStyle(0x3b82f6, 1);
    parts.staff.fillCircle(-11, -18, 5);
    
    // Orb inner glow (bright blue)
    parts.staff.fillStyle(0x60a5fa, 1);
    parts.staff.fillCircle(-11, -18, 3);
    
    // Orb highlight (white)
    parts.staff.fillStyle(0xffffff, 0.8);
    parts.staff.fillCircle(-10, -19, 1.5);
    
    // Orb outer glow (light blue aura)
    parts.staff.fillStyle(0x93c5fd, 0.4);
    parts.staff.fillCircle(-11, -18, 7);
    
    // Staff bottom cap (metal)
    parts.staff.fillStyle(0x6b7280, 1);
    parts.staff.fillCircle(-11, 25, 2);
    
    // Right sleeve (in front)
    parts.rightSleeve = scene.add.graphics();
    parts.rightSleeve.fillStyle(0x1e3a8a, 1);
    parts.rightSleeve.fillRect(9, -2, 5, 10);
    // Sleeve trim
    parts.rightSleeve.fillStyle(0x3b82f6, 1);
    parts.rightSleeve.fillRect(9, 6, 5, 2);
    
    // Right hand
    parts.rightHand = scene.add.graphics();
    parts.rightHand.fillStyle(0xfde68a, 1);
    parts.rightHand.fillCircle(11, 10, 2.5);
    
    // Collar (dark blue with gold trim)
    parts.collar = scene.add.graphics();
    parts.collar.fillStyle(0x1e3a8a, 1);
    parts.collar.fillRect(-6, -8, 12, 3);
    parts.collar.fillStyle(0xfbbf24, 1);
    parts.collar.fillRect(-6, -6, 12, 1);
    
    // Head (pale skin)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xfde68a, 1);
    parts.head.fillCircle(0, -13, 5);
    
    // Long white beard
    parts.beard = scene.add.graphics();
    parts.beard.fillStyle(0xe5e7eb, 1);
    // Main beard
    parts.beard.fillRect(-4, -9, 8, 5);
    // Beard point
    parts.beard.fillTriangle(-3, -4, 3, -4, 0, -1);
    
    // Wizard hat (tall pointed hat - dark blue)
    parts.hat = scene.add.graphics();
    parts.hat.fillStyle(0x1e3a8a, 1);
    // Hat brim
    parts.hat.fillRect(-8, -16, 16, 2);
    // Hat cone (tall and pointed)
    parts.hat.fillTriangle(0, -30, -6, -16, 6, -16);
    
    // Stars on hat (gold)
    parts.hat.fillStyle(0xfbbf24, 1);
    parts.hat.fillCircle(-2, -22, 1);
    parts.hat.fillCircle(2, -24, 1);
    parts.hat.fillCircle(0, -27, 1);
    
    // Moon on hat (silver)
    parts.hat.fillStyle(0xd1d5db, 1);
    parts.hat.fillCircle(3, -20, 1.5);
    
    // Eyes (wise blue eyes)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffffff, 1);
    parts.eyes.fillCircle(-2.5, -13, 1.5);
    parts.eyes.fillCircle(2.5, -13, 1.5);
    parts.eyes.fillStyle(0x3b82f6, 1);
    parts.eyes.fillCircle(-2.5, -13, 1);
    parts.eyes.fillCircle(2.5, -13, 1);
    
    // Eyebrows (gray, bushy)
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0xe5e7eb, 1);
    parts.eyebrows.fillRect(-4, -15, 3, 1);
    parts.eyebrows.fillRect(1, -15, 3, 1);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.robeBottom);
    container.add(parts.leftSleeve);
    container.add(parts.leftHand);
    container.add(parts.staff); // Staff visible in front of left side
    container.add(parts.robeBody);
    container.add(parts.sash);
    container.add(parts.rightSleeve);
    container.add(parts.rightHand);
    container.add(parts.collar);
    container.add(parts.beard);
    container.add(parts.head);
    container.add(parts.hat);
    container.add(parts.eyebrows);
    container.add(parts.eyes);
    
    return parts;
  }

  /**
   * Update wizard animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   * @param {boolean} isMoving - Whether character is moving
   */
  static updateAnimation(parts, animationTime, isMoving) {
    if (isMoving) {
      // Floating/gliding animation (wizards don't walk, they glide)
      const floatAmount = Math.sin(animationTime * 0.008) * 2;
      
      // Float the entire body
      parts.robeBottom.y = floatAmount;
      parts.robeBody.y = floatAmount;
      parts.sash.y = floatAmount;
      parts.collar.y = floatAmount;
      parts.head.y = floatAmount;
      parts.beard.y = floatAmount;
      parts.hat.y = floatAmount;
      parts.eyes.y = floatAmount;
      parts.eyebrows.y = floatAmount;
      
      // Robe sway
      const robeSwayAmount = Math.sin(animationTime * 0.009) * 1;
      parts.robeBottom.rotation = robeSwayAmount * 0.02;
      
      // Sleeves and hands sway gently
      const armSwayAmount = Math.sin(animationTime * 0.007) * 2;
      parts.leftSleeve.y = floatAmount + armSwayAmount;
      parts.leftHand.y = floatAmount + armSwayAmount;
      parts.rightSleeve.y = floatAmount - armSwayAmount;
      parts.rightHand.y = floatAmount - armSwayAmount;
      
      // Staff bobs with left hand
      parts.staff.y = floatAmount + armSwayAmount;
      parts.staff.rotation = armSwayAmount * 0.02;
      
      // Hat tilts slightly
      parts.hat.rotation = Math.sin(animationTime * 0.006) * 0.05;
    } else {
      // Idle animation - mystical floating
      const floatAmount = Math.sin(animationTime * 0.004) * 1.5;
      
      parts.robeBottom.y = floatAmount;
      parts.robeBody.y = floatAmount;
      parts.sash.y = floatAmount;
      parts.collar.y = floatAmount;
      parts.head.y = floatAmount;
      parts.beard.y = floatAmount;
      parts.hat.y = floatAmount;
      parts.eyes.y = floatAmount;
      parts.eyebrows.y = floatAmount;
      
      // Gentle robe sway
      parts.robeBottom.rotation = Math.sin(animationTime * 0.003) * 0.01;
      
      // Arms in meditation pose
      const breathAmount = Math.sin(animationTime * 0.005) * 0.5;
      parts.leftSleeve.y = floatAmount + breathAmount;
      parts.leftHand.y = floatAmount + breathAmount;
      parts.rightSleeve.y = floatAmount + breathAmount;
      parts.rightHand.y = floatAmount + breathAmount;
      
      // Staff floats with left hand
      parts.staff.y = floatAmount + breathAmount;
      parts.staff.rotation = 0;
      
      // Hat stays mostly still
      parts.hat.rotation = 0;
    }
  }
}
