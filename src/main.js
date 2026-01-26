import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
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
  type: Phaser.CANVAS, // Try Canvas renderer - Chrome may have WebGL issues
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game-container',
    width: '100%',
    height: '100%',
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#2d2d2d',
  fps: {
    target: 60,
    forceSetTimeOut: false,
    smoothStep: false // Disable frame smoothing
  },
  render: {
    pixelArt: false,
    antialias: false, // Disable antialiasing for performance
    roundPixels: true, // Round pixels for performance
    transparent: false,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'high-performance',
    batchSize: 4096, // Increase batch size for better performance
    maxTextures: 16 // Limit texture units for better Chrome performance
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    StartScene,
    CharacterSelectScene,
    GameScene,
    ShopScene,
    StatsScene,
    GameOverScene,
    VictoryScene
  ]
};

// Initialize Phaser game instance
let game;

// Destroy existing game instance on hot reload (Vite HMR)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (game) {
      console.log('🔄 Hot reload: destroying game instance');
      
      // Clear all registry data
      game.registry.destroy();
      
      // Destroy game instance
      game.destroy(true, false);
      game = null;
      
      // Clear any window state
      if (window.gameTabHeartbeat) {
        clearInterval(window.gameTabHeartbeat);
        delete window.gameTabHeartbeat;
      }
      if (window.gameTabId) {
        delete window.gameTabId;
      }
      
      // Clear localStorage game state
      try {
        localStorage.removeItem('game_active_tabs');
      } catch (e) {
        console.warn('Could not clear localStorage:', e);
      }
      
      console.log('✅ Game state fully cleared');
    }
  });
}

// Clear any existing game state on page load (not just HMR)
if (game) {
  console.log('🧹 Clearing existing game instance on page load');
  game.destroy(true, false);
  game = null;
}

// Clear window state
if (window.gameTabHeartbeat) {
  clearInterval(window.gameTabHeartbeat);
  delete window.gameTabHeartbeat;
}
if (window.gameTabId) {
  delete window.gameTabId;
}

// Check for Canvas support
if (!document.createElement('canvas').getContext) {
  document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Your browser does not support HTML5 Canvas. Please use a modern browser.</div>';
} else {
  game = new Phaser.Game(config);

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
  
  console.log('✅ Fresh game instance created');
}

export default game;
