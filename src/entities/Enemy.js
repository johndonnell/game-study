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
    // For TROLL, create an animated sprite
    else if (enemyType === 'TROLL') {
      this.createTrollSprite();
    }
    // For DEMON, create an animated sprite
    else if (enemyType === 'DEMON') {
      this.createDemonSprite();
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
   * Create animated troll sprite
   */
  createTrollSprite() {
    // Legs (massive and thick - brown/gray)
    this.leftLegGraphics = this.scene.add.graphics();
    this.leftLegGraphics.fillStyle(0x6b5d4f, 1); // Dark brown-gray
    this.leftLegGraphics.fillRect(-10, 12, 9, 16);
    // Foot
    this.leftLegGraphics.fillRect(-12, 26, 13, 4);
    
    this.rightLegGraphics = this.scene.add.graphics();
    this.rightLegGraphics.fillStyle(0x6b5d4f, 1);
    this.rightLegGraphics.fillRect(1, 12, 9, 16);
    // Foot
    this.rightLegGraphics.fillRect(-1, 26, 13, 4);
    
    // Body (huge and hunched - brown/gray skin)
    this.bodyGraphics = this.scene.add.graphics();
    this.bodyGraphics.fillStyle(0x8b7355, 1); // Brown
    this.bodyGraphics.fillRect(-14, -4, 28, 18);
    // Belly
    this.bodyGraphics.fillStyle(0x9d8568, 1); // Lighter brown
    this.bodyGraphics.fillEllipse(0, 6, 22, 14);
    
    // Arms (long and muscular - hanging low)
    this.leftArmGraphics = this.scene.add.graphics();
    this.leftArmGraphics.fillStyle(0x8b7355, 1);
    this.leftArmGraphics.fillRect(-18, 0, 7, 16);
    // Large hand/claw
    this.leftArmGraphics.fillCircle(-14, 18, 5);
    this.leftArmGraphics.fillStyle(0x6b5d4f, 1);
    this.leftArmGraphics.fillRect(-16, 18, 2, 4); // Claws
    this.leftArmGraphics.fillRect(-14, 18, 2, 4);
    this.leftArmGraphics.fillRect(-12, 18, 2, 4);
    
    this.rightArmGraphics = this.scene.add.graphics();
    this.rightArmGraphics.fillStyle(0x8b7355, 1);
    this.rightArmGraphics.fillRect(11, 0, 7, 16);
    // Large hand/claw
    this.rightArmGraphics.fillCircle(14, 18, 5);
    this.rightArmGraphics.fillStyle(0x6b5d4f, 1);
    this.rightArmGraphics.fillRect(12, 18, 2, 4); // Claws
    this.rightArmGraphics.fillRect(14, 18, 2, 4);
    this.rightArmGraphics.fillRect(16, 18, 2, 4);
    
    // Hunched back (bump)
    this.backHumpGraphics = this.scene.add.graphics();
    this.backHumpGraphics.fillStyle(0x8b7355, 1);
    this.backHumpGraphics.fillEllipse(0, -6, 20, 8);
    
    // Neck (thick and short)
    this.neckGraphics = this.scene.add.graphics();
    this.neckGraphics.fillStyle(0x8b7355, 1);
    this.neckGraphics.fillRect(-6, -10, 12, 6);
    
    // Head (large and brutish - brown)
    this.headGraphics = this.scene.add.graphics();
    this.headGraphics.fillStyle(0x8b7355, 1);
    this.headGraphics.fillRect(-10, -22, 20, 14);
    // Forehead (protruding)
    this.headGraphics.fillRect(-10, -24, 20, 3);
    
    // Nose (large and bulbous)
    this.noseGraphics = this.scene.add.graphics();
    this.noseGraphics.fillStyle(0x7a6449, 1); // Darker brown
    this.noseGraphics.fillEllipse(0, -14, 6, 8);
    // Nostrils
    this.noseGraphics.fillStyle(0x4a3829, 1);
    this.noseGraphics.fillCircle(-2, -12, 1.5);
    this.noseGraphics.fillCircle(2, -12, 1.5);
    
    // Eyes (small and beady - yellow)
    this.eyesGraphics = this.scene.add.graphics();
    this.eyesGraphics.fillStyle(0xffff00, 1);
    this.eyesGraphics.fillCircle(-5, -18, 2.5);
    this.eyesGraphics.fillCircle(5, -18, 2.5);
    this.eyesGraphics.fillStyle(0x000000, 1);
    this.eyesGraphics.fillCircle(-5, -18, 1);
    this.eyesGraphics.fillCircle(5, -18, 1);
    
    // Eyebrows (thick and heavy)
    this.eyebrowsGraphics = this.scene.add.graphics();
    this.eyebrowsGraphics.fillStyle(0x6b5d4f, 1);
    this.eyebrowsGraphics.fillRect(-7, -20, 5, 2);
    this.eyebrowsGraphics.fillRect(2, -20, 5, 2);
    
    // Mouth (large with teeth)
    this.mouthGraphics = this.scene.add.graphics();
    this.mouthGraphics.fillStyle(0x4a3829, 1);
    this.mouthGraphics.fillRect(-6, -10, 12, 3);
    // Teeth
    this.mouthGraphics.fillStyle(0xfff8dc, 1);
    this.mouthGraphics.fillRect(-5, -10, 2, 2);
    this.mouthGraphics.fillRect(-1, -10, 2, 2);
    this.mouthGraphics.fillRect(3, -10, 2, 2);
    
    // Ears (small and pointed)
    this.earsGraphics = this.scene.add.graphics();
    this.earsGraphics.fillStyle(0x8b7355, 1);
    this.earsGraphics.fillTriangle(-10, -16, -13, -14, -10, -12);
    this.earsGraphics.fillTriangle(10, -16, 13, -14, 10, -12);
    
    // Warts/bumps on skin
    this.wartsGraphics = this.scene.add.graphics();
    this.wartsGraphics.fillStyle(0x7a6449, 1);
    this.wartsGraphics.fillCircle(-8, -16, 1.5);
    this.wartsGraphics.fillCircle(7, -14, 1.5);
    this.wartsGraphics.fillCircle(-10, 2, 2);
    this.wartsGraphics.fillCircle(9, 4, 2);
    
    // Add all parts to container in correct order (back to front)
    this.add(this.leftLegGraphics);
    this.add(this.rightLegGraphics);
    this.add(this.leftArmGraphics);
    this.add(this.backHumpGraphics);
    this.add(this.bodyGraphics);
    this.add(this.wartsGraphics);
    this.add(this.rightArmGraphics);
    this.add(this.neckGraphics);
    this.add(this.earsGraphics);
    this.add(this.headGraphics);
    this.add(this.noseGraphics);
    this.add(this.eyebrowsGraphics);
    this.add(this.eyesGraphics);
    this.add(this.mouthGraphics);
  }

  /**
   * Create animated demon sprite
   */
  createDemonSprite() {
    // Legs (digitigrade - bent like goat legs, dark red)
    this.leftLegGraphics = this.scene.add.graphics();
    this.leftLegGraphics.fillStyle(0x8b0000, 1); // Dark red
    this.leftLegGraphics.fillRect(-7, 8, 5, 10);
    // Lower leg (bent back)
    this.leftLegGraphics.fillRect(-9, 14, 5, 8);
    // Hoof
    this.leftLegGraphics.fillStyle(0x000000, 1);
    this.leftLegGraphics.fillRect(-10, 20, 6, 3);
    
    this.rightLegGraphics = this.scene.add.graphics();
    this.rightLegGraphics.fillStyle(0x8b0000, 1);
    this.rightLegGraphics.fillRect(2, 8, 5, 10);
    // Lower leg (bent back)
    this.rightLegGraphics.fillRect(4, 14, 5, 8);
    // Hoof
    this.rightLegGraphics.fillStyle(0x000000, 1);
    this.rightLegGraphics.fillRect(4, 20, 6, 3);
    
    // Tail (long and pointed)
    this.tailGraphics = this.scene.add.graphics();
    this.tailGraphics.fillStyle(0xcc0000, 1); // Bright red
    this.tailGraphics.fillTriangle(0, 8, -4, 16, 2, 12);
    // Tail tip (spade)
    this.tailGraphics.fillStyle(0x8b0000, 1);
    this.tailGraphics.fillTriangle(-4, 16, -6, 18, -2, 18);
    
    // Body (muscular and lean - red)
    this.bodyGraphics = this.scene.add.graphics();
    this.bodyGraphics.fillStyle(0xcc0000, 1); // Bright red
    this.bodyGraphics.fillRect(-10, -6, 20, 14);
    // Chest muscles
    this.bodyGraphics.fillStyle(0xb30000, 1);
    this.bodyGraphics.fillEllipse(-4, -2, 6, 8);
    this.bodyGraphics.fillEllipse(4, -2, 6, 8);
    
    // Wings (bat-like, folded)
    this.leftWingGraphics = this.scene.add.graphics();
    this.leftWingGraphics.fillStyle(0x4a0000, 1); // Very dark red
    this.leftWingGraphics.fillTriangle(-10, -4, -16, -2, -12, 4);
    // Wing membrane
    this.leftWingGraphics.fillStyle(0x660000, 0.7);
    this.leftWingGraphics.fillTriangle(-10, -3, -14, -1, -11, 3);
    
    this.rightWingGraphics = this.scene.add.graphics();
    this.rightWingGraphics.fillStyle(0x4a0000, 1);
    this.rightWingGraphics.fillTriangle(10, -4, 16, -2, 12, 4);
    // Wing membrane
    this.rightWingGraphics.fillStyle(0x660000, 0.7);
    this.rightWingGraphics.fillTriangle(10, -3, 14, -1, 11, 3);
    
    // Arms (muscular with claws)
    this.leftArmGraphics = this.scene.add.graphics();
    this.leftArmGraphics.fillStyle(0xcc0000, 1);
    this.leftArmGraphics.fillRect(-14, -2, 5, 10);
    // Clawed hand
    this.leftArmGraphics.fillCircle(-11, 10, 3);
    this.leftArmGraphics.fillStyle(0x000000, 1);
    this.leftArmGraphics.fillRect(-13, 10, 1, 4); // Claws
    this.leftArmGraphics.fillRect(-11, 10, 1, 4);
    this.leftArmGraphics.fillRect(-9, 10, 1, 4);
    
    this.rightArmGraphics = this.scene.add.graphics();
    this.rightArmGraphics.fillStyle(0xcc0000, 1);
    this.rightArmGraphics.fillRect(9, -2, 5, 10);
    // Clawed hand
    this.rightArmGraphics.fillCircle(11, 10, 3);
    this.rightArmGraphics.fillStyle(0x000000, 1);
    this.rightArmGraphics.fillRect(9, 10, 1, 4); // Claws
    this.rightArmGraphics.fillRect(11, 10, 1, 4);
    this.rightArmGraphics.fillRect(13, 10, 1, 4);
    
    // Neck
    this.neckGraphics = this.scene.add.graphics();
    this.neckGraphics.fillStyle(0xcc0000, 1);
    this.neckGraphics.fillRect(-4, -8, 8, 4);
    
    // Head (demonic with angular features)
    this.headGraphics = this.scene.add.graphics();
    this.headGraphics.fillStyle(0xcc0000, 1);
    this.headGraphics.fillRect(-7, -18, 14, 12);
    // Jaw
    this.headGraphics.fillRect(-6, -8, 12, 3);
    
    // Horns (curved and menacing)
    this.hornsGraphics = this.scene.add.graphics();
    this.hornsGraphics.fillStyle(0x1a1a1a, 1); // Black
    // Left horn
    this.hornsGraphics.fillTriangle(-7, -18, -9, -22, -6, -20);
    this.hornsGraphics.fillTriangle(-9, -22, -11, -20, -8, -20);
    // Right horn
    this.hornsGraphics.fillTriangle(7, -18, 9, -22, 6, -20);
    this.hornsGraphics.fillTriangle(9, -22, 11, -20, 8, -20);
    
    // Eyes (glowing yellow/orange)
    this.eyesGraphics = this.scene.add.graphics();
    this.eyesGraphics.fillStyle(0xff6600, 1); // Orange glow
    this.eyesGraphics.fillCircle(-4, -14, 3);
    this.eyesGraphics.fillCircle(4, -14, 3);
    this.eyesGraphics.fillStyle(0xffff00, 1); // Yellow center
    this.eyesGraphics.fillCircle(-4, -14, 1.5);
    this.eyesGraphics.fillCircle(4, -14, 1.5);
    
    // Fangs
    this.fangsGraphics = this.scene.add.graphics();
    this.fangsGraphics.fillStyle(0xffffff, 1);
    this.fangsGraphics.fillTriangle(-4, -8, -3, -5, -2, -8);
    this.fangsGraphics.fillTriangle(4, -8, 3, -5, 2, -8);
    
    // Nose (small and pointed)
    this.noseGraphics = this.scene.add.graphics();
    this.noseGraphics.fillStyle(0xb30000, 1);
    this.noseGraphics.fillTriangle(0, -12, -2, -10, 2, -10);
    
    // Add all parts to container in correct order (back to front)
    this.add(this.tailGraphics);
    this.add(this.leftWingGraphics);
    this.add(this.rightWingGraphics);
    this.add(this.leftLegGraphics);
    this.add(this.rightLegGraphics);
    this.add(this.leftArmGraphics);
    this.add(this.bodyGraphics);
    this.add(this.rightArmGraphics);
    this.add(this.neckGraphics);
    this.add(this.headGraphics);
    this.add(this.hornsGraphics);
    this.add(this.eyesGraphics);
    this.add(this.noseGraphics);
    this.add(this.fangsGraphics);
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
    if (this.enemyType === 'GOBLIN') {
      this.updateGoblinAnimation(delta);
    } else if (this.enemyType === 'ORC') {
      this.updateOrcAnimation(delta);
    } else if (this.enemyType === 'TROLL') {
      this.updateTrollAnimation(delta);
    } else if (this.enemyType === 'DEMON') {
      this.updateDemonAnimation(delta);
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
