/**
 * ArenaBackground
 * Renders the classic arena background (Rounds 1-5)
 */
export default class ArenaBackground {
  /**
   * Render arena background
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   * @param {number} width - Screen width
   * @param {number} height - Screen height
   */
  static render(graphics, width, height) {
    // Base arena floor (sandy/stone color)
    graphics.fillStyle(0xd4c4a8, 1); // Light tan/sand color
    graphics.fillRect(0, 0, width, height);

    // Arena border (darker stone)
    graphics.lineStyle(20, 0x8b7355, 1);
    graphics.strokeRect(10, 10, width - 20, height - 20);

    // Inner border detail
    graphics.lineStyle(4, 0xa0826d, 1);
    graphics.strokeRect(25, 25, width - 50, height - 50);

    // Create stone tile pattern
    graphics.lineStyle(1, 0xc0b090, 0.3);
    const tileSize = 50;
    
    // Vertical lines
    for (let x = tileSize; x < width; x += tileSize) {
      graphics.lineBetween(x, 0, x, height);
    }
    
    // Horizontal lines
    for (let y = tileSize; y < height; y += tileSize) {
      graphics.lineBetween(0, y, width, y);
    }

    // Add some battle wear marks (darker spots)
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(10, 30);
      
      graphics.fillStyle(0xb0a080, 0.4);
      graphics.fillCircle(x, y, size);
    }

    // Corner pillars/markers
    const pillarColor = 0x6b5d4f;
    const pillarSize = 15;
    
    // Top-left
    graphics.fillStyle(pillarColor, 1);
    graphics.fillCircle(40, 40, pillarSize);
    
    // Top-right
    graphics.fillCircle(width - 40, 40, pillarSize);
    
    // Bottom-left
    graphics.fillCircle(40, height - 40, pillarSize);
    
    // Bottom-right
    graphics.fillCircle(width - 40, height - 40, pillarSize);

    // Center arena circle (combat zone marker)
    graphics.lineStyle(3, 0x9b8b6f, 0.5);
    const centerX = width / 2;
    const centerY = height / 2;
    const circleRadius = Math.min(width, height) * 0.35;
    graphics.strokeCircle(centerX, centerY, circleRadius);
    
    // Inner circle
    graphics.lineStyle(2, 0x9b8b6f, 0.3);
    graphics.strokeCircle(centerX, centerY, circleRadius * 0.7);
  }
}
