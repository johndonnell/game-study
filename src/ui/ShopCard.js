/**
 * ShopCard
 * Base class for rendering shop cards (weapons and items)
 */
export default class ShopCard {
  /**
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {number} x - X position (top-left)
   * @param {number} y - Y position (top-left)
   * @param {number} width - Card width
   * @param {number} height - Card height
   * @param {Object} theme - Theme configuration
   */
  constructor(scene, x, y, width, height, theme) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.elements = [];
  }
  
  /**
   * Create card background with border
   * @param {number} bgColor - Background color (hex)
   * @param {number} borderColor - Border color (hex)
   * @param {boolean} interactive - Whether card should be interactive
   * @returns {Phaser.GameObjects.Rectangle} The background rectangle
   */
  createBackground(bgColor, borderColor, interactive = false) {
    const box = this.scene.add.rectangle(
      this.x,
      this.y,
      this.width,
      this.height,
      bgColor
    );
    box.setOrigin(0, 0);
    box.setStrokeStyle(3, borderColor);
    
    if (interactive) {
      box.setInteractive({ useHandCursor: true });
    }
    
    this.elements.push(box);
    return box;
  }
  
  /**
   * Add hover effects to card background
   * @param {Phaser.GameObjects.Rectangle} box - The background rectangle
   * @param {number} borderColor - Normal border color
   */
  addHoverEffects(box, borderColor) {
    box.on('pointerover', () => {
      box.setStrokeStyle(this.theme.hover.borderWidth, this.theme.colors.hoverBorder);
      box.setScale(this.theme.hover.cardScale);
    });
    
    box.on('pointerout', () => {
      box.setStrokeStyle(3, borderColor);
      box.setScale(1);
    });
  }
  
  /**
   * Add click handler to card
   * @param {Phaser.GameObjects.Rectangle} box - The background rectangle
   * @param {Function} onClick - Click handler function
   */
  addClickHandler(box, onClick) {
    box.on('pointerdown', onClick);
  }
  
  /**
   * Add text element to card (centered horizontally by default)
   * @param {number} offsetX - X offset from card left (use width/2 for center)
   * @param {number} offsetY - Y offset from card top
   * @param {string} text - Text content
   * @param {Object} style - Phaser text style object
   * @returns {Phaser.GameObjects.Text} The text object
   */
  addText(offsetX, offsetY, text, style) {
    const textObj = this.scene.add.text(
      this.x + offsetX,
      this.y + offsetY,
      text,
      style
    ).setOrigin(0.5);
    
    this.elements.push(textObj);
    return textObj;
  }
  
  /**
   * Get center X position of card
   * @returns {number} Center X coordinate
   */
  getCenterX() {
    return this.width / 2;
  }
  
  /**
   * Get center Y position of card
   * @returns {number} Center Y coordinate
   */
  getCenterY() {
    return this.height / 2;
  }
  
  /**
   * Destroy all card elements
   */
  destroy() {
    this.elements.forEach(el => {
      if (el && el.destroy) {
        el.destroy();
      }
    });
    this.elements = [];
  }
}
