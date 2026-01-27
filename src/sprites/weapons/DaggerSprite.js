/**
 * DaggerSprite
 * Handles sprite creation for Dagger weapons
 */
export default class DaggerSprite {
  /**
   * Create dagger sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the dagger
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Blade (silver, shorter than sword)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillRect(-2, -15, 4, 18);
    
    // Blade tip (sharp point)
    graphics.fillTriangle(-2, -15, 2, -15, 0, -18);
    
    // Blade shine
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.fillRect(-0.5, -15, 1, 16);
    
    // Guard (small, dark metal)
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-5, 3, 10, 2);
    
    // Handle (black leather wrap)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(-1.5, 5, 3, 8);
    
    // Pommel (small metal)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 14, 2);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 25;
  }
}
