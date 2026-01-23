import { WEAPON_TYPES } from '../config/weaponTypes.js';

/**
 * Weapon class
 * Represents a weapon that can be equipped and used in combat
 */
export default class Weapon {
  /**
   * @param {string} weaponType - Type of weapon (e.g., 'SWORD', 'BOW')
   */
  constructor(weaponType) {
    // Validate weapon type
    if (!WEAPON_TYPES[weaponType]) {
      throw new Error(`Invalid weapon type: ${weaponType}`);
    }

    const weaponData = WEAPON_TYPES[weaponType];

    // Weapon properties
    this.type = weaponType;
    this.name = weaponData.name;
    this.baseDamage = weaponData.baseDamage;
    this.attackSpeed = weaponData.attackSpeed;
    this.range = weaponData.range;
    this.cost = weaponData.cost;

    // Track last attack time for attack speed
    this.lastAttackTime = 0;
  }

  /**
   * Calculate damage based on character attributes
   * @param {Object} characterAttributes - Character's current attributes
   * @returns {number} Calculated damage
   */
  calculateDamage(characterAttributes) {
    // Base damage modified by character strength
    const strengthMultiplier = 1 + (characterAttributes.strength / 100);
    return this.baseDamage * strengthMultiplier;
  }

  /**
   * Check if weapon can attack based on attack speed
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {boolean} True if weapon can attack
   */
  canAttack(currentTime) {
    const attackCooldown = 1000 / this.attackSpeed; // Convert to milliseconds
    return (currentTime - this.lastAttackTime) >= attackCooldown;
  }

  /**
   * Update last attack time
   * @param {number} currentTime - Current game time in milliseconds
   */
  recordAttack(currentTime) {
    this.lastAttackTime = currentTime;
  }
}
