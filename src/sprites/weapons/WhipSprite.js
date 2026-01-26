/**
 * WhipSprite
 * Handles sprite creation for Whip weapons
 */
export default class WhipSprite {
  /**
   * Create whip sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the whip
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Handle (leather-wrapped)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 10, 4, 15);
    
    // Handle grip texture
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 14, 4, 2);
    graphics.fillRect(-2, 18, 4, 2);
    
    // Whip cord (curved, leather)
    graphics.lineStyle(3, 0x8b4513, 1);
    graphics.beginPath();
    graphics.moveTo(0, 10);
    graphics.quadraticCurveTo(-5, 0, -8, -10);
    graphics.quadraticCurveTo(-10, -20, -12, -30);
    graphics.strokePath();
    
    // Whip tip (thinner)
    graphics.lineStyle(2, 0x654321, 1);
    graphics.lineBetween(-12, -30, -14, -35);
    
    // Metal studs on whip
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(-5, 0, 1);
    graphics.fillCircle(-8, -10, 1);
    graphics.fillCircle(-10, -20, 1);
    
    // Pommel
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 25, 2);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 45;
  }
}
