/**
 * FlailSprite
 * Handles sprite creation for Flail weapons
 */
export default class FlailSprite {
  /**
   * Create flail sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the flail
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Wooden handle
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 5, 4, 20);
    
    // Leather grip
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 12, 4, 8);
    
    // Chain (multiple links)
    graphics.lineStyle(2, 0x404040, 1);
    graphics.lineBetween(0, 5, -3, 0);
    graphics.lineBetween(-3, 0, -6, -5);
    graphics.lineBetween(-6, -5, -8, -10);
    
    // Chain links (small circles)
    graphics.fillStyle(0x606060, 1);
    graphics.fillCircle(0, 5, 1.5);
    graphics.fillCircle(-3, 0, 1.5);
    graphics.fillCircle(-6, -5, 1.5);
    
    // Spiked ball at end
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(-8, -15, 6);
    
    // Spikes on ball
    graphics.fillStyle(0x606060, 1);
    graphics.fillTriangle(-9, -15, -7, -15, -8, -20); // Top
    graphics.fillTriangle(-9, -15, -7, -15, -8, -10); // Bottom
    graphics.fillTriangle(-14, -16, -14, -14, -18, -15); // Left
    graphics.fillTriangle(-2, -16, -2, -14, 2, -15);   // Right
    
    // Pommel
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 25, 2.5);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 40;
  }
}
