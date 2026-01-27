/**
 * WandSprite
 * Handles sprite creation for Wand weapons
 */
export default class WandSprite {
  /**
   * Create wand sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the wand
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Wand handle (brown wood)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(-2, -20, 4, 25);
    
    // Wand tip (ornate)
    graphics.fillStyle(0xffd700, 1); // Gold
    graphics.fillCircle(0, -22, 3);
    
    // Magical crystal (glowing blue)
    graphics.fillStyle(0x60a5fa, 1);
    graphics.fillCircle(0, -22, 2);
    
    // Glow effect
    graphics.fillStyle(0x93c5fd, 0.5);
    graphics.fillCircle(0, -22, 4);
    
    // Decorative bands
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(-2, -15, 4, 1);
    graphics.fillRect(-2, -10, 4, 1);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 40; // Further out from player
  }
}
