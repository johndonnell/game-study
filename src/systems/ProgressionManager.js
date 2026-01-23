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
   * Formula: 50 + (roundNumber * 25)
   * @param {number} roundNumber - Completed round number
   * @returns {number} Currency reward amount
   */
  calculateCurrencyReward(roundNumber) {
    return 50 + (roundNumber * 25);
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
}
