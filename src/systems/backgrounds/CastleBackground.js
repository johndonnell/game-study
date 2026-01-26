/**
 * CastleBackground
 * Renders the medieval castle background (Rounds 16-20, when dragons appear)
 */
export default class CastleBackground {
  /**
   * Render castle background
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   * @param {number} width - Screen width
   * @param {number} height - Screen height
   */
  static render(graphics, width, height) {
    // Castle stone floor (gray stone)
    graphics.fillStyle(0x696969, 1);
    graphics.fillRect(0, 0, width, height);

    // Stone brick pattern
    graphics.lineStyle(2, 0x505050, 1);
    const brickWidth = 80;
    const brickHeight = 40;
    
    for (let y = 0; y < height; y += brickHeight) {
      for (let x = 0; x < width; x += brickWidth) {
        // Offset every other row
        const offsetX = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
        graphics.strokeRect(x + offsetX, y, brickWidth, brickHeight);
      }
    }

    // Castle walls (darker stone)
    graphics.fillStyle(0x4a4a4a, 1);
    graphics.fillRect(0, 0, width, 50); // Top wall
    graphics.fillRect(0, height - 50, width, 50); // Bottom wall
    graphics.fillRect(0, 0, 50, height); // Left wall
    graphics.fillRect(width - 50, 0, 50, height); // Right wall

    // Battlements (crenellations on top wall)
    graphics.fillStyle(0x5a5a5a, 1);
    for (let x = 60; x < width - 60; x += 60) {
      graphics.fillRect(x, 0, 30, 30);
    }

    // Torches on walls (glowing)
    const torchPositions = [
      { x: 100, y: 50 },
      { x: width - 100, y: 50 },
      { x: 100, y: height - 50 },
      { x: width - 100, y: height - 50 }
    ];

    torchPositions.forEach(pos => {
      // Torch holder (metal)
      graphics.fillStyle(0x2f4f4f, 1);
      graphics.fillRect(pos.x - 5, pos.y - 10, 10, 20);
      
      // Flame glow
      graphics.fillStyle(0xffa500, 0.4);
      graphics.fillCircle(pos.x, pos.y - 15, 20);
      graphics.fillStyle(0xff8c00, 0.7);
      graphics.fillCircle(pos.x, pos.y - 15, 12);
      graphics.fillStyle(0xffd700, 1);
      graphics.fillCircle(pos.x, pos.y - 15, 6);
    });

    // Banners/flags on walls
    graphics.fillStyle(0x8b0000, 1);
    graphics.fillRect(width / 2 - 30, 50, 60, 80);
    
    // Banner emblem (simple cross)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(width / 2 - 15, 70, 30, 10);
    graphics.fillRect(width / 2 - 5, 60, 10, 30);

    // Castle floor cracks (wear and tear)
    graphics.lineStyle(2, 0x505050, 0.5);
    for (let i = 0; i < 15; i++) {
      const startX = Phaser.Math.Between(100, width - 100);
      const startY = Phaser.Math.Between(100, height - 100);
      const endX = startX + Phaser.Math.Between(-50, 50);
      const endY = startY + Phaser.Math.Between(-50, 50);
      
      graphics.lineBetween(startX, startY, endX, endY);
    }
  }
}
