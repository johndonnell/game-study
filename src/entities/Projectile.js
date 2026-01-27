import Phaser from 'phaser';
import ArrowProjectile from '../sprites/projectiles/ArrowProjectile.js';
import SpearProjectile from '../sprites/projectiles/SpearProjectile.js';
import FireballProjectile from '../sprites/projectiles/FireballProjectile.js';
import WandProjectile from '../sprites/projectiles/WandProjectile.js';
import ShurikenProjectile from '../sprites/projectiles/ShurikenProjectile.js';
import AxeProjectile from '../sprites/projectiles/AxeProjectile.js';
import RockProjectile from '../sprites/projectiles/RockProjectile.js';
import ChakramProjectile from '../sprites/projectiles/ChakramProjectile.js';
import DefaultProjectile from '../sprites/projectiles/DefaultProjectile.js';

/**
 * Projectile class
 * Represents a projectile fired from a ranged weapon or enemy
 */
export default class Projectile extends Phaser.GameObjects.Graphics {
  /**
   * @param {Phaser.Scene} scene - The scene this projectile belongs to
   * @param {number} x - Starting x position
   * @param {number} y - Starting y position
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage this projectile deals
   * @param {number} speed - Speed of projectile
   * @param {string} weaponType - Type of weapon firing (for visual style)
   * @param {string} enemyType - Type of enemy firing (for enemy projectiles)
   * @param {boolean} skipInit - Skip initialization (for pooling)
   */
  constructor(scene, x, y, targetX, targetY, damage, speed = 300, weaponType = null, enemyType = null, skipInit = false) {
    super(scene);
    
    this.scene = scene;
    this.destroyTimer = null;
    
    // Add to scene
    scene.add.existing(this);
    
    // Initialize with reset (skip if pooling)
    if (!skipInit) {
      this.reset(x, y, targetX, targetY, damage, speed, weaponType, enemyType);
    }
  }
  
  /**
   * Reset projectile for reuse (object pooling)
   * @param {number} x - Starting x position
   * @param {number} y - Starting y position
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage this projectile deals
   * @param {number} speed - Speed of projectile
   * @param {string} weaponType - Type of weapon firing (for visual style)
   * @param {string} enemyType - Type of enemy firing (for enemy projectiles)
   */
  reset(x, y, targetX, targetY, damage, speed = 300, weaponType = null, enemyType = null) {
    this.damage = damage;
    this.speed = speed;
    this.hasHit = false;
    this.weaponType = weaponType;
    this.enemyType = enemyType;
    this.rotationSpeed = 0;
    
    // Set position
    this.x = x;
    this.y = y;
    
    // Calculate direction
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.velocityX = (dx / distance) * speed;
    this.velocityY = (dy / distance) * speed;
    
    // Set initial rotation for arrows/spears to face direction of travel
    const spriteModule = this.getSpriteModule(weaponType, enemyType);
    if (spriteModule.shouldRotate()) {
      this.rotation = Math.atan2(dy, dx);
    } else {
      this.rotation = 0;
    }
    
    // Set rotation speed for spinning projectiles
    this.rotationSpeed = spriteModule.getRotationSpeed();
    
    // Draw projectile based on weapon type or enemy type
    this.drawProjectile(weaponType, enemyType);
    
    // Scale projectile to 1.5x size (after drawing)
    this.setScale(1.5);
    
    // Set depth to ensure projectiles render on top
    this.setDepth(100);
    
    // Make visible and active
    this.setActive(true);
    this.setVisible(true);
    
    // Clear any existing timers
    if (this.destroyTimer) {
      this.destroyTimer.remove();
      this.destroyTimer = null;
    }
    
    // Auto-destroy after 2 seconds (only if scene exists)
    if (this.scene && this.scene.time) {
      this.destroyTimer = this.scene.time.delayedCall(2000, () => {
        if (this.active) {
          this.setActive(false);
          this.setVisible(false);
        }
      });
    }
  }
  
  /**
   * Get sprite module for projectile type
   * @param {string} weaponType - Type of weapon
   * @param {string} enemyType - Type of enemy (for enemy projectiles)
   * @returns {Object} Sprite module with draw, shouldRotate, and getRotationSpeed methods
   */
  getSpriteModule(weaponType, enemyType = null) {
    // Enemy projectiles
    if (enemyType === 'GOBLIN') {
      return SpearProjectile;
    } else if (enemyType === 'DRAGON') {
      return FireballProjectile;
    } else if (enemyType === 'ORC') {
      return AxeProjectile;
    } else if (enemyType === 'TROLL') {
      return RockProjectile;
    } else if (enemyType === 'DEMON') {
      return FireballProjectile;
    }
    
    // Player weapon projectiles
    if (weaponType === 'BOW' || weaponType === 'CROSSBOW') {
      return ArrowProjectile;
    } else if (weaponType === 'WAND') {
      return WandProjectile;
    } else if (weaponType === 'STAFF') {
      return FireballProjectile;
    } else if (weaponType === 'SHURIKEN') {
      return ShurikenProjectile;
    } else if (weaponType === 'CHAKRAM') {
      return ChakramProjectile;
    }
    
    // Default
    return DefaultProjectile;
  }
  
  /**
   * Draw projectile visual based on weapon type or enemy type
   * @param {string} weaponType - Type of weapon
   * @param {string} enemyType - Type of enemy (for enemy projectiles)
   */
  drawProjectile(weaponType, enemyType = null) {
    // Clear any existing graphics
    this.clear();
    
    // Reset any transforms that might affect visibility
    this.setAlpha(1);
    this.setScale(1);
    
    // Draw the projectile sprite
    const spriteModule = this.getSpriteModule(weaponType, enemyType);
    spriteModule.draw(this);
  }
  
  /**
   * Update projectile position
   * @param {number} delta - Time since last update in milliseconds
   */
  update(delta) {
    if (this.hasHit) {
      return;
    }
    
    // Move projectile
    const deltaSeconds = delta / 1000;
    this.x += this.velocityX * deltaSeconds;
    this.y += this.velocityY * deltaSeconds;
    
    // Rotate spinning projectiles (like shuriken and axes)
    if (this.rotationSpeed > 0) {
      this.rotation += this.rotationSpeed * deltaSeconds;
    }
    
    // Check if out of bounds (with safety check for scene)
    if (this.scene && this.scene.sys && this.scene.sys.game && this.scene.sys.game.config) {
      const bounds = this.scene.sys.game.config;
      if (this.x < 0 || this.x > bounds.width || this.y < 0 || this.y > bounds.height) {
        this.setActive(false);
        this.setVisible(false);
      }
    }
  }
  
  /**
   * Mark projectile as having hit a target
   */
  hit() {
    this.hasHit = true;
    this.setActive(false);
    this.setVisible(false);
    
    // Clear destroy timer
    if (this.destroyTimer) {
      this.destroyTimer.remove();
      this.destroyTimer = null;
    }
  }
}
