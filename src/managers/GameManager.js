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
    
    console.log('🎮 GameManager constructor - creating fresh playerData');
    
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
    
    console.log('   ✅ Fresh playerData created:', this.playerData);
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
    console.log('🔄 GameManager.resetGame() - clearing ALL state');
    
    this.playerData.currentRound = 1;
    this.playerData.currency = 0;
    this.playerData.availableStatPoints = 0;
    this.playerData.weaponInventory = [];
    this.playerData.itemInventory = [];
    this.playerData.equippedWeapons = [];
    this.playerData.equippedItems = [];
    this.playerData.allocatedStats = {
      strength: 0,
      speed: 0,
      defense: 0,
      vitality: 0,
      dexterity: 0
    };
    this.playerData.shopRandomItems = null;
    this.playerData.shopRandomItemsRound = null;
    this.playerData.shopPurchasedItems = [];
    
    // CRITICAL: Clear shop state
    this.playerData.shopCards = null;
    this.playerData.shopCardsRound = null;
    this.playerData.shopPurchasedCards = [];
    
    console.log('   ✅ All state cleared, shopPurchasedCards:', this.playerData.shopPurchasedCards);
    
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
    const sceneManager = this.game.scene;
    sceneManager.stop('GameOverScene');
    sceneManager.stop('VictoryScene');
    
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
    
    // Get GameScene and stop its music before stopping the scene
    const gameScene = sceneManager.getScene('GameScene');
    if (gameScene && gameScene.music) {
      console.log('Stopping game music before transitioning to shop');
      gameScene.music.stop();
    }
    
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
  showGameOver(finalStats) {
    const sceneManager = this.game.scene;
    
    // Get GameScene and stop its music before stopping the scene
    const gameScene = sceneManager.getScene('GameScene');
    if (gameScene && gameScene.music) {
      console.log('Stopping game music before game over');
      gameScene.music.stop();
    }
    
    // Stop GameScene
    sceneManager.stop('GameScene');
    
    if (this.game.scene.isActive('GameOverScene')) {
      return;
    }
    
    // Pass final stats to game over scene
    this.game.scene.start('GameOverScene', finalStats);
  }

  /**
   * Show victory scene
   */
  showVictory() {
    const sceneManager = this.game.scene;
    
    // Get GameScene and stop its music before stopping the scene
    const gameScene = sceneManager.getScene('GameScene');
    if (gameScene && gameScene.music) {
      console.log('Stopping game music before victory');
      gameScene.music.stop();
    }
    
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
    
    // Save player stats before resetting
    const finalStats = {
      finalRound: currentRound,
      character: this.playerData.selectedCharacter?.name || 'Unknown',
      currency: this.playerData.currency || 0,
      weaponCount: this.playerData.equippedWeapons?.length || 0,
      itemCount: this.playerData.equippedItems?.length || 0,
      weapons: this.playerData.equippedWeapons?.map(w => w.type) || [],
      items: this.playerData.equippedItems?.map(i => i.type) || []
    };
    
    // Get progression manager and reset it
    const progressionManager = this.game.registry.get('progressionManager');
    progressionManager.reset();
    
    // Reset game
    this.resetGame();
    
    // Show game over with saved stats
    this.showGameOver(finalStats);
  }
}
