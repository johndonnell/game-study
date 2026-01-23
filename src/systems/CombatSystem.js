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
   * Check weapon collisions and apply damage to enemies
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy[]} enemies - Array of enemies
   */
  checkWeaponCollisions(player, enemies) {
    const equippedWeapons = player.getEquippedWeapons();
    
    for (const enemy of enemies) {
      if (enemy.isDead()) continue;

      // Check distance to player (simple circle collision)
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if any weapon is in range
      for (const weapon of equippedWeapons) {
        if (distance <= weapon.range) {
          // Check if weapon can attack (cooldown)
          const currentTime = this.scene.time.now;
          if (weapon.canAttack(currentTime)) {
            // Apply damage
            const damage = this.calculatePlayerDamage(player, enemy);
            this.applyDamage(enemy, damage);
            weapon.recordAttack(currentTime);
            break; // Only one weapon hits per check
          }
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
