import Projectile from '../entities/Projectile.js';

/**
 * CombatSystem class
 * Manages damage calculation and combat interactions
 */
export default class CombatSystem {
  /**
   * @param {Phaser.Scene} scene - The scene this combat system belongs to
   */
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
  }

  /**
   * Calculate player damage considering all equipped weapons
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Target enemy
   * @returns {number} Total calculated damage
   */
  calculatePlayerDamage(player, enemy) {
    let totalDamage = 0;

    // Sum damage from all equipped weapons
    const equippedWeapons = player.getEquippedWeapons();
    for (const weapon of equippedWeapons) {
      const weaponDamage = weapon.calculateDamage(player.currentAttributes);
      totalDamage += weaponDamage;
    }

    // Apply enemy defense (handled in enemy.takeDamage())
    return totalDamage;
  }

  /**
   * Calculate enemy damage
   * @param {Enemy} enemy - Enemy attacking
   * @param {PlayerCharacter} player - Target player
   * @returns {number} Calculated damage
   */
  calculateEnemyDamage(enemy, player) {
    // Enemy damage is reduced by player defense
    const baseDamage = enemy.damage;
    const playerDefense = player.getAttribute('defense');
    const actualDamage = Math.max(1, baseDamage - playerDefense);
    
    return actualDamage;
  }

  /**
   * Check weapon collisions and apply damage to enemies (automatic attacks)
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy[]} enemies - Array of enemies
   */
  checkWeaponCollisions(player, enemies) {
    const equippedWeapons = player.getEquippedWeapons();
    const currentTime = this.scene.time.now;
    
    for (const weapon of equippedWeapons) {
      // Check if weapon can attack (cooldown)
      if (!weapon.canAttack(currentTime)) {
        continue;
      }
      
      // Find closest enemy in range
      let closestEnemy = null;
      let closestDistance = Infinity;
      
      for (const enemy of enemies) {
        if (enemy.isDead()) continue;
        
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= weapon.range && distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
      
      // If enemy in range, attack
      if (closestEnemy) {
        weapon.recordAttack(currentTime);
        
        // Determine if this is a ranged weapon (range > 100)
        const isRanged = weapon.range > 100;
        
        if (isRanged) {
          // Create projectile for ranged weapons
          const projectile = new Projectile(
            this.scene,
            player.x,
            player.y,
            closestEnemy.x,
            closestEnemy.y,
            weapon.calculateDamage(player.currentAttributes),
            400
          );
          this.projectiles.push(projectile);
        } else {
          // Melee weapon - instant damage
          const damage = weapon.calculateDamage(player.currentAttributes);
          this.applyDamage(closestEnemy, damage);
        }
      }
    }
  }
  
  /**
   * Update projectiles and check for hits
   * @param {number} delta - Time since last update
   * @param {Enemy[]} enemies - Array of enemies
   */
  updateProjectiles(delta, enemies) {
    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      
      if (!projectile.active) {
        this.projectiles.splice(i, 1);
        continue;
      }
      
      projectile.update(delta);
      
      // Check collision with enemies
      for (const enemy of enemies) {
        if (enemy.isDead() || projectile.hasHit) continue;
        
        const dx = enemy.x - projectile.x;
        const dy = enemy.y - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Hit detection (within 20 pixels)
        if (distance < 20) {
          this.applyDamage(enemy, projectile.damage);
          projectile.hit();
          break;
        }
      }
    }
  }

  /**
   * Check enemy collisions and apply damage to player
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy[]} enemies - Array of enemies
   */
  checkEnemyCollisions(player, enemies) {
    for (const enemy of enemies) {
      if (enemy.isDead()) continue;

      // Check distance to player (simple circle collision)
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Enemy attack range (melee range)
      const attackRange = 30;
      
      if (distance <= attackRange) {
        // Apply damage to player
        const damage = this.calculateEnemyDamage(enemy, player);
        this.applyDamage(player, damage);
      }
    }
  }

  /**
   * Apply damage to a target
   * @param {GameObject} target - Target to damage (Player or Enemy)
   * @param {number} amount - Amount of damage
   */
  applyDamage(target, amount) {
    target.takeDamage(amount);
    
    // Add visual feedback
    this.showDamageNumber(target, amount);
    
    // Add hit flash effect for enemies
    if (target.constructor.name === 'Enemy') {
      this.flashEnemy(target);
    }
    
    // Add screen shake for player damage
    if (target.constructor.name === 'PlayerCharacter') {
      this.shakeScreen();
    }
  }

  /**
   * Show damage number pop-up
   * @param {GameObject} target - Target that took damage
   * @param {number} amount - Damage amount
   */
  showDamageNumber(target, amount) {
    const damageText = this.scene.add.text(
      target.x,
      target.y - 20,
      Math.ceil(amount).toString(),
      {
        font: '16px monospace',
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    damageText.setOrigin(0.5);

    // Animate damage number
    this.scene.tweens.add({
      targets: damageText,
      y: target.y - 60,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        damageText.destroy();
      }
    });
  }

  /**
   * Flash enemy white when hit
   * @param {Enemy} enemy - Enemy to flash
   */
  flashEnemy(enemy) {
    // Store original tint
    const originalTint = enemy.tintTopLeft;
    
    // Flash white
    enemy.setTint(0xffffff);
    
    // Restore original tint after 100ms
    this.scene.time.delayedCall(100, () => {
      enemy.clearTint();
    });
  }

  /**
   * Shake screen when player takes damage
   */
  shakeScreen() {
    this.scene.cameras.main.shake(100, 0.005);
  }
}
