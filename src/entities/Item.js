import { ITEM_TYPES } from '../config/itemTypes.js';

/**
 * Item class
 * Represents an item that provides stat bonuses and penalties
 */
export default class Item {
  /**
   * @param {string} itemType - Type of item (e.g., 'BERSERKER_RING', 'HEAVY_ARMOR')
   */
  constructor(itemType) {
    // Validate item type
    if (!ITEM_TYPES[itemType]) {
      throw new Error(`Invalid item type: ${itemType}`);
    }

    const itemData = ITEM_TYPES[itemType];

    // Item properties
    this.type = itemType;
    this.name = itemData.name;
    this.cost = itemData.cost;
    this.bonuses = itemData.bonuses || [];
    this.penalties = itemData.penalties || [];
  }

  /**
   * Apply item effects to character
   * Note: This is handled by PlayerCharacter.recalculateAttributes()
   * This method is kept for interface compatibility
   * @param {PlayerCharacter} character - Character to apply effects to
   */
  applyEffects(character) {
    character.recalculateAttributes();
  }

  /**
   * Remove item effects from character
   * Note: This is handled by PlayerCharacter.recalculateAttributes()
   * This method is kept for interface compatibility
   * @param {PlayerCharacter} character - Character to remove effects from
   */
  removeEffects(character) {
    character.recalculateAttributes();
  }

  /**
   * Calculate bonus value (percentage or numeric)
   * @param {number} baseValue - Base attribute value
   * @param {Object} bonus - Bonus object with value and isPercentage
   * @returns {number} Calculated bonus amount
   */
  calculateBonus(baseValue, bonus) {
    if (bonus.isPercentage) {
      return baseValue * (bonus.value / 100);
    } else {
      return bonus.value;
    }
  }
}
