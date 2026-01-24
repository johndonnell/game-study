import Phaser from 'phaser';

/**
 * StatsScene
 * Stat point allocation interface
 */
export default class StatsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StatsScene' });
  }

  async create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get game manager and player data
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const progressionManager = this.registry.get('progressionManager');

    // Initialize allocated stats if not present
    if (!playerData.allocatedStats) {
      playerData.allocatedStats = {
        strength: 0,
        speed: 0,
        defense: 0,
        vitality: 0,
        dexterity: 0
      };
    }

    // Title
    this.add.text(width / 2, 30, 'Allocate Stat Points', {
      font: '32px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Available stat points
    this.availablePointsText = this.add.text(width / 2, 80, 
      `Available Points: ${progressionManager.getAvailableStatPoints()}`,
      {
        font: '20px monospace',
        fill: '#ffff00'
      }
    ).setOrigin(0.5);

    // Get base stats from character type
    const baseStats = playerData.selectedCharacter.baseStats;

    // Display stats
    const stats = ['strength', 'speed', 'defense', 'vitality', 'dexterity'];
    const startY = 150;

    // Create a temporary player to calculate current attributes with items
    const PlayerCharacter = (await import('../entities/PlayerCharacter.js')).default;
    const tempPlayer = new PlayerCharacter(this, 0, 0, playerData.characterType);
    
    // Apply allocated stats
    Object.entries(playerData.allocatedStats || {}).forEach(([attr, value]) => {
      tempPlayer.increaseBaseAttribute(attr, value);
    });
    
    // Apply equipped items
    if (playerData.equippedItems) {
      playerData.equippedItems.forEach(item => {
        tempPlayer.equipItem(item);
      });
    }

    stats.forEach((stat, index) => {
      const y = startY + (index * 80);
      
      // Stat name
      this.add.text(100, y, stat.toUpperCase(), {
        font: '20px monospace',
        fill: '#ffffff'
      });

      // Base value
      const baseValue = baseStats[stat];
      this.add.text(250, y, `Base: ${baseValue}`, {
        font: '18px monospace',
        fill: '#cccccc'
      });

      // Allocated points
      const allocated = playerData.allocatedStats[stat];
      this.add.text(400, y, `+${allocated}`, {
        font: '18px monospace',
        fill: '#00ff00'
      });

      // Current value with items
      const currentValue = Math.round(tempPlayer.currentAttributes[stat] * 100) / 100;
      const itemBonus = currentValue - (baseValue + allocated * 0.25);
      
      // Show item bonus if any
      if (Math.abs(itemBonus) > 0.01) {
        this.add.text(500, y, `+${Math.round(itemBonus * 100) / 100}`, {
          font: '18px monospace',
          fill: itemBonus > 0 ? '#00ffff' : '#ff00ff'
        });
        this.add.text(600, y, `= ${currentValue}`, {
          font: '18px monospace',
          fill: '#ffffff'
        });
      } else {
        this.add.text(500, y, `= ${currentValue}`, {
          font: '18px monospace',
          fill: '#ffffff'
        });
      }

      // Plus button
      const plusBtn = this.add.rectangle(650, y, 40, 40, 0x00ff00);
      plusBtn.setInteractive({ useHandCursor: true });

      const plusText = this.add.text(650, y, '+', {
        font: '24px monospace',
        fill: '#000000'
      }).setOrigin(0.5);

      plusBtn.on('pointerover', () => {
        plusBtn.setFillStyle(0x00cc00);
      });

      plusBtn.on('pointerout', () => {
        plusBtn.setFillStyle(0x00ff00);
      });

      plusBtn.on('pointerdown', () => {
        if (progressionManager.spendStatPoint()) {
          playerData.allocatedStats[stat]++;
          gameManager.savePlayerData(playerData);
          this.scene.restart();
        }
      });

      // Minus button (to undo allocation)
      const minusBtn = this.add.rectangle(720, y, 40, 40, 0xff0000);
      minusBtn.setInteractive({ useHandCursor: true });

      const minusText = this.add.text(720, y, '-', {
        font: '24px monospace',
        fill: '#ffffff'
      }).setOrigin(0.5);

      minusBtn.on('pointerover', () => {
        minusBtn.setFillStyle(0xcc0000);
      });

      minusBtn.on('pointerout', () => {
        minusBtn.setFillStyle(0xff0000);
      });

      minusBtn.on('pointerdown', () => {
        if (playerData.allocatedStats[stat] > 0) {
          playerData.allocatedStats[stat]--;
          progressionManager.addStatPoints(1);
          gameManager.savePlayerData(playerData);
          this.scene.restart();
        }
      });
    });

    // Continue button
    const continueBtn = this.add.rectangle(width / 2, height - 50, 200, 40, 0x00ff00);
    continueBtn.setInteractive({ useHandCursor: true });

    const continueText = this.add.text(width / 2, height - 50, 'Start Round', {
      font: '20px monospace',
      fill: '#000000'
    }).setOrigin(0.5);

    continueBtn.on('pointerover', () => {
      continueBtn.setFillStyle(0x00cc00);
    });

    continueBtn.on('pointerout', () => {
      continueBtn.setFillStyle(0x00ff00);
    });

    continueBtn.on('pointerdown', () => {
      const currentRound = gameManager.getCurrentRound();
      gameManager.startRound(currentRound);
    });
  }
}
