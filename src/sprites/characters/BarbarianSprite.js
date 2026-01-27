/**
 * BarbarianSprite
 * Handles sprite creation and animation for the Warrior/Barbarian character
 */
export default class BarbarianSprite {
  /**
   * Create barbarian sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Legs (brown pants)
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x8b4513, 1);
    parts.leftLeg.fillRect(-7, 8, 5, 14);
    // Boot
    parts.leftLeg.fillStyle(0x3e2723, 1);
    parts.leftLeg.fillRect(-7, 20, 5, 4);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x8b4513, 1);
    parts.rightLeg.fillRect(2, 8, 5, 14);
    // Boot
    parts.rightLeg.fillStyle(0x3e2723, 1);
    parts.rightLeg.fillRect(2, 20, 5, 4);
    
    // Body (muscular torso - tan/beige)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0xd2b48c, 1);
    parts.body.fillRect(-10, -6, 20, 14);
    
    // Belt (dark brown)
    parts.belt = scene.add.graphics();
    parts.belt.fillStyle(0x654321, 1);
    parts.belt.fillRect(-10, 6, 20, 3);
    // Belt buckle
    parts.belt.fillStyle(0xffd700, 1);
    parts.belt.fillRect(-2, 6, 4, 3);
    
    // Left arm (behind body)
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0xd2b48c, 1);
    parts.leftArm.fillRect(-14, -2, 5, 10);
    // Bicep
    parts.leftArm.fillStyle(0xc19a6b, 1);
    parts.leftArm.fillRect(-14, -2, 5, 3);
    
    // Left hand
    parts.leftHand = scene.add.graphics();
    parts.leftHand.fillStyle(0xd2b48c, 1);
    parts.leftHand.fillCircle(-11, 10, 2.5);
    
    // Right arm (in front)
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0xd2b48c, 1);
    parts.rightArm.fillRect(9, -2, 5, 10);
    // Bicep
    parts.rightArm.fillStyle(0xc19a6b, 1);
    parts.rightArm.fillRect(9, -2, 5, 3);
    
    // Right hand
    parts.rightHand = scene.add.graphics();
    parts.rightHand.fillStyle(0xd2b48c, 1);
    parts.rightHand.fillCircle(11, 10, 2.5);
    
    // Shoulder pads (armor - gray metal)
    parts.shoulderPads = scene.add.graphics();
    parts.shoulderPads.fillStyle(0x808080, 1);
    parts.shoulderPads.fillCircle(-10, -4, 3.5);
    parts.shoulderPads.fillCircle(10, -4, 3.5);
    
    // Neck
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0xd2b48c, 1);
    parts.neck.fillRect(-3, -8, 6, 3);
    
    // Head
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xd2b48c, 1);
    parts.head.fillRect(-6, -16, 12, 8);
    
    // Hair (long black hair)
    parts.hair = scene.add.graphics();
    parts.hair.fillStyle(0x1a1a1a, 1);
    // Top
    parts.hair.fillRect(-7, -18, 14, 3);
    // Sides
    parts.hair.fillRect(-8, -16, 2, 10);
    parts.hair.fillRect(6, -16, 2, 10);
    
    // Headband
    parts.headband = scene.add.graphics();
    parts.headband.fillStyle(0x654321, 1);
    parts.headband.fillRect(-7, -16, 14, 2);
    
    // Eyes
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffffff, 1);
    parts.eyes.fillRect(-4, -13, 2, 2);
    parts.eyes.fillRect(2, -13, 2, 2);
    parts.eyes.fillStyle(0x000000, 1);
    parts.eyes.fillRect(-3, -13, 1, 2);
    parts.eyes.fillRect(3, -13, 1, 2);
    
    // Eyebrows
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0x1a1a1a, 1);
    parts.eyebrows.fillRect(-5, -14, 3, 1);
    parts.eyebrows.fillRect(2, -14, 3, 1);
    
    // Nose
    parts.nose = scene.add.graphics();
    parts.nose.fillStyle(0xc19a6b, 1);
    parts.nose.fillRect(-1, -11, 2, 2);
    
    // Mouth
    parts.mouth = scene.add.graphics();
    parts.mouth.fillStyle(0x8b4513, 1);
    parts.mouth.fillRect(-2, -9, 4, 1);
    
    // LARGE BATTLEAXE (held in right hand, positioned to the right side)
    parts.battleaxe = scene.add.graphics();
    
    // Wooden handle (long shaft)
    parts.battleaxe.fillStyle(0x654321, 1);
    parts.battleaxe.fillRect(14, -10, 4, 35);
    
    // Leather grip
    parts.battleaxe.fillStyle(0x3e2723, 1);
    parts.battleaxe.fillRect(14, 8, 4, 10);
    
    // Axe blade (large, positioned at top)
    parts.battleaxe.fillStyle(0x708090, 1);
    // Right blade
    parts.battleaxe.fillTriangle(18, -10, 30, -15, 18, -2);
    // Left blade  
    parts.battleaxe.fillTriangle(14, -10, 2, -15, 14, -2);
    
    // Blade shine (lighter)
    parts.battleaxe.fillStyle(0xc0c0c0, 1);
    parts.battleaxe.fillTriangle(18, -10, 26, -13, 18, -4);
    parts.battleaxe.fillTriangle(14, -10, 6, -13, 14, -4);
    
    // Axe head center (dark metal connecting to handle)
    parts.battleaxe.fillStyle(0x404040, 1);
    parts.battleaxe.fillRect(14, -10, 4, 8);
    
    // Pommel at bottom
    parts.battleaxe.fillStyle(0x808080, 1);
    parts.battleaxe.fillCircle(16, 25, 3);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.leftHand);
    container.add(parts.body);
    container.add(parts.belt);
    container.add(parts.shoulderPads);
    container.add(parts.rightArm);
    container.add(parts.rightHand);
    container.add(parts.battleaxe); // Axe in front, held by right hand
    container.add(parts.neck);
    container.add(parts.hair);
    container.add(parts.head);
    container.add(parts.headband);
    container.add(parts.eyebrows);
    container.add(parts.eyes);
    container.add(parts.nose);
    container.add(parts.mouth);
    
    return parts;
  }

  /**
   * Update barbarian animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   * @param {boolean} isMoving - Whether character is moving
   */
  static updateAnimation(parts, animationTime, isMoving) {
    if (isMoving) {
      // Walking animation
      const bobAmount = Math.sin(animationTime * 0.01) * 1.5;
      
      // Bob the entire upper body
      parts.body.y = bobAmount;
      parts.belt.y = bobAmount;
      parts.neck.y = bobAmount;
      parts.head.y = bobAmount;
      parts.hair.y = bobAmount;
      parts.headband.y = bobAmount;
      parts.eyes.y = bobAmount;
      parts.eyebrows.y = bobAmount;
      parts.nose.y = bobAmount;
      parts.mouth.y = bobAmount;
      parts.shoulderPads.y = bobAmount;
      
      // Walking animation (legs)
      const legSwing = Math.sin(animationTime * 0.012) * 4;
      parts.leftLeg.y = bobAmount + Math.abs(legSwing);
      parts.leftLeg.rotation = legSwing * 0.05;
      parts.rightLeg.y = bobAmount + Math.abs(-legSwing);
      parts.rightLeg.rotation = -legSwing * 0.05;
      
      // Arm swing (opposite to legs)
      const armSwing = Math.sin(animationTime * 0.012) * 3;
      parts.leftArm.y = bobAmount - armSwing;
      parts.leftArm.rotation = -armSwing * 0.08;
      parts.leftHand.y = bobAmount - armSwing;
      
      parts.rightArm.y = bobAmount + armSwing;
      parts.rightArm.rotation = armSwing * 0.08;
      parts.rightHand.y = bobAmount + armSwing;
      
      // Battleaxe moves with right arm
      parts.battleaxe.y = bobAmount + armSwing;
      parts.battleaxe.rotation = armSwing * 0.05;
    } else {
      // Idle animation - breathing
      const breathAmount = Math.sin(animationTime * 0.003) * 0.5;
      
      parts.body.y = breathAmount;
      parts.belt.y = breathAmount;
      parts.neck.y = breathAmount;
      parts.head.y = breathAmount;
      parts.hair.y = breathAmount;
      parts.headband.y = breathAmount;
      parts.eyes.y = breathAmount;
      parts.eyebrows.y = breathAmount;
      parts.nose.y = breathAmount;
      parts.mouth.y = breathAmount;
      parts.shoulderPads.y = breathAmount;
      
      // Reset limbs to neutral position
      parts.leftLeg.y = 0;
      parts.leftLeg.rotation = 0;
      parts.rightLeg.y = 0;
      parts.rightLeg.rotation = 0;
      parts.leftArm.y = 0;
      parts.leftArm.rotation = 0;
      parts.leftHand.y = 0;
      parts.rightArm.y = 0;
      parts.rightArm.rotation = 0;
      parts.rightHand.y = 0;
      
      // Battleaxe in ready position
      parts.battleaxe.y = breathAmount;
      parts.battleaxe.rotation = 0;
    }
  }
}
