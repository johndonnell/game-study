/**
 * FireballProjectile
 * Handles rendering for fireball projectiles (WAND, STAFF, DRAGON enemy)
 */
export default class FireballProjectile {
  /**
   * Draw fireball projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Fireball - orange/red gradient effect
    graphics.fillStyle(0xff4500, 1);
    graphics.fillCircle(0, 0, 6);
    graphics.fillStyle(0xff8c00, 0.8);
    graphics.fillCircle(0, 0, 4);
    graphics.fillStyle(0xffff00, 0.6);
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
