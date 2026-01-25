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
    parts.robeBottom.fillStyle(0x1e3a8a, 1); // Dark blue
    parts.robeBottom.fillRect(-12, 8, 24, 14);
    // Robe bottom trim (lighter blue)
    parts.robeBottom.fillStyle(0x3b82f6, 1);
    parts.robeBottom.fillRect(-12, 20, 24, 2);
    
    // Robe body (medium blue)
    parts.robeBody = scene.add.graphics();
    parts.robeBody.fillStyle(0x2563eb, 1);
    parts.robeBody.fillRect(-11, -8, 22, 16);
    
    // Belt/Sash (gold)
    parts.sash = scene.add.graphics();
    parts.sash.fillStyle(0xfbbf24, 1);
    parts.sash.fillRect(-11, 4, 22, 3);
    
    // Sleeves (dark blue)
    parts.leftSleeve = scene.add.graphics();
    parts.leftSleeve.fillStyle(0x1e3a8a, 1);
    parts.leftSleeve.fillRect(-15, -4, 6, 10);
    // Sleeve trim
    parts.leftSleeve.fillStyle(0x3b82f6, 1);
    parts.leftSleeve.fillRect(-15, 4, 6, 2);
    
    parts.rightSleeve = scene.add.graphics();
    parts.rightSleeve.fillStyle(0x1e3a8a, 1);
    parts.rightSleeve.fillRect(9, -4, 6, 10);
    // Sleeve trim
    parts.rightSleeve.fillStyle(0x3b82f6, 1);
    parts.rightSleeve.fillRect(9, 4, 6, 2);
    
    // Hands (pale skin)
    parts.leftHand = scene.add.graphics();
    parts.leftHand.fillStyle(0xfde68a, 1);
    parts.leftHand.fillCircle(-12, 8, 3);
    
    parts.rightHand = scene.add.graphics();
    parts.rightHand.fillStyle(0xfde68a, 1);
    parts.rightHand.fillCircle(12, 8, 3);
    
    // Staff (wooden)
    parts.staff = scene.add.graphics();
    parts.staff.fillStyle(0x92400e, 1); // Brown
    parts.staff.fillRect(-2, -10, 2, 32);
    // Staff orb (glowing blue)
    parts.staff.fillStyle(0x60a5fa, 1);
    parts.staff.fillCircle(-1, -12, 4);
    // Orb glow
    parts.staff.fillStyle(0x93c5fd, 0.5);
    parts.staff.fillCircle(-1, -12, 6);
    
    // Collar (dark blue)
    parts.collar = scene.add.graphics();
    parts.collar.fillStyle(0x1e3a8a, 1);
    parts.collar.fillRect(-6, -10, 12, 3);
    
    // Head (pale skin)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xfde68a, 1);
    parts.head.fillCircle(0, -14, 6);
    
    // Beard (long white/gray)
    parts.beard = scene.add.graphics();
    parts.beard.fillStyle(0xe5e7eb, 1); // Light gray
    parts.beard.fillRect(-4, -10, 8, 6);
    parts.beard.fillRect(-3, -4, 6, 2);
    
    // Wizard hat (dark blue with stars)
    parts.hat = scene.add.graphics();
    parts.hat.fillStyle(0x1e3a8a, 1);
    // Hat brim
    parts.hat.fillRect(-9, -18, 18, 2);
    // Hat cone
    parts.hat.fillTriangle(0, -32, -7, -18, 7, -18);
    // Stars on hat (gold)
    parts.hat.fillStyle(0xfbbf24, 1);
    parts.hat.fillCircle(-2, -24, 1);
    parts.hat.fillCircle(2, -26, 1);
    parts.hat.fillCircle(0, -28, 1);
    
    // Eyes (wise look)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffffff, 1);
    parts.eyes.fillCircle(-3, -14, 2);
    parts.eyes.fillCircle(3, -14, 2);
    parts.eyes.fillStyle(0x3b82f6, 1); // Blue eyes
    parts.eyes.fillCircle(-3, -14, 1);
    parts.eyes.fillCircle(3, -14, 1);
    
    // Eyebrows (gray)
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0xe5e7eb, 1);
    parts.eyebrows.fillRect(-4, -16, 3, 1);
    parts.eyebrows.fillRect(1, -16, 3, 1);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.staff);
    container.add(parts.robeBottom);
    container.add(parts.leftSleeve);
    container.add(parts.leftHand);
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
      parts.robeBottom.y = 8 + floatAmount;
      parts.robeBody.y = floatAmount;
      parts.sash.y = 4 + floatAmount;
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
      parts.leftSleeve.y = -4 + floatAmount + armSwayAmount;
      parts.leftHand.y = 8 + floatAmount + armSwayAmount;
      parts.rightSleeve.y = -4 + floatAmount - armSwayAmount;
      parts.rightHand.y = 8 + floatAmount - armSwayAmount;
      
      // Staff bobs with movement
      parts.staff.y = floatAmount;
      
      // Hat tilts slightly
      parts.hat.rotation = Math.sin(animationTime * 0.006) * 0.05;
    } else {
      // Idle animation - mystical floating
      const floatAmount = Math.sin(animationTime * 0.004) * 1.5;
      
      parts.robeBottom.y = 8 + floatAmount;
      parts.robeBody.y = floatAmount;
      parts.sash.y = 4 + floatAmount;
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
      parts.leftSleeve.y = -4 + floatAmount + breathAmount;
      parts.leftHand.y = 8 + floatAmount + breathAmount;
      parts.rightSleeve.y = -4 + floatAmount + breathAmount;
      parts.rightHand.y = 8 + floatAmount + breathAmount;
      
      // Staff floats
      parts.staff.y = floatAmount;
      
      // Hat stays mostly still
      parts.hat.rotation = 0;
    }
  }
}
