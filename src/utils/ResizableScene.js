/**
 * ResizableScene
 * Mixin to add resize handling to Phaser scenes
 * 
 * Usage:
 * import { enableResize } from '../utils/ResizableScene.js';
 * 
 * In scene's create():
 *   enableResize(this);
 * 
 * In scene's shutdown():
 *   // Cleanup is automatic
 */

/**
 * Default resize handler - restarts the scene
 * @param {Phaser.Scene} scene - The scene instance
 * @param {Object} gameSize - New game size {width, height}
 */
function defaultResizeHandler(scene, gameSize) {
  // Safety check
  if (!scene.cameras || !scene.cameras.main) {
    return;
  }
  
  const width = gameSize.width;
  const height = gameSize.height;

  // Update camera bounds
  scene.cameras.main.setBounds(0, 0, width, height);
  
  // Restart scene to redraw all elements at new positions
  scene.restart();
}

/**
 * Enable resize handling for a scene
 * @param {Phaser.Scene} scene - The scene to enable resize for
 * @param {Function} customHandler - Optional custom resize handler
 */
export function enableResize(scene, customHandler = null) {
  // Store the handler on the scene for cleanup
  scene._resizeHandler = customHandler || ((gameSize) => defaultResizeHandler(scene, gameSize));
  
  // Listen for resize events
  scene.scale.on('resize', scene._resizeHandler, scene);
  
  // Override shutdown to cleanup
  const originalShutdown = scene.shutdown ? scene.shutdown.bind(scene) : () => {};
  scene.shutdown = function() {
    // Remove resize listener
    if (this.scale && this._resizeHandler) {
      this.scale.off('resize', this._resizeHandler, this);
    }
    
    // Call original shutdown
    originalShutdown();
  };
}

/**
 * Create a custom resize handler for GameScene-style repositioning
 * @param {Object} options - Configuration options
 * @returns {Function} Custom resize handler
 */
export function createCustomResizeHandler(options = {}) {
  return function(gameSize) {
    // Safety check
    if (!this.cameras || !this.cameras.main) {
      return;
    }
    
    const width = gameSize.width;
    const height = gameSize.height;

    // Update camera bounds
    this.cameras.main.setBounds(0, 0, width, height);
    
    // Call custom reposition logic if provided
    if (options.onResize) {
      options.onResize.call(this, width, height);
    }
  };
}
