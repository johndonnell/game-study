/**
 * GoblinSprite
 * Handles sprite creation and animation for Goblin enemies
 */
export default class GoblinSprite {
  /**
   * Create goblin sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Body (green oval)
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0x228b22, 1); // Forest green (darker, more visible)
    parts.body.fillEllipse(0, 0, 24, 30);
    
    // Head (lighter green circle)
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0x32cd32, 1); // Lime green (more visible)
    parts.head.fillCircle(0, -12, 10);
    
    // Eyes (yellow with black pupils)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffff00, 1);
    parts.eyes.fillCircle(-4, -12, 3);
    parts.eyes.fillCircle(4, -12, 3);
    parts.eyes.fillStyle(0x000000, 1);
    parts.eyes.fillCircle(-4, -12, 1.5);
    parts.eyes.fillCircle(4, -12, 1.5);
    
    // Ears (pointy)
    parts.ears = scene.add.graphics();
    parts.ears.fillStyle(0x00cc00, 1);
    parts.ears.fillTriangle(-10, -12, -14, -10, -10, -8);
    parts.ears.fillTriangle(10, -12, 14, -10, 10, -8);
    
    // Arms (will animate)
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0x228b22, 1); // Match body color
    parts.leftArm.fillEllipse(-10, 2, 6, 12);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0x228b22, 1); // Match body color
    parts.rightArm.fillEllipse(10, 2, 6, 12);
    
    // Legs (will animate)
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x009900, 1);
    parts.leftLeg.fillEllipse(-5, 12, 6, 10);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x009900, 1);
    parts.rightLeg.fillEllipse(5, 12, 6, 10);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.leftArm);
    container.add(parts.leftLeg);
    container.add(parts.body);
    container.add(parts.rightLeg);
    container.add(parts.rightArm);
    container.add(parts.ears);
    container.add(parts.head);
    container.add(parts.eyes);
    
    return parts;
  }

  /**
   * Update goblin animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   */
  static updateAnimation(parts, animationTime) {
    // Bobbing animation (up and down)
    const bobAmount = Math.sin(animationTime * 0.008) * 2;
    parts.body.y = bobAmount;
    parts.head.y = bobAmount;
    parts.eyes.y = bobAmount;
    parts.ears.y = bobAmount;
    
    // Walking animation (legs)
    const legSwing = Math.sin(animationTime * 0.01) * 3;
    parts.leftLeg.y = 12 + bobAmount + Math.abs(legSwing);
    parts.rightLeg.y = 12 + bobAmount + Math.abs(-legSwing);
    
    // Arm swing (opposite to legs)
    const armSwing = Math.sin(animationTime * 0.01) * 2;
    parts.leftArm.y = 2 + bobAmount - armSwing;
    parts.rightArm.y = 2 + bobAmount + armSwing;
  }
}
