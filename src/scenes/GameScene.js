import Phaser from 'phaser';
import PlayerCharacter from '../entities/PlayerCharacter.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import CombatSystem from '../systems/combat/CombatSystem.js';
import RoundManager from '../systems/RoundManager.js';
import BackgroundManager from '../systems/backgrounds/BackgroundManager.js';
import EnemyMovementSystem from '../systems/EnemyMovementSystem.js';
import TabDetector from '../utils/TabDetector.js';
import WandSprite from '../sprites/weapons/WandSprite.js';
import GreatswordSprite from '../sprites/weapons/GreatswordSprite.js';
import ShurikenSprite from '../sprites/weapons/ShurikenSprite.js';
import BowSprite from '../sprites/weapons/BowSprite.js';
import CrossbowSprite from '../sprites/weapons/CrossbowSprite.js';
import SwordSprite from '../sprites/weapons/SwordSprite.js';
import DaggerSprite from '../sprites/weapons/DaggerSprite.js';
import AxeSprite from '../sprites/weapons/AxeSprite.js';
import SpearSprite from '../sprites/weapons/SpearSprite.js';
import HammerSprite from '../sprites/weapons/HammerSprite.js';
import MaceSprite from '../sprites/weapons/MaceSprite.js';
import FlailSprite from '../sprites/weapons/FlailSprite.js';
import WhipSprite from '../sprites/weapons/WhipSprite.js';
import KatanaSprite from '../sprites/weapons/KatanaSprite.js';
import RapierSprite from '../sprites/weapons/RapierSprite.js';
import ScytheSprite from '../sprites/weapons/ScytheSprite.js';
import LanceSprite from '../sprites/weapons/LanceSprite.js';
import GauntletsSprite from '../sprites/weapons/GauntletsSprite.js';
import StaffSprite from '../sprites/weapons/StaffSprite.js';
import ChakramSprite from '../sprites/weapons/ChakramSprite.js';

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

    // Listen for resize events
    this.scale.on('resize', this.handleResize, this);

    // Check for multiple tabs and warn user
    // DISABLED: False positives due to localStorage persistence
    // if (TabDetector.hasMultipleTabs()) {
    //   console.warn(`⚠️ Multiple tabs detected (${TabDetector.getTabCount()} tabs). This may cause performance issues.`);
    //   TabDetector.showMultipleTabWarning(this);
    // }
    
    // Detect Chrome and warn about potential 30 FPS issue
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    
    if (isChrome && !isSafari) {
      console.warn('⚠️ Chrome detected. If experiencing 30 FPS, see CHROME_GPU_FIX.md');
      console.log('💡 Tip: Safari runs this game at 60 FPS. Consider using Safari for development.');
    }

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
    this.enemyMovementSystem = new EnemyMovementSystem(this);
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
    this.lastFps = 60; // Track to avoid unnecessary setText calls

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
        case 'STAFF':
          weaponGraphic = StaffSprite.create(this);
          distance = StaffSprite.getDistance();
          break;
        case 'GREATSWORD':
          weaponGraphic = GreatswordSprite.create(this);
          distance = GreatswordSprite.getDistance();
          break;
        case 'SWORD':
          weaponGraphic = SwordSprite.create(this);
          distance = SwordSprite.getDistance();
          break;
        case 'KATANA':
          weaponGraphic = KatanaSprite.create(this);
          distance = KatanaSprite.getDistance();
          break;
        case 'RAPIER':
          weaponGraphic = RapierSprite.create(this);
          distance = RapierSprite.getDistance();
          break;
        case 'DAGGER':
          weaponGraphic = DaggerSprite.create(this);
          distance = DaggerSprite.getDistance();
          break;
        case 'SHURIKEN':
          weaponGraphic = ShurikenSprite.create(this);
          distance = ShurikenSprite.getDistance();
          break;
        case 'CHAKRAM':
          weaponGraphic = ChakramSprite.create(this);
          distance = ChakramSprite.getDistance();
          break;
        case 'BOW':
          weaponGraphic = BowSprite.create(this);
          distance = BowSprite.getDistance();
          break;
        case 'CROSSBOW':
          weaponGraphic = CrossbowSprite.create(this);
          distance = CrossbowSprite.getDistance();
          break;
        case 'AXE':
          weaponGraphic = AxeSprite.create(this);
          distance = AxeSprite.getDistance();
          break;
        case 'SPEAR':
          weaponGraphic = SpearSprite.create(this);
          distance = SpearSprite.getDistance();
          break;
        case 'LANCE':
          weaponGraphic = LanceSprite.create(this);
          distance = LanceSprite.getDistance();
          break;
        case 'HAMMER':
          weaponGraphic = HammerSprite.create(this);
          distance = HammerSprite.getDistance();
          break;
        case 'MACE':
          weaponGraphic = MaceSprite.create(this);
          distance = MaceSprite.getDistance();
          break;
        case 'FLAIL':
          weaponGraphic = FlailSprite.create(this);
          distance = FlailSprite.getDistance();
          break;
        case 'WHIP':
          weaponGraphic = WhipSprite.create(this);
          distance = WhipSprite.getDistance();
          break;
        case 'SCYTHE':
          weaponGraphic = ScytheSprite.create(this);
          distance = ScytheSprite.getDistance();
          break;
        case 'GAUNTLETS':
          weaponGraphic = GauntletsSprite.create(this);
          distance = GauntletsSprite.getDistance();
          break;
        default:
          // Fallback for weapons without sprite modules yet
          weaponGraphic = this.add.graphics();
          distance = 40; // Increased default distance
          
          // Get weapon data to check weaponType
          const weaponData = weapon.weaponType || 'melee';
          
          if (weaponData === 'ranged') {
            // Ranged weapon - draw as a line/bow
            weaponGraphic.lineStyle(3, 0x00ffff);
            weaponGraphic.lineBetween(-10, 0, 10, 0);
          } else {
            // Melee weapon - draw as a rectangle/sword
            weaponGraphic.fillStyle(0xcccccc);
            weaponGraphic.fillRect(-3, -15, 6, 30);
          }
      }
      
      // Scale weapon sprite to 1.5x size
      weaponGraphic.setScale(1.5);
      
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
    this.healthBarColor = 0x00ff00; // Track current color to avoid unnecessary setFillStyle calls

    // Health text
    this.healthText = this.add.text(10, 20, '', {
      font: '16px monospace',
      fill: '#ffffff'
    });
    this.lastHealthText = ''; // Track to avoid unnecessary setText calls

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
    this.lastCurrencyText = `Gold: ${playerData.currency || 0}`;

    // Enemy count
    this.enemyCountText = this.add.text(10, 110, '', {
      font: '16px monospace',
      fill: '#ff0000'
    });
    this.lastEnemyCount = -1; // Track to avoid unnecessary setText calls
  }

  update(time, delta) {
    if (!this.player || !this.roundManager.isRoundActive) {
      return;
    }
    
    // Skip update if paused
    if (this.isPaused) {
      return;
    }

    // Monitor FPS (only update if changed)
    const fps = Math.round(this.game.loop.actualFps);
    if (this.lastFps !== fps) {
      this.fpsText.setText(`FPS: ${fps}`);
      this.lastFps = fps;
      
      // Show warning if FPS drops below 30
      if (fps < 30 && !this.fpsWarningShown) {
        this.fpsText.setColor('#ff0000');
        this.fpsWarningShown = true;
      } else if (fps >= 30 && this.fpsWarningShown) {
        this.fpsText.setColor('#ffffff');
        this.fpsWarningShown = false;
      }
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
      this.enemyMovementSystem.updateMovement(enemy, this.player, delta, time);
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
    
    // Change color based on health (only when it changes)
    let newColor;
    if (healthPercent > 0.5) {
      newColor = 0x00ff00;
    } else if (healthPercent > 0.25) {
      newColor = 0xffff00;
    } else {
      newColor = 0xff0000;
    }
    
    // Only update fill style if color changed
    if (this.healthBarColor !== newColor) {
      this.healthBar.setFillStyle(newColor);
      this.healthBarColor = newColor;
    }

    // Only update text if values changed
    const newHealthText = `HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`;
    if (this.lastHealthText !== newHealthText) {
      this.healthText.setText(newHealthText);
      this.lastHealthText = newHealthText;
    }
    
    const newCurrencyText = `Gold: ${playerData.currency || 0}`;
    if (this.lastCurrencyText !== newCurrencyText) {
      this.currencyText.setText(newCurrencyText);
      this.lastCurrencyText = newCurrencyText;
    }
    
    const enemyCount = this.roundManager.getRemainingEnemyCount();
    if (this.lastEnemyCount !== enemyCount) {
      this.enemyCountText.setText(`Enemies: ${enemyCount}`);
      this.lastEnemyCount = enemyCount;
    }
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

  handleResize(gameSize) {
    // Safety check - only resize if scene is fully initialized
    if (!this.cameras || !this.cameras.main) {
      return;
    }
    
    const width = gameSize.width;
    const height = gameSize.height;

    // Update camera bounds
    this.cameras.main.setBounds(0, 0, width, height);
    
    // Reposition HUD elements
    if (this.fpsText) {
      this.fpsText.setPosition(width - 80, height - 30);
    }
    
    // Reposition weapon indicators (top right)
    if (this.weaponIndicators) {
      this.weaponIndicators.forEach((indicator, index) => {
        indicator.setPosition(width - 200, 45 + (index * 20));
      });
    }
    
    // Reposition item indicators
    if (this.itemIndicators) {
      const equippedWeapons = this.player ? this.player.getEquippedWeapons() : [];
      const itemsStartY = 45 + (equippedWeapons.length * 20) + 20;
      this.itemIndicators.forEach((indicator, index) => {
        indicator.setPosition(width - 200, itemsStartY + 25 + (index * 20));
      });
    }
    
    // Update pause overlay if active
    if (this.isPaused && this.pauseOverlay) {
      this.pauseOverlay.setPosition(width / 2, height / 2);
      this.pauseOverlay.setSize(width, height);
      if (this.pauseText) {
        this.pauseText.setPosition(width / 2, height / 2);
      }
    }
    
    // Redraw background
    if (this.children && this.children.list && this.roundNumber) {
      const backgroundType = BackgroundManager.determineBackgroundType(this.roundNumber);
      // Remove old background graphics
      this.children.list.forEach(child => {
        if (child.type === 'Graphics' && child.getData && child.getData('isBackground')) {
          child.destroy();
        }
      });
      // Render new background
      BackgroundManager.renderBackground(this, width, height, backgroundType);
    }
  }

  shutdown() {
    // Remove resize listener
    this.scale.off('resize', this.handleResize, this);
    
    // Stop music when scene shuts down
    if (this.music) {
      console.log('Stopping game music');
      this.music.stop();
    }
    
    // Clean up weapon sprites
    if (this.weaponSprites) {
      this.weaponSprites.forEach(weaponSprite => {
        if (weaponSprite.graphic && weaponSprite.graphic.destroy) {
          weaponSprite.graphic.destroy();
        }
      });
      this.weaponSprites = [];
    }
    
    // Clean up projectiles
    if (this.combatSystem && this.combatSystem.projectileManager) {
      this.combatSystem.projectileManager.clear();
    }
    
    // Clean up enemy movement system
    if (this.enemyMovementSystem) {
      this.enemyMovementSystem.clear();
    }
    
    // Remove all tweens to prevent memory leaks
    if (this.tweens) {
      this.tweens.killAll();
    }
    
    // Remove all delayed calls
    if (this.time) {
      this.time.removeAllEvents();
    }
  }
}
