/**
 * CaveBackground
 * Renders the dark cave background (Rounds 6-10, when trolls appear)
 */
export default class CaveBackground {
  /**
   * Render cave background
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   * @param {number} width - Screen width
   * @param {number} height - Screen height
   */
  static render(graphics, width, height) {
    // Dark cave floor (dark gray/brown)
    graphics.fillStyle(0x3a3a3a, 1);
    graphics.fillRect(0, 0, width, height);

    // Cave walls (darker, rough edges)
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(0, 0, width, 40); // Top wall
    graphics.fillRect(0, height - 40, width, 40); // Bottom wall
    graphics.fillRect(0, 0, 40, height); // Left wall
    graphics.fillRect(width - 40, 0, 40, height); // Right wall

    // Rocky texture (random dark spots)
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(15, 40);
      
      graphics.fillStyle(0x2d2d2d, 0.6);
      graphics.fillCircle(x, y, size);
    }

    // Stalactites (hanging from ceiling)
    graphics.fillStyle(0x4a4a4a, 1);
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = 40;
      const stalHeight = Phaser.Math.Between(20, 50);
      
      graphics.beginPath();
      graphics.moveTo(x, y);
      graphics.lineTo(x - 10, y);
      graphics.lineTo(x - 5, y + stalHeight);
      graphics.closePath();
      graphics.fillPath();
    }

    // Stalagmites (rising from floor)
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = height - 40;
      const stalagHeight = Phaser.Math.Between(20, 50);
      
      graphics.beginPath();
      graphics.moveTo(x, y);
      graphics.lineTo(x - 10, y);
      graphics.lineTo(x - 5, y - stalagHeight);
      graphics.closePath();
      graphics.fillPath();
    }

    // Glowing crystals (blue/purple glow)
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      
      graphics.fillStyle(0x6a5acd, 0.4);
      graphics.fillCircle(x, y, 20);
      graphics.fillStyle(0x9370db, 0.8);
      graphics.fillCircle(x, y, 10);
      graphics.fillStyle(0xba55d3, 1);
      graphics.fillCircle(x, y, 5);
    }
  }
}
