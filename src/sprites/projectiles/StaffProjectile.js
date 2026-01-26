/**
 * StaffProjectile
 * Bright glowing blue ball with lightning bolts
 */
export default class StaffProjectile {
  /**
   * Draw staff projectile (glowing blue ball with lightning)
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Outer glow (light blue, semi-transparent)
    graphics.fillStyle(0x00bfff, 0.3);
    graphics.fillCircle(0, 0, 8);
    
    // Middle glow (brighter blue)
    graphics.fillStyle(0x1e90ff, 0.6);
    graphics.fillCircle(0, 0, 6);
    
    // Core (bright electric blue)
    graphics.fillStyle(0x00ffff, 1);
    graphics.fillCircle(0, 0, 4);
    
    // Inner bright spot (white)
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(0, 0, 2);
    
    // Lightning bolts (4 random bolts emanating from center)
    graphics.lineStyle(1, 0xffffff, 0.9);
    
    // Bolt 1 (top-right)
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(4, -6);
    graphics.lineTo(6, -4);
    graphics.lineTo(8, -8);
    graphics.strokePath();
    
    // Bolt 2 (bottom-right)
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(5, 5);
    graphics.lineTo(7, 3);
    graphics.lineTo(9, 7);
    graphics.strokePath();
    
    // Bolt 3 (left)
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(-6, -2);
    graphics.lineTo(-4, -4);
    graphics.lineTo(-8, -5);
    graphics.strokePath();
    
    // Bolt 4 (bottom-left)
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(-4, 6);
    graphics.lineTo(-6, 4);
    graphics.lineTo(-7, 8);
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
    return 8; // Spin the lightning bolts for dynamic effect
  }
}
