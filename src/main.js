import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import GameScene from './scenes/GameScene.js';
import ShopScene from './scenes/ShopScene.js';
import StatsScene from './scenes/StatsScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import GameManager from './managers/GameManager.js';
import ProgressionManager from './systems/ProgressionManager.js';

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
  scene: [
    BootScene,
    CharacterSelectScene,
    GameScene,
    ShopScene,
    StatsScene,
    GameOverScene,
    VictoryScene
  ]
};

// Check for Canvas support
if (!document.createElement('canvas').getContext) {
  document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Your browser does not support HTML5 Canvas. Please use a modern browser.</div>';
} else {
  // Initialize Phaser game instance
  const game = new Phaser.Game(config);

  // Initialize game manager and progression manager
  const gameManager = new GameManager(game);
  const progressionManager = new ProgressionManager();

  // Store in registry for access across scenes
  game.registry.set('gameManager', gameManager);
  game.registry.set('progressionManager', progressionManager);

  // Check localStorage support (graceful degradation)
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    game.registry.set('localStorageAvailable', true);
  } catch (e) {
    console.warn('localStorage not available - game state will not persist across sessions');
    game.registry.set('localStorageAvailable', false);
  }
}

export default game;
