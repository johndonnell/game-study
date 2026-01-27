/**
 * RapierSprite
 * Handles sprite creation for Rapier weapons
 */
export default class RapierSprite {
  /**
   * Create rapier sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the rapier
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Thin blade (silver, very narrow)
    graphics.fillStyle(0xc0c0c0, 1);
    graphics.fillRect(-1, -28, 2, 32);
    
    // Blade tip (sharp point)
    graphics.fillTriangle(-1, -28, 1, -28, 0, -32);
    
    // Blade shine
    graphics.fillStyle(0xe0e0e0, 1);
    graphics.fillRect(-0.3, -28, 0.6, 30);
    
    // Complex guard (swept hilt)
    graphics.lineStyle(2, 0xffd700, 1);
    // Main guard bar
    graphics.lineBetween(-6, 4, 6, 4);
    // Curved guards
    graphics.beginPath();
    graphics.arc(0, 4, 5, Math.PI, 0);
    graphics.strokePath();
    graphics.beginPath();
    graphics.arc(0, 4, 3, 0, Math.PI);
    graphics.strokePath();
    
    // Guard center
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 4, 2);
    
    // Handle (thin, wrapped)
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-1.5, 6, 3, 12);
    
    // Handle wire wrap
    graphics.lineStyle(0.5, 0xffd700, 1);
    for (let i = 0; i < 6; i++) {
      graphics.lineBetween(-1.5, 7 + i * 2, 1.5, 7 + i * 2);
    }
    
    // Pommel (small, ornate)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(0, 19, 2);
    
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
