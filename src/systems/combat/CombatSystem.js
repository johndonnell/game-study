import DamageCalculator from './DamageCalculator.js';
import CollisionDetector from './CollisionDetector.js';
import ProjectileManager from './ProjectileManager.js';
import CombatVisualEffects from './CombatVisualEffects.js';
import AttackAnimationFactory from './AttackAnimationFactory.js';

/**
 * CombatSystem (Refactored)
 * Orchestrates combat interactions by delegating to specialized components
 * 
 * This is now a thin orchestrator that coordinates:
 * - DamageCalculator: Pure damage calculation logic
 * - CollisionDetector: All collision detection algorithms
 * - ProjectileManager: Projectile lifecycle management
 * - CombatVisualEffects: Visual feedback (damage numbers, flashes, etc.)
 * - AttackAnimationFactory: Weapon-specific attack animations
 */
export default class CombatSystem {
  /**
   * @param {Phaser.Scene} scene - The scene this combat system belongs to
   */
  constructor(scene) {
    this.scene = scene;
    
    // Initialize specialized components
    this.projectileManager = new ProjectileManager(scene);
    this.visualEffects = new CombatVisualEffects(scene);
    this.animationFactory = new AttackAnimationFactory(scene);
  }

  /**
   * Calculate player damage considering all equipped weapons
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Target enemy
   * @returns {number} Total calculated damage
   */
  calculatePlayerDamage(player, enemy) {
    return DamageCalculator.calculatePlayerDamage(player, enemy);
  }

  /**
   * Calculate enemy damage
   * @param {Enemy} enemy - Enemy attacking
   * @param {PlayerCharacter} player - Target player
   * @returns {number} Calculated damage
   */
  calculateEnemyDamage(enemy, player) {
    return DamageCalculator.calculateEnemyDamage(enemy, player);
  }

  /**
   * Check weapon collisions and apply damage to enemies (automatic attacks)
   * 
   * ATTACK SPEED CALCULATIONS:
   * - Attack speed cooldown is checked via weapon.canAttack(currentTime, playerAttributes)
   * - The weapon's base attack speed is modified by player's dexterity attribute
   * - This happens in the Weapon class: getAttackCooldown() method
   * - Formula: cooldown = baseAttackSpeed / (1 + dexterity * 0.01)
   * - Higher dexterity = shorter cooldown = faster attacks
   * 
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy[]} enemies - Array of enemies
   * @param {Array} weaponSprites - Array of weapon sprite objects from GameScene
   */
  checkWeaponCollisions(player, enemies, weaponSprites = []) {
    const equippedWeapons = player.getEquippedWeapons();
    const currentTime = this.scene.time.now;
    
    for (let i = 0; i < equippedWeapons.length; i++) {
      const weapon = equippedWeapons[i];
      
      // Check if weapon can attack (cooldown check includes attack speed calculation)
      // Pass character attributes for dexterity-based attack speed modification
      if (!weapon.canAttack(currentTime, player.currentAttributes)) {
        continue;
      }
      
      // Get effective weapon range (modified by player stats)
      const effectiveRange = weapon.getEffectiveRange(player.currentAttributes);
      
      // Find closest enemy in range
      const { enemy: closestEnemy } = CollisionDetector.findClosestEnemyInRange(
        player,
        enemies,
        effectiveRange
      );
      
      // If enemy in range, attack
      if (closestEnemy) {
        // Record attack time (for cooldown tracking)
        weapon.recordAttack(currentTime);
        
        // Determine if this is a ranged weapon (range > 100)
        const isRanged = effectiveRange > 100;
        
        if (isRanged) {
          this.handleRangedAttack(player, closestEnemy, weapon, weaponSprites[i], effectiveRange);
        } else {
          this.handleMeleeAttack(player, closestEnemy, weapon, enemies, effectiveRange, currentTime);
        }
      }
    }
  }

  /**
   * Handle ranged weapon attack
   * @private
   */
  handleRangedAttack(player, closestEnemy, weapon, weaponSprite, effectiveRange) {
    // Get weapon sprite position if available, otherwise use player position
    let projectileX = player.x;
    let projectileY = player.y;
    
    if (weaponSprite && weaponSprite.graphic) {
      projectileX = weaponSprite.graphic.x;
      projectileY = weaponSprite.graphic.y;
    }
    
    // Create projectile from weapon position
    this.projectileManager.createPlayerProjectile(
      projectileX,
      projectileY,
      closestEnemy.x,
      closestEnemy.y,
      weapon.calculateDamage(player.currentAttributes),
      400,
      weapon.type
    );
  }

  /**
   * Handle melee weapon attack
   * @private
   */
  handleMeleeAttack(player, closestEnemy, weapon, enemies, effectiveRange, currentTime) {
    const damage = weapon.calculateDamage(player.currentAttributes);
    
    // Calculate angle to closest enemy for animation
    const dx = closestEnemy.x - player.x;
    const dy = closestEnemy.y - player.y;
    const attackAngle = Math.atan2(dy, dx);
    
    // Create visual effect
    this.animationFactory.createMeleeAttackEffect(player, closestEnemy, weapon, effectiveRange);
    
    // Damage all enemies that collide with the attack animation hitbox
    for (const enemy of enemies) {
      if (enemy.isDead()) continue;
      
      // Check if enemy collides with the attack animation based on weapon type
      if (CollisionDetector.checkMeleeHitboxCollision(player, enemy, weapon, attackAngle, effectiveRange)) {
        this.applyDamage(enemy, damage, currentTime);
      }
    }
  }

  /**
   * Update projectiles and check for hits
   * @param {number} delta - Time since last update
   * @param {Enemy[]} enemies - Array of enemies
   * @param {number} currentTime - Current game time
   */
  updateProjectiles(delta, enemies, currentTime) {
    this.projectileManager.updatePlayerProjectiles(delta, enemies, (projectile, enemy) => {
      this.applyDamage(enemy, projectile.damage, currentTime);
    });
  }

  /**
   * Update enemy projectiles and check for hits on player
   * @param {number} delta - Time since last update
   * @param {PlayerCharacter} player - Player character
   * @param {number} currentTime - Current game time
   */
  updateEnemyProjectiles(delta, player, currentTime) {
    this.projectileManager.updateEnemyProjectiles(delta, player, (projectile, player) => {
      this.applyDamage(player, projectile.damage, currentTime);
    });
  }

  /**
   * Check enemy ranged attacks and create projectiles
   * @param {Enemy[]} enemies - Array of enemies
   * @param {PlayerCharacter} player - Player character
   * @param {number} currentTime - Current game time
   */
  checkEnemyRangedAttacks(enemies, player, currentTime) {
    for (const enemy of enemies) {
      if (enemy.isDead() || !enemy.hasRangedAttack()) continue;

      // Check if enemy can attack
      if (!enemy.canRangedAttack(currentTime)) continue;

      // Check if player is in range
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= enemy.getRangedAttackRange()) {
        // Determine projectile speed based on enemy type
        let projectileSpeed;
        if (enemy.enemyType === 'GOBLIN') {
          projectileSpeed = 350; // Faster spear throw
        } else if (enemy.enemyType === 'ORC') {
          projectileSpeed = 300; // Medium speed axe throw
        } else if (enemy.enemyType === 'TROLL') {
          projectileSpeed = 150; // Very slow rock throw
        } else if (enemy.enemyType === 'DEMON') {
          projectileSpeed = 400; // Very fast fireball
        } else if (enemy.enemyType === 'DRAGON') {
          projectileSpeed = 250; // Slower fireball
        } else {
          projectileSpeed = 300; // Default
        }
        
        // Dragons fire 3 fireballs in a cone pattern
        if (enemy.enemyType === 'DRAGON') {
          // Calculate angle to player
          const angleToPlayer = Math.atan2(dy, dx);
          
          // Cone spread angle (in radians) - 15 degrees on each side
          const spreadAngle = (15 * Math.PI) / 180;
          
          // Create 3 projectiles: center, left, right
          const angles = [
            angleToPlayer,              // Center (straight at player)
            angleToPlayer - spreadAngle, // Left
            angleToPlayer + spreadAngle  // Right
          ];
          
          // Calculate target positions for each angle
          for (const angle of angles) {
            const targetX = enemy.x + Math.cos(angle) * distance;
            const targetY = enemy.y + Math.sin(angle) * distance;
            
            this.projectileManager.createEnemyProjectile(
              enemy,
              targetX,
              targetY,
              enemy.damage,
              projectileSpeed
            );
          }
        } else {
          // Goblins, orcs, trolls, demons, and other ranged enemies fire single projectile
          this.projectileManager.createEnemyProjectile(
            enemy,
            player.x,
            player.y,
            enemy.damage,
            projectileSpeed
          );
        }
        
        enemy.recordRangedAttack(currentTime);
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
      if (CollisionDetector.checkEnemyMeleeRange(player, enemy)) {
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
    this.visualEffects.showDamageNumber(target, amount);
    
    // Add hit flash effect for enemies
    if (target.constructor.name === 'Enemy') {
      this.visualEffects.flashEnemy(target);
      
      // If enemy died, create death effect
      if (target.isDead()) {
        this.visualEffects.createDeathEffect(target);
      }
    }
    
    // Add screen shake for player damage
    if (target.constructor.name === 'PlayerCharacter') {
      this.visualEffects.shakeScreen();
    }
  }

  /**
   * Show damage number pop-up (delegated to visual effects)
   * @param {GameObject} target - Target that took damage
   * @param {number} amount - Damage amount
   */
  showDamageNumber(target, amount) {
    this.visualEffects.showDamageNumber(target, amount);
  }

  /**
   * Flash enemy white when hit (delegated to visual effects)
   * @param {Enemy} enemy - Enemy to flash
   */
  flashEnemy(enemy) {
    this.visualEffects.flashEnemy(enemy);
  }

  /**
   * Shake screen when player takes damage (delegated to visual effects)
   */
  shakeScreen() {
    this.visualEffects.shakeScreen();
  }

  /**
   * Check if enemy collides with melee attack hitbox (delegated to collision detector)
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Enemy to check collision with
   * @param {Weapon} weapon - Weapon being used
   * @param {number} attackAngle - Angle of attack in radians
   * @param {number} effectiveRange - Effective weapon range after modifiers
   * @returns {boolean} True if enemy is hit by the attack animation
   */
  checkMeleeHitboxCollision(player, enemy, weapon, attackAngle, effectiveRange) {
    return CollisionDetector.checkMeleeHitboxCollision(player, enemy, weapon, attackAngle, effectiveRange);
  }

  /**
   * Create melee attack effect (delegated to animation factory)
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Target enemy
   * @param {Weapon} weapon - Weapon being used
   * @param {number} effectiveRange - Effective weapon range after modifiers
   */
  createMeleeAttackEffect(player, enemy, weapon, effectiveRange) {
    this.animationFactory.createMeleeAttackEffect(player, enemy, weapon, effectiveRange);
  }
}
