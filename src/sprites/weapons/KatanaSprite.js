/**
 * KatanaSprite
 * Handles sprite creation for Katana weapons
 */
export default class KatanaSprite {
  /**
   * Create katana sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the katana
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Curved blade (silver with slight curve)
    graphics.fillStyle(0xd0d0d0, 1);
    graphics.beginPath();
    graphics.moveTo(-2, -28);
    graphics.lineTo(2, -28);
    graphics.lineTo(3, 5);
    graphics.lineTo(-3, 5);
    graphics.closePath();
    graphics.fillPath();
    
    // Blade tip (sharp point)
    graphics.fillTriangle(-2, -28, 2, -28, 0, -32);
    
    // Blade shine (bright edge)
    graphics.fillStyle(0xf0f0f0, 1);
    graphics.fillRect(-0.5, -28, 1, 30);
    
    // Tsuba (hand guard - circular)
    graphics.fillStyle(0x404040, 1);
    graphics.fillCircle(0, 5, 5);
    
    // Tsuba decoration (gold inlay)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 5, 3);
    
    // Handle (wrapped in black cord)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(-2, 7, 4, 14);
    
    // Handle wrapping pattern (white cord)
    graphics.lineStyle(1, 0xffffff, 1);
    graphics.lineBetween(-2, 9, 2, 11);
    graphics.lineBetween(-2, 13, 2, 15);
    graphics.lineBetween(-2, 17, 2, 19);
    
    // Pommel (metal cap)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 22, 2.5);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 38;
  }
}
