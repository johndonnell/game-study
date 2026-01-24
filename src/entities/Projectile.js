import Phaser from 'phaser';

/**
 * Projectile class
 * Represents a projectile fired from a ranged weapon
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
   */
  constructor(scene, x, y, targetX, targetY, damage, speed = 300, weaponType = null) {
    super(scene);
    
    this.scene = scene;
    this.damage = damage;
    this.speed = speed;
    this.hasHit = false;
    this.weaponType = weaponType;
    
    // Set position
    this.x = x;
    this.y = y;
    
    // Draw projectile based on weapon type
    this.drawProjectile(weaponType);
    
    // Calculate direction
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.velocityX = (dx / distance) * speed;
    this.velocityY = (dy / distance) * speed;
    
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
   * Draw projectile visual based on weapon type
   * @param {string} weaponType - Type of weapon
   */
  drawProjectile(weaponType) {
    this.clear();
    
    if (weaponType === 'WAND' || weaponType === 'STAFF') {
      // Fireball - orange/red gradient effect
      this.fillStyle(0xff4500, 1);
      this.fillCircle(0, 0, 6);
      this.fillStyle(0xff8c00, 0.8);
      this.fillCircle(0, 0, 4);
      this.fillStyle(0xffff00, 0.6);
      this.fillCircle(0, 0, 2);
    } else {
      // Default projectile (yellow circle)
      this.fillStyle(0xffff00, 1);
      this.fillCircle(0, 0, 3);
    }
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
