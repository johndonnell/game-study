/**
 * MaceSprite
 * Handles sprite creation for Mace weapons
 */
export default class MaceSprite {
  /**
   * Create mace sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the mace
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Wooden handle
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, 0, 4, 22);
    
    // Leather grip
    graphics.fillStyle(0x3e2723, 1);
    graphics.fillRect(-2, 10, 4, 8);
    
    // Mace head (spiked ball)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, -8, 8);
    
    // Spikes (4 directions)
    graphics.fillStyle(0x606060, 1);
    graphics.fillTriangle(-2, -8, 2, -8, 0, -14); // Top
    graphics.fillTriangle(-2, -8, 2, -8, 0, -2);  // Bottom
    graphics.fillTriangle(-8, -10, -8, -6, -14, -8); // Left
    graphics.fillTriangle(8, -10, 8, -6, 14, -8);   // Right
    
    // Mace head shine
    graphics.fillStyle(0xa0a0a0, 1);
    graphics.fillCircle(-2, -10, 3);
    
    // Pommel
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(0, 22, 2.5);
    
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
