/**
 * Unit tests for Item class
 */

import Item from '../../src/entities/Item.js';
import { ITEM_TYPES } from '../../src/config/itemTypes.js';

describe('Item', () => {
  describe('Constructor', () => {
    test('should initialize with correct item type', () => {
      const item = new Item('BERSERKER_RING');
      expect(item.type).toBe('BERSERKER_RING');
      expect(item.name).toBe(ITEM_TYPES.BERSERKER_RING.name);
    });

    test('should load properties from ITEM_TYPES', () => {
      const item = new Item('HEAVY_ARMOR');
      expect(item.cost).toBe(ITEM_TYPES.HEAVY_ARMOR.cost);
      expect(item.bonuses).toEqual(ITEM_TYPES.HEAVY_ARMOR.bonuses);
      expect(item.penalties).toEqual(ITEM_TYPES.HEAVY_ARMOR.penalties);
    });

    test('should throw error for invalid item type', () => {
      expect(() => {
        new Item('INVALID');
      }).toThrow('Invalid item type: INVALID');
    });

    test('should handle items with no penalties', () => {
      const item = new Item('BALANCED_PENDANT');
      expect(item.penalties).toEqual([]);
    });
  });

  describe('calculateBonus', () => {
    test('should calculate percentage bonus correctly', () => {
      const item = new Item('BERSERKER_RING');
      const bonus = { value: 30, isPercentage: true };
      const result = item.calculateBonus(10, bonus);
      expect(result).toBe(3); // 10 * 30%
    });

    test('should calculate numeric bonus correctly', () => {
      const item = new Item('HEAVY_ARMOR');
      const bonus = { value: 10, isPercentage: false };
      const result = item.calculateBonus(5, bonus);
      expect(result).toBe(10);
    });
  });

  describe('applyEffects and removeEffects', () => {
    test('should call character.recalculateAttributes', () => {
      const item = new Item('BERSERKER_RING');
      let callCount = 0;
      const mockCharacter = {
        recalculateAttributes: () => { callCount++; }
      };
      
      item.applyEffects(mockCharacter);
      expect(callCount).toBe(1);
      
      item.removeEffects(mockCharacter);
      expect(callCount).toBe(2);
    });
  });
});
