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
    this.weaponType = weaponData.weaponType; // 'melee' or 'ranged'

    // Track last attack time for attack speed (null means never attacked)
    this.lastAttackTime = null;
  }

  /**
   * Check if weapon is ranged
   * @returns {boolean} True if weapon is ranged
   */
  isRanged() {
    return this.weaponType === 'ranged';
  }

  /**
   * Calculate damage based on character attributes
   * @param {Object} characterAttributes - Character's current attributes
   * @returns {number} Calculated damage
   */
  calculateDamage(characterAttributes) {
    // Base damage modified by character strength
    // Each point of strength adds 5% damage (more impactful than previous 1%)
    const strengthMultiplier = 1 + (characterAttributes.strength * 0.05);
    return this.baseDamage * strengthMultiplier;
  }

  /**
   * Calculate effective attack speed based on character dexterity and multipliers
   * @param {Object} characterAttributes - Character's current attributes
   * @returns {number} Effective attacks per second
   */
  calculateAttackSpeed(characterAttributes) {
    // Base attack speed modified by character dexterity
    // Each point of dexterity adds 2% attack speed
    const dexterityMultiplier = 1 + (characterAttributes.dexterity * 0.02);
    
    // Apply attack speed multiplier from items (default 1.0)
    const attackSpeedMultiplier = characterAttributes.attackSpeedMultiplier || 1.0;
    
    return this.attackSpeed * dexterityMultiplier * attackSpeedMultiplier;
  }

  /**
   * Get effective weapon range based on character multipliers
   * @param {Object} characterAttributes - Character's current attributes
   * @returns {number} Effective weapon range
   */
  getEffectiveRange(characterAttributes) {
    // Apply range multiplier from items (default 1.0)
    const rangeMultiplier = characterAttributes.rangeMultiplier || 1.0;
    return this.range * rangeMultiplier;
  }

  /**
   * Check if weapon can attack based on attack speed
   * @param {number} currentTime - Current game time in milliseconds
   * @param {Object} characterAttributes - Character's current attributes
   * @returns {boolean} True if weapon can attack
   */
  canAttack(currentTime, characterAttributes) {
    // Can always attack if never attacked before
    if (this.lastAttackTime === null) {
      return true;
    }
    
    const effectiveAttackSpeed = this.calculateAttackSpeed(characterAttributes);
    const attackCooldown = 1000 / effectiveAttackSpeed; // Convert to milliseconds
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    return timeSinceLastAttack >= attackCooldown;
  }

  /**
   * Update last attack time
   * @param {number} currentTime - Current game time in milliseconds
   */
  recordAttack(currentTime) {
    this.lastAttackTime = currentTime;
  }
}
