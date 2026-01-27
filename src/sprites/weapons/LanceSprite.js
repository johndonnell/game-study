/**
 * LanceSprite
 * Handles sprite creation for Lance weapons
 */
export default class LanceSprite {
  /**
   * Create lance sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the lance
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Very long wooden shaft
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, -20, 4, 45);
    
    // Lance head (long pointed blade)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillTriangle(-4, -35, 4, -35, 0, -45);
    
    // Lance head shine
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.fillTriangle(-1.5, -35, 1.5, -35, 0, -43);
    
    // Lance head socket (dark metal)
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-3, -20, 6, 8);
    
    // Vamplate (hand guard - circular shield)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 0, 7);
    
    // Vamplate decoration
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 0, 5);
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 0, 3);
    
    // Grip area (leather wrapped)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 8, 4, 12);
    
    // Butt spike
    graphics.fillStyle(0x808080, 1);
    graphics.fillTriangle(-2, 25, 2, 25, 0, 28);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 50;
  }
}
