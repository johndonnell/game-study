import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import EnemyMovementSystem from '../../src/systems/EnemyMovementSystem.js';

describe('EnemyMovementSystem', () => {
  let mockScene;
  let movementSystem;
  let mockPlayer;
  let mockEnemy;

  beforeEach(() => {
    mockScene = {
      time: { now: 0 }
    };

    movementSystem = new EnemyMovementSystem(mockScene);

    mockPlayer = {
      x: 400,
      y: 300
    };

    mockEnemy = {
      x: 200,
      y: 200,
      enemyType: 'GOBLIN',
      speed: 80,
      isDead: jest.fn(() => false)
    };
  });

  describe('initialization', () => {
    it('should initialize with empty enemy states', () => {
      expect(movementSystem.enemyStates.size).toBe(0);
    });

    it('should initialize enemy state on first update', () => {
      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);
      expect(movementSystem.enemyStates.has(mockEnemy)).toBe(true);
    });

    it('should not reinitialize existing enemy state', () => {
      movementSystem.initializeEnemy(mockEnemy);
      const firstState = movementSystem.enemyStates.get(mockEnemy);
      
      movementSystem.initializeEnemy(mockEnemy);
      const secondState = movementSystem.enemyStates.get(mockEnemy);
      
      expect(firstState).toBe(secondState);
    });
  });

  describe('goblin movement', () => {
    beforeEach(() => {
      mockEnemy.enemyType = 'GOBLIN';
    });

    it('should move goblin towards player', () => {
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      // Goblin should have moved (zigzag pattern still moves generally towards player)
      const movedX = mockEnemy.x !== initialX;
      const movedY = mockEnemy.y !== initialY;
      expect(movedX || movedY).toBe(true);
    });

    it('should apply zigzag pattern', () => {
      const positions = [];
      
      // Track positions over multiple updates
      for (let i = 0; i < 10; i++) {
        movementSystem.updateMovement(mockEnemy, mockPlayer, 16, i * 16);
        positions.push({ x: mockEnemy.x, y: mockEnemy.y });
      }

      // Check that movement is not perfectly linear (zigzag creates variation)
      const xDeltas = [];
      for (let i = 1; i < positions.length; i++) {
        xDeltas.push(positions[i].x - positions[i - 1].x);
      }

      // Zigzag should create varying x deltas
      const hasVariation = xDeltas.some((delta, i) => 
        i > 0 && Math.abs(delta - xDeltas[i - 1]) > 0.01
      );
      expect(hasVariation).toBe(true);
    });
  });

  describe('orc movement', () => {
    beforeEach(() => {
      mockEnemy.enemyType = 'ORC';
    });

    it('should move orc slowly when not charging', () => {
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      const distanceMoved = Math.sqrt(
        Math.pow(mockEnemy.x - initialX, 2) + 
        Math.pow(mockEnemy.y - initialY, 2)
      );

      // Should move, but slowly (0.3x speed)
      expect(distanceMoved).toBeGreaterThan(0);
      expect(distanceMoved).toBeLessThan(2); // Very small movement
    });

    it('should charge after cooldown expires', () => {
      const state = movementSystem.enemyStates.get(mockEnemy) || {};
      movementSystem.initializeEnemy(mockEnemy);
      
      // Simulate time passing to trigger charge
      const updatedState = movementSystem.enemyStates.get(mockEnemy);
      updatedState.chargeTimer = updatedState.chargeCooldown + 100;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 5000);

      expect(updatedState.isCharging).toBe(true);
    });
  });

  describe('troll movement', () => {
    beforeEach(() => {
      mockEnemy.enemyType = 'TROLL';
    });

    it('should move troll directly towards player', () => {
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      // Calculate expected direction
      const dx = mockPlayer.x - initialX;
      const dy = mockPlayer.y - initialY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const expectedDirX = dx / distance;
      const expectedDirY = dy / distance;

      // Calculate actual direction
      const actualDx = mockEnemy.x - initialX;
      const actualDy = mockEnemy.y - initialY;
      const actualDistance = Math.sqrt(actualDx * actualDx + actualDy * actualDy);
      const actualDirX = actualDx / actualDistance;
      const actualDirY = actualDy / actualDistance;

      // Should move in roughly the same direction (allowing for floating point errors)
      expect(Math.abs(actualDirX - expectedDirX)).toBeLessThan(0.1);
      expect(Math.abs(actualDirY - expectedDirY)).toBeLessThan(0.1);
    });
  });

  describe('demon movement', () => {
    beforeEach(() => {
      mockEnemy.enemyType = 'DEMON';
    });

    it('should circle-strafe around player', () => {
      // Position demon at optimal range
      mockEnemy.x = mockPlayer.x + 250;
      mockEnemy.y = mockPlayer.y;

      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      // Demon should move (circling)
      const moved = mockEnemy.x !== initialX || mockEnemy.y !== initialY;
      expect(moved).toBe(true);
    });

    it('should maintain distance from player', () => {
      // Position demon too close
      mockEnemy.x = mockPlayer.x + 100;
      mockEnemy.y = mockPlayer.y;

      const initialDistance = Math.sqrt(
        Math.pow(mockPlayer.x - mockEnemy.x, 2) + 
        Math.pow(mockPlayer.y - mockEnemy.y, 2)
      );

      // Update multiple times
      for (let i = 0; i < 20; i++) {
        movementSystem.updateMovement(mockEnemy, mockPlayer, 16, i * 16);
      }

      const finalDistance = Math.sqrt(
        Math.pow(mockPlayer.x - mockEnemy.x, 2) + 
        Math.pow(mockPlayer.y - mockEnemy.y, 2)
      );

      // Should try to move away (increase distance)
      expect(finalDistance).toBeGreaterThan(initialDistance);
    });
  });

  describe('dragon movement', () => {
    beforeEach(() => {
      mockEnemy.enemyType = 'DRAGON';
    });

    it('should retreat when player gets too close', () => {
      // Position dragon close to player (danger range)
      mockEnemy.x = mockPlayer.x + 150;
      mockEnemy.y = mockPlayer.y;

      const initialDistance = Math.sqrt(
        Math.pow(mockPlayer.x - mockEnemy.x, 2) + 
        Math.pow(mockPlayer.y - mockEnemy.y, 2)
      );

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      const finalDistance = Math.sqrt(
        Math.pow(mockPlayer.x - mockEnemy.x, 2) + 
        Math.pow(mockPlayer.y - mockEnemy.y, 2)
      );

      // Should retreat (increase distance)
      expect(finalDistance).toBeGreaterThan(initialDistance);
    });

    it('should maintain long range positioning', () => {
      // Position dragon at safe range
      mockEnemy.x = mockPlayer.x + 350;
      mockEnemy.y = mockPlayer.y;

      const initialX = mockEnemy.x;

      // Update multiple times
      for (let i = 0; i < 10; i++) {
        movementSystem.updateMovement(mockEnemy, mockPlayer, 16, i * 16);
      }

      // Should stay roughly at same distance (slight strafing allowed)
      const distanceMoved = Math.abs(mockEnemy.x - initialX);
      expect(distanceMoved).toBeLessThan(50); // Small movement for strafing
    });
  });

  describe('edge cases', () => {
    it('should handle dead enemies', () => {
      mockEnemy.isDead = jest.fn(() => true);
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      // Dead enemies should not move
      expect(mockEnemy.x).toBe(initialX);
      expect(mockEnemy.y).toBe(initialY);
    });

    it('should handle null player', () => {
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, null, 16, 0);

      // Should not move with null player
      expect(mockEnemy.x).toBe(initialX);
      expect(mockEnemy.y).toBe(initialY);
    });

    it('should handle zero distance to player', () => {
      mockEnemy.x = mockPlayer.x;
      mockEnemy.y = mockPlayer.y;

      // Should not throw error
      expect(() => {
        movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);
      }).not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('should remove enemy state', () => {
      movementSystem.initializeEnemy(mockEnemy);
      expect(movementSystem.enemyStates.has(mockEnemy)).toBe(true);

      movementSystem.removeEnemy(mockEnemy);
      expect(movementSystem.enemyStates.has(mockEnemy)).toBe(false);
    });

    it('should clear all enemy states', () => {
      const enemy1 = { ...mockEnemy };
      const enemy2 = { ...mockEnemy, enemyType: 'ORC' };

      movementSystem.initializeEnemy(enemy1);
      movementSystem.initializeEnemy(enemy2);
      expect(movementSystem.enemyStates.size).toBe(2);

      movementSystem.clear();
      expect(movementSystem.enemyStates.size).toBe(0);
    });
  });

  describe('direct movement fallback', () => {
    it('should use direct movement for unknown enemy types', () => {
      mockEnemy.enemyType = 'UNKNOWN';
      const initialX = mockEnemy.x;
      const initialY = mockEnemy.y;

      movementSystem.updateMovement(mockEnemy, mockPlayer, 16, 0);

      // Should still move towards player
      const dx = mockEnemy.x - initialX;
      const dy = mockEnemy.y - initialY;
      const movedTowardsPlayer = 
        (dx > 0 && mockPlayer.x > initialX) || 
        (dx < 0 && mockPlayer.x < initialX) ||
        (dy > 0 && mockPlayer.y > initialY) ||
        (dy < 0 && mockPlayer.y < initialY);

      expect(movedTowardsPlayer).toBe(true);
    });
  });
});
