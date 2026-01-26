/**
 * ShopState
 * Manages shop state and card tracking for the current round
 */
export default class ShopState {
  /**
   * @param {GameManager} gameManager - The game manager instance
   * @param {number} currentRound - Current round number
   */
  constructor(gameManager, currentRound) {
    this.gameManager = gameManager;
    this.currentRound = currentRound;
    this.playerData = gameManager.getPlayerData();
    this.initializeState();
  }
  
  /**
   * Initialize shop state for current round
   */
  initializeState() {
    // Check if we need to reset for a new round
    if (!this.playerData.shopCards || 
        this.playerData.shopCardsRound !== this.currentRound) {
      this.resetForNewRound();
    }
    
    // Ensure purchased cards array exists
    if (!this.playerData.shopPurchasedCards) {
      this.playerData.shopPurchasedCards = [];
    }
  }
  
  /**
   * Reset shop state for a new round
   */
  resetForNewRound() {
    this.playerData.shopCardsRound = this.currentRound;
    this.playerData.shopPurchasedCards = [];
    // Note: shopCards will be set by the scene after generation
  }
  
  /**
   * Set the shop cards for this round
   * @param {Array} cards - Array of card objects
   */
  setCards(cards) {
    this.playerData.shopCards = cards;
    this.save();
  }
  
  /**
   * Mark a card as purchased
   * @param {number} cardIndex - Index of the card (0-3)
   */
  markCardPurchased(cardIndex) {
    if (!this.playerData.shopPurchasedCards) {
      this.playerData.shopPurchasedCards = [];
    }
    this.playerData.shopPurchasedCards.push(cardIndex);
    this.save();
  }
  
  /**
   * Check if a card has been purchased
   * @param {number} cardIndex - Index of the card (0-3)
   * @returns {boolean} True if card was purchased
   */
  isCardPurchased(cardIndex) {
    return this.playerData.shopPurchasedCards?.includes(cardIndex) || false;
  }
  
  /**
   * Reset purchased cards (used when refreshing shop)
   */
  resetPurchasedCards() {
    this.playerData.shopPurchasedCards = [];
    this.save();
  }
  
  /**
   * Save player data to game manager
   */
  save() {
    this.gameManager.savePlayerData(this.playerData);
  }
  
  // Getters
  
  /**
   * Get current shop cards
   * @returns {Array} Array of card objects
   */
  getCards() {
    return this.playerData.shopCards || [];
  }
  
  /**
   * Get player's current currency
   * @returns {number} Currency amount
   */
  getCurrency() {
    return this.playerData.currency || 0;
  }
  
  /**
   * Get number of equipped weapons
   * @returns {number} Number of equipped weapons (0-6)
   */
  getEquippedWeaponCount() {
    return this.playerData.equippedWeapons?.length || 0;
  }
  
  /**
   * Get purchased card indices
   * @returns {Array} Array of purchased card indices
   */
  getPurchasedCards() {
    return this.playerData.shopPurchasedCards || [];
  }
  
  /**
   * Check if player can afford refresh
   * @param {number} refreshCost - Cost to refresh (default 50)
   * @returns {boolean} True if player can afford
   */
  canAffordRefresh(refreshCost = 50) {
    return this.getCurrency() >= refreshCost;
  }
  
  /**
   * Check if weapons inventory is full
   * @param {number} maxWeapons - Maximum weapons (default 6)
   * @returns {boolean} True if inventory is full
   */
  isWeaponInventoryFull(maxWeapons = 6) {
    return this.getEquippedWeaponCount() >= maxWeapons;
  }
}
