/**
 * EnemyMovementSystem
 * Handles varied movement patterns for different enemy types
 * Makes combat more dynamic and prevents simple circle-kiting strategies
 */
export default class EnemyMovementSystem {
  /**
   * @param {Phaser.Scene} scene - The scene this system belongs to
   */
  constructor(scene) {
    this.scene = scene;
    
    // Track enemy-specific movement state
    this.enemyStates = new Map();
  }

  /**
   * Initialize movement state for an enemy
   * @param {Enemy} enemy - Enemy to initialize
   */
  initializeEnemy(enemy) {
    if (this.enemyStates.has(enemy)) return;
    
    const state = {
      // Strafe pattern state
      strafeDirection: Math.random() > 0.5 ? 1 : -1,
      strafeTimer: 0,
      strafeDuration: 2000 + Math.random() * 2000, // 2-4 seconds
      
      // Charge pattern state
      isCharging: false,
      chargeTimer: 0,
      chargeCooldown: 3000 + Math.random() * 2000, // 3-5 seconds
      chargeTargetX: 0,
      chargeTargetY: 0,
      
      // Circle pattern state
      circleAngle: Math.random() * Math.PI * 2,
      circleDirection: Math.random() > 0.5 ? 1 : -1,
      circleDistance: 150 + Math.random() * 100, // 150-250 pixels
      
      // Zigzag pattern state
      zigzagOffset: 0,
      zigzagDirection: 1,
      
      // Retreat pattern state
      retreatTimer: 0,
      isRetreating: false,
      
      // General timing
      lastPatternChange: 0,
      patternChangeCooldown: 4000 + Math.random() * 3000 // 4-7 seconds
    };
    
    this.enemyStates.set(enemy, state);
  }

  /**
   * Update enemy movement based on their type
   * @param {Enemy} enemy - Enemy to update
   * @param {PlayerCharacter} player - Player target
   * @param {number} delta - Time since last update in milliseconds
   * @param {number} currentTime - Current game time
   */
  updateMovement(enemy, player, delta, currentTime) {
    if (!player || enemy.isDead()) return;
    
    // Initialize state if needed
    this.initializeEnemy(enemy);
    const state = this.enemyStates.get(enemy);
    
    // Choose movement pattern based on enemy type
    switch (enemy.enemyType) {
      case 'GOBLIN':
        this.updateGoblinMovement(enemy, player, state, delta, currentTime);
        break;
      case 'ORC':
        this.updateOrcMovement(enemy, player, state, delta, currentTime);
        break;
      case 'TROLL':
        this.updateTrollMovement(enemy, player, state, delta, currentTime);
        break;
      case 'DEMON':
        this.updateDemonMovement(enemy, player, state, delta, currentTime);
        break;
      case 'DRAGON':
        this.updateDragonMovement(enemy, player, state, delta, currentTime);
        break;
      default:
        // Fallback to direct movement
        this.moveDirectly(enemy, player, delta);
    }
    
    // Clamp enemy position to screen bounds
    this.clampToScreenBounds(enemy);
  }

  /**
   * Clamp enemy position to stay within screen bounds
   * @param {Enemy} enemy - Enemy to clamp
   */
  clampToScreenBounds(enemy) {
    // Safety check - only clamp if camera is available
    if (!this.scene.cameras || !this.scene.cameras.main) {
      return;
    }
    
    const camera = this.scene.cameras.main;
    const padding = 20; // Keep enemies at least 20 pixels from edge
    
    // Clamp X position
    if (enemy.x < padding) {
      enemy.x = padding;
    } else if (enemy.x > camera.width - padding) {
      enemy.x = camera.width - padding;
    }
    
    // Clamp Y position
    if (enemy.y < padding) {
      enemy.y = padding;
    } else if (enemy.y > camera.height - padding) {
      enemy.y = camera.height - padding;
    }
  }

  /**
   * Goblin movement: Fast, erratic zigzag pattern
   * Goblins dart side-to-side while approaching
   */
  updateGoblinMovement(enemy, player, state, delta, currentTime) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    // Zigzag frequency increases as they get closer
    const zigzagFrequency = 0.005 + (1 / Math.max(distance, 50)) * 0.5;
    state.zigzagOffset += zigzagFrequency * delta;
    
    // Calculate perpendicular direction for zigzag
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    // Zigzag amplitude
    const zigzagAmount = Math.sin(state.zigzagOffset) * 30;
    
    // Move towards player with zigzag
    const velocityX = (dx / distance) * enemy.speed * 0.016 + perpX * zigzagAmount * 0.016;
    const velocityY = (dy / distance) * enemy.speed * 0.016 + perpY * zigzagAmount * 0.016;
    
    enemy.x += velocityX;
    enemy.y += velocityY;
  }

  /**
   * Orc movement: Charge pattern with brief pauses
   * Orcs charge at player, pause to attack, then charge again
   */
  updateOrcMovement(enemy, player, state, delta, currentTime) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    // Update charge timer
    state.chargeTimer += delta;
    
    // Check if should start charging
    if (!state.isCharging && state.chargeTimer >= state.chargeCooldown) {
      state.isCharging = true;
      state.chargeTimer = 0;
      state.chargeTargetX = player.x;
      state.chargeTargetY = player.y;
    }
    
    if (state.isCharging) {
      // Charge towards the locked target position
      const chargeDx = state.chargeTargetX - enemy.x;
      const chargeDy = state.chargeTargetY - enemy.y;
      const chargeDistance = Math.sqrt(chargeDx * chargeDx + chargeDy * chargeDy);
      
      if (chargeDistance > 20) {
        // Charge at 1.5x speed
        const chargeSpeed = enemy.speed * 1.5;
        const velocityX = (chargeDx / chargeDistance) * chargeSpeed * 0.016;
        const velocityY = (chargeDy / chargeDistance) * chargeSpeed * 0.016;
        
        enemy.x += velocityX;
        enemy.y += velocityY;
      } else {
        // Reached target, stop charging
        state.isCharging = false;
        state.chargeTimer = 0;
        state.chargeCooldown = 3000 + Math.random() * 2000;
      }
    } else {
      // Slow approach when not charging
      const velocityX = (dx / distance) * enemy.speed * 0.3 * 0.016;
      const velocityY = (dy / distance) * enemy.speed * 0.3 * 0.016;
      
      enemy.x += velocityX;
      enemy.y += velocityY;
    }
  }

  /**
   * Troll movement: Slow but relentless direct pursuit
   * Trolls move slowly but never stop, pushing through obstacles
   */
  updateTrollMovement(enemy, player, state, delta, currentTime) {
    // Trolls just move directly but very steadily
    // No fancy patterns, just unstoppable forward momentum
    this.moveDirectly(enemy, player, delta);
  }

  /**
   * Demon movement: Circle-strafe pattern at medium range
   * Demons try to maintain distance while circling the player
   */
  updateDemonMovement(enemy, player, state, delta, currentTime) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    // Demons try to maintain optimal range (200-300 pixels)
    const optimalRange = 250;
    const rangeTolerance = 50;
    
    // Update circle angle
    state.circleAngle += state.circleDirection * 0.002 * delta;
    
    // Calculate tangent direction (perpendicular to player direction)
    const tangentX = -dy / distance;
    const tangentY = dx / distance;
    
    // Calculate radial direction (towards/away from player)
    const radialX = dx / distance;
    const radialY = dy / distance;
    
    // Determine if should move closer or farther
    let radialWeight = 0;
    if (distance < optimalRange - rangeTolerance) {
      radialWeight = -0.5; // Move away
    } else if (distance > optimalRange + rangeTolerance) {
      radialWeight = 0.5; // Move closer
    }
    
    // Combine tangent (circle) and radial (distance adjustment) movement
    const velocityX = (tangentX * 0.7 + radialX * radialWeight) * enemy.speed * 0.016;
    const velocityY = (tangentY * 0.7 + radialY * radialWeight) * enemy.speed * 0.016;
    
    enemy.x += velocityX;
    enemy.y += velocityY;
    
    // Occasionally change circle direction
    state.strafeTimer += delta;
    if (state.strafeTimer >= state.strafeDuration) {
      state.circleDirection *= -1;
      state.strafeTimer = 0;
      state.strafeDuration = 2000 + Math.random() * 2000;
    }
  }

  /**
   * Dragon movement: Tactical positioning with retreat behavior
   * Dragons maintain long range, retreat when player gets close
   */
  updateDragonMovement(enemy, player, state, delta, currentTime) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    // Dragons prefer to stay at long range (300+ pixels)
    const safeRange = 350;
    const dangerRange = 200;
    
    state.retreatTimer += delta;
    
    // If player gets too close, retreat
    if (distance < dangerRange) {
      state.isRetreating = true;
      state.retreatTimer = 0;
    }
    
    // Stop retreating after 2 seconds or if far enough
    if (state.isRetreating && (state.retreatTimer > 2000 || distance > safeRange)) {
      state.isRetreating = false;
    }
    
    if (state.isRetreating) {
      // Retreat away from player at high speed
      const velocityX = -(dx / distance) * enemy.speed * 1.3 * 0.016;
      const velocityY = -(dy / distance) * enemy.speed * 1.3 * 0.016;
      
      enemy.x += velocityX;
      enemy.y += velocityY;
    } else if (distance > safeRange) {
      // Move closer if too far
      const velocityX = (dx / distance) * enemy.speed * 0.5 * 0.016;
      const velocityY = (dy / distance) * enemy.speed * 0.5 * 0.016;
      
      enemy.x += velocityX;
      enemy.y += velocityY;
    } else {
      // Maintain position with slight strafing
      const tangentX = -dy / distance;
      const tangentY = dx / distance;
      
      state.circleAngle += 0.001 * delta;
      const strafeAmount = Math.sin(state.circleAngle) * 0.3;
      
      const velocityX = tangentX * strafeAmount * enemy.speed * 0.016;
      const velocityY = tangentY * strafeAmount * enemy.speed * 0.016;
      
      enemy.x += velocityX;
      enemy.y += velocityY;
    }
  }

  /**
   * Basic direct movement towards player
   * @param {Enemy} enemy - Enemy to move
   * @param {PlayerCharacter} player - Player target
   * @param {number} delta - Time delta
   */
  moveDirectly(enemy, player, delta) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const velocityX = (dx / distance) * enemy.speed * 0.016;
      const velocityY = (dy / distance) * enemy.speed * 0.016;

      enemy.x += velocityX;
      enemy.y += velocityY;
    }
  }

  /**
   * Clean up state for a destroyed enemy
   * @param {Enemy} enemy - Enemy to clean up
   */
  removeEnemy(enemy) {
    this.enemyStates.delete(enemy);
  }

  /**
   * Clear all enemy states (for scene cleanup)
   */
  clear() {
    this.enemyStates.clear();
  }
}
