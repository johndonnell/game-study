/**
 * HellBackground
 * Renders the hellish background (Rounds 11-15, when demons appear)
 */
export default class HellBackground {
  /**
   * Render hell background
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   * @param {number} width - Screen width
   * @param {number} height - Screen height
   */
  static render(graphics, width, height) {
    // Hellish red/orange gradient floor
    graphics.fillStyle(0x8b0000, 1); // Dark red
    graphics.fillRect(0, 0, width, height);

    // Lava cracks pattern
    graphics.lineStyle(3, 0xff4500, 1);
    for (let i = 0; i < 20; i++) {
      const startX = Phaser.Math.Between(0, width);
      const startY = Phaser.Math.Between(0, height);
      const endX = startX + Phaser.Math.Between(-100, 100);
      const endY = startY + Phaser.Math.Between(-100, 100);
      
      graphics.lineBetween(startX, startY, endX, endY);
    }

    // Glowing lava pools
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      const size = Phaser.Math.Between(30, 60);
      
      // Outer glow
      graphics.fillStyle(0xff4500, 0.3);
      graphics.fillCircle(x, y, size);
      // Middle glow
      graphics.fillStyle(0xff6347, 0.6);
      graphics.fillCircle(x, y, size * 0.7);
      // Bright center
      graphics.fillStyle(0xffa500, 1);
      graphics.fillCircle(x, y, size * 0.4);
    }

    // Burning embers/particles effect (static)
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(2, 5);
      
      graphics.fillStyle(0xffd700, 0.8);
      graphics.fillCircle(x, y, size);
    }

    // Hellish border (dark red/black)
    graphics.lineStyle(15, 0x4a0000, 1);
    graphics.strokeRect(10, 10, width - 20, height - 20);

    // Inner border with fire glow
    graphics.lineStyle(5, 0xff4500, 0.8);
    graphics.strokeRect(25, 25, width - 50, height - 50);
  }
}
