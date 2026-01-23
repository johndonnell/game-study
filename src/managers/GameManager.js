/**
 * GameManager class
 * Central orchestrator that manages scene transitions and global game state
 */
export default class GameManager {
  /**
   * @param {Phaser.Game} phaserGame - The Phaser game instance
   */
  constructor(phaserGame) {
    this.game = phaserGame;
    
    // Initialize player data
    this.playerData = {
      characterType: null,
      currentRound: 1,
      currency: 0,
      availableStatPoints: 0,
      baseAttributes: {
        strength: 0,
        speed: 0,
        defense: 0,
        vitality: 0
      },
      currentAttributes: {
        strength: 0,
        speed: 0,
        defense: 0,
        vitality: 0
      },
      weaponInventory: [],
      itemInventory: [],
      equippedWeapons: [],
      equippedItems: []
    };
  }

  /**
   * Get current round number
   * @returns {number} Current round
   */
  getCurrentRound() {
    return this.playerData.currentRound;
  }

  /**
   * Set current round number
   * @param {number} round - Round number to set
   */
  setCurrentRound(round) {
    this.playerData.currentRound = round;
  }

  /**
   * Reset game to initial state
   */
  resetGame() {
    this.playerData.currentRound = 1;
    this.playerData.currency = 0;
    this.playerData.availableStatPoints = 0;
    this.playerData.weaponInventory = [];
    this.playerData.itemInventory = [];
    this.playerData.equippedWeapons = [];
    this.playerData.equippedItems = [];
    
    // Reset attributes to base values (will be set on character selection)
    if (this.playerData.characterType) {
      // Keep character type but reset stats
      // Base attributes will be restored from character type
    }
  }
}
