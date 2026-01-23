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

  /**
   * Get a valid spawn position within screen boundaries
   * @returns {{x: number, y: number}} Spawn position
   */
  getSpawnPosition() {
    const bounds = this.scene.sys.game.config;
    const margin = 50; // Margin from edges
    
    // Random position within bounds
    const x = margin + Math.random() * (bounds.width - margin * 2);
    const y = margin + Math.random() * (bounds.height - margin * 2);
    
    return { x, y };
  }

  /**
   * Select enemy type based on round number
   * @param {number} roundNumber - Current round number
   * @returns {string} Enemy type key
   */
  selectEnemyType(roundNumber) {
    const enemyTypeKeys = Object.keys(ENEMY_TYPES);
    
    // Early rounds: weaker enemies
    if (roundNumber <= 5) {
      // GOBLIN, ORC
      return enemyTypeKeys[Math.floor(Math.random() * 2)];
    } else if (roundNumber <= 10) {
      // GOBLIN, ORC, TROLL
      return enemyTypeKeys[Math.floor(Math.random() * 3)];
    } else if (roundNumber <= 15) {
      // ORC, TROLL, DEMON
      return enemyTypeKeys[1 + Math.floor(Math.random() * 3)];
    } else {
      // TROLL, DEMON, DRAGON
      return enemyTypeKeys[2 + Math.floor(Math.random() * 3)];
    }
  }
}
