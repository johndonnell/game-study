import Phaser from 'phaser';
import { CHARACTER_TYPES } from '../config/characterTypes.js';

/**
 * CharacterSelectScene
 * Character selection interface
 */
export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    this.add.text(width / 2, 50, 'Select Your Character', {
      font: '32px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Character options
    const characters = [
      { type: 'WARRIOR', x: width / 4 },
      { type: 'ROGUE', x: width / 2 },
      { type: 'MAGE', x: (width * 3) / 4 }
    ];

    characters.forEach(({ type, x }) => {
      const charData = CHARACTER_TYPES[type];
      const y = height / 2;

      // Character box
      const box = this.add.rectangle(x, y, 200, 300, 0x333333, 0.8);
      box.setStrokeStyle(2, 0xffffff);
      box.setInteractive({ useHandCursor: true });

      // Character name
      this.add.text(x, y - 120, charData.name, {
        font: '24px monospace',
        fill: '#ffffff'
      }).setOrigin(0.5);

      // Stats display
      const statsY = y - 60;
      const stats = [
        `HP: ${charData.maxHealth}`,
        `STR: ${charData.baseStats.strength}`,
        `SPD: ${charData.baseStats.speed}`,
        `DEF: ${charData.baseStats.defense}`,
        `VIT: ${charData.baseStats.vitality}`
      ];

      stats.forEach((stat, index) => {
        this.add.text(x, statsY + (index * 25), stat, {
          font: '16px monospace',
          fill: '#cccccc'
        }).setOrigin(0.5);
      });

      // Hover effect
      box.on('pointerover', () => {
        box.setStrokeStyle(3, 0x00ff00);
      });

      box.on('pointerout', () => {
        box.setStrokeStyle(2, 0xffffff);
      });

      // Selection handler
      box.on('pointerdown', () => {
        this.selectCharacter(type);
      });
    });
  }

  selectCharacter(characterType) {
    // Get GameManager from registry
    const gameManager = this.registry.get('gameManager');
    const progressionManager = this.registry.get('progressionManager');
    
    // Save selected character to player data
    const playerData = gameManager.getPlayerData();
    playerData.characterType = characterType;
    playerData.selectedCharacter = CHARACTER_TYPES[characterType];
    
    // Give starting currency (enough for cheapest weapon - 80 gold)
    progressionManager.addCurrency(100);
    playerData.currency = progressionManager.getCurrency();
    
    gameManager.savePlayerData(playerData);

    // Go to shop first instead of starting round 1
    gameManager.showShop();
  }
}
