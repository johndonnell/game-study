/**
 * CrossbowSprite
 * Handles sprite creation for Crossbow weapons
 */
export default class CrossbowSprite {
  /**
   * Create crossbow sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the crossbow
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Crossbow has a horizontal bow mounted on a stock
    const centerX = 0;
    const centerY = 0;
    
    // Stock (wooden body - brown)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(centerX - 8, centerY - 2, 16, 4);
    
    // Trigger mechanism (darker brown)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(centerX - 2, centerY + 2, 3, 3);
    
    // Horizontal bow limbs (dark wood/metal)
    graphics.lineStyle(3, 0x654321, 1);
    
    // Upper limb
    graphics.beginPath();
    graphics.moveTo(centerX + 8, centerY);
    graphics.lineTo(centerX + 10, centerY - 8);
    graphics.strokePath();
    
    // Lower limb
    graphics.beginPath();
    graphics.moveTo(centerX + 8, centerY);
    graphics.lineTo(centerX + 10, centerY + 8);
    graphics.strokePath();
    
    // Bow tips (metal reinforcement)
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(centerX + 10, centerY - 8, 2);
    graphics.fillCircle(centerX + 10, centerY + 8, 2);
    
    // Bowstring (light grey)
    graphics.lineStyle(1, 0xcccccc, 1);
    graphics.beginPath();
    graphics.moveTo(centerX + 10, centerY - 8);
    graphics.lineTo(centerX + 10, centerY + 8);
    graphics.strokePath();
    
    // String attachment to stock
    graphics.lineStyle(1, 0xcccccc, 1);
    graphics.beginPath();
    graphics.moveTo(centerX + 10, centerY - 8);
    graphics.lineTo(centerX + 6, centerY);
    graphics.lineTo(centerX + 10, centerY + 8);
    graphics.strokePath();
    
    // Bolt/arrow rest (small metal piece)
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(centerX + 4, centerY - 1, 4, 2);
    
    // Grip detail (leather wrapping)
    graphics.lineStyle(1, 0x654321, 1);
    graphics.beginPath();
    graphics.moveTo(centerX - 4, centerY - 2);
    graphics.lineTo(centerX - 4, centerY + 2);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(centerX - 6, centerY - 2);
    graphics.lineTo(centerX - 6, centerY + 2);
    graphics.strokePath();
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 40; // Medium distance for crossbow
  }
}
