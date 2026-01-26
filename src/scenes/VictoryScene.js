import Phaser from 'phaser';
import { enableResize } from '../utils/ResizableScene.js';

/**
 * VictoryScene
 * Displayed on completing all 20 rounds
 */
export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Enable resize handling
    enableResize(this);

    // Get game manager and player data
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    // Victory title
    this.add.text(width / 2, height / 2 - 120, 'VICTORY!', {
      font: '56px monospace',
      fill: '#00ff00'
    }).setOrigin(0.5);

    // Congratulations message
    this.add.text(width / 2, height / 2 - 40, 'You completed all 20 rounds!', {
      font: '24px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Display stats
    const statsY = height / 2 + 20;
    this.add.text(width / 2, statsY, `Character: ${playerData.selectedCharacter.name}`, {
      font: '18px monospace',
      fill: '#cccccc'
    }).setOrigin(0.5);

    this.add.text(width / 2, statsY + 30, `Final Gold: ${playerData.currency || 0}`, {
      font: '18px monospace',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Restart button
    const restartBtn = this.add.rectangle(width / 2, height / 2 + 120, 200, 50, 0x00ff00);
    restartBtn.setInteractive({ useHandCursor: true });

    const restartText = this.add.text(width / 2, height / 2 + 120, 'Play Again', {
      font: '24px monospace',
      fill: '#000000'
    }).setOrigin(0.5);

    restartBtn.on('pointerover', () => {
      restartBtn.setFillStyle(0x00cc00);
    });

    restartBtn.on('pointerout', () => {
      restartBtn.setFillStyle(0x00ff00);
    });

    restartBtn.on('pointerdown', () => {
      // Reset game state
      gameManager.resetGame();
      
      // Return to character selection
      gameManager.startCharacterSelection();
    });
  }
}
