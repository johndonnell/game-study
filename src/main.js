import Phaser from 'phaser';

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: []
};

// Initialize Phaser game instance
const game = new Phaser.Game(config);

// Check for Canvas support
if (!document.createElement('canvas').getContext) {
  document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Your browser does not support HTML5 Canvas. Please use a modern browser.</div>';
}

export default game;
