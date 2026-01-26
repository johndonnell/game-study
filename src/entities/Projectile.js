import Phaser from 'phaser';
import ArrowProjectile from '../sprites/projectiles/ArrowProjectile.js';
import SpearProjectile from '../sprites/projectiles/SpearProjectile.js';
import FireballProjectile from '../sprites/projectiles/FireballProjectile.js';
import ShurikenProjectile from '../sprites/projectiles/ShurikenProjectile.js';
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
   */
  constructor(scene, x, y, targetX, targetY, damage, speed = 300, weaponType = null, enemyType = null) {
    super(scene);
    
    this.scene = scene;
    this.damage = damage;
    this.speed = speed;
    this.hasHit = false;
    this.weaponType = weaponType;
    this.enemyType = enemyType;
    this.rotationSpeed = 0; // For spinning projectiles
    
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
    }
    
    // Set rotation speed for spinning projectiles
    this.rotationSpeed = spriteModule.getRotationSpeed();
    
    // Draw projectile based on weapon type or enemy type
    this.drawProjectile(weaponType, enemyType);
    
    // Add to scene
    scene.add.existing(this);
    
    // Auto-destroy after 2 seconds
    scene.time.delayedCall(2000, () => {
      if (this.active) {
        this.destroy();
      }
    });
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
    }
    
    // Player weapon projectiles
    if (weaponType === 'BOW' || weaponType === 'CROSSBOW') {
      return ArrowProjectile;
    } else if (weaponType === 'WAND' || weaponType === 'STAFF') {
      return FireballProjectile;
    } else if (weaponType === 'SHURIKEN') {
      return ShurikenProjectile;
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
    this.clear();
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
    
    // Rotate spinning projectiles (like shuriken)
    if (this.rotationSpeed > 0) {
      this.rotation += this.rotationSpeed;
    }
    
    // Check if out of bounds
    const bounds = this.scene.sys.game.config;
    if (this.x < 0 || this.x > bounds.width || this.y < 0 || this.y > bounds.height) {
      this.destroy();
    }
  }
  
  /**
   * Mark projectile as having hit a target
   */
  hit() {
    this.hasHit = true;
    this.destroy();
  }
}
