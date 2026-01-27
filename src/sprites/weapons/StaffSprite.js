/**
 * StaffSprite
 * Handles sprite creation for Staff weapons
 */
export default class StaffSprite {
  /**
   * Create staff sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the staff
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Long wooden staff
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-3, -25, 6, 50);
    
    // Wood grain texture
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, -25, 4, 50);
    
    // Ornate top (magical crystal holder)
    graphics.fillStyle(0xffd700, 1);
    // Left prong
    graphics.fillTriangle(-3, -25, -6, -30, -3, -28);
    // Right prong
    graphics.fillTriangle(3, -25, 6, -30, 3, -28);
    // Center mount
    graphics.fillRect(-2, -28, 4, 3);
    
    // Large magical crystal
    graphics.fillStyle(0x9333ea, 1); // Purple crystal
    graphics.fillCircle(0, -32, 5);
    
    // Crystal shine
    graphics.fillStyle(0xc084fc, 0.8);
    graphics.fillCircle(-1, -33, 2);
    
    // Crystal glow
    graphics.fillStyle(0xd8b4fe, 0.4);
    graphics.fillCircle(0, -32, 7);
    
    // Grip wrapping (leather)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-3, 8, 6, 12);
    
    // Metal bands
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(-3, -15, 6, 2);
    graphics.fillRect(-3, 0, 6, 2);
    graphics.fillRect(-3, 20, 6, 2);
    
    // Butt cap (metal)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 25, 3.5);
    
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
