/**
 * GauntletsSprite
 * Handles sprite creation for Gauntlets weapons
 */
export default class GauntletsSprite {
  /**
   * Create gauntlets sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the gauntlets
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Fist shape (metal gauntlet)
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(-6, -8, 12, 10);
    
    // Knuckles (spiked)
    graphics.fillStyle(0x606060, 1);
    graphics.fillRect(-5, -8, 3, 3);
    graphics.fillRect(-1, -8, 3, 3);
    graphics.fillRect(3, -8, 3, 3);
    
    // Spikes on knuckles
    graphics.fillStyle(0x404040, 1);
    graphics.fillTriangle(-4, -8, -3, -8, -3.5, -11);
    graphics.fillTriangle(0, -8, 1, -8, 0.5, -11);
    graphics.fillTriangle(4, -8, 5, -8, 4.5, -11);
    
    // Wrist guard (armored)
    graphics.fillStyle(0x707070, 1);
    graphics.fillRect(-7, 2, 14, 8);
    
    // Wrist guard plates
    graphics.fillStyle(0x909090, 1);
    graphics.fillRect(-7, 2, 14, 2);
    graphics.fillRect(-7, 6, 14, 2);
    
    // Leather straps
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-7, 4, 14, 1);
    graphics.fillRect(-7, 8, 14, 1);
    
    // Metal studs
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(-5, 4, 1);
    graphics.fillCircle(0, 4, 1);
    graphics.fillCircle(5, 4, 1);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 20;
  }
}
