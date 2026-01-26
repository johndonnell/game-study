/**
 * StaffProjectile
 * Bright glowing blue ball with lightning bolts (Chrome-optimized)
 */
export default class StaffProjectile {
  /**
   * Draw staff projectile (glowing blue ball with simplified lightning)
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Solid outer glow (no alpha - Chrome optimization)
    graphics.fillStyle(0x4da6ff, 1); // Lighter blue instead of transparent
    graphics.fillCircle(0, 0, 6);
    
    // Core (bright electric blue)
    graphics.fillStyle(0x00ffff, 1);
    graphics.fillCircle(0, 0, 4);
    
    // Inner bright spot (white)
    graphics.fillStyle(0xffffff, 1); // Solid white instead of 0.9 alpha
    graphics.fillCircle(0, 0, 2);
    
    // Simplified lightning bolts (solid lines - no alpha)
    graphics.lineStyle(1.5, 0xffffff, 1); // Solid instead of 0.8 alpha
    
    // Bolt 1 (diagonal)
    graphics.beginPath();
    graphics.moveTo(-5, -5);
    graphics.lineTo(5, 5);
    graphics.strokePath();
    
    // Bolt 2 (opposite diagonal)
    graphics.beginPath();
    graphics.moveTo(-5, 5);
    graphics.lineTo(5, -5);
    graphics.strokePath();
  }
  
  /**
   * Should this projectile rotate to face direction of travel?
   * @returns {boolean}
   */
  static shouldRotate() {
    return false; // Ball doesn't need to rotate to face direction
  }
  
  /**
   * Get rotation speed for spinning projectiles
   * @returns {number} Rotation speed in radians per second
   */
  static getRotationSpeed() {
    return 6; // Moderate spin for dynamic effect
  }
}
