/**
 * Unit tests for ShopSystem class
 */

import ShopSystem from '../../src/systems/ShopSystem.js';
import ProgressionManager from '../../src/systems/ProgressionManager.js';
import { WEAPON_TYPES } from '../../src/config/weaponTypes.js';
import { ITEM_TYPES } from '../../src/config/itemTypes.js';

describe('ShopSystem', () => {
  let shop;
  let progressionManager;
  let mockScene;

  beforeEach(() => {
    mockScene = {};
    progressionManager = new ProgressionManager();
    shop = new ShopSystem(mockScene, progressionManager);
  });

  describe('Display Methods', () => {
    test('should display all available weapons', () => {
      const weapons = shop.displayAvailableWeapons();
      expect(weapons.length).toBe(Object.keys(WEAPON_TYPES).length);
      expect(weapons.length).toBe(20);
    });

    test('should display weapon with correct properties', () => {
      const weapons = shop.displayAvailableWeapons();
      const sword = weapons.find(w => w.type === 'SWORD');
      
      expect(sword).toBeDefined();
      expect(sword.name).toBe('Sword');
      expect(sword.cost).toBe(100);
      expect(sword.baseDamage).toBe(10);
    });

    test('should display all available items', () => {
      const items = shop.displayAvailableItems();
      expect(items.length).toBe(Object.keys(ITEM_TYPES).length);
      expect(items.length).toBe(13); // Updated to 13 items (10 original + 3 dexterity items)
    });

    test('should display item with correct properties', () => {
      const items = shop.displayAvailableItems();
      const ring = items.find(i => i.type === 'BERSERKER_RING');
      
      expect(ring).toBeDefined();
      expect(ring.name).toBe('Berserker Ring');
      expect(ring.cost).toBe(200);
      expect(ring.bonuses).toBeDefined();
      expect(ring.penalties).toBeDefined();
    });
  });

  describe('Affordability Validation', () => {
    test('should return true when player can afford weapon', () => {
      progressionManager.addCurrency(150);
      const canAfford = shop.canAffordWeapon('SWORD'); // Cost: 100
      expect(canAfford).toBe(true);
    });

    test('should return false when player cannot afford weapon', () => {
      progressionManager.addCurrency(50);
      const canAfford = shop.canAffordWeapon('SWORD'); // Cost: 100
      expect(canAfford).toBe(false);
    });

    test('should return true when player has exact amount', () => {
      progressionManager.addCurrency(100);
      const canAfford = shop.canAffordWeapon('SWORD'); // Cost: 100
      expect(canAfford).toBe(true);
    });

    test('should return false for invalid weapon type', () => {
      progressionManager.addCurrency(1000);
      const canAfford = shop.canAffordWeapon('INVALID');
      expect(canAfford).toBe(false);
    });

    test('should return true when player can afford item', () => {
      progressionManager.addCurrency(250);
      const canAfford = shop.canAffordItem('BERSERKER_RING'); // Cost: 200
      expect(canAfford).toBe(true);
    });

    test('should return false when player cannot afford item', () => {
      progressionManager.addCurrency(100);
      const canAfford = shop.canAffordItem('BERSERKER_RING'); // Cost: 200
      expect(canAfford).toBe(false);
    });

    test('should return false for invalid item type', () => {
      progressionManager.addCurrency(1000);
      const canAfford = shop.canAffordItem('INVALID');
      expect(canAfford).toBe(false);
    });
  });

  describe('Weapon Purchase', () => {
    test('should successfully purchase weapon with sufficient currency', () => {
      progressionManager.addCurrency(150);
      const mockPlayer = {};
      const result = shop.purchaseWeapon('SWORD', mockPlayer);
      
      expect(result).toBe(true);
      expect(progressionManager.getCurrency()).toBe(50); // 150 - 100
    });

    test('should fail to purchase weapon with insufficient currency', () => {
      progressionManager.addCurrency(50);
      const mockPlayer = {};
      const result = shop.purchaseWeapon('SWORD', mockPlayer);
      
      expect(result).toBe(false);
      expect(progressionManager.getCurrency()).toBe(50); // No change
    });

    test('should fail to purchase invalid weapon type', () => {
      progressionManager.addCurrency(1000);
      const mockPlayer = {};
      const result = shop.purchaseWeapon('INVALID', mockPlayer);
      
      expect(result).toBe(false);
      expect(progressionManager.getCurrency()).toBe(1000); // No change
    });

    test('should deduct exact cost from currency', () => {
      progressionManager.addCurrency(200);
      const mockPlayer = {};
      shop.purchaseWeapon('GREATSWORD', mockPlayer); // Cost: 200
      
      expect(progressionManager.getCurrency()).toBe(0);
    });
  });

  describe('Item Purchase', () => {
    test('should successfully purchase item with sufficient currency', () => {
      progressionManager.addCurrency(250);
      const mockPlayer = {};
      const result = shop.purchaseItem('BERSERKER_RING', mockPlayer);
      
      expect(result).toBe(true);
      expect(progressionManager.getCurrency()).toBe(50); // 250 - 200
    });

    test('should fail to purchase item with insufficient currency', () => {
      progressionManager.addCurrency(100);
      const mockPlayer = {};
      const result = shop.purchaseItem('BERSERKER_RING', mockPlayer);
      
      expect(result).toBe(false);
      expect(progressionManager.getCurrency()).toBe(100); // No change
    });

    test('should fail to purchase invalid item type', () => {
      progressionManager.addCurrency(1000);
      const mockPlayer = {};
      const result = shop.purchaseItem('INVALID', mockPlayer);
      
      expect(result).toBe(false);
      expect(progressionManager.getCurrency()).toBe(1000); // No change
    });

    test('should deduct exact cost from currency', () => {
      progressionManager.addCurrency(300);
      const mockPlayer = {};
      shop.purchaseItem('GLASS_CANNON_CHARM', mockPlayer); // Cost: 300
      
      expect(progressionManager.getCurrency()).toBe(0);
    });
  });

  describe('Multiple Purchases', () => {
    test('should handle multiple weapon purchases', () => {
      progressionManager.addCurrency(500);
      const mockPlayer = {};
      
      shop.purchaseWeapon('SWORD', mockPlayer); // Cost: 100
      shop.purchaseWeapon('DAGGER', mockPlayer); // Cost: 80
      shop.purchaseWeapon('BOW', mockPlayer); // Cost: 140
      
      expect(progressionManager.getCurrency()).toBe(180); // 500 - 320
    });

    test('should handle multiple item purchases', () => {
      progressionManager.addCurrency(600);
      const mockPlayer = {};
      
      shop.purchaseItem('BERSERKER_RING', mockPlayer); // Cost: 200
      shop.purchaseItem('BALANCED_PENDANT', mockPlayer); // Cost: 150
      
      expect(progressionManager.getCurrency()).toBe(250); // 600 - 350
    });

    test('should stop purchases when currency runs out', () => {
      progressionManager.addCurrency(150);
      const mockPlayer = {};
      
      const result1 = shop.purchaseWeapon('SWORD', mockPlayer); // Cost: 100
      const result2 = shop.purchaseWeapon('SWORD', mockPlayer); // Cost: 100
      
      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(progressionManager.getCurrency()).toBe(50);
    });
  });

  describe('Inventory Space', () => {
    test('should always have inventory space', () => {
      expect(shop.hasInventorySpace()).toBe(true);
    });
  });
});
