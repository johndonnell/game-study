import Phaser from 'phaser';
import PlayerCharacter from '../entities/PlayerCharacter.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import CombatSystem from '../systems/combat/CombatSystem.js';
import RoundManager from '../systems/RoundManager.js';
import BackgroundManager from '../systems/backgrounds/BackgroundManager.js';
import WandSprite from '../sprites/weapons/WandSprite.js';
import GreatswordSprite from '../sprites/weapons/GreatswordSprite.js';
import ShurikenSprite from '../sprites/weapons/ShurikenSprite.js';
import BowSprite from '../sprites/weapons/BowSprite.js';
import CrossbowSprite from '../sprites/weapons/CrossbowSprite.js';

/**
 * GameScene
 * Main gameplay scene with combat and movement
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.roundNumber = data.roundNumber || 1;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Determine and render background based on round number
    const backgroundType = BackgroundManager.determineBackgroundType(this.roundNumber);
    BackgroundManager.renderBackground(this, width, height, backgroundType);

    // Start game music with 27-second loop
    try {
      const audioKey = 'game-music';
      
      if (this.cache.audio.exists(audioKey)) {
        console.log('Game music found, attempting to play...');
        
        this.music = this.sound.add(audioKey, {
          loop: true,
          volume: 0.4
        });
        
        // Set up 27-second loop marker
        this.music.once('play', () => {
          console.log('Game music started playing');
          // Add a marker for the 27-second loop
          this.music.addMarker({
            name: 'loop',
            start: 0,
            duration: 27,
            config: {
              loop: true
            }
          });
          // Stop the current playback and play the marker
          this.music.stop();
          this.music.play('loop');
        });
        
        this.music.play();
      } else {
        console.warn('Game music not found in cache:', audioKey);
      }
    } catch (error) {
      console.error('Error playing game music:', error);
    }

    // Get game manager and player data
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    // Create player character at center
    this.player = new PlayerCharacter(
      this,
      width / 2,
      height / 2,
      playerData.characterType
    );

    // Restore player state from saved data
    if (playerData.equippedWeapons) {
      playerData.equippedWeapons.forEach(weapon => {
        this.player.equipWeapon(weapon);
      });
    }

    if (playerData.equippedItems) {
      playerData.equippedItems.forEach(item => {
        this.player.equipItem(item);
      });
    }

    // Apply stat point allocations
    if (playerData.allocatedStats) {
      Object.entries(playerData.allocatedStats).forEach(([attr, value]) => {
        this.player.increaseBaseAttribute(attr, value);
      });
    }
    
    // Set health to max after all stat/item modifications
    this.player.health = this.player.maxHealth;

    // Initialize systems
    this.enemySpawner = new EnemySpawner(this);
    this.combatSystem = new CombatSystem(this);
    this.roundManager = new RoundManager(this, gameManager);

    // Set up input handlers
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Pause functionality
    this.isPaused = false;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on('down', () => {
      this.togglePause();
    });

    // Create HUD
    this.createHUD();

    // Create weapon and item indicators
    this.createEquipmentIndicators();

    // Add FPS monitor
    this.fpsText = this.add.text(width - 80, height - 30, 'FPS: 60', {
      font: '14px monospace',
      fill: '#ffffff'
    });
    this.fpsWarningShown = false;

    // Start the round
    this.roundManager.startRound(this.roundNumber);
  }

  createEquipmentIndicators() {
    const width = this.cameras.main.width;

    // Weapon indicators (top right)
    this.add.text(width - 200, 20, 'Weapons:', {
      font: '14px monospace',
      fill: '#ffffff'
    });

    this.weaponIndicators = [];
    const equippedWeapons = this.player.getEquippedWeapons();
    
    equippedWeapons.forEach((weapon, index) => {
      const y = 45 + (index * 20);
      const text = this.add.text(width - 200, y, 
        `${weapon.type} (${weapon.range}r)`,
        {
          font: '12px monospace',
          fill: '#00ff00'
        }
      );
      this.weaponIndicators.push(text);
    });

    // Item indicators (below weapons)
    const itemsStartY = 45 + (equippedWeapons.length * 20) + 20;
    this.add.text(width - 200, itemsStartY, 'Items:', {
      font: '14px monospace',
      fill: '#ffffff'
    });

    this.itemIndicators = [];
    const equippedItems = this.player.getEquippedItems();
    
    equippedItems.forEach((item, index) => {
      const y = itemsStartY + 25 + (index * 20);
      const text = this.add.text(width - 200, y, 
        item.type,
        {
          font: '12px monospace',
          fill: '#ffff00'
        }
      );
      this.itemIndicators.push(text);
    });

    // Visual weapon sprites around player
    this.weaponSprites = [];
    equippedWeapons.forEach((weapon, index) => {
      // Create a visual representation for each weapon using sprite modules
      const angle = (index / equippedWeapons.length) * Math.PI * 2;
      
      // Determine which sprite to use and get its distance
      let weaponGraphic;
      let distance;
      
      switch (weapon.type) {
        case 'WAND':
          weaponGraphic = WandSprite.create(this);
          distance = WandSprite.getDistance();
          break;
        case 'GREATSWORD':
          weaponGraphic = GreatswordSprite.create(this);
          distance = GreatswordSprite.getDistance();
          break;
        case 'SHURIKEN':
          weaponGraphic = ShurikenSprite.create(this);
          distance = ShurikenSprite.getDistance();
          break;
        case 'BOW':
          weaponGraphic = BowSprite.create(this);
          distance = BowSprite.getDistance();
          break;
        case 'CROSSBOW':
          weaponGraphic = CrossbowSprite.create(this);
          distance = CrossbowSprite.getDistance();
          break;
        default:
          // Fallback for weapons without sprite modules yet
          weaponGraphic = this.add.graphics();
          distance = 40; // Increased default distance
          
          if (weapon.range > 100) {
            // Ranged weapon - draw as a line/bow
            weaponGraphic.lineStyle(3, 0x00ffff);
            weaponGraphic.lineBetween(-10, 0, 10, 0);
          } else {
            // Melee weapon - draw as a rectangle/sword
            weaponGraphic.fillStyle(0xcccccc);
            weaponGraphic.fillRect(-3, -15, 6, 30);
          }
      }
      
      weaponGraphic.x = this.player.x + Math.cos(angle) * distance;
      weaponGraphic.y = this.player.y + Math.sin(angle) * distance;
      weaponGraphic.rotation = angle;
      
      this.weaponSprites.push({ graphic: weaponGraphic, angle, distance });
    });
  }

  createHUD() {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    // Health bar background
    this.healthBarBg = this.add.rectangle(100, 20, 200, 20, 0x333333);
    this.healthBarBg.setOrigin(0, 0);

    // Health bar fill
    this.healthBar = this.add.rectangle(100, 20, 200, 20, 0x00ff00);
    this.healthBar.setOrigin(0, 0);

    // Health text
    this.healthText = this.add.text(10, 20, '', {
      font: '16px monospace',
      fill: '#ffffff'
    });

    // Round number
    this.roundText = this.add.text(10, 50, `Round: ${this.roundNumber}`, {
      font: '16px monospace',
      fill: '#ffffff'
    });

    // Currency
    this.currencyText = this.add.text(10, 80, `Gold: ${playerData.currency || 0}`, {
      font: '16px monospace',
      fill: '#ffff00'
    });

    // Enemy count
    this.enemyCountText = this.add.text(10, 110, '', {
      font: '16px monospace',
      fill: '#ff0000'
    });
  }

  update(time, delta) {
    if (!this.player || !this.roundManager.isRoundActive) {
      return;
    }
    
    // Skip update if paused
    if (this.isPaused) {
      return;
    }

    // Monitor FPS
    const fps = Math.round(this.game.loop.actualFps);
    this.fpsText.setText(`FPS: ${fps}`);
    
    // Show warning if FPS drops below 30
    if (fps < 30 && !this.fpsWarningShown) {
      this.fpsText.setColor('#ff0000');
      this.fpsWarningShown = true;
    } else if (fps >= 30 && this.fpsWarningShown) {
      this.fpsText.setColor('#ffffff');
      this.fpsWarningShown = false;
    }

    // Handle movement input
    let velocityX = 0;
    let velocityY = 0;
    const speed = this.player.getAttribute('speed') * 0.5;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = speed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = speed;
    }

    // Move player
    this.player.move(velocityX, velocityY);
    
    // Update player animation
    const isMoving = velocityX !== 0 || velocityY !== 0;
    this.player.updateAnimation(delta, isMoving);
    
    // Update player invincibility
    this.player.updateInvincibility(time);

    // Update round manager
    this.roundManager.updateRound(time);

    // Update combat - pass weaponSprites for projectile spawn positions
    const enemies = this.roundManager.getEnemies();
    this.combatSystem.checkWeaponCollisions(this.player, enemies, this.weaponSprites);
    this.combatSystem.updateProjectiles(delta, enemies, time);
    this.combatSystem.updateEnemyProjectiles(delta, this.player, time);
    this.combatSystem.checkEnemyRangedAttacks(enemies, this.player, time);
    this.combatSystem.checkEnemyCollisions(this.player, enemies, time);

    // Update enemy AI
    enemies.forEach(enemy => {
      enemy.moveTowards(this.player);
      enemy.updateAnimation(delta);
    });

    // Update HUD
    this.updateHUD();
    
    // Update weapon sprites to follow player and rotate
    if (this.weaponSprites) {
      this.weaponSprites.forEach((weaponSprite) => {
        // Rotate weapons around player
        weaponSprite.angle += 0.02;
        const x = this.player.x + Math.cos(weaponSprite.angle) * weaponSprite.distance;
        const y = this.player.y + Math.sin(weaponSprite.angle) * weaponSprite.distance;
        weaponSprite.graphic.x = x;
        weaponSprite.graphic.y = y;
        weaponSprite.graphic.rotation = weaponSprite.angle;
      });
    }

    // Check round failure first (player death has priority)
    if (this.player.isDead()) {
      this.roundManager.onRoundFailed();
      return;
    }

    // Check round completion
    if (this.roundManager.checkRoundComplete()) {
      this.roundManager.onRoundComplete();
    }
  }

  updateHUD() {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    // Update health bar
    const healthPercent = this.player.health / this.player.maxHealth;
    this.healthBar.width = 200 * healthPercent;
    
    // Change color based on health
    if (healthPercent > 0.5) {
      this.healthBar.setFillStyle(0x00ff00);
    } else if (healthPercent > 0.25) {
      this.healthBar.setFillStyle(0xffff00);
    } else {
      this.healthBar.setFillStyle(0xff0000);
    }

    this.healthText.setText(`HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`);
    this.currencyText.setText(`Gold: ${playerData.currency || 0}`);
    this.enemyCountText.setText(`Enemies: ${this.roundManager.getRemainingEnemyCount()}`);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Create pause overlay
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      
      this.pauseOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
      this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED\n\nPress SPACE to resume', {
        font: '32px monospace',
        fill: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);
    } else {
      // Remove pause overlay
      if (this.pauseOverlay) {
        this.pauseOverlay.destroy();
        this.pauseOverlay = null;
      }
      if (this.pauseText) {
        this.pauseText.destroy();
        this.pauseText = null;
      }
    }
  }

  shutdown() {
    // Stop music when scene shuts down
    if (this.music) {
      console.log('Stopping game music');
      this.music.stop();
    }
  }
}
