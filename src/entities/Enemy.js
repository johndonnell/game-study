import Phaser from 'phaser';
import { ENEMY_TYPES } from '../config/enemyTypes.js';
import GoblinSprite from '../sprites/enemies/GoblinSprite.js';
import OrcSprite from '../sprites/enemies/OrcSprite.js';
import TrollSprite from '../sprites/enemies/TrollSprite.js';
import DemonSprite from '../sprites/enemies/DemonSprite.js';

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
      }
      
      // Flip sprite based on facing direction
      this.scaleX = this.facingDirection;
    }
  }

  /**
   * Update goblin animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateGoblinAnimation(delta) {
    
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Bobbing animation (up and down)
    const bobAmount = Math.sin(this.animationTime * 0.008) * 2;
    this.bodyGraphics.y = bobAmount;
    this.headGraphics.y = bobAmount;
    this.eyesGraphics.y = bobAmount;
    this.earsGraphics.y = bobAmount;
    
    // Walking animation (legs)
    const legSwing = Math.sin(this.animationTime * 0.01) * 3;
    this.leftLegGraphics.y = 12 + bobAmount + Math.abs(legSwing);
    this.rightLegGraphics.y = 12 + bobAmount + Math.abs(-legSwing);
    
    // Arm swing (opposite to legs)
    const armSwing = Math.sin(this.animationTime * 0.01) * 2;
    this.leftArmGraphics.y = 2 + bobAmount - armSwing;
    this.rightArmGraphics.y = 2 + bobAmount + armSwing;
    
    // Flip sprite based on facing direction
    this.scaleX = this.facingDirection;
  }

  /**
   * Update orc animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateOrcAnimation(delta) {
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Heavy stomping animation
    const stompAmount = Math.sin(this.animationTime * 0.012) * 1.5;
    
    // Body bobs with stomping
    this.bodyGraphics.y = -6 + Math.abs(stompAmount);
    this.armorGraphics.y = -4 + Math.abs(stompAmount);
    this.neckGraphics.y = Math.abs(stompAmount);
    this.headGraphics.y = Math.abs(stompAmount);
    this.tuskGraphics.y = Math.abs(stompAmount);
    this.eyesGraphics.y = Math.abs(stompAmount);
    this.eyebrowsGraphics.y = Math.abs(stompAmount);
    this.noseGraphics.y = Math.abs(stompAmount);
    this.mouthGraphics.y = Math.abs(stompAmount);
    this.shoulderSpikesGraphics.y = Math.abs(stompAmount);
    
    // Heavy leg stomping (more pronounced than goblin)
    const legSwing = Math.sin(this.animationTime * 0.012) * 5;
    this.leftLegGraphics.y = 10 + Math.abs(stompAmount) + Math.abs(legSwing);
    this.leftLegGraphics.rotation = legSwing * 0.08;
    this.rightLegGraphics.y = 10 + Math.abs(stompAmount) + Math.abs(-legSwing);
    this.rightLegGraphics.rotation = -legSwing * 0.08;
    
    // Aggressive arm swing (ready to fight)
    const armSwing = Math.sin(this.animationTime * 0.012) * 4;
    this.leftArmGraphics.y = -2 + Math.abs(stompAmount) - armSwing;
    this.leftArmGraphics.rotation = -armSwing * 0.1;
    this.rightArmGraphics.y = -2 + Math.abs(stompAmount) + armSwing;
    this.rightArmGraphics.rotation = armSwing * 0.1;
    
    // Flip sprite based on facing direction
    this.scaleX = this.facingDirection;
  }

  /**
   * Update troll animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateTrollAnimation(delta) {
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Slow, lumbering walk (slower than orc)
    const lumberAmount = Math.sin(this.animationTime * 0.008) * 2;
    
    // Body sways with lumbering walk
    this.bodyGraphics.y = -4 + Math.abs(lumberAmount);
    this.bodyGraphics.rotation = lumberAmount * 0.02;
    this.backHumpGraphics.y = -6 + Math.abs(lumberAmount);
    this.neckGraphics.y = Math.abs(lumberAmount);
    this.headGraphics.y = Math.abs(lumberAmount);
    this.noseGraphics.y = Math.abs(lumberAmount);
    this.eyesGraphics.y = Math.abs(lumberAmount);
    this.eyebrowsGraphics.y = Math.abs(lumberAmount);
    this.mouthGraphics.y = Math.abs(lumberAmount);
    this.earsGraphics.y = Math.abs(lumberAmount);
    this.wartsGraphics.y = Math.abs(lumberAmount);
    
    // Slow, heavy leg movement
    const legSwing = Math.sin(this.animationTime * 0.008) * 4;
    this.leftLegGraphics.y = 12 + Math.abs(lumberAmount) + Math.abs(legSwing);
    this.leftLegGraphics.rotation = legSwing * 0.06;
    this.rightLegGraphics.y = 12 + Math.abs(lumberAmount) + Math.abs(-legSwing);
    this.rightLegGraphics.rotation = -legSwing * 0.06;
    
    // Long arms swing low (dragging knuckles)
    const armSwing = Math.sin(this.animationTime * 0.008) * 3;
    this.leftArmGraphics.y = Math.abs(lumberAmount) - armSwing;
    this.leftArmGraphics.rotation = -armSwing * 0.05;
    this.rightArmGraphics.y = Math.abs(lumberAmount) + armSwing;
    this.rightArmGraphics.rotation = armSwing * 0.05;
    
    // Flip sprite based on facing direction
    this.scaleX = this.facingDirection;
  }

  /**
   * Update demon animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateDemonAnimation(delta) {
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Menacing, prowling movement (faster than troll, smoother than orc)
    const prowlAmount = Math.sin(this.animationTime * 0.01) * 1.5;
    
    // Body moves smoothly
    this.bodyGraphics.y = -6 + Math.abs(prowlAmount);
    this.neckGraphics.y = Math.abs(prowlAmount);
    this.headGraphics.y = Math.abs(prowlAmount);
    this.hornsGraphics.y = Math.abs(prowlAmount);
    this.eyesGraphics.y = Math.abs(prowlAmount);
    this.noseGraphics.y = Math.abs(prowlAmount);
    this.fangsGraphics.y = Math.abs(prowlAmount);
    
    // Tail swishes menacingly
    const tailSwish = Math.sin(this.animationTime * 0.015) * 0.3;
    this.tailGraphics.rotation = tailSwish;
    this.tailGraphics.y = 8 + Math.abs(prowlAmount);
    
    // Wings flap slightly (breathing motion)
    const wingFlap = Math.sin(this.animationTime * 0.006) * 0.15;
    this.leftWingGraphics.rotation = -0.2 + wingFlap;
    this.leftWingGraphics.y = Math.abs(prowlAmount);
    this.rightWingGraphics.rotation = 0.2 - wingFlap;
    this.rightWingGraphics.y = Math.abs(prowlAmount);
    
    // Digitigrade legs (bent, prowling stance)
    const legProwl = Math.sin(this.animationTime * 0.01) * 3;
    this.leftLegGraphics.y = 8 + Math.abs(prowlAmount) + Math.abs(legProwl);
    this.leftLegGraphics.rotation = legProwl * 0.07;
    this.rightLegGraphics.y = 8 + Math.abs(prowlAmount) + Math.abs(-legProwl);
    this.rightLegGraphics.rotation = -legProwl * 0.07;
    
    // Arms ready to strike
    const armProwl = Math.sin(this.animationTime * 0.01) * 2.5;
    this.leftArmGraphics.y = -2 + Math.abs(prowlAmount) - armProwl;
    this.leftArmGraphics.rotation = -armProwl * 0.08;
    this.rightArmGraphics.y = -2 + Math.abs(prowlAmount) + armProwl;
    this.rightArmGraphics.rotation = armProwl * 0.08;
    
    // Eyes glow pulse
    const glowPulse = Math.sin(this.animationTime * 0.005);
    this.eyesGraphics.alpha = 0.8 + glowPulse * 0.2;
    
    // Flip sprite based on facing direction
    this.scaleX = this.facingDirection;
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
}
