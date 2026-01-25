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
    } 
    // For ORC, create an animated sprite
    else if (enemyType === 'ORC') {
      this.createOrcSprite();
    }
    else {
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
   * Create animated orc sprite
   */
  createOrcSprite() {
    // Legs (brown/gray pants)
    this.leftLegGraphics = this.scene.add.graphics();
    this.leftLegGraphics.fillStyle(0x654321, 1);
    this.leftLegGraphics.fillRect(-8, 10, 7, 12);
    
    this.rightLegGraphics = this.scene.add.graphics();
    this.rightLegGraphics.fillStyle(0x654321, 1);
    this.rightLegGraphics.fillRect(1, 10, 7, 12);
    
    // Body (muscular - orange/brown skin)
    this.bodyGraphics = this.scene.add.graphics();
    this.bodyGraphics.fillStyle(0xcc6600, 1); // Orange-brown
    this.bodyGraphics.fillRect(-12, -6, 24, 16);
    
    // Armor vest (dark metal)
    this.armorGraphics = this.scene.add.graphics();
    this.armorGraphics.fillStyle(0x4a4a4a, 1);
    this.armorGraphics.fillRect(-10, -4, 20, 10);
    // Armor studs
    this.armorGraphics.fillStyle(0x808080, 1);
    this.armorGraphics.fillCircle(-6, 0, 1.5);
    this.armorGraphics.fillCircle(6, 0, 1.5);
    
    // Arms (muscular - orange/brown)
    this.leftArmGraphics = this.scene.add.graphics();
    this.leftArmGraphics.fillStyle(0xcc6600, 1);
    this.leftArmGraphics.fillRect(-16, -2, 6, 10);
    // Fist
    this.leftArmGraphics.fillCircle(-13, 10, 3);
    
    this.rightArmGraphics = this.scene.add.graphics();
    this.rightArmGraphics.fillStyle(0xcc6600, 1);
    this.rightArmGraphics.fillRect(10, -2, 6, 10);
    // Fist
    this.rightArmGraphics.fillCircle(13, 10, 3);
    
    // Neck (orange/brown)
    this.neckGraphics = this.scene.add.graphics();
    this.neckGraphics.fillStyle(0xcc6600, 1);
    this.neckGraphics.fillRect(-4, -8, 8, 4);
    
    // Head (large and brutish - orange/brown)
    this.headGraphics = this.scene.add.graphics();
    this.headGraphics.fillStyle(0xcc6600, 1);
    this.headGraphics.fillRect(-8, -18, 16, 12);
    // Forehead ridge
    this.headGraphics.fillRect(-8, -19, 16, 2);
    
    // Tusks (white/ivory)
    this.tuskGraphics = this.scene.add.graphics();
    this.tuskGraphics.fillStyle(0xfff8dc, 1);
    // Left tusk
    this.tuskGraphics.fillTriangle(-6, -8, -4, -8, -5, -4);
    // Right tusk
    this.tuskGraphics.fillTriangle(6, -8, 4, -8, 5, -4);
    
    // Eyes (red and angry)
    this.eyesGraphics = this.scene.add.graphics();
    this.eyesGraphics.fillStyle(0xffff00, 1);
    this.eyesGraphics.fillRect(-6, -14, 3, 3);
    this.eyesGraphics.fillRect(3, -14, 3, 3);
    this.eyesGraphics.fillStyle(0xff0000, 1); // Red pupils
    this.eyesGraphics.fillRect(-5, -13, 1, 2);
    this.eyesGraphics.fillRect(4, -13, 1, 2);
    
    // Eyebrows (thick and angry)
    this.eyebrowsGraphics = this.scene.add.graphics();
    this.eyebrowsGraphics.fillStyle(0x4a2511, 1);
    this.eyebrowsGraphics.fillRect(-7, -15, 4, 1);
    this.eyebrowsGraphics.fillRect(3, -15, 4, 1);
    
    // Nose (flat and wide)
    this.noseGraphics = this.scene.add.graphics();
    this.noseGraphics.fillStyle(0xb35900, 1); // Darker orange
    this.noseGraphics.fillRect(-2, -11, 4, 3);
    
    // Mouth (snarling)
    this.mouthGraphics = this.scene.add.graphics();
    this.mouthGraphics.fillStyle(0x4a2511, 1);
    this.mouthGraphics.fillRect(-4, -8, 8, 2);
    
    // Shoulder spikes (armor)
    this.shoulderSpikesGraphics = this.scene.add.graphics();
    this.shoulderSpikesGraphics.fillStyle(0x808080, 1);
    this.shoulderSpikesGraphics.fillTriangle(-14, -6, -12, -10, -10, -6);
    this.shoulderSpikesGraphics.fillTriangle(14, -6, 12, -10, 10, -6);
    
    // Add all parts to container in correct order (back to front)
    this.add(this.leftLegGraphics);
    this.add(this.rightLegGraphics);
    this.add(this.leftArmGraphics);
    this.add(this.bodyGraphics);
    this.add(this.armorGraphics);
    this.add(this.rightArmGraphics);
    this.add(this.shoulderSpikesGraphics);
    this.add(this.neckGraphics);
    this.add(this.headGraphics);
    this.add(this.tuskGraphics);
    this.add(this.eyebrowsGraphics);
    this.add(this.eyesGraphics);
    this.add(this.noseGraphics);
    this.add(this.mouthGraphics);
  }

  /**
   * Create default sprite for non-goblin/non-orc enemies
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
    if (this.enemyType === 'GOBLIN') {
      this.updateGoblinAnimation(delta);
    } else if (this.enemyType === 'ORC') {
      this.updateOrcAnimation(delta);
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
