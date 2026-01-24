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
    
    // Calculate enemy count: (3 + (roundNumber * 2)) * 2
    // Multiplied by 2 for increased difficulty
    const enemyCount = (3 + (roundNumber * 2)) * 2;
    
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
   * Ensures enemies don't spawn too close to the player
   * @returns {{x: number, y: number}} Spawn position
   */
  getSpawnPosition() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const margin = 50; // Margin from edges
    const minDistanceFromPlayer = 250; // Minimum distance from player to spawn
    
    // Get player position (center of screen)
    const playerX = width / 2;
    const playerY = height / 2;
    
    let x, y, distance;
    let attempts = 0;
    const maxAttempts = 50;
    
    // Keep trying until we find a position far enough from player
    do {
      x = margin + Math.random() * (width - margin * 2);
      y = margin + Math.random() * (height - margin * 2);
      
      // Calculate distance from player
      const dx = x - playerX;
      const dy = y - playerY;
      distance = Math.sqrt(dx * dx + dy * dy);
      
      attempts++;
    } while (distance < minDistanceFromPlayer && attempts < maxAttempts);
    
    // If we couldn't find a good position, spawn at edge
    if (distance < minDistanceFromPlayer) {
      // Spawn at a random edge
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: // Top
          x = margin + Math.random() * (width - margin * 2);
          y = margin;
          break;
        case 1: // Right
          x = width - margin;
          y = margin + Math.random() * (height - margin * 2);
          break;
        case 2: // Bottom
          x = margin + Math.random() * (width - margin * 2);
          y = height - margin;
          break;
        case 3: // Left
          x = margin;
          y = margin + Math.random() * (height - margin * 2);
          break;
      }
    }
    
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
