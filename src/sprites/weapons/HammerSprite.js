/**
 * HammerSprite
 * Handles sprite creation for Hammer weapons
 */
export default class HammerSprite {
  /**
   * Create hammer sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the hammer
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Wooden handle
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, -5, 4, 28);
    
    // Leather grip
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 10, 4, 8);
    
    // Hammer head (large rectangular block)
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(-8, -15, 16, 10);
    
    // Hammer head shine (top)
    graphics.fillStyle(0xa0a0a0, 1);
    graphics.fillRect(-8, -15, 16, 3);
    
    // Hammer head dark edge
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-8, -6, 16, 1);
    
    // Metal bands on handle
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(-2, -5, 4, 2);
    graphics.fillRect(-2, 18, 4, 2);
    
    // Pommel
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 23, 2.5);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 35;
  }
}
