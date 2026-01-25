/**
 * TrollSprite
 * Handles sprite creation and animation for Troll enemies
 */
import { createTrollGraphics, updateTrollAnimation } from './troll-helpers.js';

export default class TrollSprite {
  static create(scene, container) {
    // Implementation moved from Enemy.js createTrollSprite method
    // Returns parts object with all graphics
    return createTrollGraphics(scene, container);
  }

  static updateAnimation(parts, animationTime) {
    // Implementation moved from Enemy.js updateTrollAnimation method
    updateTrollAnimation(parts, animationTime);
  }
}
