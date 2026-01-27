/**
 * GreatswordSprite
 * Handles sprite creation for Greatsword weapons
 */
export default class GreatswordSprite {
  /**
   * Create greatsword sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the greatsword
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Blade (large silver blade)
    graphics.fillStyle(0xc0c0c0, 1); // Silver
    graphics.fillRect(-4, -35, 8, 40);
    
    // Blade edge highlight
    graphics.fillStyle(0xe8e8e8, 1); // Lighter silver
    graphics.fillRect(-3, -35, 2, 40);
    
    // Blade tip (pointed)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.beginPath();
    graphics.moveTo(-4, -35);
    graphics.lineTo(0, -45);
    graphics.lineTo(4, -35);
    graphics.closePath();
    graphics.fillPath();
    
    // Cross guard (gold)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(-10, 5, 20, 3);
    
    // Grip (brown leather)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, 8, 4, 12);
    
    // Grip wrapping (darker brown)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 10, 4, 1);
    graphics.fillRect(-2, 13, 4, 1);
    graphics.fillRect(-2, 16, 4, 1);
    
    // Pommel (gold)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 22, 3);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 45; // Further out from player due to large size
  }
}
