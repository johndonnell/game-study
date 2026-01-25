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
    
    // Legs (brown pants) - EXTENDED TO CONNECT WITH BODY
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x8b4513, 1);
    parts.leftLeg.fillRect(-8, 6, 6, 16); // Extended up to y=6 and down to y=22
    // Boot (dark brown leather)
    parts.leftLeg.fillStyle(0x3e2723, 1);
    parts.leftLeg.fillRect(-8, 20, 6, 4);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x8b4513, 1);
    parts.rightLeg.fillRect(2, 6, 6, 16); // Extended up to y=6 and down to y=22
    // Boot (dark brown leather)
    parts.rightLeg.fillStyle(0x3e2723, 1);
    parts.rightLeg.fillRect(2, 20, 6, 4);
    
    // Body (muscular torso - tan/beige)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0xd2b48c, 1);
    parts.body.fillRect(-10, -8, 20, 16);
    
    // Belt (dark brown)
    parts.belt = scene.add.graphics();
    parts.belt.fillStyle(0x654321, 1);
    parts.belt.fillRect(-10, 6, 20, 3);
    
    // Arms (muscular - tan/beige) - EXTENDED TO CONNECT WITH SHOULDERS
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0xd2b48c, 1);
    parts.leftArm.fillRect(-15, -6, 6, 14); // Extended up to connect with shoulder
    // Bicep definition
    parts.leftArm.fillStyle(0xc19a6b, 1);
    parts.leftArm.fillRect(-15, -4, 6, 3);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0xd2b48c, 1);
    parts.rightArm.fillRect(9, -6, 6, 14); // Extended up to connect with shoulder
    // Bicep definition
    parts.rightArm.fillStyle(0xc19a6b, 1);
    parts.rightArm.fillRect(9, -4, 6, 3);
    
    // Hands (large, strong hands)
    parts.leftHand = scene.add.graphics();
    parts.leftHand.fillStyle(0xd2b48c, 1);
    parts.leftHand.fillCircle(-12, 10, 3);
    
    parts.rightHand = scene.add.graphics();
    parts.rightHand.fillStyle(0xd2b48c, 1);
    parts.rightHand.fillCircle(12, 10, 3);
    
    // Neck (tan/beige)
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0xd2b48c, 1);
    parts.neck.fillRect(-3, -10, 6, 4);
    
    // Head (tan/beige - more defined shape)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xd2b48c, 1);
    // Square jaw
    parts.head.fillRect(-6, -18, 12, 10);
    // Forehead
    parts.head.fillRect(-5, -20, 10, 2);
    
    // Long black hair (Conan style)
    parts.hair = scene.add.graphics();
    parts.hair.fillStyle(0x1a1a1a, 1); // Black hair
    // Hair on top and sides
    parts.hair.fillRect(-7, -22, 14, 4); // Top of head
    parts.hair.fillRect(-8, -20, 2, 8); // Left side
    parts.hair.fillRect(6, -20, 2, 8); // Right side
    // Long hair flowing down
    parts.hair.fillRect(-8, -12, 2, 6); // Left long hair
    parts.hair.fillRect(6, -12, 2, 6); // Right long hair
    // Hair strands at bottom
    parts.hair.fillRect(-7, -6, 1, 2);
    parts.hair.fillRect(6, -6, 1, 2);
    
    // Headband (brown leather)
    parts.headband = scene.add.graphics();
    parts.headband.fillStyle(0x654321, 1);
    parts.headband.fillRect(-7, -19, 14, 2);
    
    // Eyes (fierce look - smaller and more intense)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffffff, 1);
    parts.eyes.fillRect(-4, -15, 2, 2);
    parts.eyes.fillRect(2, -15, 2, 2);
    parts.eyes.fillStyle(0x000000, 1);
    parts.eyes.fillRect(-4, -15, 1, 2);
    parts.eyes.fillRect(2, -15, 1, 2);
    
    // Eyebrows (thick and angry)
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0x1a1a1a, 1);
    parts.eyebrows.fillRect(-5, -16, 3, 1);
    parts.eyebrows.fillRect(2, -16, 3, 1);
    
    // Nose (simple)
    parts.nose = scene.add.graphics();
    parts.nose.fillStyle(0xc19a6b, 1); // Slightly darker tan
    parts.nose.fillRect(-1, -13, 2, 3);
    
    // Mouth (stern expression)
    parts.mouth = scene.add.graphics();
    parts.mouth.fillStyle(0x8b4513, 1);
    parts.mouth.fillRect(-2, -10, 4, 1);
    
    // Shoulder pads (armor - gray)
    parts.shoulderPads = scene.add.graphics();
    parts.shoulderPads.fillStyle(0x808080, 1);
    parts.shoulderPads.fillCircle(-11, -6, 4);
    parts.shoulderPads.fillCircle(11, -6, 4);
    
    // Large Battleaxe (held in right hand)
    parts.battleaxe = scene.add.graphics();
    // Axe handle (long wooden shaft - dark brown)
    parts.battleaxe.fillStyle(0x654321, 1);
    parts.battleaxe.fillRect(10, -5, 3, 28); // Long handle from shoulder to below waist
    // Handle grip (leather wrapping)
    parts.battleaxe.fillStyle(0x3e2723, 1);
    parts.battleaxe.fillRect(10, 5, 3, 8);
    // Axe head (large double-bladed - steel grey)
    parts.battleaxe.fillStyle(0x708090, 1);
    // Main blade (right side)
    parts.battleaxe.fillTriangle(13, -5, 22, -8, 13, 2);
    // Main blade (left side)
    parts.battleaxe.fillTriangle(10, -5, 1, -8, 10, 2);
    // Blade edges (lighter grey for shine)
    parts.battleaxe.fillStyle(0xa9a9a9, 1);
    parts.battleaxe.fillTriangle(13, -5, 20, -7, 13, 0);
    parts.battleaxe.fillTriangle(10, -5, 3, -7, 10, 0);
    // Axe head center (connecting to handle)
    parts.battleaxe.fillStyle(0x505050, 1);
    parts.battleaxe.fillRect(10, -5, 3, 7);
    // Pommel at bottom (metal cap)
    parts.battleaxe.fillStyle(0x808080, 1);
    parts.battleaxe.fillCircle(11.5, 23, 2.5);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.battleaxe); // Axe behind character
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.body);
    container.add(parts.belt);
    container.add(parts.rightArm);
    container.add(parts.leftHand);
    container.add(parts.rightHand);
    container.add(parts.shoulderPads);
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
      
      // Bob the entire body
      parts.body.y = bobAmount;
      parts.belt.y = 6 + bobAmount;
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
      
      // Arm swing (opposite to legs - more aggressive)
      const armSwing = Math.sin(animationTime * 0.012) * 3;
      parts.leftArm.y = bobAmount - armSwing;
      parts.leftArm.rotation = -armSwing * 0.08;
      parts.leftHand.y = 10 + bobAmount - armSwing;
      
      parts.rightArm.y = bobAmount + armSwing;
      parts.rightArm.rotation = armSwing * 0.08;
      parts.rightHand.y = 10 + bobAmount + armSwing;
      
      // Battleaxe moves with right arm
      parts.battleaxe.y = bobAmount + armSwing;
      parts.battleaxe.rotation = armSwing * 0.08;
    } else {
      // Idle animation - breathing
      const breathAmount = Math.sin(animationTime * 0.003) * 0.5;
      
      parts.body.y = breathAmount;
      parts.belt.y = 6 + breathAmount;
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
      parts.leftHand.y = 10 + breathAmount;
      parts.rightArm.y = 0;
      parts.rightArm.rotation = 0;
      parts.rightHand.y = 10 + breathAmount;
      
      // Battleaxe in ready position
      parts.battleaxe.y = breathAmount;
      parts.battleaxe.rotation = 0;
    }
  }
}
