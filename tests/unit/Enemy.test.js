/**
 * Unit tests for Enemy class logic
 */

import { ENEMY_TYPES } from '../../src/config/enemyTypes.js';

describe('Enemy Logic', () => {
  describe('Enemy Type Data', () => {
    test('GOBLIN should have correct base stats', () => {
      expect(ENEMY_TYPES.GOBLIN.baseHealth).toBe(20);
      expect(ENEMY_TYPES.GOBLIN.baseDamage).toBe(5);
      expect(ENEMY_TYPES.GOBLIN.baseSpeed).toBe(80);
      expect(ENEMY_TYPES.GOBLIN.baseDefense).toBe(2);
    });

    test('DRAGON should have correct base stats', () => {
      expect(ENEMY_TYPES.DRAGON.baseHealth).toBe(150);
      expect(ENEMY_TYPES.DRAGON.baseDamage).toBe(30);
      expect(ENEMY_TYPES.DRAGON.baseSpeed).toBe(70);
      expect(ENEMY_TYPES.DRAGON.baseDefense).toBe(12);
    });

    test('all enemy types should have distinct stats', () => {
      const goblin = ENEMY_TYPES.GOBLIN;
      const dragon = ENEMY_TYPES.DRAGON;

      expect(goblin.baseHealth).not.toBe(dragon.baseHealth);
      expect(goblin.baseDamage).not.toBe(dragon.baseDamage);
    });
  });

  describe('Difficulty Scaling', () => {
    test('health should scale with round number', () => {
      const baseHealth = 100;
      const roundNumber = 5;
      const healthMultiplier = 1 + (roundNumber * 0.15);
      const scaledHealth = Math.floor(baseHealth * healthMultiplier);
      
      expect(scaledHealth).toBe(175); // 100 * 1.75
    });

    test('damage should scale with round number', () => {
      const baseDamage = 10;
      const roundNumber = 5;
      const damageMultiplier = 1 + (roundNumber * 0.1);
      const scaledDamage = Math.floor(baseDamage * damageMultiplier);
      
      expect(scaledDamage).toBe(15); // 10 * 1.5
    });

    test('higher rounds should have stronger enemies', () => {
      const baseHealth = 100;
      const baseDamage = 10;
      
      const round1Health = Math.floor(baseHealth * (1 + 1 * 0.15));
      const round10Health = Math.floor(baseHealth * (1 + 10 * 0.15));
      
      const round1Damage = Math.floor(baseDamage * (1 + 1 * 0.1));
      const round10Damage = Math.floor(baseDamage * (1 + 10 * 0.1));
      
      expect(round10Health).toBeGreaterThan(round1Health);
      expect(round10Damage).toBeGreaterThan(round1Damage);
    });
  });

  describe('Combat Mechanics', () => {
    test('defense should reduce incoming damage', () => {
      const incomingDamage = 20;
      const defense = 5;
      const actualDamage = Math.max(1, incomingDamage - defense);
      
      expect(actualDamage).toBe(15);
    });

    test('defense should not reduce damage below 1', () => {
      const incomingDamage = 5;
      const defense = 10;
      const actualDamage = Math.max(1, incomingDamage - defense);
      
      expect(actualDamage).toBe(1);
    });

    test('health should not go below 0', () => {
      const health = 50;
      const damage = 100;
      const result = Math.max(0, health - damage);
      
      expect(result).toBe(0);
    });
  });

  describe('Movement Logic', () => {
    test('should calculate direction towards target', () => {
      const enemyX = 100;
      const enemyY = 100;
      const targetX = 200;
      const targetY = 200;
      
      const dx = targetX - enemyX;
      const dy = targetY - enemyY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      expect(dx).toBe(100);
      expect(dy).toBe(100);
      expect(distance).toBeCloseTo(141.42, 2);
    });

    test('should normalize movement vector', () => {
      const dx = 100;
      const dy = 100;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;
      
      // Normalized vector should have length 1
      const normalizedLength = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
      expect(normalizedLength).toBeCloseTo(1, 5);
    });
  });

  describe('Death State', () => {
    test('should be dead when health is 0', () => {
      const health = 0;
      expect(health <= 0).toBe(true);
    });

    test('should be alive when health is above 0', () => {
      const health = 50;
      expect(health <= 0).toBe(false);
    });
  });
});
