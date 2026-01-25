import Phaser from 'phaser';
import { CHARACTER_TYPES } from '../config/characterTypes.js';
import BarbarianSprite from '../sprites/characters/BarbarianSprite.js';
import RogueSprite from '../sprites/characters/RogueSprite.js';
import WizardSprite from '../sprites/characters/WizardSprite.js';

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

    // Start character select music
    try {
      const audioKey = 'character-select-music';
      
      if (this.cache.audio.exists(audioKey)) {
        this.music = this.sound.add(audioKey, {
          loop: true,
          volume: 0.5
        });
        this.music.play();
      }
    } catch (error) {
      console.error('Error playing music:', error);
    }

    // Create gradient background
    const background = this.add.graphics();
    background.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x16213e, 0x16213e, 1);
    background.fillRect(0, 0, width, height);

    // Title with glow effect
    const titleShadow = this.add.text(width / 2 + 3, 53, 'SELECT YOUR HERO', {
      font: 'bold 48px monospace',
      fill: '#000000'
    }).setOrigin(0.5);
    titleShadow.setAlpha(0.5);

    const title = this.add.text(width / 2, 50, 'SELECT YOUR HERO', {
      font: 'bold 48px monospace',
      fill: '#ffd700',
      stroke: '#ff8c00',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Pulsing title
    this.tweens.add({
      targets: title,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Character options
    const characters = [
      { type: 'WARRIOR', x: width / 4, color: 0xff4444 },
      { type: 'ROGUE', x: width / 2, color: 0x44ff44 },
      { type: 'MAGE', x: (width * 3) / 4, color: 0x4444ff }
    ];

    this.characterSprites = [];

    characters.forEach(({ type, x, color }) => {
      this.createCharacterDisplay(type, x, height / 2 + 20, color);
    });

    // Instructions
    const instructions = this.add.text(width / 2, height - 40, 'Click on a hero to begin your journey!', {
      font: 'bold 18px monospace',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: instructions,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createCharacterDisplay(type, x, y, color) {
    const charData = CHARACTER_TYPES[type];
    const container = this.add.container(x, y);

    // Glowing background (larger)
    const glowCircle = this.add.circle(0, 0, 140, color, 0.2);
    container.add(glowCircle);

    // Character box (larger dimensions)
    const boxGraphics = this.add.graphics();
    boxGraphics.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x2a2a4e, 0x2a2a4e, 1);
    boxGraphics.fillRoundedRect(-130, -180, 260, 380, 10); // Increased from 220x320 to 260x380
    boxGraphics.lineStyle(3, color, 1);
    boxGraphics.strokeRoundedRect(-130, -180, 260, 380, 10);
    container.add(boxGraphics);

    // Create large sprite (2.5x scale)
    const spriteContainer = this.add.container(0, -50); // Moved up slightly
    spriteContainer.setScale(2.5);
    
    let spriteParts;
    if (type === 'WARRIOR') {
      spriteParts = BarbarianSprite.create(this, spriteContainer);
    } else if (type === 'ROGUE') {
      spriteParts = RogueSprite.create(this, spriteContainer);
    } else if (type === 'MAGE') {
      spriteParts = WizardSprite.create(this, spriteContainer);
    }

    container.add(spriteContainer);
    this.characterSprites.push({ container: spriteContainer, parts: spriteParts, type });

    // Idle animation
    this.time.addEvent({
      delay: 50,
      callback: () => {
        if (type === 'WARRIOR') {
          BarbarianSprite.updateAnimation(spriteParts, this.time.now, false);
        } else if (type === 'ROGUE') {
          RogueSprite.updateAnimation(spriteParts, this.time.now, false);
        } else if (type === 'MAGE') {
          WizardSprite.updateAnimation(spriteParts, this.time.now, false);
        }
      },
      loop: true
    });

    // Character name (moved up)
    const nameText = this.add.text(0, -165, charData.name.toUpperCase(), {
      font: 'bold 24px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    container.add(nameText);

    // Stats with icons (moved down and better spacing)
    const stats = [
      { label: '❤️ HP', value: charData.maxHealth, color: '#ff4444' },
      { label: '⚔️ STR', value: charData.baseStats.strength, color: '#ff8844' },
      { label: '🏃 SPD', value: charData.baseStats.speed, color: '#44ff44' },
      { label: '🛡️ DEF', value: charData.baseStats.defense, color: '#4488ff' },
      { label: '🎯 DEX', value: charData.baseStats.dexterity, color: '#ffff44' }
    ];

    stats.forEach((stat, index) => {
      const statText = this.add.text(-100, 100 + (index * 24), `${stat.label}: ${stat.value}`, {
        font: 'bold 14px monospace',
        fill: stat.color,
        stroke: '#000000',
        strokeThickness: 2
      });
      container.add(statText);
    });

    // Interactive area (larger)
    const hitArea = this.add.rectangle(0, 0, 280, 400, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // Hover - jump animation
    hitArea.on('pointerover', () => {
      boxGraphics.clear();
      boxGraphics.fillGradientStyle(0x2a2a4e, 0x2a2a4e, 0x3a3a5e, 0x3a3a5e, 1);
      boxGraphics.fillRoundedRect(-130, -180, 260, 380, 10);
      boxGraphics.lineStyle(4, color, 1);
      boxGraphics.strokeRoundedRect(-130, -180, 260, 380, 10);

      glowCircle.setAlpha(0.4);
      this.tweens.add({
        targets: glowCircle,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 300
      });

      // Jump animation
      this.tweens.add({
        targets: spriteContainer,
        y: -70, // Adjusted for new position
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: nameText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200
      });
    });

    hitArea.on('pointerout', () => {
      boxGraphics.clear();
      boxGraphics.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x2a2a4e, 0x2a2a4e, 1);
      boxGraphics.fillRoundedRect(-130, -180, 260, 380, 10);
      boxGraphics.lineStyle(3, color, 1);
      boxGraphics.strokeRoundedRect(-130, -180, 260, 380, 10);

      glowCircle.setAlpha(0.2);
      this.tweens.add({
        targets: glowCircle,
        scaleX: 1,
        scaleY: 1,
        duration: 300
      });

      this.tweens.killTweensOf(spriteContainer);
      this.tweens.add({
        targets: spriteContainer,
        y: -50, // Adjusted for new position
        duration: 200
      });

      this.tweens.add({
        targets: nameText,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    hitArea.on('pointerdown', () => {
      this.cameras.main.flash(300, 255, 255, 255);
      this.tweens.add({
        targets: container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        yoyo: true,
        onComplete: () => {
          this.selectCharacter(type);
        }
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
