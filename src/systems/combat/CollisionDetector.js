/**
 * CollisionDetector
 * Handles all collision detection logic
 */
export default class CollisionDetector {
  /**
   * Find closest enemy in range
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy[]} enemies - Array of enemies
   * @param {number} range - Weapon range
   * @returns {{enemy: Enemy|null, distance: number}} Closest enemy and distance
   */
  static findClosestEnemyInRange(player, enemies, range) {
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    for (const enemy of enemies) {
      if (enemy.isDead()) continue;
      
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= range && distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    }
    
    return { enemy: closestEnemy, distance: closestDistance };
  }

  /**
   * Check if projectile hits enemy
   * @param {Projectile} projectile - Projectile to check
   * @param {Enemy} enemy - Enemy to check collision with
   * @param {number} hitRadius - Hit detection radius (default 20)
   * @returns {boolean} True if hit
   */
  static checkProjectileHit(projectile, enemy, hitRadius = 20) {
    if (enemy.isDead() || projectile.hasHit) return false;
    
    const dx = enemy.x - projectile.x;
    const dy = enemy.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < hitRadius;
  }

  /**
   * Check if projectile hits player
   * @param {Projectile} projectile - Projectile to check
   * @param {PlayerCharacter} player - Player to check collision with
   * @param {number} hitRadius - Hit detection radius (default 20)
   * @returns {boolean} True if hit
   */
  static checkProjectileHitPlayer(projectile, player, hitRadius = 20) {
    if (projectile.hasHit) return false;
    
    const dx = player.x - projectile.x;
    const dy = player.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < hitRadius;
  }

  /**
   * Check if enemy is in melee range of player
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Enemy to check
   * @param {number} attackRange - Melee attack range (default 30)
   * @returns {boolean} True if in range
   */
  static checkEnemyMeleeRange(player, enemy, attackRange = 30) {
    if (enemy.isDead()) return false;
    
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance <= attackRange;
  }

  /**
   * Check if enemy collides with melee attack hitbox based on weapon type
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Enemy to check collision with
   * @param {Weapon} weapon - Weapon being used
   * @param {number} attackAngle - Angle of attack in radians
   * @param {number} effectiveRange - Effective weapon range after modifiers
   * @returns {boolean} True if enemy is hit by the attack animation
   */
  static checkMeleeHitboxCollision(player, enemy, weapon, attackAngle, effectiveRange) {
    const enemyDx = enemy.x - player.x;
    const enemyDy = enemy.y - player.y;
    const enemyDistance = Math.sqrt(enemyDx * enemyDx + enemyDy * enemyDy);
    const enemyAngle = Math.atan2(enemyDy, enemyDx);
    
    // Enemy hitbox radius (approximate)
    const enemyRadius = 15;
    const range = effectiveRange;
    const weaponType = weapon.type;
    
    // Sword-like weapons: slash arc (90-degree arc)
    if (['SWORD', 'KATANA', 'RAPIER', 'GREATSWORD'].includes(weaponType)) {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 4);
    }
    // Axe/Hammer: overhead swing (90-degree arc, slightly wider)
    else if (['AXE', 'HAMMER', 'MACE'].includes(weaponType)) {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 4);
    }
    // Dagger: quick stab (narrow 45-degree cone)
    else if (['DAGGER'].includes(weaponType)) {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 8);
    }
    // Spear/Lance: thrust (narrow 30-degree cone)
    else if (['SPEAR', 'LANCE'].includes(weaponType)) {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 12);
    }
    // Whip/Flail: sweeping motion (wide 120-degree arc)
    else if (['WHIP', 'FLAIL', 'SCYTHE'].includes(weaponType)) {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 3);
    }
    // Gauntlets: punch (circular area at end of range)
    else if (['GAUNTLETS'].includes(weaponType)) {
      const punchX = player.x + Math.cos(attackAngle) * range;
      const punchY = player.y + Math.sin(attackAngle) * range;
      const punchRadius = 8 + enemyRadius;
      const distToPunch = Math.sqrt((enemy.x - punchX) ** 2 + (enemy.y - punchY) ** 2);
      return distToPunch <= punchRadius;
    }
    // Default: slash arc
    else {
      return this.checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, Math.PI / 4);
    }
  }

  /**
   * Check if enemy is within an arc-shaped hitbox
   * @param {number} enemyDistance - Distance from player to enemy
   * @param {number} enemyAngle - Angle from player to enemy
   * @param {number} attackAngle - Angle of attack
   * @param {number} range - Weapon range
   * @param {number} enemyRadius - Enemy hitbox radius
   * @param {number} arcHalfAngle - Half of the arc angle (in radians)
   * @returns {boolean} True if enemy is within the arc
   */
  static checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, arcHalfAngle) {
    // Check if enemy is within weapon range (with enemy radius buffer)
    if (enemyDistance > range + enemyRadius) {
      return false;
    }
    
    // Calculate angle difference (normalized to -PI to PI)
    let angleDiff = enemyAngle - attackAngle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    // Check if enemy is within attack arc
    return Math.abs(angleDiff) <= arcHalfAngle;
  }
}
