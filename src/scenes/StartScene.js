import Phaser from 'phaser';

/**
 * StartScene
 * Initial start screen that enables audio context after user interaction
 */
export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    this.add.text(width / 2, height / 2 - 100, 'Browser Action Game', {
      font: 'bold 48px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 2 - 30, 'Survive 20 Rounds', {
      font: '24px monospace',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Click to start button
    const startButton = this.add.rectangle(width / 2, height / 2 + 80, 300, 60, 0x00ff00);
    startButton.setInteractive({ useHandCursor: true });

    const startText = this.add.text(width / 2, height / 2 + 80, 'Click to Start', {
      font: 'bold 24px monospace',
      fill: '#000000'
    }).setOrigin(0.5);

    // Hover effects
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x00cc00);
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x00ff00);
    });

    // Start game on click - this user interaction enables audio
    startButton.on('pointerdown', () => {
      // Resume audio context if needed
      if (this.sound.context && this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      
      // Go to character selection
      this.scene.start('CharacterSelectScene');
    });

    // Instructions
    this.add.text(width / 2, height - 100, 'WASD or Arrow Keys to Move | Space to Pause', {
      font: '14px monospace',
      fill: '#888888'
    }).setOrigin(0.5);
  }
}
