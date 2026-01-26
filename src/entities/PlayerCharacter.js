import Phaser from 'phaser';
import { CHARACTER_TYPES } from '../config/characterTypes.js';
import BarbarianSprite from '../sprites/characters/BarbarianSprite.js';
import WizardSprite from '../sprites/characters/WizardSprite.js';
import RogueSprite from '../sprites/characters/RogueSprite.js';

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
    
    // Sprite parts (will be populated by sprite modules)
    this.spriteParts = null;
    
    // Create visual representation
    this.createSprite(characterType);
    
    // Add to scene
    scene.add.existing(this);
    
    // Scale up sprite with better proportions (wider than tall to avoid distortion)
    this.setScale(1.8, 1.5);
  }

  /**
   * Create visual sprite for player based on character type
   * @param {string} characterType - Type of character
   */
  createSprite(characterType) {
    // Use sprite modules for all character types
    if (characterType === 'WARRIOR') {
      this.spriteParts = BarbarianSprite.create(this.scene, this);
    } 
    else if (characterType === 'ROGUE') {
      this.spriteParts = RogueSprite.create(this.scene, this);
    }
    else if (characterType === 'MAGE') {
      this.spriteParts = WizardSprite.create(this.scene, this);
    } 
    else {
      // Fallback for unknown character types
      this.createDefaultSprite(characterType);
    }
  }

  /**
   * Create default sprite for unknown character types
   * @param {string} characterType - Type of character
   */
  createDefaultSprite(characterType) {
    // Create simple placeholder sprite
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(0, 0, 20);

    // Add letter text
    const letterText = this.scene.add.text(0, 0, '?', {
      font: 'bold 20px monospace',
      fill: '#000000',
      stroke: '#ffffff',
      strokeThickness: 3
    });
    letterText.setOrigin(0.5);

    // Add graphics and text to container
    this.add(graphics);
    this.add(letterText);
  }

  /**
   * Update character animation
   * @param {number} delta - Time since last update in milliseconds
   * @param {boolean} isMoving - Whether the character is currently moving
   */
  updateAnimation(delta, isMoving) {
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
    
    // Use sprite module for animation
    if (this.spriteParts) {
      if (this.characterType === 'WARRIOR') {
        BarbarianSprite.updateAnimation(this.spriteParts, this.animationTime, isMoving);
      } else if (this.characterType === 'ROGUE') {
        RogueSprite.updateAnimation(this.spriteParts, this.animationTime, isMoving);
      } else if (this.characterType === 'MAGE') {
        WizardSprite.updateAnimation(this.spriteParts, this.animationTime, isMoving);
      }
      
      // Flip sprite based on facing direction
      this.scaleX = this.facingDirection;
    }
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
