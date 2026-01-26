import Phaser from 'phaser';
import { enableResize } from '../utils/ResizableScene.js';

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

    // Enable resize handling
    enableResize(this);

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

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title with decorative border
    const titleBg = this.add.rectangle(width / 2, 40, 500, 60, 0x16213e);
    titleBg.setStrokeStyle(3, 0x0f3460);
    
    this.add.text(width / 2, 40, 'ALLOCATE STAT POINTS', {
      font: 'bold 28px monospace',
      fill: '#e94560',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Available stat points - prominent display
    const pointsBg = this.add.rectangle(width / 2, 100, 400, 50, 0x0f3460);
    pointsBg.setStrokeStyle(2, 0xe94560);
    
    this.availablePointsText = this.add.text(width / 2, 100, 
      `Available Points: ${progressionManager.getAvailableStatPoints()}`,
      {
        font: 'bold 24px monospace',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    // Get base stats from character type
    const baseStats = playerData.selectedCharacter.baseStats;

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

    // Column headers
    const headerY = 160;
    const leftX = 120;
    
    this.add.text(leftX, headerY, 'STAT', {
      font: 'bold 16px monospace',
      fill: '#888888'
    }).setOrigin(0, 0.5);
    
    this.add.text(leftX + 150, headerY, 'BASE', {
      font: 'bold 16px monospace',
      fill: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(leftX + 250, headerY, 'POINTS', {
      font: 'bold 16px monospace',
      fill: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(leftX + 350, headerY, 'ITEMS', {
      font: 'bold 16px monospace',
      fill: '#888888'
    }).setOrigin(0.5);
    
    this.add.text(leftX + 450, headerY, 'TOTAL', {
      font: 'bold 16px monospace',
      fill: '#888888'
    }).setOrigin(0.5);

    // Display stats with organized layout
    const stats = [
      { key: 'strength', name: 'STRENGTH', color: '#ff6b6b', icon: '💪' },
      { key: 'speed', name: 'SPEED', color: '#4ecdc4', icon: '⚡' },
      { key: 'defense', name: 'DEFENSE', color: '#95e1d3', icon: '🛡️' },
      { key: 'vitality', name: 'VITALITY', color: '#f38181', icon: '❤️' },
      { key: 'dexterity', name: 'DEXTERITY', color: '#aa96da', icon: '🎯' }
    ];
    
    const startY = 200;
    const rowHeight = 70;

    stats.forEach((stat, index) => {
      const y = startY + (index * rowHeight);
      
      // Row background (alternating)
      const rowBg = this.add.rectangle(width / 2, y, width - 40, rowHeight - 10, 
        index % 2 === 0 ? 0x16213e : 0x0f3460, 0.5);
      rowBg.setStrokeStyle(1, 0x0f3460);

      // Stat name with icon (aligned with header)
      this.add.text(leftX, y, `${stat.icon} ${stat.name}`, {
        font: 'bold 18px monospace',
        fill: stat.color,
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0, 0.5);

      // Base value
      const baseValue = baseStats[stat.key];
      this.add.text(leftX + 150, y, `${baseValue}`, {
        font: 'bold 20px monospace',
        fill: '#cccccc'
      }).setOrigin(0.5);

      // Allocated points (with 0.25x multiplier shown)
      const allocated = playerData.allocatedStats[stat.key];
      const allocatedValue = allocated * 0.25;
      
      if (allocated > 0) {
        this.add.text(leftX + 250, y - 8, `+${allocated} pts`, {
          font: '14px monospace',
          fill: '#888888'
        }).setOrigin(0.5);
        
        this.add.text(leftX + 250, y + 8, `(+${allocatedValue.toFixed(2)})`, {
          font: 'bold 16px monospace',
          fill: '#00ff00'
        }).setOrigin(0.5);
      } else {
        this.add.text(leftX + 250, y, '-', {
          font: '20px monospace',
          fill: '#444444'
        }).setOrigin(0.5);
      }

      // Item bonus (percentage and flat bonuses separated)
      const currentValue = tempPlayer.currentAttributes[stat.key];
      const baseWithAllocated = baseValue + allocatedValue;
      const itemBonus = currentValue - baseWithAllocated;
      
      if (Math.abs(itemBonus) > 0.01) {
        const bonusColor = itemBonus > 0 ? '#00ffff' : '#ff00ff';
        this.add.text(leftX + 350, y, `${itemBonus > 0 ? '+' : ''}${itemBonus.toFixed(2)}`, {
          font: 'bold 18px monospace',
          fill: bonusColor,
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
      } else {
        this.add.text(leftX + 350, y, '-', {
          font: '20px monospace',
          fill: '#444444'
        }).setOrigin(0.5);
      }

      // Total value (final calculated value)
      this.add.text(leftX + 450, y, `${currentValue.toFixed(2)}`, {
        font: 'bold 22px monospace',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);

      // Plus button (styled)
      const btnY = y;
      const plusBtn = this.add.rectangle(leftX + 570, btnY, 50, 50, 0x00aa00);
      plusBtn.setStrokeStyle(2, 0x00ff00);
      plusBtn.setInteractive({ useHandCursor: true });

      const plusText = this.add.text(leftX + 570, btnY, '+', {
        font: 'bold 32px monospace',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);

      plusBtn.on('pointerover', () => {
        plusBtn.setFillStyle(0x00ff00);
        plusBtn.setScale(1.1);
      });

      plusBtn.on('pointerout', () => {
        plusBtn.setFillStyle(0x00aa00);
        plusBtn.setScale(1);
      });

      plusBtn.on('pointerdown', () => {
        if (progressionManager.spendStatPoint()) {
          playerData.allocatedStats[stat.key]++;
          gameManager.savePlayerData(playerData);
          this.scene.restart();
        }
      });

      // Minus button (styled)
      const minusBtn = this.add.rectangle(leftX + 640, btnY, 50, 50, 0xaa0000);
      minusBtn.setStrokeStyle(2, 0xff0000);
      minusBtn.setInteractive({ useHandCursor: true });

      const minusText = this.add.text(leftX + 640, btnY, '-', {
        font: 'bold 32px monospace',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);

      minusBtn.on('pointerover', () => {
        minusBtn.setFillStyle(0xff0000);
        minusBtn.setScale(1.1);
      });

      minusBtn.on('pointerout', () => {
        minusBtn.setFillStyle(0xaa0000);
        minusBtn.setScale(1);
      });

      minusBtn.on('pointerdown', () => {
        if (playerData.allocatedStats[stat.key] > 0) {
          playerData.allocatedStats[stat.key]--;
          progressionManager.addStatPoints(1);
          gameManager.savePlayerData(playerData);
          this.scene.restart();
        }
      });
    });

    // Legend/Help text
    const legendY = startY + (stats.length * rowHeight) + 20;
    
    this.add.text(width / 2, legendY, 'BASE: Character starting value  |  POINTS: Allocated stat points (×0.25)  |  ITEMS: Equipment bonuses  |  TOTAL: Final value', {
      font: '14px monospace',
      fill: '#888888',
      align: 'center'
    }).setOrigin(0.5);

    // Continue button (large and prominent)
    const btnY = height - 60;
    const continueBtn = this.add.rectangle(width / 2, btnY, 300, 60, 0xe94560);
    continueBtn.setStrokeStyle(3, 0xff6b6b);
    continueBtn.setInteractive({ useHandCursor: true });

    const continueText = this.add.text(width / 2, btnY, 'START ROUND', {
      font: 'bold 24px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    continueBtn.on('pointerover', () => {
      continueBtn.setFillStyle(0xff6b6b);
      continueBtn.setScale(1.05);
    });

    continueBtn.on('pointerout', () => {
      continueBtn.setFillStyle(0xe94560);
      continueBtn.setScale(1);
    });

    continueBtn.on('pointerdown', () => {
      const currentRound = gameManager.getCurrentRound();
      gameManager.startRound(currentRound);
    });
  }
}
