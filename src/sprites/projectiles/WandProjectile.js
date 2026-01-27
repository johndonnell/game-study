/**
 * WandProjectile
 * Simple glowing blue ball projectile for WAND weapon
 */
export default class WandProjectile {
  /**
   * Draw wand projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Simple glowing blue ball - 3 circles for glow effect
    graphics.fillStyle(0x0088ff, 1); // Outer glow - bright blue
    graphics.fillCircle(0, 0, 6);
    graphics.fillStyle(0x00ccff, 0.9); // Middle layer - lighter blue
    graphics.fillCircle(0, 0, 4);
    graphics.fillStyle(0xffffff, 0.7); // Inner core - white
    graphics.fillCircle(0, 0, 2);
  }
  
  /**
   * Check if this projectile should rotate to face direction
   * @returns {boolean} True if should rotate
   */
  static shouldRotate() {
    return false;
  }
  
  /**
   * Get rotation speed for spinning projectiles
   * @returns {number} Rotation speed (0 for non-spinning)
   */
  static getRotationSpeed() {
    return 0;
  }
}
