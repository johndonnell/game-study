/**
 * AxeSprite
 * Handles sprite creation for Axe weapons
 */
export default class AxeSprite {
  /**
   * Create axe sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the axe
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Wooden handle
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, -5, 4, 25);
    
    // Leather grip
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 8, 4, 8);
    
    // Axe blade (single-sided, gray metal)
    graphics.fillStyle(0x708090, 1);
    graphics.fillTriangle(2, -5, 15, -8, 2, 2);
    
    // Blade shine
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillTriangle(2, -5, 12, -7, 2, 0);
    
    // Axe head back (connecting to handle)
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-2, -5, 4, 7);
    
    // Pommel
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 20, 2.5);
    
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
