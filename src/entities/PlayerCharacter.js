import Phaser from 'phaser';
import { CHARACTER_TYPES } from '../config/characterTypes.js';

/**
 * PlayerCharacter class
 * Represents the player-controlled character with stats and equipment
 */
export default class PlayerCharacter extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this character belongs to
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {string} characterType - Type of character (WARRIOR, ROGUE, MAGE)
   */
  constructor(scene, x, y, characterType) {
    super(scene, x, y);
    
    // Validate character type
    if (!CHARACTER_TYPES[characterType]) {
      throw new Error(`Invalid character type: ${characterType}`);
    }

    const charData = CHARACTER_TYPES[characterType];
    
    // Character properties
    this.characterType = characterType;
    
    // Base attributes (never modified except by stat point allocation)
    this.baseAttributes = {
      strength: charData.baseStats.strength,
      speed: charData.baseStats.speed,
      defense: charData.baseStats.defense,
      vitality: charData.baseStats.vitality,
      dexterity: charData.baseStats.dexterity
    };
    
    // Calculate max health based solely on vitality (10 HP per vitality point)
    this.maxHealth = this.baseAttributes.vitality * 10;
    this.health = this.maxHealth;
    
    // Current attributes (modified by items)
    this.currentAttributes = {
      strength: this.baseAttributes.strength,
      speed: this.baseAttributes.speed,
      defense: this.baseAttributes.defense,
      vitality: this.baseAttributes.vitality,
      dexterity: this.baseAttributes.dexterity
    };
    
    // Equipment arrays
    this.equippedWeapons = [];
    this.equippedItems = [];
    
    // Invincibility frames
    this.isInvincible = false;
    this.invincibilityEndTime = 0;
    
    // Animation properties
    this.animationTime = 0;
    this.lastX = x;
    this.lastY = y;
    this.facingDirection = 1; // 1 = right, -1 = left
    this.isMoving = false;
    
    // Create visual representation
    this.createSprite(characterType);
    
    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Create visual sprite for player based on character type
   * @param {string} characterType - Type of character
   */
  createSprite(characterType) {
    // For WARRIOR, create an animated barbarian sprite
    if (characterType === 'WARRIOR') {
      this.createBarbarianSprite();
    } else {
      // Default sprite for other character types
      this.createDefaultSprite(characterType);
    }
  }

  /**
   * Create animated barbarian sprite for warrior
   */
  createBarbarianSprite() {
    // Legs (brown pants)
    this.leftLegGraphics = this.scene.add.graphics();
    this.leftLegGraphics.fillStyle(0x8b4513, 1);
    this.leftLegGraphics.fillRect(-8, 8, 6, 14);
    
    this.rightLegGraphics = this.scene.add.graphics();
    this.rightLegGraphics.fillStyle(0x8b4513, 1);
    this.rightLegGraphics.fillRect(2, 8, 6, 14);
    
    // Body (muscular torso - tan/beige)
    this.bodyGraphics = this.scene.add.graphics();
    this.bodyGraphics.fillStyle(0xd2b48c, 1);
    this.bodyGraphics.fillRect(-10, -8, 20, 16);
    
    // Belt (dark brown)
    this.beltGraphics = this.scene.add.graphics();
    this.beltGraphics.fillStyle(0x654321, 1);
    this.beltGraphics.fillRect(-10, 6, 20, 3);
    
    // Arms (muscular - tan/beige)
    this.leftArmGraphics = this.scene.add.graphics();
    this.leftArmGraphics.fillStyle(0xd2b48c, 1);
    this.leftArmGraphics.fillRect(-14, -4, 5, 12);
    
    this.rightArmGraphics = this.scene.add.graphics();
    this.rightArmGraphics.fillStyle(0xd2b48c, 1);
    this.rightArmGraphics.fillRect(9, -4, 5, 12);
    
    // Neck (tan/beige)
    this.neckGraphics = this.scene.add.graphics();
    this.neckGraphics.fillStyle(0xd2b48c, 1);
    this.neckGraphics.fillRect(-3, -10, 6, 4);
    
    // Head (tan/beige - more defined shape)
    this.headGraphics = this.scene.add.graphics();
    this.headGraphics.fillStyle(0xd2b48c, 1);
    // Square jaw
    this.headGraphics.fillRect(-6, -18, 12, 10);
    // Forehead
    this.headGraphics.fillRect(-5, -20, 10, 2);
    
    // Long black hair (Conan style)
    this.hairGraphics = this.scene.add.graphics();
    this.hairGraphics.fillStyle(0x1a1a1a, 1); // Black hair
    // Hair on top and sides
    this.hairGraphics.fillRect(-7, -22, 14, 4); // Top of head
    this.hairGraphics.fillRect(-8, -20, 2, 8); // Left side
    this.hairGraphics.fillRect(6, -20, 2, 8); // Right side
    // Long hair flowing down
    this.hairGraphics.fillRect(-8, -12, 2, 6); // Left long hair
    this.hairGraphics.fillRect(6, -12, 2, 6); // Right long hair
    // Hair strands at bottom
    this.hairGraphics.fillRect(-7, -6, 1, 2);
    this.hairGraphics.fillRect(6, -6, 1, 2);
    
    // Headband (brown leather)
    this.headbandGraphics = this.scene.add.graphics();
    this.headbandGraphics.fillStyle(0x654321, 1);
    this.headbandGraphics.fillRect(-7, -19, 14, 2);
    
    // Eyes (fierce look - smaller and more intense)
    this.eyesGraphics = this.scene.add.graphics();
    this.eyesGraphics.fillStyle(0xffffff, 1);
    this.eyesGraphics.fillRect(-4, -15, 2, 2);
    this.eyesGraphics.fillRect(2, -15, 2, 2);
    this.eyesGraphics.fillStyle(0x000000, 1);
    this.eyesGraphics.fillRect(-4, -15, 1, 2);
    this.eyesGraphics.fillRect(2, -15, 1, 2);
    
    // Eyebrows (thick and angry)
    this.eyebrowsGraphics = this.scene.add.graphics();
    this.eyebrowsGraphics.fillStyle(0x1a1a1a, 1);
    this.eyebrowsGraphics.fillRect(-5, -16, 3, 1);
    this.eyebrowsGraphics.fillRect(2, -16, 3, 1);
    
    // Nose (simple)
    this.noseGraphics = this.scene.add.graphics();
    this.noseGraphics.fillStyle(0xc19a6b, 1); // Slightly darker tan
    this.noseGraphics.fillRect(-1, -13, 2, 3);
    
    // Mouth (stern expression)
    this.mouthGraphics = this.scene.add.graphics();
    this.mouthGraphics.fillStyle(0x8b4513, 1);
    this.mouthGraphics.fillRect(-2, -10, 4, 1);
    
    // Shoulder pads (armor - gray)
    this.shoulderPadsGraphics = this.scene.add.graphics();
    this.shoulderPadsGraphics.fillStyle(0x808080, 1);
    this.shoulderPadsGraphics.fillCircle(-11, -6, 4);
    this.shoulderPadsGraphics.fillCircle(11, -6, 4);
    
    // Add all parts to container in correct order (back to front)
    this.add(this.leftLegGraphics);
    this.add(this.rightLegGraphics);
    this.add(this.leftArmGraphics);
    this.add(this.bodyGraphics);
    this.add(this.beltGraphics);
    this.add(this.rightArmGraphics);
    this.add(this.shoulderPadsGraphics);
    this.add(this.neckGraphics);
    this.add(this.hairGraphics); // Hair behind head
    this.add(this.headGraphics);
    this.add(this.headbandGraphics);
    this.add(this.eyebrowsGraphics);
    this.add(this.eyesGraphics);
    this.add(this.noseGraphics);
    this.add(this.mouthGraphics);
  }

  /**
   * Create default sprite for non-warrior characters
   * @param {string} characterType - Type of character
   */
  createDefaultSprite(characterType) {
    // Define colors for each character type
    const characterVisuals = {
      ROGUE: { color: 0x00ff00, letter: 'R' },     // Green
      MAGE: { color: 0xff00ff, letter: 'M' }       // Magenta
    };

    const visual = characterVisuals[characterType] || { color: 0xffffff, letter: 'P' };

    // Create graphics for player body
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(visual.color, 1);
    graphics.fillCircle(0, 0, 20);

    // Add letter text
    const letterText = this.scene.add.text(0, 0, visual.letter, {
      font: 'bold 20px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    letterText.setOrigin(0.5);

    // Add graphics and text to container
    this.add(graphics);
    this.add(letterText);
  }

  /**
   * Update barbarian animation
   * @param {number} delta - Time since last update in milliseconds
   * @param {boolean} isMoving - Whether the character is currently moving
   */
  updateAnimation(delta, isMoving) {
    if (this.characterType !== 'WARRIOR') return;
    
    // Update animation time
    this.animationTime += delta;
    
    // Calculate movement direction for facing
    const dx = this.x - this.lastX;
    if (Math.abs(dx) > 0.1) {
      this.facingDirection = dx > 0 ? 1 : -1;
    }
    this.lastX = this.x;
    this.lastY = this.y;
    this.isMoving = isMoving;
    
    if (isMoving) {
      // Walking animation
      const bobAmount = Math.sin(this.animationTime * 0.01) * 1.5;
      
      // Bob the entire body
      this.bodyGraphics.y = bobAmount;
      this.beltGraphics.y = 6 + bobAmount;
      this.neckGraphics.y = bobAmount;
      this.headGraphics.y = bobAmount;
      this.hairGraphics.y = bobAmount;
      this.headbandGraphics.y = bobAmount;
      this.eyesGraphics.y = bobAmount;
      this.eyebrowsGraphics.y = bobAmount;
      this.noseGraphics.y = bobAmount;
      this.mouthGraphics.y = bobAmount;
      this.shoulderPadsGraphics.y = bobAmount;
      
      // Walking animation (legs)
      const legSwing = Math.sin(this.animationTime * 0.012) * 4;
      this.leftLegGraphics.y = 8 + bobAmount + Math.abs(legSwing);
      this.leftLegGraphics.rotation = legSwing * 0.05;
      this.rightLegGraphics.y = 8 + bobAmount + Math.abs(-legSwing);
      this.rightLegGraphics.rotation = -legSwing * 0.05;
      
      // Arm swing (opposite to legs - more aggressive)
      const armSwing = Math.sin(this.animationTime * 0.012) * 3;
      this.leftArmGraphics.y = -4 + bobAmount - armSwing;
      this.leftArmGraphics.rotation = -armSwing * 0.08;
      this.rightArmGraphics.y = -4 + bobAmount + armSwing;
      this.rightArmGraphics.rotation = armSwing * 0.08;
    } else {
      // Idle animation - breathing
      const breathAmount = Math.sin(this.animationTime * 0.003) * 0.5;
      
      this.bodyGraphics.y = breathAmount;
      this.beltGraphics.y = 6 + breathAmount;
      this.neckGraphics.y = breathAmount;
      this.headGraphics.y = breathAmount;
      this.hairGraphics.y = breathAmount;
      this.headbandGraphics.y = breathAmount;
      this.eyesGraphics.y = breathAmount;
      this.eyebrowsGraphics.y = breathAmount;
      this.noseGraphics.y = breathAmount;
      this.mouthGraphics.y = breathAmount;
      this.shoulderPadsGraphics.y = breathAmount;
      
      // Reset limbs to neutral position
      this.leftLegGraphics.y = 8;
      this.leftLegGraphics.rotation = 0;
      this.rightLegGraphics.y = 8;
      this.rightLegGraphics.rotation = 0;
      this.leftArmGraphics.y = -4;
      this.leftArmGraphics.rotation = 0;
      this.rightArmGraphics.y = -4;
      this.rightArmGraphics.rotation = 0;
    }
    
    // Flip sprite based on facing direction
    this.scaleX = this.facingDirection;
  }

  /**
   * Move the character with velocity
   * @param {number} velocityX - Horizontal velocity
   * @param {number} velocityY - Vertical velocity
   */
  move(velocityX, velocityY) {
    // Apply movement
    this.x += velocityX;
    this.y += velocityY;
    
    // Clamp to screen boundaries
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    this.x = Phaser.Math.Clamp(this.x, 0, width);
    this.y = Phaser.Math.Clamp(this.y, 0, height);
  }

  /**
   * Apply damage to the character
   * @param {number} amount - Amount of damage to apply
   * @param {number} currentTime - Current game time in milliseconds
   */
  takeDamage(amount, currentTime = Date.now()) {
    // Check if invincible
    if (this.isInvincible) {
      return;
    }
    
    this.health -= amount;
    this.health = Math.max(0, this.health);
    
    // Grant 0.25 seconds of invincibility
    this.isInvincible = true;
    this.invincibilityEndTime = currentTime + 250; // 250ms = 0.25 seconds
  }
  
  /**
   * Update invincibility status (call this in game loop)
   * @param {number} currentTime - Current time in milliseconds
   */
  updateInvincibility(currentTime) {
    if (this.isInvincible && currentTime >= this.invincibilityEndTime) {
      this.isInvincible = false;
      this.alpha = 1; // Reset alpha when invincibility ends
    }
    
    // Flash effect during invincibility
    if (this.isInvincible) {
      this.alpha = Math.sin(currentTime * 0.05) * 0.5 + 0.5; // Oscillate between 0.5 and 1
    }
  }

  /**
   * Heal the character
   * @param {number} amount - Amount of health to restore
   */
  heal(amount) {
    this.health += amount;
    this.health = Math.min(this.maxHealth, this.health);
  }

  /**
   * Check if character is dead
   * @returns {boolean} True if health is zero
   */
  isDead() {
    return this.health <= 0;
  }

  /**
   * Equip a weapon (max 6 weapons)
   * @param {Weapon} weapon - Weapon to equip
   * @returns {boolean} True if weapon was equipped successfully
   */
  equipWeapon(weapon) {
    if (this.equippedWeapons.length >= 6) {
      return false;
    }
    this.equippedWeapons.push(weapon);
    return true;
  }

  /**
   * Unequip a weapon by index
   * @param {number} weaponIndex - Index of weapon to unequip
   */
  unequipWeapon(weaponIndex) {
    if (weaponIndex >= 0 && weaponIndex < this.equippedWeapons.length) {
      this.equippedWeapons.splice(weaponIndex, 1);
    }
  }

  /**
   * Get all equipped weapons
   * @returns {Weapon[]} Array of equipped weapons
   */
  getEquippedWeapons() {
    return [...this.equippedWeapons];
  }

  /**
   * Equip an item
   * @param {Item} item - Item to equip
   */
  equipItem(item) {
    this.equippedItems.push(item);
    this.recalculateAttributes();
  }

  /**
   * Unequip an item by index
   * @param {number} itemIndex - Index of item to unequip
   */
  unequipItem(itemIndex) {
    if (itemIndex >= 0 && itemIndex < this.equippedItems.length) {
      this.equippedItems.splice(itemIndex, 1);
      this.recalculateAttributes();
    }
  }

  /**
   * Get all equipped items
   * @returns {Item[]} Array of equipped items
   */
  getEquippedItems() {
    return [...this.equippedItems];
  }

  /**
   * Get current attribute value (modified by items)
   * @param {string} attributeName - Name of attribute
   * @returns {number} Current attribute value
   */
  getAttribute(attributeName) {
    return this.currentAttributes[attributeName] || 0;
  }

  /**
   * Get base attribute value (unmodified)
   * @param {string} attributeName - Name of attribute
   * @returns {number} Base attribute value
   */
  getBaseAttribute(attributeName) {
    return this.baseAttributes[attributeName] || 0;
  }

  /**
   * Increase base attribute (stat point allocation)
   * @param {string} attributeName - Name of attribute
   * @param {number} amount - Amount to increase (reduced to 0.25x impact)
   */
  increaseBaseAttribute(attributeName, amount) {
    if (this.baseAttributes[attributeName] !== undefined) {
      // Reduce stat impact to 0.25x
      this.baseAttributes[attributeName] += amount * 0.25;
      this.recalculateAttributes();
    }
  }

  /**
   * Recalculate current attributes from base + item effects
   */
  recalculateAttributes() {
    // Start with base attributes
    this.currentAttributes = {
      strength: this.baseAttributes.strength,
      speed: this.baseAttributes.speed,
      defense: this.baseAttributes.defense,
      vitality: this.baseAttributes.vitality,
      dexterity: this.baseAttributes.dexterity,
      attackSpeedMultiplier: 1.0, // Multiplier for attack speed (1.0 = 100%)
      rangeMultiplier: 1.0 // Multiplier for weapon range (1.0 = 100%)
    };

    // Apply item effects
    for (const item of this.equippedItems) {
      // Apply bonuses
      for (const bonus of item.bonuses) {
        const attr = bonus.attribute;
        if (this.currentAttributes[attr] !== undefined) {
          if (bonus.isPercentage) {
            this.currentAttributes[attr] += this.baseAttributes[attr] * (bonus.value / 100);
          } else {
            this.currentAttributes[attr] += bonus.value;
          }
        }
        // Handle special multiplier attributes
        else if (attr === 'attackSpeedMultiplier' || attr === 'rangeMultiplier') {
          if (bonus.isPercentage) {
            this.currentAttributes[attr] += bonus.value / 100;
          } else {
            this.currentAttributes[attr] += bonus.value;
          }
        }
      }

      // Apply penalties
      for (const penalty of item.penalties) {
        const attr = penalty.attribute;
        if (this.currentAttributes[attr] !== undefined) {
          if (penalty.isPercentage) {
            this.currentAttributes[attr] -= this.baseAttributes[attr] * (penalty.value / 100);
          } else {
            this.currentAttributes[attr] -= penalty.value;
          }
        }
        // Handle special multiplier attributes
        else if (attr === 'attackSpeedMultiplier' || attr === 'rangeMultiplier') {
          if (penalty.isPercentage) {
            this.currentAttributes[attr] -= penalty.value / 100;
          } else {
            this.currentAttributes[attr] -= penalty.value;
          }
        }
      }
    }
    
    // Recalculate max health based solely on current vitality (10 HP per vitality point)
    const oldMaxHealth = this.maxHealth;
    this.maxHealth = this.currentAttributes.vitality * 10;
    
    // Adjust current health if max health changed
    if (oldMaxHealth > 0) {
      this.health = Math.min(this.health, this.maxHealth); // Don't exceed new max
    }
  }
}
