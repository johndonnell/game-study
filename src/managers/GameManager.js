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

  /**
   * Start character selection scene
   */
  startCharacterSelection() {
    if (this.game.scene.isActive('CharacterSelectScene')) {
      return;
    }
    this.game.scene.start('CharacterSelectScene');
  }

  /**
   * Start a round
   * @param {number} roundNumber - Round number to start
   */
  startRound(roundNumber) {
    this.setCurrentRound(roundNumber);
    
    // Stop all other scenes before starting GameScene
    const sceneManager = this.game.scene;
    sceneManager.stop('CharacterSelectScene');
    sceneManager.stop('ShopScene');
    sceneManager.stop('StatsScene');
    
    if (this.game.scene.isActive('GameScene')) {
      return;
    }
    this.game.scene.start('GameScene', { roundNumber });
  }

  /**
   * Show shop scene
   */
  showShop() {
    const sceneManager = this.game.scene;
    sceneManager.stop('GameScene');
    sceneManager.stop('CharacterSelectScene');
    
    if (this.game.scene.isActive('ShopScene')) {
      return;
    }
    this.game.scene.start('ShopScene');
  }

  /**
   * Show stats allocation scene
   */
  showStatsAllocation() {
    const sceneManager = this.game.scene;
    sceneManager.stop('ShopScene');
    
    if (this.game.scene.isActive('StatsScene')) {
      return;
    }
    this.game.scene.start('StatsScene');
  }

  /**
   * Show game over scene
   */
  showGameOver() {
    const sceneManager = this.game.scene;
    const finalRound = this.getCurrentRound();
    sceneManager.stop('GameScene');
    
    if (this.game.scene.isActive('GameOverScene')) {
      return;
    }
    this.game.scene.start('GameOverScene', { finalRound });
  }

  /**
   * Show victory scene
   */
  showVictory() {
    const sceneManager = this.game.scene;
    sceneManager.stop('GameScene');
    
    if (this.game.scene.isActive('VictoryScene')) {
      return;
    }
    this.game.scene.start('VictoryScene');
  }

  /**
   * Get player data
   * @returns {Object} Player data object
   */
  getPlayerData() {
    return this.playerData;
  }

  /**
   * Save player data
   * @param {Object} data - Player data to save
   */
  savePlayerData(data) {
    this.playerData = { ...this.playerData, ...data };
  }

  /**
   * Handle round completion
   * @param {number} roundNumber - Completed round number
   */
  onRoundComplete(roundNumber) {
    // Get progression manager
    const progressionManager = this.game.registry.get('progressionManager');
    
    // Award currency and stat points
    const currencyReward = progressionManager.calculateCurrencyReward(roundNumber);
    const statPointReward = progressionManager.calculateStatPointReward(roundNumber);
    
    progressionManager.addCurrency(currencyReward);
    progressionManager.addStatPoints(statPointReward);
    
    // Update player data
    this.playerData.currency = progressionManager.getCurrency();
    this.playerData.availableStatPoints = progressionManager.getAvailableStatPoints();
    
    // Advance to next round
    this.setCurrentRound(roundNumber + 1);
    
    // Check for victory (completed round 20)
    if (roundNumber >= 20) {
      this.showVictory();
    } else {
      // Go to shop
      this.showShop();
    }
  }

  /**
   * Handle round failure
   */
  onRoundFailed() {
    const currentRound = this.getCurrentRound();
    
    // Reset game
    this.resetGame();
    
    // Get progression manager and reset it
    const progressionManager = this.game.registry.get('progressionManager');
    progressionManager.reset();
    
    // Show game over with final round
    this.showGameOver();
  }
}
