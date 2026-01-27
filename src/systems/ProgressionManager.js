/**
 * ProgressionManager class
 * Manages currency, stat points, and rewards
 */
export default class ProgressionManager {
  constructor() {
    // Initialize progression properties
    this.currency = 0;
    this.availableStatPoints = 0;
  }

  /**
   * Calculate currency reward for completing a round
   * Formula: 100 + (roundNumber * 50) - doubled from original
   * @param {number} roundNumber - Completed round number
   * @returns {number} Currency reward amount
   */
  calculateCurrencyReward(roundNumber) {
    return 100 + (roundNumber * 50);
  }

  /**
   * Calculate stat point reward for completing a round
   * Formula: 2 + Math.floor(roundNumber / 5)
   * @param {number} roundNumber - Completed round number
   * @returns {number} Stat point reward amount
   */
  calculateStatPointReward(roundNumber) {
    return 2 + Math.floor(roundNumber / 5);
  }

  /**
   * Add currency to the player's balance
   * @param {number} amount - Amount of currency to add
   */
  addCurrency(amount) {
    this.currency += amount;
  }

  /**
   * Spend currency (with validation)
   * @param {number} amount - Amount of currency to spend
   * @returns {boolean} True if purchase was successful
   */
  spendCurrency(amount) {
    if (this.currency >= amount) {
      this.currency -= amount;
      return true;
    }
    return false;
  }

  /**
   * Get current currency balance
   * @returns {number} Current currency amount
   */
  getCurrency() {
    return this.currency;
  }

  /**
   * Add stat points to the player's available pool
   * @param {number} amount - Amount of stat points to add
   */
  addStatPoints(amount) {
    this.availableStatPoints += amount;
  }

  /**
   * Spend a stat point (with validation)
   * @returns {boolean} True if stat point was spent successfully
   */
  spendStatPoint() {
    if (this.availableStatPoints > 0) {
      this.availableStatPoints -= 1;
      return true;
    }
    return false;
  }

  /**
   * Get available stat points
   * @returns {number} Current available stat points
   */
  getAvailableStatPoints() {
    return this.availableStatPoints;
  }

  /**
   * Reset all progression (on game over)
   */
  reset() {
    this.currency = 0;
    this.availableStatPoints = 0;
  }
}
