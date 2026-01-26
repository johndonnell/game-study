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
   * Create enemy projectile (fireball, spear, or axe)
   * @param {Enemy} enemy - Enemy firing the projectile
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage amount
   * @param {number} speed - Projectile speed
   * @returns {Projectile} Created projectile
   */
  createEnemyProjectile(enemy, targetX, targetY, damage, speed) {
    // Calculate spawn position based on enemy type
    let spawnOffsetX, spawnOffsetY;
    
    if (enemy.enemyType === 'DRAGON') {
      // From dragon's mouth/head area
      spawnOffsetX = enemy.facingDirection * 45;
      spawnOffsetY = -10;
    } else if (enemy.enemyType === 'GOBLIN') {
      // From goblin's hand area
      spawnOffsetX = enemy.facingDirection * 15;
      spawnOffsetY = 0;
    } else if (enemy.enemyType === 'ORC') {
      // From orc's hand area (higher up for throwing motion)
      spawnOffsetX = enemy.facingDirection * 20;
      spawnOffsetY = -5;
    } else {
      // Default offset
      spawnOffsetX = enemy.facingDirection * 20;
      spawnOffsetY = 0;
    }
    
    const projectile = new Projectile(
      this.scene,
      enemy.x + spawnOffsetX,
      enemy.y + spawnOffsetY,
      targetX,
      targetY,
      damage,
      speed,
      null, // weaponType (not used for enemy projectiles)
      enemy.enemyType // enemyType for visual style
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
