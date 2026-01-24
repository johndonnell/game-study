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
   * @param {Array} weaponSprites - Array of weapon sprite objects from GameScene
   */
  checkWeaponCollisions(player, enemies, weaponSprites = []) {
    const equippedWeapons = player.getEquippedWeapons();
    const currentTime = this.scene.time.now;
    
    for (let i = 0; i < equippedWeapons.length; i++) {
      const weapon = equippedWeapons[i];
      
      // Check if weapon can attack (cooldown) - pass character attributes for dexterity calculation
      if (!weapon.canAttack(currentTime, player.currentAttributes)) {
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
          // Get weapon sprite position if available, otherwise use player position
          let projectileX = player.x;
          let projectileY = player.y;
          
          if (weaponSprites[i] && weaponSprites[i].graphic) {
            projectileX = weaponSprites[i].graphic.x;
            projectileY = weaponSprites[i].graphic.y;
          }
          
          // Create projectile for ranged weapons from weapon position
          const projectile = new Projectile(
            this.scene,
            projectileX,
            projectileY,
            closestEnemy.x,
            closestEnemy.y,
            weapon.calculateDamage(player.currentAttributes),
            400,
            weapon.type // Pass weapon type for visual style
          );
          this.projectiles.push(projectile);
        } else {
          // Melee weapon - instant damage with weapon-specific animation
          const damage = weapon.calculateDamage(player.currentAttributes);
          this.createMeleeAttackEffect(player, closestEnemy, weapon);
          this.applyDamage(closestEnemy, damage, currentTime);
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
    const currentTime = this.scene.time.now;
    
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
          this.applyDamage(enemy, projectile.damage, currentTime);
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
    const currentTime = this.scene.time.now;
    
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
        this.applyDamage(player, damage, currentTime);
      }
    }
  }

  /**
   * Apply damage to a target
   * @param {GameObject} target - Target to damage (Player or Enemy)
   * @param {number} amount - Amount of damage
   * @param {number} currentTime - Current game time in milliseconds
   */
  applyDamage(target, amount, currentTime) {
    target.takeDamage(amount, currentTime);
    
    // Add visual feedback
    this.showDamageNumber(target, amount);
    
    // Add hit flash effect for enemies
    if (target.constructor.name === 'Enemy') {
      this.flashEnemy(target);
      
      // If enemy died, destroy container
      if (target.isDead()) {
        // Fade out and destroy
        this.scene.tweens.add({
          targets: target,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            target.destroy();
          }
        });
      }
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
    // For containers, we need to tint the children (graphics)
    if (enemy.list && enemy.list.length > 0) {
      // Get the graphics object (first child)
      const graphics = enemy.list[0];
      
      // Store original alpha
      const originalAlpha = graphics.alpha;
      
      // Flash by changing alpha
      graphics.alpha = 0.5;
      
      // Restore original alpha after 100ms
      this.scene.time.delayedCall(100, () => {
        if (graphics && graphics.active) {
          graphics.alpha = originalAlpha;
        }
      });
    }
  }

  /**
   * Shake screen when player takes damage
   */
  shakeScreen() {
    this.scene.cameras.main.shake(100, 0.005);
  }

  /**
   * Create melee attack effect based on weapon type
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Target enemy
   * @param {Weapon} weapon - Weapon being used
   */
  createMeleeAttackEffect(player, enemy, weapon) {
    // Calculate angle from player to enemy
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const angle = Math.atan2(dy, dx);
    
    // Use weapon's actual range for animation size
    const range = weapon.range;
    
    // Different animations based on weapon type
    const weaponType = weapon.type;
    
    // Sword-like weapons: slash arc
    if (['SWORD', 'KATANA', 'RAPIER', 'GREATSWORD'].includes(weaponType)) {
      this.createSlashArc(player, angle, 0xffffff, range);
    }
    // Axe/Hammer: overhead swing
    else if (['AXE', 'HAMMER', 'MACE'].includes(weaponType)) {
      this.createOverheadSwing(player, angle, 0xff8800, range);
    }
    // Dagger: quick stab
    else if (['DAGGER'].includes(weaponType)) {
      this.createStab(player, angle, 0xcccccc, range);
    }
    // Spear/Lance: thrust
    else if (['SPEAR', 'LANCE'].includes(weaponType)) {
      this.createThrust(player, angle, 0xffff00, range);
    }
    // Whip/Flail: sweeping motion
    else if (['WHIP', 'FLAIL', 'SCYTHE'].includes(weaponType)) {
      this.createSweep(player, angle, 0xff00ff, range);
    }
    // Gauntlets: punch
    else if (['GAUNTLETS'].includes(weaponType)) {
      this.createPunch(player, angle, 0xff0000, range);
    }
    // Default: simple slash
    else {
      this.createSlashArc(player, angle, 0xffffff, range);
    }
  }

  /**
   * Create slash arc animation (swords)
   */
  createSlashArc(player, angle, color, range) {
    const slash = this.scene.add.graphics();
    slash.lineStyle(3, color, 1);
    
    // Draw arc from side to side using weapon range
    const startAngle = angle - Math.PI / 4;
    const endAngle = angle + Math.PI / 4;
    
    slash.beginPath();
    slash.arc(player.x, player.y, range, startAngle, endAngle);
    slash.strokePath();
    
    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      duration: 200,
      onComplete: () => slash.destroy()
    });
  }

  /**
   * Create overhead swing animation (axes, hammers)
   */
  createOverheadSwing(player, angle, color, range) {
    const swing = this.scene.add.graphics();
    swing.lineStyle(5, color, 1);
    
    const startX = player.x + Math.cos(angle - Math.PI / 3) * (range * 0.6);
    const startY = player.y + Math.sin(angle - Math.PI / 3) * (range * 0.6);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    swing.beginPath();
    swing.moveTo(startX, startY);
    swing.lineTo(endX, endY);
    swing.strokePath();
    
    this.scene.tweens.add({
      targets: swing,
      alpha: 0,
      duration: 180,
      onComplete: () => swing.destroy()
    });
  }

  /**
   * Create stab animation (daggers)
   */
  createStab(player, angle, color, range) {
    const stab = this.scene.add.graphics();
    stab.lineStyle(2, color, 1);
    
    const startX = player.x + Math.cos(angle) * (range * 0.3);
    const startY = player.y + Math.sin(angle) * (range * 0.3);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    stab.beginPath();
    stab.moveTo(startX, startY);
    stab.lineTo(endX, endY);
    stab.strokePath();
    
    this.scene.tweens.add({
      targets: stab,
      alpha: 0,
      x: stab.x + Math.cos(angle) * (range * 0.3),
      y: stab.y + Math.sin(angle) * (range * 0.3),
      duration: 120,
      onComplete: () => stab.destroy()
    });
  }

  /**
   * Create thrust animation (spears, lances)
   */
  createThrust(player, angle, color, range) {
    const thrust = this.scene.add.graphics();
    thrust.lineStyle(3, color, 1);
    
    const startX = player.x + Math.cos(angle) * (range * 0.4);
    const startY = player.y + Math.sin(angle) * (range * 0.4);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    thrust.beginPath();
    thrust.moveTo(startX, startY);
    thrust.lineTo(endX, endY);
    thrust.strokePath();
    
    this.scene.tweens.add({
      targets: thrust,
      alpha: 0,
      x: thrust.x + Math.cos(angle) * (range * 0.4),
      y: thrust.y + Math.sin(angle) * (range * 0.4),
      duration: 150,
      onComplete: () => thrust.destroy()
    });
  }

  /**
   * Create sweep animation (whips, flails)
   */
  createSweep(player, angle, color, range) {
    const sweep = this.scene.add.graphics();
    sweep.lineStyle(2, color, 1);
    
    // Wide sweeping arc using weapon range
    const startAngle = angle - Math.PI / 3;
    const endAngle = angle + Math.PI / 3;
    
    sweep.beginPath();
    sweep.arc(player.x, player.y, range, startAngle, endAngle);
    sweep.strokePath();
    
    this.scene.tweens.add({
      targets: sweep,
      alpha: 0,
      duration: 250,
      onComplete: () => sweep.destroy()
    });
  }

  /**
   * Create punch animation (gauntlets)
   */
  createPunch(player, angle, color, range) {
    const punch = this.scene.add.graphics();
    punch.fillStyle(color, 1);
    
    const x = player.x + Math.cos(angle) * range;
    const y = player.y + Math.sin(angle) * range;
    
    punch.fillCircle(x, y, 8);
    
    this.scene.tweens.add({
      targets: punch,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      onComplete: () => punch.destroy()
    });
  }
}
