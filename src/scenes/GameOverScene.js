import Phaser from 'phaser';

/**
 * GameOverScene
 * Displayed on player death
 */
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalRound = data.finalRound || 1;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get the actual final round from game manager if not passed
    if (!this.finalRound || this.finalRound === 1) {
      const gameManager = this.registry.get('gameManager');
      this.finalRound = gameManager.getCurrentRound();
    }

    // Game Over title
    this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
      font: '48px monospace',
      fill: '#ff0000'
    }).setOrigin(0.5);

    // Final round reached
    this.add.text(width / 2, height / 2 - 20, `You reached Round ${this.finalRound}`, {
      font: '24px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Restart button
    const restartBtn = this.add.rectangle(width / 2, height / 2 + 60, 200, 50, 0x00ff00);
    restartBtn.setInteractive({ useHandCursor: true });

    const restartText = this.add.text(width / 2, height / 2 + 60, 'Restart', {
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
      const gameManager = this.registry.get('gameManager');
      gameManager.resetGame();
      
      // Return to character selection
      gameManager.startCharacterSelection();
    });
  }
}
