import Weapon from '../entities/Weapon.js';
import Item from '../entities/Item.js';

/**
 * ShopPurchaseHandler
 * Handles purchase transactions and inventory updates
 */
export default class ShopPurchaseHandler {
  /**
   * @param {ShopSystem} shopSystem - The shop system instance
   * @param {GameManager} gameManager - The game manager instance
   */
  constructor(shopSystem, gameManager) {
    this.shopSystem = shopSystem;
    this.gameManager = gameManager;
  }
  
  /**
   * Attempt to purchase a weapon
   * @param {string} weaponType - Weapon type identifier
   * @returns {boolean} Success status
   */
  purchaseWeapon(weaponType) {
    const playerData = this.gameManager.getPlayerData();
    
    // Check weapon limit
    const equippedCount = playerData.equippedWeapons?.length || 0;
    if (equippedCount >= 6) {
      console.warn('ShopPurchaseHandler: Cannot purchase weapon, inventory full (6/6)');
      return false;
    }
    
    // Attempt purchase through shop system
    const success = this.shopSystem.purchaseWeapon(weaponType);
    
    if (success) {
      this.addWeaponToInventory(weaponType, playerData);
      this.updatePlayerData(playerData);
    }
    
    return success;
  }
  
  /**
   * Attempt to purchase an item
   * @param {string} itemType - Item type identifier
   * @returns {boolean} Success status
   */
  purchaseItem(itemType) {
    const playerData = this.gameManager.getPlayerData();
    
    // Attempt purchase through shop system
    const success = this.shopSystem.purchaseItem(itemType);
    
    if (success) {
      this.addItemToInventory(itemType, playerData);
      this.updatePlayerData(playerData);
    }
    
    return success;
  }
  
  /**
   * Add weapon to player inventory and equip it
   * @param {string} weaponType - Weapon type identifier
   * @param {Object} playerData - Player data object
   */
  addWeaponToInventory(weaponType, playerData) {
    const weapon = new Weapon(weaponType);
    
    // Initialize inventory if needed
    if (!playerData.inventory) {
      playerData.inventory = { weapons: [], items: [] };
    }
    
    // Add to inventory
    playerData.inventory.weapons.push(weapon);
    
    // Auto-equip if space available
    if (!playerData.equippedWeapons) {
      playerData.equippedWeapons = [];
    }
    if (playerData.equippedWeapons.length < 6) {
      playerData.equippedWeapons.push(weapon);
    }
  }
  
  /**
   * Add item to player inventory and equip it
   * @param {string} itemType - Item type identifier
   * @param {Object} playerData - Player data object
   */
  addItemToInventory(itemType, playerData) {
    const item = new Item(itemType);
    
    // Initialize inventory if needed
    if (!playerData.inventory) {
      playerData.inventory = { weapons: [], items: [] };
    }
    
    // Add to inventory
    playerData.inventory.items.push(item);
    
    // Auto-equip item
    if (!playerData.equippedItems) {
      playerData.equippedItems = [];
    }
    playerData.equippedItems.push(item);
  }
  
  /**
   * Update player data with current currency and save
   * @param {Object} playerData - Player data object
   */
  updatePlayerData(playerData) {
    // Update currency from progression manager
    playerData.currency = this.shopSystem.progressionManager.getCurrency();
    
    // Save player data
    this.gameManager.savePlayerData(playerData);
  }
  
  /**
   * Mark a card as purchased
   * @param {number} cardIndex - Index of the card
   */
  markCardPurchased(cardIndex) {
    const playerData = this.gameManager.getPlayerData();
    
    if (!playerData.shopPurchasedCards) {
      playerData.shopPurchasedCards = [];
    }
    
    playerData.shopPurchasedCards.push(cardIndex);
    this.updatePlayerData(playerData);
  }
}
