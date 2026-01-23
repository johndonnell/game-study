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
}
