import Projectile from '../../entities/Projectile.js';
import CollisionDetector from './CollisionDetector.js';

/**
 * ProjectilePool
 * Object pool for reusing projectile instances
 */
class ProjectilePool {
  constructor(scene, initialSize = 50) {
    this.scene = scene;
    this.available = [];
    this.active = [];
    
    // Pre-create projectiles (skip initialization to avoid scene.time issues)
    for (let i = 0; i < initialSize; i++) {
      const projectile = new Projectile(scene, 0, 0, 0, 0, 0, 0, true); // skipInit flag
      projectile.setActive(false);
      projectile.setVisible(false);
      this.available.push(projectile);
    }
  }
  
  /**
   * Acquire a projectile from the pool
   * @returns {Projectile} Projectile instance
   */
  acquire() {
    let projectile;
    
    if (this.available.length > 0) {
      projectile = this.available.pop();
    } else {
      // Pool exhausted, create new projectile (skip init)
      projectile = new Projectile(this.scene, 0, 0, 0, 0, 0, 0, null, null, true);
      projectile.setActive(false);
      projectile.setVisible(false);
    }
    
    this.active.push(projectile);
    return projectile;
  }
  
  /**
   * Release a projectile back to the pool
   * @param {Projectile} projectile - Projectile to release
   */
  release(projectile) {
    const index = this.active.indexOf(projectile);
    if (index !== -1) {
      this.active.splice(index, 1);
    }
    
    projectile.setActive(false);
    projectile.setVisible(false);
    this.available.push(projectile);
  }
  
  /**
   * Clear all projectiles
   */
  clear() {
    // Move all active projectiles back to available
    this.active.forEach(p => {
      p.setActive(false);
      p.setVisible(false);
    });
    this.available.push(...this.active);
    this.active = [];
  }
  
  /**
   * Destroy all projectiles (cleanup)
   */
  destroy() {
    [...this.available, ...this.active].forEach(p => {
      if (p.destroy) p.destroy();
    });
    this.available = [];
    this.active = [];
  }
}

/**
 * ProjectileManager
 * Manages all projectiles (player and enemy) with object pooling
 */
export default class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.playerPool = new ProjectilePool(scene, 50);
    this.enemyPool = new ProjectilePool(scene, 50);
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
    const projectile = this.playerPool.acquire();
    projectile.reset(x, y, targetX, targetY, damage, speed, weaponType);
    return projectile;
  }

  /**
   * Create enemy projectile (fireball, spear, axe, or rock)
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
    } else if (enemy.enemyType === 'TROLL') {
      // From troll's hand area (large enemy, higher spawn)
      spawnOffsetX = enemy.facingDirection * 25;
      spawnOffsetY = -10;
    } else if (enemy.enemyType === 'DEMON') {
      // From demon's hand/claw area (magical casting)
      spawnOffsetX = enemy.facingDirection * 20;
      spawnOffsetY = -8;
    } else {
      // Default offset
      spawnOffsetX = enemy.facingDirection * 20;
      spawnOffsetY = 0;
    }
    
    const projectile = this.enemyPool.acquire();
    projectile.reset(
      enemy.x + spawnOffsetX,
      enemy.y + spawnOffsetY,
      targetX,
      targetY,
      damage,
      speed,
      null, // weaponType (not used for enemy projectiles)
      enemy.enemyType // enemyType for visual style
    );
    
    return projectile;
  }

  /**
   * Update all player projectiles and check for hits
   * @param {number} delta - Time since last update
   * @param {Enemy[]} enemies - Array of enemies
   * @param {Function} onHit - Callback when projectile hits (projectile, enemy)
   */
  updatePlayerProjectiles(delta, enemies, onHit) {
    const projectiles = this.playerPool.active;
    
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];
      
      if (!projectile.active) {
        this.playerPool.release(projectile);
        continue;
      }
      
      projectile.update(delta);
      
      // Check collision with enemies
      for (const enemy of enemies) {
        if (CollisionDetector.checkProjectileHit(projectile, enemy)) {
          onHit(projectile, enemy);
          projectile.hit();
          this.playerPool.release(projectile);
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
    const projectiles = this.enemyPool.active;
    
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];
      
      if (!projectile.active) {
        this.enemyPool.release(projectile);
        continue;
      }
      
      projectile.update(delta);
      
      // Check collision with player
      if (CollisionDetector.checkProjectileHitPlayer(projectile, player)) {
        onHit(projectile, player);
        projectile.hit();
        this.enemyPool.release(projectile);
      }
    }
  }

  /**
   * Clear all projectiles
   */
  clear() {
    this.playerPool.clear();
    this.enemyPool.clear();
  }
  
  /**
   * Destroy all projectiles (cleanup)
   */
  destroy() {
    this.playerPool.destroy();
    this.enemyPool.destroy();
  }
}
