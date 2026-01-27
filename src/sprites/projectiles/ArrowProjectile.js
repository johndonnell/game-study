/**
 * ArrowProjectile
 * Handles rendering for arrow projectiles (BOW, CROSSBOW)
 */
export default class ArrowProjectile {
  /**
   * Draw arrow projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Arrow - wooden shaft with metal tip and feather fletching
    // Arrow points to the right (will be rotated to face direction)
    
    // Arrow shaft (brown wood)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-8, -1, 16, 2);
    
    // Arrow tip (silver/grey metal - pointed)
    graphics.fillStyle(0x9ca3af, 1);
    graphics.fillTriangle(8, -2, 8, 2, 14, 0);
    
    // Arrow tip shine (lighter)
    graphics.fillStyle(0xd1d5db, 1);
    graphics.fillTriangle(8, -1, 8, 1, 12, 0);
    
    // Fletching (feathers at back - red/white)
    graphics.fillStyle(0xff0000, 0.8);
    graphics.fillTriangle(-8, 0, -12, -3, -10, 0);
    graphics.fillTriangle(-8, 0, -12, 3, -10, 0);
    
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillTriangle(-8, 0, -11, -2, -10, 0);
    graphics.fillTriangle(-8, 0, -11, 2, -10, 0);
    
    // Nock (back of arrow - small notch)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-12, -1, 2, 2);
  }
  
  /**
   * Check if this projectile should rotate to face direction
   * @returns {boolean} True if should rotate
   */
  static shouldRotate() {
    return true;
  }
  
  /**
   * Get rotation speed for spinning projectiles
   * @returns {number} Rotation speed (0 for non-spinning)
   */
  static getRotationSpeed() {
    return 0;
  }
}
