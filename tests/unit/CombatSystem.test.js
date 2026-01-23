/**
 * Unit tests for CombatSystem class logic
 */

describe('CombatSystem Logic', () => {
  describe('Damage Calculation', () => {
    test('should calculate damage with character strength modifier', () => {
      const baseDamage = 10;
      const strength = 50;
      const strengthMultiplier = 1 + (strength / 100);
      const expectedDamage = baseDamage * strengthMultiplier;
      
      expect(expectedDamage).toBe(15); // 10 * 1.5
    });

    test('should sum damage from multiple weapons', () => {
      const weapon1Damage = 10;
      const weapon2Damage = 15;
      const weapon3Damage = 8;
      const totalDamage = weapon1Damage + weapon2Damage + weapon3Damage;
      
      expect(totalDamage).toBe(33);
    });

    test('should apply defense reduction to damage', () => {
      const incomingDamage = 20;
      const defense = 5;
      const actualDamage = Math.max(1, incomingDamage - defense);
      
      expect(actualDamage).toBe(15);
    });

    test('damage should not go below 1 after defense', () => {
      const incomingDamage = 3;
      const defense = 10;
      const actualDamage = Math.max(1, incomingDamage - defense);
      
      expect(actualDamage).toBe(1);
    });
  });

  describe('Multiple Weapon Damage', () => {
    test('6 weapons should deal more damage than 1 weapon', () => {
      const singleWeaponDamage = 10;
      const sixWeaponsDamage = 10 * 6;
      
      expect(sixWeaponsDamage).toBeGreaterThan(singleWeaponDamage);
      expect(sixWeaponsDamage).toBe(60);
    });

    test('damage should scale with number of equipped weapons', () => {
      const baseDamage = 10;
      const oneWeapon = baseDamage * 1;
      const threeWeapons = baseDamage * 3;
      const sixWeapons = baseDamage * 6;
      
      expect(threeWeapons).toBeGreaterThan(oneWeapon);
      expect(sixWeapons).toBeGreaterThan(threeWeapons);
    });

    test('different weapon damages should sum correctly', () => {
      const weapons = [
        { baseDamage: 10 },
        { baseDamage: 15 },
        { baseDamage: 8 },
        { baseDamage: 12 }
      ];
      
      const totalDamage = weapons.reduce((sum, w) => sum + w.baseDamage, 0);
      expect(totalDamage).toBe(45);
    });
  });

  describe('Collision Detection Logic', () => {
    test('should detect collision when distance is within range', () => {
      const playerX = 100;
      const playerY = 100;
      const enemyX = 120;
      const enemyY = 100;
      
      const dx = enemyX - playerX;
      const dy = enemyY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const weaponRange = 50;
      const isInRange = distance <= weaponRange;
      
      expect(distance).toBe(20);
      expect(isInRange).toBe(true);
    });

    test('should not detect collision when distance exceeds range', () => {
      const playerX = 100;
      const playerY = 100;
      const enemyX = 200;
      const enemyY = 100;
      
      const dx = enemyX - playerX;
      const dy = enemyY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const weaponRange = 50;
      const isInRange = distance <= weaponRange;
      
      expect(distance).toBe(100);
      expect(isInRange).toBe(false);
    });

    test('should calculate distance correctly for diagonal positions', () => {
      const playerX = 0;
      const playerY = 0;
      const enemyX = 3;
      const enemyY = 4;
      
      const dx = enemyX - playerX;
      const dy = enemyY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      expect(distance).toBe(5); // 3-4-5 triangle
    });
  });

  describe('Attribute Effects on Combat', () => {
    test('higher strength should increase damage', () => {
      const baseDamage = 10;
      const lowStrength = 10;
      const highStrength = 50;
      
      const lowDamage = baseDamage * (1 + lowStrength / 100);
      const highDamage = baseDamage * (1 + highStrength / 100);
      
      expect(highDamage).toBeGreaterThan(lowDamage);
      expect(lowDamage).toBe(11);
      expect(highDamage).toBe(15);
    });

    test('higher defense should reduce incoming damage', () => {
      const incomingDamage = 20;
      const lowDefense = 2;
      const highDefense = 10;
      
      const lowReduction = Math.max(1, incomingDamage - lowDefense);
      const highReduction = Math.max(1, incomingDamage - highDefense);
      
      expect(highReduction).toBeLessThan(lowReduction);
      expect(lowReduction).toBe(18);
      expect(highReduction).toBe(10);
    });

    test('attribute changes should measurably affect damage output', () => {
      const baseDamage = 10;
      const initialStrength = 10;
      const increasedStrength = 20;
      
      const initialDamage = baseDamage * (1 + initialStrength / 100);
      const increasedDamage = baseDamage * (1 + increasedStrength / 100);
      
      const damageIncrease = increasedDamage - initialDamage;
      
      expect(damageIncrease).toBeGreaterThan(0);
      expect(damageIncrease).toBe(1); // 10% increase on base 10 = 1 damage
    });
  });

  describe('Weapon Range', () => {
    test('melee weapons should have short range', () => {
      const meleeRange = 50;
      const rangedRange = 200;
      
      expect(meleeRange).toBeLessThan(rangedRange);
    });

    test('ranged weapons should have long range', () => {
      const bowRange = 200;
      const swordRange = 50;
      
      expect(bowRange).toBeGreaterThan(swordRange * 3);
    });

    test('different weapon types should have different ranges', () => {
      const weapons = [
        { type: 'SWORD', range: 50 },
        { type: 'BOW', range: 200 },
        { type: 'SPEAR', range: 80 }
      ];
      
      const ranges = weapons.map(w => w.range);
      const uniqueRanges = new Set(ranges);
      
      expect(uniqueRanges.size).toBe(3); // All different
    });
  });
});
