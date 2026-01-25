import Phaser from 'phaser';
import { ENEMY_TYPES } from '../config/enemyTypes.js';

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
    // For GOBLIN, create an animated sprite
    if (enemyType === 'GOBLIN') {
      this.createGoblinSprite();
    } else {
      // Default sprite for other enemy types
      this.createDefaultSprite(enemyType);
    }
  }

  /**
   * Create animated goblin sprite
   */
  createGoblinSprite() {
    // Body (green oval)
    this.bodyGraphics = this.scene.add.graphics();
    this.bodyGraphics.fillStyle(0x00ff00, 1);
    this.bodyGraphics.fillEllipse(0, 0, 24, 30);
    
    // Head (lighter green circle)
    this.headGraphics = this.scene.add.graphics();
    this.headGraphics.fillStyle(0x33ff33, 1);
    this.headGraphics.fillCircle(0, -12, 10);
    
    // Eyes (yellow with black pupils)
    this.eyesGraphics = this.scene.add.graphics();
    this.eyesGraphics.fillStyle(0xffff00, 1);
    this.eyesGraphics.fillCircle(-4, -12, 3);
    this.eyesGraphics.fillCircle(4, -12, 3);
    this.eyesGraphics.fillStyle(0x000000, 1);
    this.eyesGraphics.fillCircle(-4, -12, 1.5);
    this.eyesGraphics.fillCircle(4, -12, 1.5);
    
    // Ears (pointy)
    this.earsGraphics = this.scene.add.graphics();
    this.earsGraphics.fillStyle(0x00cc00, 1);
    this.earsGraphics.fillTriangle(-10, -12, -14, -10, -10, -8);
    this.earsGraphics.fillTriangle(10, -12, 14, -10, 10, -8);
    
    // Arms (will animate)
    this.leftArmGraphics = this.scene.add.graphics();
    this.leftArmGraphics.fillStyle(0x00ff00, 1);
    this.leftArmGraphics.fillEllipse(-10, 2, 6, 12);
    
    this.rightArmGraphics = this.scene.add.graphics();
    this.rightArmGraphics.fillStyle(0x00ff00, 1);
    this.rightArmGraphics.fillEllipse(10, 2, 6, 12);
    
    // Legs (will animate)
    this.leftLegGraphics = this.scene.add.graphics();
    this.leftLegGraphics.fillStyle(0x009900, 1);
    this.leftLegGraphics.fillEllipse(-5, 12, 6, 10);
    
    this.rightLegGraphics = this.scene.add.graphics();
    this.rightLegGraphics.fillStyle(0x009900, 1);
    this.rightLegGraphics.fillEllipse(5, 12, 6, 10);
    
    // Add all parts to container in correct order (back to front)
    this.add(this.leftArmGraphics);
    this.add(this.leftLegGraphics);
    this.add(this.bodyGraphics);
    this.add(this.rightLegGraphics);
    this.add(this.rightArmGraphics);
    this.add(this.earsGraphics);
    this.add(this.headGraphics);
    this.add(this.eyesGraphics);
  }

  /**
   * Create default sprite for non-goblin enemies
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
   * Update goblin animation
   * @param {number} delta - Time since last update in milliseconds
   */
  updateAnimation(delta) {
    if (this.enemyType !== 'GOBLIN') return;
    
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
