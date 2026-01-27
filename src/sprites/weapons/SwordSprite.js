/**
 * SwordSprite
 * Handles sprite creation for Sword weapons
 */
export default class SwordSprite {
  /**
   * Create sword sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the sword
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Blade (silver/gray)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillRect(-3, -25, 6, 30);
    
    // Blade tip (pointed)
    graphics.fillTriangle(-3, -25, 3, -25, 0, -30);
    
    // Blade shine (lighter)
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.fillRect(-1, -25, 2, 28);
    
    // Cross-guard (gold)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(-8, 5, 16, 3);
    
    // Handle (brown leather)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, 8, 4, 10);
    
    // Pommel (gold)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 19, 3);
    
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
