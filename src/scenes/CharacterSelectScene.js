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

    // Start character select music with better error handling
    try {
      // Check if audio is loaded
      const audioKey = 'character-select-music';
      
      if (this.cache.audio.exists(audioKey)) {
        console.log('Audio file found, attempting to play...');
        
        this.music = this.sound.add(audioKey, {
          loop: true,
          volume: 0.5
        });
        
        // Add event listeners for debugging
        this.music.once('play', () => {
          console.log('Music started playing');
        });
        
        this.music.once('looped', () => {
          console.log('Music looped');
        });
        
        this.music.play();
        console.log('Play command sent');
      } else {
        console.warn('Audio file not found in cache:', audioKey);
        console.log('Available audio keys:', this.cache.audio.getKeys());
      }
    } catch (error) {
      console.error('Error playing music:', error);
    }

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
      const box = this.add.rectangle(x, y, 200, 350, 0x333333, 0.8);
      box.setStrokeStyle(2, 0xffffff);
      box.setInteractive({ useHandCursor: true });

      // Character name
      this.add.text(x, y - 120, charData.name, {
        font: '24px monospace',
        fill: '#ffffff'
      }).setOrigin(0.5);

      // Stats display - dynamically show all stats from baseStats
      const statsY = y - 70;
      const stats = [`HP: ${charData.maxHealth}`];
      
      // Add all base stats dynamically
      Object.entries(charData.baseStats).forEach(([statName, statValue]) => {
        // Convert stat name to uppercase abbreviation (first 3 letters)
        const abbrev = statName.substring(0, 3).toUpperCase();
        stats.push(`${abbrev}: ${statValue}`);
      });

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
    // Stop music when leaving scene
    if (this.music) {
      this.music.stop();
    }
    
    // Get GameManager from registry
    const gameManager = this.registry.get('gameManager');
    const progressionManager = this.registry.get('progressionManager');
    
    // Save selected character to player data
    const playerData = gameManager.getPlayerData();
    playerData.characterType = characterType;
    playerData.selectedCharacter = CHARACTER_TYPES[characterType];
    
    // Give starting currency (600 gold - enough to buy 3 of any weapon)
    progressionManager.addCurrency(600);
    playerData.currency = progressionManager.getCurrency();
    
    gameManager.savePlayerData(playerData);

    // Go to shop first instead of starting round 1
    gameManager.showShop();
  }
}
