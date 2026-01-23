/**
 * Unit tests for RoundManager class
 */

import RoundManager from '../../src/systems/RoundManager.js';

describe('RoundManager', () => {
  let roundManager;
  let mockScene;
  let mockGameManager;

  beforeEach(() => {
    mockScene = {};
    mockGameManager = {
      onRoundComplete: () => {},
      onRoundFailed: () => {}
    };
    roundManager = new RoundManager(mockScene, mockGameManager);
  });

  describe('Initialization', () => {
    test('should initialize with round 1', () => {
      expect(roundManager.currentRound).toBe(1);
    });

    test('should initialize with empty enemies array', () => {
      expect(roundManager.enemies).toEqual([]);
    });

    test('should initialize as not active', () => {
      expect(roundManager.isRoundActive).toBe(false);
    });
  });

  describe('Start Round', () => {
    test('should set current round number', () => {
      roundManager.startRound(5);
      expect(roundManager.currentRound).toBe(5);
    });

    test('should set round as active', () => {
      roundManager.startRound(1);
      expect(roundManager.isRoundActive).toBe(true);
    });

    test('should clear enemies array', () => {
      roundManager.enemies = [{ id: 1 }, { id: 2 }];
      roundManager.startRound(2);
      expect(roundManager.enemies).toEqual([]);
    });
  });

  describe('Check Round Complete', () => {
    test('should return false when no enemies', () => {
      roundManager.enemies = [];
      expect(roundManager.checkRoundComplete()).toBe(false);
    });

    test('should return true when all enemies are dead', () => {
      roundManager.enemies = [
        { isDead: () => true },
        { isDead: () => true },
        { isDead: () => true }
      ];
      expect(roundManager.checkRoundComplete()).toBe(true);
    });

    test('should return false when some enemies are alive', () => {
      roundManager.enemies = [
        { isDead: () => true },
        { isDead: () => false },
        { isDead: () => true }
      ];
      expect(roundManager.checkRoundComplete()).toBe(false);
    });

    test('should return false when all enemies are alive', () => {
      roundManager.enemies = [
        { isDead: () => false },
        { isDead: () => false }
      ];
      expect(roundManager.checkRoundComplete()).toBe(false);
    });
  });

  describe('Round Completion', () => {
    test('should set round as inactive on completion', () => {
      roundManager.isRoundActive = true;
      roundManager.onRoundComplete();
      expect(roundManager.isRoundActive).toBe(false);
    });

    test('should call gameManager.onRoundComplete', () => {
      let called = false;
      let passedRound = null;
      mockGameManager.onRoundComplete = (round) => {
        called = true;
        passedRound = round;
      };
      
      roundManager.currentRound = 5;
      roundManager.onRoundComplete();
      
      expect(called).toBe(true);
      expect(passedRound).toBe(5);
    });
  });

  describe('Round Failure', () => {
    test('should set round as inactive on failure', () => {
      roundManager.isRoundActive = true;
      roundManager.onRoundFailed();
      expect(roundManager.isRoundActive).toBe(false);
    });

    test('should call gameManager.onRoundFailed', () => {
      let called = false;
      mockGameManager.onRoundFailed = () => {
        called = true;
      };
      
      roundManager.onRoundFailed();
      expect(called).toBe(true);
    });
  });

  describe('Enemy Management', () => {
    test('should remove enemy from list', () => {
      const enemy1 = { id: 1 };
      const enemy2 = { id: 2 };
      const enemy3 = { id: 3 };
      
      roundManager.enemies = [enemy1, enemy2, enemy3];
      roundManager.removeEnemy(enemy2);
      
      expect(roundManager.enemies).toEqual([enemy1, enemy3]);
      expect(roundManager.enemies.length).toBe(2);
    });

    test('should handle removing non-existent enemy', () => {
      const enemy1 = { id: 1 };
      const enemy2 = { id: 2 };
      const enemy3 = { id: 3 };
      
      roundManager.enemies = [enemy1, enemy2];
      roundManager.removeEnemy(enemy3);
      
      expect(roundManager.enemies).toEqual([enemy1, enemy2]);
    });

    test('should get correct count of remaining enemies', () => {
      roundManager.enemies = [
        { isDead: () => false },
        { isDead: () => true },
        { isDead: () => false },
        { isDead: () => false }
      ];
      
      expect(roundManager.getRemainingEnemyCount()).toBe(3);
    });

    test('should return 0 when all enemies are dead', () => {
      roundManager.enemies = [
        { isDead: () => true },
        { isDead: () => true }
      ];
      
      expect(roundManager.getRemainingEnemyCount()).toBe(0);
    });

    test('should return total count when all enemies are alive', () => {
      roundManager.enemies = [
        { isDead: () => false },
        { isDead: () => false },
        { isDead: () => false }
      ];
      
      expect(roundManager.getRemainingEnemyCount()).toBe(3);
    });
  });

  describe('Update Round', () => {
    test('should not update when round is not active', () => {
      roundManager.isRoundActive = false;
      let completeCalled = false;
      mockGameManager.onRoundComplete = () => { completeCalled = true; };
      
      roundManager.enemies = [{ isDead: () => true }];
      roundManager.updateRound(16);
      
      expect(completeCalled).toBe(false);
    });

    test('should check completion when round is active', () => {
      roundManager.isRoundActive = true;
      let completeCalled = false;
      mockGameManager.onRoundComplete = () => { completeCalled = true; };
      
      roundManager.enemies = [{ isDead: () => true }];
      roundManager.updateRound(16);
      
      expect(completeCalled).toBe(true);
    });
  });

  describe('Round Progression', () => {
    test('should advance from round 1 to round 2', () => {
      roundManager.startRound(1);
      expect(roundManager.currentRound).toBe(1);
      
      roundManager.startRound(2);
      expect(roundManager.currentRound).toBe(2);
    });

    test('should handle round 20', () => {
      roundManager.startRound(20);
      expect(roundManager.currentRound).toBe(20);
    });
  });
});
