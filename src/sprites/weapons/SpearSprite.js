/**
 * SpearSprite
 * Handles sprite creation for Spear weapons
 */
export default class SpearSprite {
  /**
   * Create spear sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the spear
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Long wooden shaft
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, -10, 4, 35);
    
    // Spearhead outline (dark border)
    graphics.lineStyle(2, 0x000000, 1);
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.beginPath();
    graphics.moveTo(-4, -25);
    graphics.lineTo(4, -25);
    graphics.lineTo(0, -38);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    
    // Spearhead shine (brighter center)
    graphics.fillStyle(0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(-2, -25);
    graphics.lineTo(2, -25);
    graphics.lineTo(0, -35);
    graphics.closePath();
    graphics.fillPath();
    
    // Spearhead socket (dark metal with outline)
    graphics.fillStyle(0x404040, 1);
    graphics.lineStyle(1, 0x000000, 1);
    graphics.fillRect(-2, -10, 4, 5);
    graphics.strokeRect(-2, -10, 4, 5);
    
    // Grip wrapping (leather)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 8, 4, 10);
    
    // Butt spike (metal end with outline)
    graphics.lineStyle(1, 0x000000, 1);
    graphics.fillStyle(0x808080, 1);
    graphics.beginPath();
    graphics.moveTo(-2, 25);
    graphics.lineTo(2, 25);
    graphics.lineTo(0, 28);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    
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
