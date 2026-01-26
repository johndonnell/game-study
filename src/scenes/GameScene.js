import Phaser from 'phaser';
import PlayerCharacter from '../entities/PlayerCharacter.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import CombatSystem from '../systems/combat/CombatSystem.js';
import RoundManager from '../systems/RoundManager.js';
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

    // Determine background type based on round number
    const backgroundType = this.determineBackgroundType(this.roundNumber);
    
    // Create battle arena background
    this.createArenaBackground(width, height, backgroundType);

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

  createArenaBackground(width, height, backgroundType = 'arena') {
    const background = this.add.graphics();
    
    switch (backgroundType) {
      case 'cave':
        this.createCaveBackground(background, width, height);
        break;
      case 'hell':
        this.createHellBackground(background, width, height);
        break;
      case 'castle':
        this.createCastleBackground(background, width, height);
        break;
      default:
        this.createDefaultArenaBackground(background, width, height);
    }
    
    // Send background to back
    background.setDepth(-1);
  }

  /**
   * Determine background type based on round number
   * @param {number} roundNumber - Current round number
   * @returns {string} Background type ('arena', 'cave', 'hell', 'castle')
   */
  determineBackgroundType(roundNumber) {
    if (roundNumber <= 5) {
      return 'arena'; // Early rounds: basic arena
    } else if (roundNumber <= 10) {
      return 'cave'; // Rounds 6-10: trolls appear, cave environment
    } else if (roundNumber <= 15) {
      return 'hell'; // Rounds 11-15: demons appear, hellish environment
    } else {
      return 'castle'; // Rounds 16-20: dragons appear, castle environment
    }
  }

  createDefaultArenaBackground(background, width, height) {
    // Base arena floor (sandy/stone color)
    background.fillStyle(0xd4c4a8, 1); // Light tan/sand color
    background.fillRect(0, 0, width, height);

    // Arena border (darker stone)
    background.lineStyle(20, 0x8b7355, 1);
    background.strokeRect(10, 10, width - 20, height - 20);

    // Inner border detail
    background.lineStyle(4, 0xa0826d, 1);
    background.strokeRect(25, 25, width - 50, height - 50);

    // Create stone tile pattern
    background.lineStyle(1, 0xc0b090, 0.3);
    const tileSize = 50;
    
    // Vertical lines
    for (let x = tileSize; x < width; x += tileSize) {
      background.lineBetween(x, 0, x, height);
    }
    
    // Horizontal lines
    for (let y = tileSize; y < height; y += tileSize) {
      background.lineBetween(0, y, width, y);
    }

    // Add some battle wear marks (darker spots)
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(10, 30);
      
      background.fillStyle(0xb0a080, 0.4);
      background.fillCircle(x, y, size);
    }

    // Corner pillars/markers
    const pillarColor = 0x6b5d4f;
    const pillarSize = 15;
    
    // Top-left
    background.fillStyle(pillarColor, 1);
    background.fillCircle(40, 40, pillarSize);
    
    // Top-right
    background.fillCircle(width - 40, 40, pillarSize);
    
    // Bottom-left
    background.fillCircle(40, height - 40, pillarSize);
    
    // Bottom-right
    background.fillCircle(width - 40, height - 40, pillarSize);

    // Center arena circle (combat zone marker)
    background.lineStyle(3, 0x9b8b6f, 0.5);
    const centerX = width / 2;
    const centerY = height / 2;
    const circleRadius = Math.min(width, height) * 0.35;
    background.strokeCircle(centerX, centerY, circleRadius);
    
    // Inner circle
    background.lineStyle(2, 0x9b8b6f, 0.3);
    background.strokeCircle(centerX, centerY, circleRadius * 0.7);
  }

  createCaveBackground(background, width, height) {
    // Dark cave floor (dark gray/brown)
    background.fillStyle(0x3a3a3a, 1);
    background.fillRect(0, 0, width, height);

    // Cave walls (darker, rough edges)
    background.fillStyle(0x2a2a2a, 1);
    background.fillRect(0, 0, width, 40); // Top wall
    background.fillRect(0, height - 40, width, 40); // Bottom wall
    background.fillRect(0, 0, 40, height); // Left wall
    background.fillRect(width - 40, 0, 40, height); // Right wall

    // Rocky texture (random dark spots)
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(15, 40);
      
      background.fillStyle(0x2d2d2d, 0.6);
      background.fillCircle(x, y, size);
    }

    // Stalactites (hanging from ceiling)
    background.fillStyle(0x4a4a4a, 1);
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = 40;
      const stalHeight = Phaser.Math.Between(20, 50);
      
      background.beginPath();
      background.moveTo(x, y);
      background.lineTo(x - 10, y);
      background.lineTo(x - 5, y + stalHeight);
      background.closePath();
      background.fillPath();
    }

    // Stalagmites (rising from floor)
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = height - 40;
      const stalagHeight = Phaser.Math.Between(20, 50);
      
      background.beginPath();
      background.moveTo(x, y);
      background.lineTo(x - 10, y);
      background.lineTo(x - 5, y - stalagHeight);
      background.closePath();
      background.fillPath();
    }

    // Glowing crystals (blue/purple glow)
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      
      background.fillStyle(0x6a5acd, 0.4);
      background.fillCircle(x, y, 20);
      background.fillStyle(0x9370db, 0.8);
      background.fillCircle(x, y, 10);
      background.fillStyle(0xba55d3, 1);
      background.fillCircle(x, y, 5);
    }
  }

  createHellBackground(background, width, height) {
    // Hellish red/orange gradient floor
    background.fillStyle(0x8b0000, 1); // Dark red
    background.fillRect(0, 0, width, height);

    // Lava cracks pattern
    background.lineStyle(3, 0xff4500, 1);
    for (let i = 0; i < 20; i++) {
      const startX = Phaser.Math.Between(0, width);
      const startY = Phaser.Math.Between(0, height);
      const endX = startX + Phaser.Math.Between(-100, 100);
      const endY = startY + Phaser.Math.Between(-100, 100);
      
      background.lineBetween(startX, startY, endX, endY);
    }

    // Glowing lava pools
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      const size = Phaser.Math.Between(30, 60);
      
      // Outer glow
      background.fillStyle(0xff4500, 0.3);
      background.fillCircle(x, y, size);
      // Middle glow
      background.fillStyle(0xff6347, 0.6);
      background.fillCircle(x, y, size * 0.7);
      // Bright center
      background.fillStyle(0xffa500, 1);
      background.fillCircle(x, y, size * 0.4);
    }

    // Burning embers/particles effect (static)
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const size = Phaser.Math.Between(2, 5);
      
      background.fillStyle(0xffd700, 0.8);
      background.fillCircle(x, y, size);
    }

    // Hellish border (dark red/black)
    background.lineStyle(15, 0x4a0000, 1);
    background.strokeRect(10, 10, width - 20, height - 20);

    // Inner border with fire glow
    background.lineStyle(5, 0xff4500, 0.8);
    background.strokeRect(25, 25, width - 50, height - 50);
  }

  createCastleBackground(background, width, height) {
    // Castle stone floor (gray stone)
    background.fillStyle(0x696969, 1);
    background.fillRect(0, 0, width, height);

    // Stone brick pattern
    background.lineStyle(2, 0x505050, 1);
    const brickWidth = 80;
    const brickHeight = 40;
    
    for (let y = 0; y < height; y += brickHeight) {
      for (let x = 0; x < width; x += brickWidth) {
        // Offset every other row
        const offsetX = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
        background.strokeRect(x + offsetX, y, brickWidth, brickHeight);
      }
    }

    // Castle walls (darker stone)
    background.fillStyle(0x4a4a4a, 1);
    background.fillRect(0, 0, width, 50); // Top wall
    background.fillRect(0, height - 50, width, 50); // Bottom wall
    background.fillRect(0, 0, 50, height); // Left wall
    background.fillRect(width - 50, 0, 50, height); // Right wall

    // Battlements (crenellations on top wall)
    background.fillStyle(0x5a5a5a, 1);
    for (let x = 60; x < width - 60; x += 60) {
      background.fillRect(x, 0, 30, 30);
    }

    // Torches on walls (glowing)
    const torchPositions = [
      { x: 100, y: 50 },
      { x: width - 100, y: 50 },
      { x: 100, y: height - 50 },
      { x: width - 100, y: height - 50 }
    ];

    torchPositions.forEach(pos => {
      // Torch holder (metal)
      background.fillStyle(0x2f4f4f, 1);
      background.fillRect(pos.x - 5, pos.y - 10, 10, 20);
      
      // Flame glow
      background.fillStyle(0xffa500, 0.4);
      background.fillCircle(pos.x, pos.y - 15, 20);
      background.fillStyle(0xff8c00, 0.7);
      background.fillCircle(pos.x, pos.y - 15, 12);
      background.fillStyle(0xffd700, 1);
      background.fillCircle(pos.x, pos.y - 15, 6);
    });

    // Banners/flags on walls
    background.fillStyle(0x8b0000, 1);
    background.fillRect(width / 2 - 30, 50, 60, 80);
    
    // Banner emblem (simple cross)
    background.fillStyle(0xffd700, 1);
    background.fillRect(width / 2 - 15, 70, 30, 10);
    background.fillRect(width / 2 - 5, 60, 10, 30);

    // Castle floor cracks (wear and tear)
    background.lineStyle(2, 0x505050, 0.5);
    for (let i = 0; i < 15; i++) {
      const startX = Phaser.Math.Between(100, width - 100);
      const startY = Phaser.Math.Between(100, height - 100);
      const endX = startX + Phaser.Math.Between(-50, 50);
      const endY = startY + Phaser.Math.Between(-50, 50);
      
      background.lineBetween(startX, startY, endX, endY);
    }
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
