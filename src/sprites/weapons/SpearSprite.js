/**
 * SpearSprite
 * Handles sprite creation for Spear weapons
 */
export default class SpearSprite {
  /**
   * Create spear sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the spear
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Long wooden shaft
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, -10, 4, 35);
    
    // Spearhead (long triangular blade)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillTriangle(-3, -25, 3, -25, 0, -35);
    
    // Spearhead shine
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.fillTriangle(-1, -25, 1, -25, 0, -33);
    
    // Spearhead socket (dark metal)
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-2, -10, 4, 5);
    
    // Grip wrapping (leather)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 8, 4, 10);
    
    // Butt spike (metal end)
    graphics.fillStyle(0x808080, 1);
    graphics.fillTriangle(-2, 25, 2, 25, 0, 28);
    
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
