/**
 * StaffProjectile
 * Bright glowing blue ball with lightning bolts (optimized for performance)
 */
export default class StaffProjectile {
  /**
   * Draw staff projectile (glowing blue ball with simplified lightning)
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Outer glow (light blue, semi-transparent)
    graphics.fillStyle(0x00bfff, 0.3);
    graphics.fillCircle(0, 0, 7);
    
    // Core (bright electric blue)
    graphics.fillStyle(0x00ffff, 1);
    graphics.fillCircle(0, 0, 4);
    
    // Inner bright spot (white)
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillCircle(0, 0, 2);
    
    // Simplified lightning bolts (2 simple lines instead of 4 complex paths)
    graphics.lineStyle(1.5, 0xffffff, 0.8);
    
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
