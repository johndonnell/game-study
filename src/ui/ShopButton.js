/**
 * ShopButton
 * Reusable button component with hover effects for shop scene
 */
export default class ShopButton {
  /**
   * Create an interactive button with hover effects
   * @param {Phaser.Scene} scene - The scene to add button to
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   * @param {number} width - Button width
   * @param {number} height - Button height
   * @param {string} text - Button text
   * @param {Function} onClick - Click handler function
   * @param {Object} style - Button style configuration
   * @returns {Object} Object containing {button, text} references
   */
  static create(scene, x, y, width, height, text, onClick, style = {}) {
    const {
      bgColor = 0x0f3460,
      bgColorHover = 0x16213e,
      borderColor = 0xffff00,
      borderWidth = 3,
      textColor = '#ffff00',
      font = 'bold 18px monospace',
      strokeColor = '#000000',
      strokeThickness = 3,
      hoverScale = 1.05
    } = style;
    
    // Create button background
    const button = scene.add.rectangle(x, y, width, height, bgColor);
    button.setStrokeStyle(borderWidth, borderColor);
    button.setInteractive({ useHandCursor: true });
    
    // Create button text
    const buttonText = scene.add.text(x, y, text, {
      font,
      fill: textColor,
      stroke: strokeColor,
      strokeThickness
    }).setOrigin(0.5);
    
    // Add hover effects
    button.on('pointerover', () => {
      button.setFillStyle(bgColorHover);
      button.setScale(hoverScale);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(bgColor);
      button.setScale(1);
    });
    
    button.on('pointerdown', onClick);
    
    return { button, text: buttonText };
  }
  
  /**
   * Create a refresh button with standard styling
   * @param {Phaser.Scene} scene - The scene to add button to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Function} onClick - Click handler
   * @param {Object} theme - Theme configuration
   * @returns {Object} Object containing {button, text} references
   */
  static createRefreshButton(scene, x, y, onClick, theme) {
    return this.create(
      scene,
      x,
      y,
      220,
      45,
      '🔄 REFRESH (50g)',
      onClick,
      {
        bgColor: theme.colors.refreshBg,
        bgColorHover: theme.colors.refreshBgHover,
        borderColor: theme.colors.refreshBorder,
        textColor: theme.colors.refreshText,
        font: theme.fonts.refreshButton,
        strokeColor: theme.stroke.button.color,
        strokeThickness: theme.stroke.button.thickness,
        hoverScale: theme.hover.scale
      }
    );
  }
  
  /**
   * Create a continue button with standard styling
   * @param {Phaser.Scene} scene - The scene to add button to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Button text
   * @param {Function} onClick - Click handler
   * @param {Object} theme - Theme configuration
   * @returns {Object} Object containing {button, text} references
   */
  static createContinueButton(scene, x, y, text, onClick, theme) {
    return this.create(
      scene,
      x,
      y,
      280,
      50,
      text,
      onClick,
      {
        bgColor: theme.colors.continueBg,
        bgColorHover: theme.colors.continueBgHover,
        borderColor: theme.colors.continueBorder,
        textColor: theme.colors.continueText,
        font: theme.fonts.continueButton,
        strokeColor: theme.stroke.continueButton.color,
        strokeThickness: theme.stroke.continueButton.thickness,
        hoverScale: theme.hover.scale
      }
    );
  }
}
