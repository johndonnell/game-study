/**
 * Unit tests for GameManager class
 */

import GameManager from '../../src/managers/GameManager.js';

describe('GameManager', () => {
  let gameManager;
  let mockGame;

  beforeEach(() => {
    mockGame = {
      scene: {
        isActive: () => false,
        start: () => {},
        stop: () => {},
        getScene: () => null // Mock getScene to return null (no music to stop)
      }
    };
    gameManager = new GameManager(mockGame);
  });

  describe('Initialization', () => {
    test('should initialize with round 1', () => {
      expect(gameManager.getCurrentRound()).toBe(1);
    });

    test('should initialize player data structure', () => {
      const data = gameManager.getPlayerData();
      expect(data).toBeDefined();
      expect(data.characterType).toBeNull();
      expect(data.currentRound).toBe(1);
      expect(data.currency).toBe(0);
      expect(data.availableStatPoints).toBe(0);
    });

    test('should initialize empty inventories', () => {
      const data = gameManager.getPlayerData();
      expect(data.weaponInventory).toEqual([]);
      expect(data.itemInventory).toEqual([]);
      expect(data.equippedWeapons).toEqual([]);
      expect(data.equippedItems).toEqual([]);
    });

    test('should initialize attributes', () => {
      const data = gameManager.getPlayerData();
      expect(data.baseAttributes).toBeDefined();
      expect(data.currentAttributes).toBeDefined();
    });
  });

  describe('Round Management', () => {
    test('should get current round', () => {
      expect(gameManager.getCurrentRound()).toBe(1);
    });

    test('should set current round', () => {
      gameManager.setCurrentRound(5);
      expect(gameManager.getCurrentRound()).toBe(5);
    });

    test('should update player data round number', () => {
      gameManager.setCurrentRound(10);
      expect(gameManager.getPlayerData().currentRound).toBe(10);
    });
  });

  describe('Reset Game', () => {
    test('should reset round to 1', () => {
      gameManager.setCurrentRound(10);
      gameManager.resetGame();
      expect(gameManager.getCurrentRound()).toBe(1);
    });

    test('should reset currency to 0', () => {
      gameManager.playerData.currency = 500;
      gameManager.resetGame();
      expect(gameManager.getPlayerData().currency).toBe(0);
    });

    test('should reset stat points to 0', () => {
      gameManager.playerData.availableStatPoints = 20;
      gameManager.resetGame();
      expect(gameManager.getPlayerData().availableStatPoints).toBe(0);
    });

    test('should clear weapon inventory', () => {
      gameManager.playerData.weaponInventory = [{ type: 'SWORD' }];
      gameManager.resetGame();
      expect(gameManager.getPlayerData().weaponInventory).toEqual([]);
    });

    test('should clear item inventory', () => {
      gameManager.playerData.itemInventory = [{ type: 'RING' }];
      gameManager.resetGame();
      expect(gameManager.getPlayerData().itemInventory).toEqual([]);
    });

    test('should clear equipped weapons', () => {
      gameManager.playerData.equippedWeapons = [{ type: 'SWORD' }];
      gameManager.resetGame();
      expect(gameManager.getPlayerData().equippedWeapons).toEqual([]);
    });

    test('should clear equipped items', () => {
      gameManager.playerData.equippedItems = [{ type: 'RING' }];
      gameManager.resetGame();
      expect(gameManager.getPlayerData().equippedItems).toEqual([]);
    });
  });

  describe('Player Data Management', () => {
    test('should get player data', () => {
      const data = gameManager.getPlayerData();
      expect(data).toBe(gameManager.playerData);
    });

    test('should save player data', () => {
      gameManager.savePlayerData({
        currency: 100,
        availableStatPoints: 5
      });
      
      expect(gameManager.getPlayerData().currency).toBe(100);
      expect(gameManager.getPlayerData().availableStatPoints).toBe(5);
    });

    test('should merge saved data with existing data', () => {
      gameManager.playerData.currency = 50;
      gameManager.playerData.currentRound = 3;
      
      gameManager.savePlayerData({
        currency: 100
      });
      
      expect(gameManager.getPlayerData().currency).toBe(100);
      expect(gameManager.getPlayerData().currentRound).toBe(3);
    });

    test('should preserve character type when saving', () => {
      gameManager.playerData.characterType = 'WARRIOR';
      
      gameManager.savePlayerData({
        currency: 100
      });
      
      expect(gameManager.getPlayerData().characterType).toBe('WARRIOR');
    });
  });

  describe('Scene Transitions', () => {
    test('should start character selection scene', () => {
      let startedScene = null;
      mockGame.scene.start = (scene) => { startedScene = scene; };
      
      gameManager.startCharacterSelection();
      expect(startedScene).toBe('CharacterSelectScene');
    });

    test('should start round with round number', () => {
      let startedScene = null;
      let sceneData = null;
      mockGame.scene.start = (scene, data) => {
        startedScene = scene;
        sceneData = data;
      };
      
      gameManager.startRound(5);
      expect(startedScene).toBe('GameScene');
      expect(sceneData.roundNumber).toBe(5);
      expect(gameManager.getCurrentRound()).toBe(5);
    });

    test('should show shop scene', () => {
      let startedScene = null;
      mockGame.scene.start = (scene) => { startedScene = scene; };
      
      gameManager.showShop();
      expect(startedScene).toBe('ShopScene');
    });

    test('should show stats allocation scene', () => {
      let startedScene = null;
      mockGame.scene.start = (scene) => { startedScene = scene; };
      
      gameManager.showStatsAllocation();
      expect(startedScene).toBe('StatsScene');
    });

    test('should show game over scene', () => {
      let startedScene = null;
      mockGame.scene.start = (scene) => { startedScene = scene; };
      
      gameManager.showGameOver();
      expect(startedScene).toBe('GameOverScene');
    });

    test('should show victory scene', () => {
      let startedScene = null;
      mockGame.scene.start = (scene) => { startedScene = scene; };
      
      gameManager.showVictory();
      expect(startedScene).toBe('VictoryScene');
    });

    test('should not start scene if already active', () => {
      let startCalled = false;
      mockGame.scene.isActive = (scene) => scene === 'GameScene';
      mockGame.scene.start = () => { startCalled = true; };
      
      gameManager.startRound(1);
      expect(startCalled).toBe(false);
    });
  });

  describe('State Persistence', () => {
    test('should maintain state across operations', () => {
      gameManager.savePlayerData({ currency: 100 });
      gameManager.setCurrentRound(5);
      gameManager.savePlayerData({ availableStatPoints: 10 });
      
      const data = gameManager.getPlayerData();
      expect(data.currency).toBe(100);
      expect(data.currentRound).toBe(5);
      expect(data.availableStatPoints).toBe(10);
    });

    test('should maintain inventory across rounds', () => {
      gameManager.savePlayerData({
        weaponInventory: [{ type: 'SWORD' }],
        itemInventory: [{ type: 'RING' }]
      });
      
      gameManager.setCurrentRound(2);
      
      const data = gameManager.getPlayerData();
      expect(data.weaponInventory.length).toBe(1);
      expect(data.itemInventory.length).toBe(1);
    });
  });
});
