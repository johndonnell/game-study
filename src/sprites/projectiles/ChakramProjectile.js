/**
 * ChakramProjectile
 * Handles rendering for chakram projectiles (spinning disc)
 */
export default class ChakramProjectile {
  /**
   * Draw chakram projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Outer ring (sharp edge)
    graphics.lineStyle(2, 0xc0c0c0, 1);
    graphics.strokeCircle(0, 0, 8);
    
    // Inner ring
    graphics.lineStyle(1.5, 0x808080, 1);
    graphics.strokeCircle(0, 0, 5);
    
    // Center hub
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 0, 3);
    
    // Spokes (4 directions)
    graphics.lineStyle(1.5, 0x808080, 1);
    graphics.lineBetween(0, -5, 0, -8);
    graphics.lineBetween(0, 5, 0, 8);
    graphics.lineBetween(-5, 0, -8, 0);
    graphics.lineBetween(5, 0, 8, 0);
    
    // Center gem
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(0, 0, 1.5);
  }
  
  /**
   * Check if this projectile should rotate to face direction
   * @returns {boolean} True if should rotate
   */
  static shouldRotate() {
    return false; // Spins on its own axis
  }
  
  /**
   * Get rotation speed for spinning projectiles
   * @returns {number} Rotation speed in radians per second
   */
  static getRotationSpeed() {
    return 8; // Fast spinning disc
  }
}
