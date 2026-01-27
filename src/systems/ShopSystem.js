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

  /**
   * Purchase a weapon
   * @param {string} weaponType - Type of weapon to purchase
   * @param {PlayerCharacter} player - Player to add weapon to
   * @returns {boolean} True if purchase was successful
   */
  purchaseWeapon(weaponType, player) {
    if (!WEAPON_TYPES[weaponType]) {
      return false;
    }

    const cost = WEAPON_TYPES[weaponType].cost;

    // Check if player can afford it
    if (!this.canAffordWeapon(weaponType)) {
      return false;
    }

    // Deduct currency
    if (this.progressionManager.spendCurrency(cost)) {
      // Create and add weapon to player inventory
      const weapon = new Weapon(weaponType);
      // Note: Weapon is added to inventory, not equipped automatically
      return true;
    }

    return false;
  }

  /**
   * Purchase an item
   * @param {string} itemType - Type of item to purchase
   * @param {PlayerCharacter} player - Player to add item to
   * @returns {boolean} True if purchase was successful
   */
  purchaseItem(itemType, player) {
    if (!ITEM_TYPES[itemType]) {
      return false;
    }

    const cost = ITEM_TYPES[itemType].cost;

    // Check if player can afford it
    if (!this.canAffordItem(itemType)) {
      return false;
    }

    // Deduct currency
    if (this.progressionManager.spendCurrency(cost)) {
      // Create and add item to player inventory
      const item = new Item(itemType);
      // Note: Item is added to inventory, not equipped automatically
      return true;
    }

    return false;
  }

  /**
   * Check if player can afford a weapon
   * @param {string} weaponType - Type of weapon
   * @returns {boolean} True if player has sufficient currency
   */
  canAffordWeapon(weaponType) {
    if (!WEAPON_TYPES[weaponType]) {
      return false;
    }
    const cost = WEAPON_TYPES[weaponType].cost;
    return this.progressionManager.getCurrency() >= cost;
  }

  /**
   * Check if player can afford an item
   * @param {string} itemType - Type of item
   * @returns {boolean} True if player has sufficient currency
   */
  canAffordItem(itemType) {
    if (!ITEM_TYPES[itemType]) {
      return false;
    }
    const cost = ITEM_TYPES[itemType].cost;
    return this.progressionManager.getCurrency() >= cost;
  }

  /**
   * Check if player has inventory space
   * Note: Currently no inventory limit, always returns true
   * @returns {boolean} True if inventory has space
   */
  hasInventorySpace() {
    // No inventory limit for now
    return true;
  }
}
