/**
 * ChakramSprite
 * Handles sprite creation for Chakram weapons (throwing disc)
 */
export default class ChakramSprite {
  /**
   * Create chakram sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the chakram
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Outer ring (sharp edge)
    graphics.lineStyle(3, 0xc0c0c0, 1);
    graphics.strokeCircle(0, 0, 12);
    
    // Inner ring
    graphics.lineStyle(2, 0x808080, 1);
    graphics.strokeCircle(0, 0, 8);
    
    // Center hub
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 0, 4);
    
    // Spokes (4 directions)
    graphics.lineStyle(2, 0x808080, 1);
    graphics.lineBetween(0, -8, 0, -12);
    graphics.lineBetween(0, 8, 0, 12);
    graphics.lineBetween(-8, 0, -12, 0);
    graphics.lineBetween(8, 0, 12, 0);
    
    // Diagonal spokes
    graphics.lineBetween(-6, -6, -9, -9);
    graphics.lineBetween(6, -6, 9, -9);
    graphics.lineBetween(-6, 6, -9, 9);
    graphics.lineBetween(6, 6, 9, 9);
    
    // Sharp edge highlights (to show it's a blade)
    graphics.lineStyle(1, 0xe0e0e0, 1);
    graphics.beginPath();
    graphics.arc(0, 0, 12, -Math.PI / 4, Math.PI / 4);
    graphics.strokePath();
    
    // Center gem
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(0, 0, 2);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 35;
  }
}
