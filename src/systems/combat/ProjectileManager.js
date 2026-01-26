import Projectile from '../../entities/Projectile.js';
import CollisionDetector from './CollisionDetector.js';

/**
 * ProjectileManager
 * Manages all projectiles (player and enemy)
 */
export default class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
    this.enemyProjectiles = [];
  }

  /**
   * Create player projectile
   * @param {number} x - Start x position
   * @param {number} y - Start y position
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage amount
   * @param {number} speed - Projectile speed
   * @param {string} weaponType - Weapon type for visual style
   * @returns {Projectile} Created projectile
   */
  createPlayerProjectile(x, y, targetX, targetY, damage, speed, weaponType) {
    const projectile = new Projectile(
      this.scene,
      x,
      y,
      targetX,
      targetY,
      damage,
      speed,
      weaponType
    );
    this.projectiles.push(projectile);
    return projectile;
  }

  /**
   * Create enemy projectile (fireball)
   * @param {Enemy} enemy - Enemy firing the projectile
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage amount
   * @param {number} speed - Projectile speed
   * @returns {Projectile} Created projectile
   */
  createEnemyProjectile(enemy, targetX, targetY, damage, speed) {
    // Calculate spawn position (from dragon's mouth/head area)
    const spawnOffsetX = enemy.facingDirection * 45; // Offset to head
    const spawnOffsetY = -10; // Slightly above center
    
    const projectile = new (class EnemyProjectile extends Phaser.GameObjects.Graphics {
      constructor(scene, x, y, targetX, targetY, damage, speed) {
        super(scene);
        
        this.damage = damage;
        this.speed = speed;
        this.hasHit = false;
        
        // Set position
        this.x = x;
        this.y = y;
        
        // Draw fireball
        this.drawFireball();
        
        // Calculate direction
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.velocityX = (dx / distance) * speed;
        this.velocityY = (dy / distance) * speed;
        
        // Add to scene
        scene.add.existing(this);
        
        // Auto-destroy after 3 seconds
        scene.time.delayedCall(3000, () => {
          if (this.active) {
            this.destroy();
          }
        });
      }
      
      drawFireball() {
        this.clear();
        // Outer flame (red-orange)
        this.fillStyle(0xff4500, 1);
        this.fillCircle(0, 0, 8);
        // Middle flame (orange)
        this.fillStyle(0xff8c00, 0.9);
        this.fillCircle(0, 0, 6);
        // Inner flame (yellow)
        this.fillStyle(0xffff00, 0.8);
        this.fillCircle(0, 0, 4);
        // Core (white)
        this.fillStyle(0xffffff, 0.6);
        this.fillCircle(0, 0, 2);
      }
      
      update(delta) {
        if (this.hasHit) return;
        
        // Move projectile
        const deltaSeconds = delta / 1000;
        this.x += this.velocityX * deltaSeconds;
        this.y += this.velocityY * deltaSeconds;
        
        // Animate fireball (pulsing effect)
        const time = Date.now();
        const scale = 1 + Math.sin(time * 0.01) * 0.1;
        this.scaleX = scale;
        this.scaleY = scale;
        
        // Check if out of bounds
        const bounds = this.scene.sys.game.config;
        if (this.x < 0 || this.x > bounds.width || this.y < 0 || this.y > bounds.height) {
          this.destroy();
        }
      }
      
      hit() {
        this.hasHit = true;
        
        // Create explosion effect
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xff4500, 0.8);
        explosion.fillCircle(this.x, this.y, 15);
        explosion.fillStyle(0xff8c00, 0.6);
        explosion.fillCircle(this.x, this.y, 10);
        explosion.fillStyle(0xffff00, 0.4);
        explosion.fillCircle(this.x, this.y, 5);
        
        this.scene.tweens.add({
          targets: explosion,
          alpha: 0,
          scaleX: 2,
          scaleY: 2,
          duration: 300,
          onComplete: () => explosion.destroy()
        });
        
        this.destroy();
      }
    })(
      this.scene,
      enemy.x + spawnOffsetX,
      enemy.y + spawnOffsetY,
      targetX,
      targetY,
      damage,
      speed
    );
    
    this.enemyProjectiles.push(projectile);
    return projectile;
  }

  /**
   * Update all player projectiles and check for hits
   * @param {number} delta - Time since last update
   * @param {Enemy[]} enemies - Array of enemies
   * @param {Function} onHit - Callback when projectile hits (projectile, enemy)
   */
  updatePlayerProjectiles(delta, enemies, onHit) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      
      if (!projectile.active) {
        this.projectiles.splice(i, 1);
        continue;
      }
      
      projectile.update(delta);
      
      // Check collision with enemies
      for (const enemy of enemies) {
        if (CollisionDetector.checkProjectileHit(projectile, enemy)) {
          onHit(projectile, enemy);
          projectile.hit();
          break;
        }
      }
    }
  }

  /**
   * Update all enemy projectiles and check for hits on player
   * @param {number} delta - Time since last update
   * @param {PlayerCharacter} player - Player character
   * @param {Function} onHit - Callback when projectile hits (projectile, player)
   */
  updateEnemyProjectiles(delta, player, onHit) {
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const projectile = this.enemyProjectiles[i];
      
      if (!projectile.active) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }
      
      projectile.update(delta);
      
      // Check collision with player
      if (CollisionDetector.checkProjectileHitPlayer(projectile, player)) {
        onHit(projectile, player);
        projectile.hit();
      }
    }
  }

  /**
   * Clear all projectiles
   */
  clear() {
    this.projectiles.forEach(p => p.destroy && p.destroy());
    this.enemyProjectiles.forEach(p => p.destroy && p.destroy());
    this.projectiles = [];
    this.enemyProjectiles = [];
  }
}
