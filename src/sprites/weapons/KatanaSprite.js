/**
 * KatanaSprite
 * Handles sprite creation for Katana weapons
 */
export default class KatanaSprite {
  /**
   * Create katana sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the katana
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Curved blade (traditional katana curve - sori)
    // Draw the blade with a slight curve
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.beginPath();
    graphics.moveTo(-1.5, -30);
    graphics.lineTo(1.5, -30);
    graphics.lineTo(2, -25);
    graphics.lineTo(2.5, -15);
    graphics.lineTo(2.5, 0);
    graphics.lineTo(2, 5);
    graphics.lineTo(-2, 5);
    graphics.lineTo(-2.5, 0);
    graphics.lineTo(-2.5, -15);
    graphics.lineTo(-2, -25);
    graphics.closePath();
    graphics.fillPath();
    
    // Blade tip (kissaki - angled point characteristic of katana)
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.beginPath();
    graphics.moveTo(-1.5, -30);
    graphics.lineTo(1, -33);
    graphics.lineTo(1.5, -30);
    graphics.closePath();
    graphics.fillPath();
    
    // Hamon (temper line - wavy pattern along blade)
    graphics.lineStyle(0.5, 0xffffff, 0.6);
    graphics.beginPath();
    graphics.moveTo(-1, 3);
    graphics.lineTo(-0.8, -5);
    graphics.lineTo(-1, -10);
    graphics.lineTo(-0.5, -15);
    graphics.lineTo(-1, -20);
    graphics.lineTo(-0.5, -25);
    graphics.lineTo(0, -28);
    graphics.strokePath();
    
    // Blade shine (shinogi - ridge line)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, -30, 0.8, 33);
    
    // Habaki (blade collar - brass/gold)
    graphics.fillStyle(0xd4af37, 1);
    graphics.fillRect(-2.5, 3, 5, 3);
    
    // Tsuba (hand guard - square with rounded corners, traditional style)
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRoundedRect(-5, 6, 10, 6, 1);
    
    // Tsuba decoration (traditional pattern)
    graphics.lineStyle(0.5, 0xd4af37, 1);
    graphics.strokeCircle(0, 9, 2);
    graphics.lineBetween(-3, 9, 3, 9);
    graphics.lineBetween(0, 6.5, 0, 11.5);
    
    // Tsuka (handle - wrapped in black silk/leather)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(-2.5, 12, 5, 12);
    
    // Tsuka-ito (handle wrapping - diamond pattern)
    graphics.lineStyle(1, 0x8b0000, 1); // Dark red wrapping
    for (let i = 0; i < 4; i++) {
      const y = 14 + i * 3;
      graphics.lineBetween(-2.5, y, 2.5, y + 2);
      graphics.lineBetween(2.5, y, -2.5, y + 2);
    }
    
    // Menuki (handle ornaments - small gold details)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(-1, 16, 0.8);
    graphics.fillCircle(1, 20, 0.8);
    
    // Kashira (pommel - metal cap)
    graphics.fillStyle(0x404040, 1);
    graphics.fillRect(-2.5, 24, 5, 2);
    graphics.fillStyle(0xd4af37, 1);
    graphics.fillRect(-2, 24.5, 4, 1);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 38;
  }
}
