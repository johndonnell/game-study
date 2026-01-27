/**
 * RockProjectile sprite module
 * Renders a large boulder projectile for troll ranged attacks
 */

const RockProjectile = {
  /**
   * Draw rock projectile
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  draw(graphics) {
    // Large boulder (gray/brown stone)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 0, 12); // Large size for troll strength
    
    // Rock texture details (darker spots)
    graphics.fillStyle(0x606060, 1);
    graphics.fillCircle(-4, -3, 3);
    graphics.fillCircle(3, 2, 2);
    graphics.fillCircle(-2, 4, 2);
    
    // Lighter highlights
    graphics.fillStyle(0xa0a0a0, 1);
    graphics.fillCircle(-5, -5, 2);
    graphics.fillCircle(4, -2, 2);
    
    // Brown dirt/moss patches
    graphics.fillStyle(0x8b4513, 0.6);
    graphics.fillCircle(2, -4, 2);
    graphics.fillCircle(-3, 3, 2);
  },

  /**
   * Check if projectile should rotate
   * @returns {boolean} True if projectile should rotate
   */
  shouldRotate() {
    return true; // Rocks tumble as they fly
  },

  /**
   * Get rotation speed in radians per second
   * @returns {number} Rotation speed
   */
  getRotationSpeed() {
    return Math.PI * 1.5; // Slow tumbling (0.75 rotations per second)
  }
};

export default RockProjectile;
