/**
 * RoundManager class
 * Orchestrates round flow and win/loss conditions
 */
export default class RoundManager {
  /**
   * @param {Phaser.Scene} scene - The scene this round manager belongs to
   * @param {Object} gameManager - Game manager for state coordination
   */
  constructor(scene, gameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    
    // Round properties
    this.currentRound = 1;
    this.enemies = [];
    this.isRoundActive = false;
  }

  /**
   * Start a new round
   * @param {number} roundNumber - Round number to start
   */
  startRound(roundNumber) {
    this.currentRound = roundNumber;
    this.isRoundActive = true;
    this.enemies = [];
    
    // Enemies will be spawned by the scene using EnemySpawner
  }

  /**
   * Update round state (called each frame)
   * @param {number} delta - Time since last update in milliseconds
   */
  updateRound(delta) {
    if (!this.isRoundActive) return;

    // Check win/loss conditions
    if (this.checkRoundComplete()) {
      this.onRoundComplete();
    } else if (this.checkRoundFailed()) {
      this.onRoundFailed();
    }
  }

  /**
   * Check if round is complete (all enemies defeated)
   * @returns {boolean} True if all enemies are defeated
   */
  checkRoundComplete() {
    if (this.enemies.length === 0) return false;
    return this.enemies.every(enemy => enemy.isDead());
  }

  /**
   * Check if round has failed (player is dead)
   * @returns {boolean} True if player is dead
   */
  checkRoundFailed() {
    // This will be checked by the scene with player.isDead()
    return false;
  }

  /**
   * Handle round completion
   * Awards rewards and transitions to shop
   */
  onRoundComplete() {
    this.isRoundActive = false;
    
    // Award currency and stat points will be handled by GameManager
    // Transition to shop scene will be handled by GameManager
    
    if (this.gameManager && this.gameManager.onRoundComplete) {
      this.gameManager.onRoundComplete(this.currentRound);
    }
  }

  /**
   * Handle round failure
   * Resets game to round 1 and clears all progress
   */
  onRoundFailed() {
    this.isRoundActive = false;
    
    // Reset game state will be handled by GameManager
    // Transition to game over scene will be handled by GameManager
    
    if (this.gameManager && this.gameManager.onRoundFailed) {
      this.gameManager.onRoundFailed();
    }
  }
}
