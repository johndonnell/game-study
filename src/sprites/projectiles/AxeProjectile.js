/**
 * AxeProjectile sprite module
 * Renders a throwing axe projectile for orc ranged attacks
 */

const AxeProjectile = {
  /**
   * Draw axe projectile
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  draw(graphics) {
    // Axe handle (brown wooden shaft)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, -8, 4, 16);
    
    // Axe blade (metallic gray double-bladed)
    graphics.fillStyle(0x808080, 1);
    
    // Left blade
    graphics.beginPath();
    graphics.moveTo(-2, -8);
    graphics.lineTo(-10, -6);
    graphics.lineTo(-10, -2);
    graphics.lineTo(-2, -4);
    graphics.closePath();
    graphics.fillPath();
    
    // Right blade
    graphics.beginPath();
    graphics.moveTo(2, -8);
    graphics.lineTo(10, -6);
    graphics.lineTo(10, -2);
    graphics.lineTo(2, -4);
    graphics.closePath();
    graphics.fillPath();
    
    // Blade highlights (lighter gray for metallic shine)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillRect(-8, -7, 2, 2);
    graphics.fillRect(6, -7, 2, 2);
    
    // Handle grip (darker brown)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 0, 4, 2);
    graphics.fillRect(-2, 4, 4, 2);
  },

  /**
   * Check if projectile should rotate
   * @returns {boolean} True if projectile should rotate
   */
  shouldRotate() {
    return true; // Axes spin as they fly
  },

  /**
   * Get rotation speed in radians per second
   * @returns {number} Rotation speed
   */
  getRotationSpeed() {
    return Math.PI * 4; // Fast spinning axe (2 full rotations per second)
  }
};

export default AxeProjectile;
