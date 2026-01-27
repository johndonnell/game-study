/**
 * Unit tests for ProgressionManager class
 */

import ProgressionManager from '../../src/systems/ProgressionManager.js';

describe('ProgressionManager', () => {
  let manager;

  beforeEach(() => {
    manager = new ProgressionManager();
  });

  describe('Initialization', () => {
    test('should initialize with zero currency', () => {
      expect(manager.getCurrency()).toBe(0);
    });

    test('should initialize with zero stat points', () => {
      expect(manager.getAvailableStatPoints()).toBe(0);
    });
  });

  describe('Currency Reward Calculation', () => {
    test('should calculate correct reward for round 1', () => {
      const reward = manager.calculateCurrencyReward(1);
      expect(reward).toBe(150); // 100 + (1 * 50)
    });

    test('should calculate correct reward for round 5', () => {
      const reward = manager.calculateCurrencyReward(5);
      expect(reward).toBe(350); // 100 + (5 * 50)
    });

    test('should calculate correct reward for round 10', () => {
      const reward = manager.calculateCurrencyReward(10);
      expect(reward).toBe(600); // 100 + (10 * 50)
    });

    test('should calculate correct reward for round 20', () => {
      const reward = manager.calculateCurrencyReward(20);
      expect(reward).toBe(1100); // 100 + (20 * 50)
    });

    test('rewards should increase with round number', () => {
      const round1 = manager.calculateCurrencyReward(1);
      const round10 = manager.calculateCurrencyReward(10);
      expect(round10).toBeGreaterThan(round1);
    });
  });

  describe('Stat Point Reward Calculation', () => {
    test('should calculate correct reward for round 1', () => {
      const reward = manager.calculateStatPointReward(1);
      expect(reward).toBe(2); // 2 + Math.floor(1 / 5)
    });

    test('should calculate correct reward for round 5', () => {
      const reward = manager.calculateStatPointReward(5);
      expect(reward).toBe(3); // 2 + Math.floor(5 / 5)
    });

    test('should calculate correct reward for round 10', () => {
      const reward = manager.calculateStatPointReward(10);
      expect(reward).toBe(4); // 2 + Math.floor(10 / 5)
    });

    test('should calculate correct reward for round 20', () => {
      const reward = manager.calculateStatPointReward(20);
      expect(reward).toBe(6); // 2 + Math.floor(20 / 5)
    });

    test('rewards should increase with round number', () => {
      const round1 = manager.calculateStatPointReward(1);
      const round20 = manager.calculateStatPointReward(20);
      expect(round20).toBeGreaterThan(round1);
    });
  });

  describe('Currency Management', () => {
    test('should add currency correctly', () => {
      manager.addCurrency(100);
      expect(manager.getCurrency()).toBe(100);
    });

    test('should accumulate currency from multiple additions', () => {
      manager.addCurrency(50);
      manager.addCurrency(75);
      manager.addCurrency(25);
      expect(manager.getCurrency()).toBe(150);
    });

    test('should spend currency when sufficient funds available', () => {
      manager.addCurrency(100);
      const result = manager.spendCurrency(50);
      expect(result).toBe(true);
      expect(manager.getCurrency()).toBe(50);
    });

    test('should not spend currency when insufficient funds', () => {
      manager.addCurrency(30);
      const result = manager.spendCurrency(50);
      expect(result).toBe(false);
      expect(manager.getCurrency()).toBe(30);
    });

    test('should allow spending exact amount', () => {
      manager.addCurrency(100);
      const result = manager.spendCurrency(100);
      expect(result).toBe(true);
      expect(manager.getCurrency()).toBe(0);
    });
  });

  describe('Stat Point Management', () => {
    test('should add stat points correctly', () => {
      manager.addStatPoints(5);
      expect(manager.getAvailableStatPoints()).toBe(5);
    });

    test('should accumulate stat points from multiple additions', () => {
      manager.addStatPoints(2);
      manager.addStatPoints(3);
      manager.addStatPoints(1);
      expect(manager.getAvailableStatPoints()).toBe(6);
    });

    test('should spend stat point when available', () => {
      manager.addStatPoints(3);
      const result = manager.spendStatPoint();
      expect(result).toBe(true);
      expect(manager.getAvailableStatPoints()).toBe(2);
    });

    test('should not spend stat point when none available', () => {
      const result = manager.spendStatPoint();
      expect(result).toBe(false);
      expect(manager.getAvailableStatPoints()).toBe(0);
    });

    test('should spend multiple stat points correctly', () => {
      manager.addStatPoints(5);
      manager.spendStatPoint();
      manager.spendStatPoint();
      manager.spendStatPoint();
      expect(manager.getAvailableStatPoints()).toBe(2);
    });
  });

  describe('Reset Functionality', () => {
    test('should reset currency to zero', () => {
      manager.addCurrency(500);
      manager.reset();
      expect(manager.getCurrency()).toBe(0);
    });

    test('should reset stat points to zero', () => {
      manager.addStatPoints(10);
      manager.reset();
      expect(manager.getAvailableStatPoints()).toBe(0);
    });

    test('should reset all progression data', () => {
      manager.addCurrency(300);
      manager.addStatPoints(8);
      manager.reset();
      expect(manager.getCurrency()).toBe(0);
      expect(manager.getAvailableStatPoints()).toBe(0);
    });
  });

  describe('Currency Persistence', () => {
    test('currency should persist across rounds', () => {
      manager.addCurrency(100);
      manager.addCurrency(75);
      expect(manager.getCurrency()).toBe(175);
    });

    test('currency should persist after purchases', () => {
      manager.addCurrency(200);
      manager.spendCurrency(50);
      manager.addCurrency(100);
      expect(manager.getCurrency()).toBe(250);
    });
  });

  describe('Purchase Deduction', () => {
    test('should deduct exact cost from currency', () => {
      manager.addCurrency(150);
      manager.spendCurrency(100);
      expect(manager.getCurrency()).toBe(50);
    });

    test('multiple purchases should deduct correctly', () => {
      manager.addCurrency(500);
      manager.spendCurrency(100);
      manager.spendCurrency(150);
      manager.spendCurrency(50);
      expect(manager.getCurrency()).toBe(200);
    });
  });
});
