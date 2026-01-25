/**
 * TrollSprite
 * Handles sprite creation and animation for Troll enemies
 */
export default class TrollSprite {
  /**
   * Create troll sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Legs (massive and thick - brown/gray)
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x6b5d4f, 1); // Dark brown-gray
    parts.leftLeg.fillRect(-10, 12, 9, 16);
    // Foot
    parts.leftLeg.fillRect(-12, 26, 13, 4);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x6b5d4f, 1);
    parts.rightLeg.fillRect(1, 12, 9, 16);
    // Foot
    parts.rightLeg.fillRect(-1, 26, 13, 4);
    
    // Body (huge and hunched - brown/gray skin)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0x556b2f, 1); // Dark olive green (more visible)
    parts.body.fillRect(-14, -4, 28, 18);
    // Belly
    parts.body.fillStyle(0x6b8e23, 1); // Olive drab (lighter)
    parts.body.fillEllipse(0, 6, 22, 14);
    
    // Arms (long and muscular - hanging low)
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0x556b2f, 1); // Match body
    parts.leftArm.fillRect(-18, 0, 7, 16);
    // Large hand/claw
    parts.leftArm.fillCircle(-14, 18, 5);
    parts.leftArm.fillStyle(0x3d4f1f, 1); // Darker for claws
    parts.leftArm.fillRect(-16, 18, 2, 4); // Claws
    parts.leftArm.fillRect(-14, 18, 2, 4);
    parts.leftArm.fillRect(-12, 18, 2, 4);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0x556b2f, 1); // Match body
    parts.rightArm.fillRect(11, 0, 7, 16);
    // Large hand/claw
    parts.rightArm.fillCircle(14, 18, 5);
    parts.rightArm.fillStyle(0x3d4f1f, 1); // Darker for claws
    parts.rightArm.fillRect(12, 18, 2, 4); // Claws
    parts.rightArm.fillRect(14, 18, 2, 4);
    parts.rightArm.fillRect(16, 18, 2, 4);
    
    // Hunched back (bump)
    parts.backHump = scene.add.graphics();
    parts.backHump.fillStyle(0x556b2f, 1); // Match body
    parts.backHump.fillEllipse(0, -6, 20, 8);
    
    // Neck (thick and short)
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0x556b2f, 1); // Match body
    parts.neck.fillRect(-6, -10, 12, 6);
    
    // Head (large and brutish - brown)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0x556b2f, 1); // Match body
    parts.head.fillRect(-10, -22, 20, 14);
    // Forehead (protruding)
    parts.head.fillRect(-10, -24, 20, 3);
    
    // Nose (large and bulbous)
    parts.nose = scene.add.graphics();
    parts.nose.fillStyle(0x7a6449, 1); // Darker brown
    parts.nose.fillEllipse(0, -14, 6, 8);
    // Nostrils
    parts.nose.fillStyle(0x4a3829, 1);
    parts.nose.fillCircle(-2, -12, 1.5);
    parts.nose.fillCircle(2, -12, 1.5);
    
    // Eyes (small and beady - yellow)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffff00, 1);
    parts.eyes.fillCircle(-5, -18, 2.5);
    parts.eyes.fillCircle(5, -18, 2.5);
    parts.eyes.fillStyle(0x000000, 1);
    parts.eyes.fillCircle(-5, -18, 1);
    parts.eyes.fillCircle(5, -18, 1);
    
    // Eyebrows (thick and heavy)
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0x6b5d4f, 1);
    parts.eyebrows.fillRect(-7, -20, 5, 2);
    parts.eyebrows.fillRect(2, -20, 5, 2);
    
    // Mouth (large with teeth)
    parts.mouth = scene.add.graphics();
    parts.mouth.fillStyle(0x4a3829, 1);
    parts.mouth.fillRect(-6, -10, 12, 3);
    // Teeth
    parts.mouth.fillStyle(0xfff8dc, 1);
    parts.mouth.fillRect(-5, -10, 2, 2);
    parts.mouth.fillRect(-1, -10, 2, 2);
    parts.mouth.fillRect(3, -10, 2, 2);
    
    // Ears (small and pointed)
    parts.ears = scene.add.graphics();
    parts.ears.fillStyle(0x556b2f, 1); // Match body
    parts.ears.fillTriangle(-10, -16, -13, -14, -10, -12);
    parts.ears.fillTriangle(10, -16, 13, -14, 10, -12);
    
    // Warts/bumps on skin
    parts.warts = scene.add.graphics();
    parts.warts.fillStyle(0x7a6449, 1);
    parts.warts.fillCircle(-8, -16, 1.5);
    parts.warts.fillCircle(7, -14, 1.5);
    parts.warts.fillCircle(-10, 2, 2);
    parts.warts.fillCircle(9, 4, 2);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.backHump);
    container.add(parts.body);
    container.add(parts.warts);
    container.add(parts.rightArm);
    container.add(parts.neck);
    container.add(parts.ears);
    container.add(parts.head);
    container.add(parts.nose);
    container.add(parts.eyebrows);
    container.add(parts.eyes);
    container.add(parts.mouth);
    
    return parts;
  }

  /**
   * Update troll animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   */
  static updateAnimation(parts, animationTime) {
    // Slow, lumbering walk (slower than orc)
    const lumberAmount = Math.sin(animationTime * 0.008) * 2;
    
    // Body sways with lumbering walk
    parts.body.y = -4 + Math.abs(lumberAmount);
    parts.body.rotation = lumberAmount * 0.02;
    parts.backHump.y = -6 + Math.abs(lumberAmount);
    parts.neck.y = Math.abs(lumberAmount);
    parts.head.y = Math.abs(lumberAmount);
    parts.nose.y = Math.abs(lumberAmount);
    parts.eyes.y = Math.abs(lumberAmount);
    parts.eyebrows.y = Math.abs(lumberAmount);
    parts.mouth.y = Math.abs(lumberAmount);
    parts.ears.y = Math.abs(lumberAmount);
    parts.warts.y = Math.abs(lumberAmount);
    
    // Slow, heavy leg movement
    const legSwing = Math.sin(animationTime * 0.008) * 4;
    parts.leftLeg.y = 12 + Math.abs(lumberAmount) + Math.abs(legSwing);
    parts.leftLeg.rotation = legSwing * 0.06;
    parts.rightLeg.y = 12 + Math.abs(lumberAmount) + Math.abs(-legSwing);
    parts.rightLeg.rotation = -legSwing * 0.06;
    
    // Long arms swing low (dragging knuckles)
    const armSwing = Math.sin(animationTime * 0.008) * 3;
    parts.leftArm.y = Math.abs(lumberAmount) - armSwing;
    parts.leftArm.rotation = -armSwing * 0.05;
    parts.rightArm.y = Math.abs(lumberAmount) + armSwing;
    parts.rightArm.rotation = armSwing * 0.05;
  }
}
