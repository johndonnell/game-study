import { WEAPON_TYPES } from '../config/weaponTypes.js';
import { ITEM_TYPES } from '../config/itemTypes.js';
import Weapon from '../entities/Weapon.js';
import Item from '../entities/Item.js';

/**
 * ShopSystem class
 * Interface for purchasing weapons and items between rounds
 */
export default class ShopSystem {
  /**
   * @param {Phaser.Scene} scene - The scene this shop belongs to
   * @param {ProgressionManager} progressionManager - Progression manager for currency
   */
  constructor(scene, progressionManager) {
    this.scene = scene;
    this.progressionManager = progressionManager;
  }

  /**
   * Display available weapons
   * @returns {Array} Array of weapon data with type, name, cost, and properties
   */
  displayAvailableWeapons() {
    const weapons = [];
    for (const [type, data] of Object.entries(WEAPON_TYPES)) {
      weapons.push({
        type,
        name: data.name,
        cost: data.cost,
        baseDamage: data.baseDamage,
        attackSpeed: data.attackSpeed,
        range: data.range
      });
    }
    return weapons;
  }

  /**
   * Display available items
   * @returns {Array} Array of item data with type, name, cost, bonuses, and penalties
   */
  displayAvailableItems() {
    const items = [];
    for (const [type, data] of Object.entries(ITEM_TYPES)) {
      items.push({
        type,
        name: data.name,
        cost: data.cost,
        bonuses: data.bonuses,
        penalties: data.penalties
      });
    }
    return items;
  }
}
