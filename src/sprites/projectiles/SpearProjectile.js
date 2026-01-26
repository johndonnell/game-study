/**
 * SpearProjectile
 * Handles rendering for spear projectiles (GOBLIN enemy)
 */
export default class SpearProjectile {
  /**
   * Draw spear projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Spear - longer and thicker than arrow, crude goblin craftsmanship
    // Spear points to the right (will be rotated to face direction)
    
    // Spear shaft (darker wood, thicker)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-12, -2, 24, 4);
    
    // Leather grip in middle
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, -2, 6, 4);
    
    // Spear tip (crude iron - darker metal)
    graphics.fillStyle(0x5a5a5a, 1);
    graphics.fillTriangle(12, -3, 12, 3, 20, 0);
    
    // Spear tip edge (lighter grey)
    graphics.fillStyle(0x808080, 1);
    graphics.fillTriangle(12, -2, 12, 2, 18, 0);
    
    // Binding at spear tip (leather straps)
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(10, -2, 3, 1);
    graphics.fillRect(10, 1, 3, 1);
    
    // Back end (blunt)
    graphics.fillStyle(0x4a3728, 1);
    graphics.fillRect(-14, -2, 2, 4);
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
