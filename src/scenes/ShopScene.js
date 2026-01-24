import Phaser from 'phaser';
import ShopSystem from '../systems/ShopSystem.js';
import Weapon from '../entities/Weapon.js';
import Item from '../entities/Item.js';

/**
 * ShopScene
 * Between-round shop for purchasing weapons and items
 */
export default class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get game manager and player data
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const progressionManager = this.registry.get('progressionManager');

    // Initialize shop system
    this.shopSystem = new ShopSystem(progressionManager);

    // Title
    this.add.text(width / 2, 30, 'Shop', {
      font: '32px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Currency display
    this.currencyText = this.add.text(width / 2, 70, `Gold: ${playerData.currency || 0}`, {
      font: '20px monospace',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Weapons section
    this.add.text(100, 120, 'Weapons', {
      font: '24px monospace',
      fill: '#ffffff'
    });

    this.displayWeapons(100, 160);

    // Items section
    this.add.text(width / 2 + 50, 120, 'Items', {
      font: '24px monospace',
      fill: '#ffffff'
    });

    this.displayItems(width / 2 + 50, 160);

    // Continue button - changes based on current round
    const currentRound = gameManager.getCurrentRound();
    const continueBtn = this.add.rectangle(width / 2, height - 50, 200, 40, 0x00ff00);
    continueBtn.setInteractive({ useHandCursor: true });

    // If round is 1 and we haven't started yet, this is the initial shop
    const buttonText = currentRound === 1 ? 'Start Round 1' : 'Continue';
    const continueText = this.add.text(width / 2, height - 50, buttonText, {
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
      // If this is the initial shop (round 1), go directly to game
      // Otherwise, go to stats allocation first
      if (currentRound === 1) {
        gameManager.startRound(1);
      } else {
        gameManager.showStatsAllocation();
      }
    });
  }

  displayWeapons(startX, startY) {
    const weapons = this.shopSystem.displayAvailableWeapons();
    const itemsPerColumn = 10;
    const columnWidth = 250;

    weapons.forEach((weapon, index) => {
      const column = Math.floor(index / itemsPerColumn);
      const row = index % itemsPerColumn;
      const x = startX + (column * columnWidth);
      const y = startY + (row * 30);

      const canAfford = this.shopSystem.canAffordWeapon(weapon.type);
      const color = canAfford ? '#ffffff' : '#666666';

      const text = this.add.text(x, y, 
        `${weapon.type}: ${weapon.cost}g (${weapon.baseDamage}dmg)`,
        {
          font: '14px monospace',
          fill: color
        }
      );

      if (canAfford) {
        text.setInteractive({ useHandCursor: true });
        
        text.on('pointerover', () => {
          text.setColor('#00ff00');
        });

        text.on('pointerout', () => {
          text.setColor('#ffffff');
        });

        text.on('pointerdown', () => {
          this.purchaseWeapon(weapon.type);
        });
      }
    });
  }

  displayItems(startX, startY) {
    const items = this.shopSystem.displayAvailableItems();
    const itemsPerColumn = 10;

    items.forEach((item, index) => {
      const row = index % itemsPerColumn;
      const y = startY + (row * 30);

      const canAfford = this.shopSystem.canAffordItem(item.type);
      const color = canAfford ? '#ffffff' : '#666666';

      const text = this.add.text(startX, y, 
        `${item.type}: ${item.cost}g`,
        {
          font: '14px monospace',
          fill: color
        }
      );

      if (canAfford) {
        text.setInteractive({ useHandCursor: true });
        
        text.on('pointerover', () => {
          text.setColor('#00ff00');
        });

        text.on('pointerout', () => {
          text.setColor('#ffffff');
        });

        text.on('pointerdown', () => {
          this.purchaseItem(item.type);
        });
      }
    });
  }

  purchaseWeapon(weaponType) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    const result = this.shopSystem.purchaseWeapon(weaponType);
    
    if (result.success) {
      // Add weapon to player inventory
      const weapon = new Weapon(weaponType);
      if (!playerData.inventory) {
        playerData.inventory = { weapons: [], items: [] };
      }
      playerData.inventory.weapons.push(weapon);
      
      // Update currency in player data
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene
      this.scene.restart();
    }
  }

  purchaseItem(itemType) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    const result = this.shopSystem.purchaseItem(itemType);
    
    if (result.success) {
      // Add item to player inventory
      const item = new Item(itemType);
      if (!playerData.inventory) {
        playerData.inventory = { weapons: [], items: [] };
      }
      playerData.inventory.items.push(item);
      
      // Update currency in player data
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene
      this.scene.restart();
    }
  }
}
