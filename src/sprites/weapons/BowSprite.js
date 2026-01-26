/**
 * BowSprite
 * Handles sprite creation for Bow weapons
 */
export default class BowSprite {
  /**
   * Create bow sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the bow
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Bow is a curved weapon with string
    const centerX = 0;
    const centerY = 0;
    
    // Bow limbs (curved wood - brown)
    graphics.lineStyle(3, 0x8b4513, 1);
    
    // Upper limb (curved using arc)
    graphics.beginPath();
    graphics.moveTo(centerX, centerY - 15);
    graphics.lineTo(centerX + 4, centerY - 10);
    graphics.lineTo(centerX + 6, centerY - 5);
    graphics.lineTo(centerX + 6, centerY);
    graphics.strokePath();
    
    // Lower limb (curved using arc)
    graphics.beginPath();
    graphics.moveTo(centerX, centerY + 15);
    graphics.lineTo(centerX + 4, centerY + 10);
    graphics.lineTo(centerX + 6, centerY + 5);
    graphics.lineTo(centerX + 6, centerY);
    graphics.strokePath();
    
    // Grip (darker brown, thicker)
    graphics.lineStyle(4, 0x654321, 1);
    graphics.beginPath();
    graphics.moveTo(centerX + 6, centerY - 3);
    graphics.lineTo(centerX + 6, centerY + 3);
    graphics.strokePath();
    
    // Bowstring (light grey/white)
    graphics.lineStyle(1, 0xcccccc, 1);
    graphics.beginPath();
    graphics.moveTo(centerX, centerY - 15);
    graphics.lineTo(centerX, centerY + 15);
    graphics.strokePath();
    
    // String nocking point (small indicator)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(centerX, centerY, 1);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 40; // Medium distance for bow
  }
}
