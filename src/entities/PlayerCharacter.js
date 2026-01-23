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
}
