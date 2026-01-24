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
    this.maxHealth = charData.maxHealth;
    this.health = this.maxHealth;
    
    // Base attributes (never modified except by stat point allocation)
    this.baseAttributes = {
      strength: charData.baseStats.strength,
      speed: charData.baseStats.speed,
      defense: charData.baseStats.defense,
      vitality: charData.baseStats.vitality
    };
    
    // Current attributes (modified by items)
    this.currentAttributes = {
      strength: this.baseAttributes.strength,
      speed: this.baseAttributes.speed,
      defense: this.baseAttributes.defense,
      vitality: this.baseAttributes.vitality
    };
    
    // Equipment arrays
    this.equippedWeapons = [];
    this.equippedItems = [];
    
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
    // Define colors for each character type
    const characterVisuals = {
      WARRIOR: { color: 0x0000ff, letter: 'W' },   // Blue
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
   */
  takeDamage(amount) {
    this.health -= amount;
    this.health = Math.max(0, this.health);
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
      vitality: this.baseAttributes.vitality
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
      }
    }
  }
}
