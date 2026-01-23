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
    if (this.game.scene.isActive('GameScene')) {
      return;
    }
    this.game.scene.start('GameScene', { roundNumber });
  }

  /**
   * Show shop scene
   */
  showShop() {
    if (this.game.scene.isActive('ShopScene')) {
      return;
    }
    this.game.scene.start('ShopScene');
  }

  /**
   * Show stats allocation scene
   */
  showStatsAllocation() {
    if (this.game.scene.isActive('StatsScene')) {
      return;
    }
    this.game.scene.start('StatsScene');
  }

  /**
   * Show game over scene
   */
  showGameOver() {
    if (this.game.scene.isActive('GameOverScene')) {
      return;
    }
    this.game.scene.start('GameOverScene');
  }

  /**
   * Show victory scene
   */
  showVictory() {
    if (this.game.scene.isActive('VictoryScene')) {
      return;
    }
    this.game.scene.start('VictoryScene');
  }
}
