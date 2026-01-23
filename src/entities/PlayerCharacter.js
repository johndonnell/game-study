import Phaser from 'phaser';
import { CHARACTER_TYPES } from '../config/characterTypes.js';

/**
 * PlayerCharacter class
 * Represents the player-controlled character with stats and equipment
 */
export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
  /**
   * @param {Phaser.Scene} scene - The scene this character belongs to
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {string} characterType - Type of character (WARRIOR, ROGUE, MAGE)
   */
  constructor(scene, x, y, characterType) {
    super(scene, x, y, 'player');
    
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
    
    // Add to scene
    scene.add.existing(this);
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
    const bounds = this.scene.sys.game.config;
    this.x = Phaser.Math.Clamp(this.x, 0, bounds.width);
    this.y = Phaser.Math.Clamp(this.y, 0, bounds.height);
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
   * @param {number} amount - Amount to increase
   */
  increaseBaseAttribute(attributeName, amount) {
    if (this.baseAttributes[attributeName] !== undefined) {
      this.baseAttributes[attributeName] += amount;
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
