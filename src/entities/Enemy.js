import Phaser from 'phaser';
import { ENEMY_TYPES } from '../config/enemyTypes.js';
import GoblinSprite from '../sprites/enemies/GoblinSprite.js';
import OrcSprite from '../sprites/enemies/OrcSprite.js';
import TrollSprite from '../sprites/enemies/TrollSprite.js';
import DemonSprite from '../sprites/enemies/DemonSprite.js';
import DragonSprite from '../sprites/enemies/DragonSprite.js';

/**
 * Enemy class
 * Represents a computer-controlled hostile entity
 */
export default class Enemy extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this enemy belongs to
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {string} enemyType - Type of enemy (e.g., 'GOBLIN', 'DRAGON')
   * @param {number} roundNumber - Current round number for difficulty scaling
   */
  constructor(scene, x, y, enemyType, roundNumber) {
    super(scene, x, y);
    
    // Validate enemy type
    if (!ENEMY_TYPES[enemyType]) {
      throw new Error(`Invalid enemy type: ${enemyType}`);
    }

    const enemyData = ENEMY_TYPES[enemyType];
    
    // Enemy properties
    this.enemyType = enemyType;
    
    // Apply difficulty scaling based on round number
    // Health scaling: baseHealth * (1 + roundNumber * 0.15)
    const healthMultiplier = 1 + (roundNumber * 0.15);
    this.maxHealth = Math.floor(enemyData.baseHealth * healthMultiplier);
    this.health = this.maxHealth;
    
    // Damage scaling: baseDamage * (1 + roundNumber * 0.1)
    const damageMultiplier = 1 + (roundNumber * 0.1);
    this.damage = Math.floor(enemyData.baseDamage * damageMultiplier);
    
    // Speed and defense don't scale (for now)
    this.speed = enemyData.baseSpeed;
    this.defense = enemyData.baseDefense;
    
    // Animation properties
    this.animationTime = 0;
    this.lastX = x;
    this.lastY = y;
    this.facingDirection = 1; // 1 = right, -1 = left
    
    // Sprite parts (will be populated by sprite modules)
    this.spriteParts = null;
    
    // Ranged attack properties (for dragons, goblins, orcs, trolls, and demons)
    this.lastAttackTime = 0;
    // Different attack speeds and ranges for different enemy types
    if (enemyType === 'GOBLIN') {
      this.attackCooldown = 1500; // 1.5s - fast spear throws
      this.attackRange = 250; // Medium range
    } else if (enemyType === 'ORC') {
      this.attackCooldown = 2500; // 2.5s - slower but powerful axe throws
      this.attackRange = 200; // Short range (orcs prefer melee but can throw)
    } else if (enemyType === 'TROLL') {
      this.attackCooldown = 3500; // 3.5s - very slow rock throws
      this.attackRange = 180; // Very short range (trolls are slow and clumsy)
    } else if (enemyType === 'DEMON') {
      this.attackCooldown = 1200; // 1.2s - very fast fireball attacks
      this.attackRange = 350; // Longest range (demons are magical)
    } else if (enemyType === 'DRAGON') {
      this.attackCooldown = 2000; // 2s - fireball attacks
      this.attackRange = 300; // Long range
    } else {
      this.attackCooldown = 2000;
      this.attackRange = 250;
    }
    
    // Create visual representation
    this.createSprite(enemyType);
    
    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Create visual sprite for enemy based on type
   * @param {string} enemyType - Type of enemy
   */
  createSprite(enemyType) {
    // Use sprite modules for animated enemies
    if (enemyType === 'GOBLIN') {
      this.spriteParts = GoblinSprite.create(this.scene, this);
    } 
    else if (enemyType === 'ORC') {
      this.spriteParts = OrcSprite.create(this.scene, this);
    }
    else if (enemyType === 'TROLL') {
      this.spriteParts = TrollSprite.create(this.scene, this);
    }
    else if (enemyType === 'DEMON') {
      this.spriteParts = DemonSprite.create(this.scene, this);
    }
    else if (enemyType === 'DRAGON') {
      this.spriteParts = DragonSprite.create(this.scene, this);
    }
    else {
      // Default sprite for other enemy types
      this.createDefaultSprite(enemyType);
    }
  }

  /**
   * Create default sprite for other enemy types
   * @param {string} enemyType - Type of enemy
   */
  createDefaultSprite(enemyType) {
    // Define colors and letters for each enemy type
    const enemyVisuals = {
      ORC: { color: 0xff6600, letter: 'O' },       // Orange
      TROLL: { color: 0x8b4513, letter: 'T' },     // Brown
      DEMON: { color: 0xff0000, letter: 'D' },     // Red
      DRAGON: { color: 0x9400d3, letter: 'Dr' }    // Purple
    };

    const visual = enemyVisuals[enemyType] || { color: 0xffffff, letter: '?' };

    // Create graphics for enemy body
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(visual.color, 1);
    graphics.fillCircle(0, 0, 15);

    // Add letter text
    const letterText = this.scene.add.text(0, 0, visual.letter, {
      font: 'bold 16px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    letterText.setOrigin(0.5);

    // Add graphics and text to container
    this.add(graphics);
    this.add(letterText);
  }

  /**
   * Update enemy animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateAnimation(delta) {
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Use sprite module for animation if available
    if (this.spriteParts) {
      if (this.enemyType === 'GOBLIN') {
        GoblinSprite.updateAnimation(this.spriteParts, this.animationTime);
      } else if (this.enemyType === 'ORC') {
        OrcSprite.updateAnimation(this.spriteParts, this.animationTime);
      } else if (this.enemyType === 'TROLL') {
        TrollSprite.updateAnimation(this.spriteParts, this.animationTime);
      } else if (this.enemyType === 'DEMON') {
        DemonSprite.updateAnimation(this.spriteParts, this.animationTime);
      } else if (this.enemyType === 'DRAGON') {
        DragonSprite.updateAnimation(this.spriteParts, this.animationTime);
      }
      
      // Flip sprite based on facing direction
      this.scaleX = this.facingDirection;
    }
  }

  /**
   * Move towards the target (player)
   * @param {PlayerCharacter} target - Target to move towards
   */
  moveTowards(target) {
    if (!target) return;

    // Calculate direction to target
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize and apply speed
      const velocityX = (dx / distance) * this.speed * 0.016; // Assuming 60 FPS (1/60 ≈ 0.016)
      const velocityY = (dy / distance) * this.speed * 0.016;

      this.x += velocityX;
      this.y += velocityY;
    }
  }

  /**
   * Apply damage to the enemy
   * @param {number} amount - Amount of damage to apply
   */
  takeDamage(amount) {
    // Apply defense reduction
    const actualDamage = Math.max(1, amount - this.defense);
    this.health -= actualDamage;
    this.health = Math.max(0, this.health);
  }

  /**
   * Check if enemy is dead
   * @returns {boolean} True if health is zero
   */
  isDead() {
    return this.health <= 0;
  }

  /**
   * Attack the target (player)
   * @param {PlayerCharacter} target - Target to attack
   */
  attack(target) {
    if (!target) return;
    target.takeDamage(this.damage);
  }

  /**
   * Check if enemy can perform ranged attack
   * @param {number} currentTime - Current game time
   * @returns {boolean} True if can attack
   */
  canRangedAttack(currentTime) {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }

  /**
   * Record ranged attack time
   * @param {number} currentTime - Current game time
   */
  recordRangedAttack(currentTime) {
    this.lastAttackTime = currentTime;
  }

  /**
   * Check if enemy has ranged attack capability
   * @returns {boolean} True if enemy can attack at range
   */
  hasRangedAttack() {
    return this.enemyType === 'DRAGON' || this.enemyType === 'GOBLIN' || this.enemyType === 'ORC' || this.enemyType === 'TROLL' || this.enemyType === 'DEMON';
  }

  /**
   * Get ranged attack range
   * @returns {number} Attack range in pixels
   */
  getRangedAttackRange() {
    return this.attackRange;
  }
}
