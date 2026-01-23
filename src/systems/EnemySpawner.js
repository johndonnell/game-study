import Enemy from '../entities/Enemy.js';
import { ENEMY_TYPES } from '../config/enemyTypes.js';

/**
 * EnemySpawner class
 * Manages enemy spawning with progressive difficulty scaling
 */
export default class EnemySpawner {
  /**
   * @param {Phaser.Scene} scene - The scene to spawn enemies in
   */
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Spawn enemies for a given round
   * @param {number} roundNumber - Current round number
   * @returns {Enemy[]} Array of spawned enemies
   */
  spawnEnemiesForRound(roundNumber) {
    const enemies = [];
    
    // Calculate enemy count: 3 + (roundNumber * 2)
    const enemyCount = 3 + (roundNumber * 2);
    
    for (let i = 0; i < enemyCount; i++) {
      // Select enemy type based on round
      const enemyType = this.selectEnemyType(roundNumber);
      
      // Get spawn position
      const position = this.getSpawnPosition();
      
      // Create enemy with difficulty scaling
      const enemy = new Enemy(
        this.scene,
        position.x,
        position.y,
        enemyType,
        roundNumber
      );
      
      enemies.push(enemy);
    }
    
    return enemies;
  }
}
