import Phaser from 'phaser';
import PlayerCharacter from '../entities/PlayerCharacter.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import CombatSystem from '../systems/CombatSystem.js';
import RoundManager from '../systems/RoundManager.js';

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

    // Create HUD
    this.createHUD();

    // Start the round
    this.roundManager.startRound(this.roundNumber);
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

    // Handle movement input
    let velocityX = 0;
    let velocityY = 0;
    const speed = this.player.getAttribute('speed') * 2;

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

    // Update round manager
    this.roundManager.updateRound(time);

    // Update combat
    const enemies = this.roundManager.getEnemies();
    this.combatSystem.checkWeaponCollisions(this.player, enemies);
    this.combatSystem.checkEnemyCollisions(this.player, enemies);

    // Update enemy AI
    enemies.forEach(enemy => {
      enemy.moveTowards(this.player);
    });

    // Update HUD
    this.updateHUD();

    // Check round completion
    if (this.roundManager.checkRoundComplete()) {
      this.roundManager.onRoundComplete();
    }

    // Check round failure
    if (this.player.isDead()) {
      this.roundManager.onRoundFailed();
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
}
