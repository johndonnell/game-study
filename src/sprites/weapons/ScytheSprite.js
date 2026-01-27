/**
 * ScytheSprite
 * Handles sprite creation for Scythe weapons
 */
export default class ScytheSprite {
  /**
   * Create scythe sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the scythe
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Long wooden staff
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, -15, 4, 40);
    
    // Grip area
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 8, 4, 10);
    
    // Curved blade (large, menacing) - using polygon approximation
    graphics.fillStyle(0x808080, 1);
    graphics.beginPath();
    graphics.moveTo(2, -15);
    graphics.lineTo(10, -18);
    graphics.lineTo(16, -16);
    graphics.lineTo(20, -10);
    graphics.lineTo(18, -8);
    graphics.lineTo(12, -12);
    graphics.lineTo(6, -14);
    graphics.lineTo(2, -12);
    graphics.closePath();
    graphics.fillPath();
    
    // Blade shine
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.beginPath();
    graphics.moveTo(2, -15);
    graphics.lineTo(8, -17);
    graphics.lineTo(14, -14);
    graphics.lineTo(16, -11);
    graphics.lineTo(15, -10);
    graphics.lineTo(10, -13);
    graphics.lineTo(5, -14);
    graphics.lineTo(2, -13);
    graphics.closePath();
    graphics.fillPath();
    
    // Blade edge (darker)
    graphics.lineStyle(1, 0x404040, 1);
    graphics.beginPath();
    graphics.moveTo(2, -15);
    graphics.lineTo(10, -18);
    graphics.lineTo(16, -16);
    graphics.lineTo(20, -10);
    graphics.strokePath();
    
    // Metal connector
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-2, -15, 4, 5);
    
    // Butt cap
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 25, 2.5);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 45;
  }
}
