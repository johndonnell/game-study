/**
 * DefaultProjectile
 * Handles rendering for default/unknown projectile types
 */
export default class DefaultProjectile {
  /**
   * Draw default projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Default projectile (yellow circle)
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(0, 0, 3);
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
