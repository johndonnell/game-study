/**
 * Unit tests for Weapon class
 */

import Weapon from '../../src/entities/Weapon.js';
import { WEAPON_TYPES } from '../../src/config/weaponTypes.js';

describe('Weapon', () => {
  describe('Constructor', () => {
    test('should initialize with correct weapon type', () => {
      const weapon = new Weapon('SWORD');
      expect(weapon.type).toBe('SWORD');
      expect(weapon.name).toBe(WEAPON_TYPES.SWORD.name);
    });

    test('should load properties from WEAPON_TYPES', () => {
      const weapon = new Weapon('BOW');
      expect(weapon.baseDamage).toBe(WEAPON_TYPES.BOW.baseDamage);
      expect(weapon.attackSpeed).toBe(WEAPON_TYPES.BOW.attackSpeed);
      expect(weapon.range).toBe(WEAPON_TYPES.BOW.range);
      expect(weapon.cost).toBe(WEAPON_TYPES.BOW.cost);
    });

    test('should throw error for invalid weapon type', () => {
      expect(() => {
        new Weapon('INVALID');
      }).toThrow('Invalid weapon type: INVALID');
    });

    test('should initialize lastAttackTime to null', () => {
      const weapon = new Weapon('SWORD');
      expect(weapon.lastAttackTime).toBe(null);
    });
  });

  describe('calculateDamage', () => {
    test('should calculate damage based on character strength', () => {
      const weapon = new Weapon('SWORD');
      const attributes = { strength: 10 };
      const damage = weapon.calculateDamage(attributes);
      // Each point of strength adds 5% damage (0.05 multiplier)
      const expectedDamage = weapon.baseDamage * (1 + 10 * 0.05);
      expect(damage).toBe(expectedDamage);
    });

    test('should scale damage with higher strength', () => {
      const weapon = new Weapon('SWORD');
      const lowStrength = weapon.calculateDamage({ strength: 10 });
      const highStrength = weapon.calculateDamage({ strength: 50 });
      expect(highStrength).toBeGreaterThan(lowStrength);
    });
  });

  describe('canAttack', () => {
    test('should allow attack initially', () => {
      const weapon = new Weapon('SWORD');
      const attributes = { dexterity: 10 };
      expect(weapon.canAttack(0, attributes)).toBe(true);
    });

    test('should not allow attack during cooldown', () => {
      const weapon = new Weapon('SWORD');
      const attributes = { dexterity: 10 };
      weapon.recordAttack(0);
      const effectiveAttackSpeed = weapon.calculateAttackSpeed(attributes);
      const cooldown = 1000 / effectiveAttackSpeed;
      expect(weapon.canAttack(cooldown / 2, attributes)).toBe(false);
    });

    test('should allow attack after cooldown', () => {
      const weapon = new Weapon('SWORD');
      const attributes = { dexterity: 10 };
      weapon.recordAttack(0);
      const effectiveAttackSpeed = weapon.calculateAttackSpeed(attributes);
      const cooldown = 1000 / effectiveAttackSpeed;
      expect(weapon.canAttack(cooldown, attributes)).toBe(true);
    });

    test('should have faster cooldown for faster weapons', () => {
      const slowWeapon = new Weapon('HAMMER'); // attackSpeed: 0.5
      const fastWeapon = new Weapon('SHURIKEN'); // attackSpeed: 2.0
      const attributes = { dexterity: 10 };
      
      slowWeapon.recordAttack(0);
      fastWeapon.recordAttack(0);
      
      const testTime = 1000;
      expect(fastWeapon.canAttack(testTime, attributes)).toBe(true);
      expect(slowWeapon.canAttack(testTime, attributes)).toBe(false);
    });
  });

  describe('recordAttack', () => {
    test('should update lastAttackTime', () => {
      const weapon = new Weapon('SWORD');
      weapon.recordAttack(1000);
      expect(weapon.lastAttackTime).toBe(1000);
    });
  });
});
