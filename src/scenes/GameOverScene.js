import Phaser from 'phaser';
import { GAME_OVER_SCENE_THEME } from '../config/gameOverSceneTheme.js';

/**
 * GameOverScene
 * Displayed on player death
 * Professional design matching other scenes
 */
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
    this.theme = GAME_OVER_SCENE_THEME;
  }

  init(data) {
    // Receive final stats from GameManager
    this.finalRound = data.finalRound || 1;
    this.finalStats = data || {};
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Listen for resize events
    this.scale.on('resize', this.handleResize, this);

    // Screen shake effect on entry
    this.cameras.main.shake(
      this.theme.effects.screenShake.duration,
      this.theme.effects.screenShake.intensity
    );

    // Get game manager for buttons
    const gameManager = this.registry.get('gameManager');

    // Render all elements
    this.renderBackground(width, height);
    this.renderTitle(width, height);
    this.renderInfoBox(width, height);
    this.renderRoundInfo(width, height);
    this.renderMessage(width, height);
    this.renderStats(width, height);
    this.renderButtons(width, height, gameManager);
    
    // Add vignette effect
    if (this.theme.effects.vignette.enabled) {
      this.createVignette(width, height);
    }
  }

  /**
   * Render background with gradient
   */
  renderBackground(width, height) {
    const background = this.add.graphics();
    background.fillGradientStyle(
      this.theme.colors.backgroundGradientTop,
      this.theme.colors.backgroundGradientTop,
      this.theme.colors.backgroundGradientBottom,
      this.theme.colors.backgroundGradientBottom,
      1
    );
    background.fillRect(0, 0, width, height);
  }

  /**
   * Render title with decorative border and skulls
   */
  renderTitle(width, height) {
    // Title background box
    const titleBg = this.add.rectangle(
      width / 2,
      this.theme.layout.titleY,
      this.theme.layout.titleBoxWidth,
      this.theme.layout.titleBoxHeight,
      this.theme.colors.titleBg
    );
    titleBg.setStrokeStyle(this.theme.layout.titleBorderWidth, this.theme.colors.titleBorder);

    // Decorative skulls on sides
    this.createSkull(width / 2 + this.theme.layout.skullLeftX, this.theme.layout.skullY);
    this.createSkull(width / 2 + this.theme.layout.skullRightX, this.theme.layout.skullY);

    // Title shadow
    const titleShadow = this.add.text(
      width / 2 + 3,
      this.theme.layout.titleY + 3,
      'GAME OVER',
      {
        font: this.theme.fonts.title,
        fill: this.theme.colors.titleShadow
      }
    ).setOrigin(0.5);
    titleShadow.setAlpha(0.5);

    // Title text
    const title = this.add.text(
      width / 2,
      this.theme.layout.titleY,
      'GAME OVER',
      {
        font: this.theme.fonts.title,
        fill: this.theme.colors.title,
        stroke: this.theme.stroke.title.color,
        strokeThickness: this.theme.stroke.title.thickness
      }
    ).setOrigin(0.5);

    // Pulsing animation
    this.tweens.add({
      targets: title,
      scaleX: this.theme.animation.titlePulse.scale,
      scaleY: this.theme.animation.titlePulse.scale,
      duration: this.theme.animation.titlePulse.duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create decorative skull
   */
  createSkull(x, y) {
    const graphics = this.add.graphics();
    const size = this.theme.layout.skullSize;
    
    // Skull shape
    graphics.fillStyle(this.theme.colors.skullColor, 1);
    graphics.fillCircle(x, y, size);
    graphics.fillRect(x - size * 0.6, y, size * 1.2, size * 0.8);
    
    // Eye sockets (glowing)
    const leftEye = this.add.circle(x - size * 0.4, y - size * 0.2, size * 0.2, this.theme.colors.skullEyeGlow);
    const rightEye = this.add.circle(x + size * 0.4, y - size * 0.2, size * 0.2, this.theme.colors.skullEyeGlow);
    
    // Glowing animation
    this.tweens.add({
      targets: [leftEye, rightEye],
      alpha: this.theme.animation.skullGlow.alpha,
      duration: this.theme.animation.skullGlow.duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Render info box
   */
  renderInfoBox(width, height) {
    const infoBg = this.add.rectangle(
      width / 2,
      this.theme.layout.infoBoxY,
      this.theme.layout.infoBoxWidth,
      this.theme.layout.infoBoxHeight,
      this.theme.colors.infoBg,
      0.8
    );
    infoBg.setStrokeStyle(this.theme.layout.infoBorderWidth, this.theme.colors.infoBorder);
  }

  /**
   * Render round information
   */
  renderRoundInfo(width, height) {
    // "You reached" label
    this.add.text(
      width / 2,
      this.theme.layout.roundLabelY,
      'You reached',
      {
        font: this.theme.fonts.roundLabel,
        fill: this.theme.colors.roundLabel
      }
    ).setOrigin(0.5);

    // Round number (large and prominent)
    const roundValue = this.add.text(
      width / 2,
      this.theme.layout.roundValueY,
      `ROUND ${this.finalRound}`,
      {
        font: this.theme.fonts.roundValue,
        fill: this.theme.colors.roundValue,
        stroke: this.theme.stroke.roundValue.color,
        strokeThickness: this.theme.stroke.roundValue.thickness
      }
    ).setOrigin(0.5);

    // Pulsing animation
    this.tweens.add({
      targets: roundValue,
      scaleX: this.theme.animation.roundValuePulse.scale,
      scaleY: this.theme.animation.roundValuePulse.scale,
      duration: this.theme.animation.roundValuePulse.duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Render message
   */
  renderMessage(width, height) {
    const message = this.finalRound >= 10 
      ? 'A valiant effort!' 
      : 'Better luck next time!';
    
    this.add.text(
      width / 2,
      this.theme.layout.messageY,
      message,
      {
        font: this.theme.fonts.message,
        fill: this.theme.colors.messageText,
        stroke: this.theme.stroke.message.color,
        strokeThickness: this.theme.stroke.message.thickness
      }
    ).setOrigin(0.5);
  }

  /**
   * Render stats summary
   */
  renderStats(width, height) {
    const statsY = this.theme.layout.statsStartY;
    const spacing = this.theme.layout.statsSpacing;
    const leftX = width / 2 + this.theme.layout.statsLeftX;
    const rightX = width / 2 + this.theme.layout.statsRightX;

    // Debug: Log final stats to verify accuracy
    console.log('GameOverScene - Final Stats:', this.finalStats);

    // Extract stats with fallbacks
    const characterName = this.finalStats.character || 'Unknown';
    const goldAmount = this.finalStats.currency || 0;
    const weaponCount = this.finalStats.weaponCount || 0;
    const itemCount = this.finalStats.itemCount || 0;

    // Left column
    // Character
    this.createStatRow(
      leftX,
      statsY,
      '⚔️ Character:',
      characterName,
      this.theme.colors.characterValue
    );

    // Gold
    this.createStatRow(
      leftX,
      statsY + spacing,
      '💰 Gold:',
      `${goldAmount}`,
      this.theme.colors.statsValue
    );

    // Right column
    // Weapons
    this.createStatRow(
      rightX,
      statsY,
      '🗡️ Weapons:',
      `${weaponCount}/6`,
      this.theme.colors.weaponsValue
    );

    // Items
    this.createStatRow(
      rightX,
      statsY + spacing,
      '🎒 Items:',
      `${itemCount}`,
      this.theme.colors.itemsValue
    );
  }

  /**
   * Create a stat row
   */
  createStatRow(x, y, label, value, valueColor = null) {
    // Label
    this.add.text(x, y, label, {
      font: this.theme.fonts.statsLabel,
      fill: this.theme.colors.statsLabel
    }).setOrigin(0, 0.5);

    // Value
    this.add.text(x + 140, y, value, {
      font: this.theme.fonts.statsValue,
      fill: valueColor || this.theme.colors.characterValue
    }).setOrigin(0, 0.5);
  }

  /**
   * Render buttons
   */
  renderButtons(width, height, gameManager) {
    const buttonY = this.theme.layout.buttonY;

    // Restart button
    const restartBtn = this.add.rectangle(
      width / 2 + this.theme.layout.restartButtonX,
      buttonY,
      this.theme.layout.buttonWidth,
      this.theme.layout.buttonHeight,
      this.theme.colors.restartBg
    );
    restartBtn.setStrokeStyle(this.theme.layout.buttonBorderWidth, this.theme.colors.restartBorder);
    restartBtn.setInteractive({ useHandCursor: true });

    const restartText = this.add.text(
      width / 2 + this.theme.layout.restartButtonX,
      buttonY,
      'TRY AGAIN',
      {
        font: this.theme.fonts.button,
        fill: this.theme.colors.restartText,
        stroke: this.theme.stroke.button.color,
        strokeThickness: this.theme.stroke.button.thickness
      }
    ).setOrigin(0.5);

    restartBtn.on('pointerover', () => {
      restartBtn.setFillStyle(this.theme.colors.restartBgHover);
      this.tweens.add({
        targets: restartBtn,
        scaleX: this.theme.animation.buttonHover.scale,
        scaleY: this.theme.animation.buttonHover.scale,
        duration: this.theme.animation.buttonHover.duration
      });
    });

    restartBtn.on('pointerout', () => {
      restartBtn.setFillStyle(this.theme.colors.restartBg);
      this.tweens.add({
        targets: restartBtn,
        scaleX: 1,
        scaleY: 1,
        duration: this.theme.animation.buttonHover.duration
      });
    });

    restartBtn.on('pointerdown', () => {
      this.cameras.main.flash(200, 255, 255, 255);
      this.time.delayedCall(200, () => {
        gameManager.resetGame();
        gameManager.startCharacterSelection();
      });
    });

    // Main menu button
    const menuBtn = this.add.rectangle(
      width / 2 + this.theme.layout.menuButtonX,
      buttonY,
      this.theme.layout.buttonWidth,
      this.theme.layout.buttonHeight,
      this.theme.colors.menuBg
    );
    menuBtn.setStrokeStyle(this.theme.layout.buttonBorderWidth, this.theme.colors.menuBorder);
    menuBtn.setInteractive({ useHandCursor: true });

    const menuText = this.add.text(
      width / 2 + this.theme.layout.menuButtonX,
      buttonY,
      'MAIN MENU',
      {
        font: this.theme.fonts.button,
        fill: this.theme.colors.menuText,
        stroke: this.theme.stroke.button.color,
        strokeThickness: this.theme.stroke.button.thickness
      }
    ).setOrigin(0.5);

    menuBtn.on('pointerover', () => {
      menuBtn.setFillStyle(this.theme.colors.menuBgHover);
      this.tweens.add({
        targets: menuBtn,
        scaleX: this.theme.animation.buttonHover.scale,
        scaleY: this.theme.animation.buttonHover.scale,
        duration: this.theme.animation.buttonHover.duration
      });
    });

    menuBtn.on('pointerout', () => {
      menuBtn.setFillStyle(this.theme.colors.menuBg);
      this.tweens.add({
        targets: menuBtn,
        scaleX: 1,
        scaleY: 1,
        duration: this.theme.animation.buttonHover.duration
      });
    });

    menuBtn.on('pointerdown', () => {
      this.cameras.main.flash(200, 255, 255, 255);
      this.time.delayedCall(200, () => {
        gameManager.resetGame();
        this.scene.start('StartScene');
      });
    });
  }

  /**
   * Create vignette effect
   */
  createVignette(width, height) {
    const vignette = this.add.graphics();
    vignette.fillStyle(this.theme.effects.vignette.color, this.theme.effects.vignette.alpha);
    
    // Create radial gradient effect by drawing multiple circles
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height);
    
    for (let i = 0; i < 10; i++) {
      const radius = maxRadius * (0.5 + i * 0.1);
      const alpha = (i / 10) * this.theme.effects.vignette.alpha;
      vignette.fillStyle(this.theme.effects.vignette.color, alpha);
      vignette.fillCircle(centerX, centerY, radius);
    }
    
    vignette.setBlendMode(Phaser.BlendModes.MULTIPLY);
  }
}

  handleResize(gameSize) {
    // Safety check
    if (!this.cameras || !this.cameras.main) {
      return;
    }
    
    const width = gameSize.width;
    const height = gameSize.height;

    // Update camera bounds
    this.cameras.main.setBounds(0, 0, width, height);
    
    // Restart scene to redraw all elements at new positions
    this.scene.restart();
  }

  shutdown() {
    // Remove resize listener
    if (this.scale) {
      this.scale.off('resize', this.handleResize, this);
    }
  }
