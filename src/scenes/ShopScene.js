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
    this.shopSystem = new ShopSystem(this, progressionManager);

    // Title
    this.add.text(width / 2, 20, 'Shop', {
      font: '32px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Currency display
    this.currencyText = this.add.text(width / 2, 55, `Gold: ${playerData.currency || 0}`, {
      font: '20px monospace',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Instructions
    const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
    this.add.text(width / 2, 85, `Equipped: ${equippedCount}/6 weapons | Click to purchase`, {
      font: '14px monospace',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Weapons section
    this.add.text(width / 2, 110, 'Weapons', {
      font: '20px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.displayWeapons(50, 140);

    // Continue button - changes based on current round
    const currentRound = gameManager.getCurrentRound();
    const continueBtn = this.add.rectangle(width / 2, height - 30, 200, 40, 0x00ff00);
    continueBtn.setInteractive({ useHandCursor: true });

    // If round is 1 and we haven't started yet, this is the initial shop
    const buttonText = currentRound === 1 ? 'Start Round 1' : 'Continue';
    const continueText = this.add.text(width / 2, height - 30, buttonText, {
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
    const boxWidth = 140;
    const boxHeight = 80;
    const padding = 10;
    const columns = 5;

    weapons.forEach((weapon, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + (column * (boxWidth + padding));
      const y = startY + (row * (boxHeight + padding));

      const canAfford = this.shopSystem.canAffordWeapon(weapon.type);
      const boxColor = canAfford ? 0x444444 : 0x222222;
      const textColor = canAfford ? '#ffffff' : '#666666';

      // Weapon box
      const box = this.add.rectangle(x, y, boxWidth, boxHeight, boxColor);
      box.setOrigin(0, 0);
      box.setStrokeStyle(2, canAfford ? 0xffffff : 0x444444);

      if (canAfford) {
        box.setInteractive({ useHandCursor: true });
        
        box.on('pointerover', () => {
          box.setStrokeStyle(3, 0x00ff00);
        });

        box.on('pointerout', () => {
          box.setStrokeStyle(2, 0xffffff);
        });

        box.on('pointerdown', () => {
          this.purchaseWeapon(weapon.type);
        });
      }

      // Weapon name
      this.add.text(x + boxWidth / 2, y + 15, weapon.type, {
        font: '12px monospace',
        fill: textColor
      }).setOrigin(0.5);

      // Cost
      this.add.text(x + boxWidth / 2, y + 35, `${weapon.cost}g`, {
        font: '14px monospace',
        fill: '#ffff00'
      }).setOrigin(0.5);

      // Stats
      this.add.text(x + boxWidth / 2, y + 55, `DMG:${weapon.baseDamage} RNG:${weapon.range}`, {
        font: '10px monospace',
        fill: textColor
      }).setOrigin(0.5);
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

    // Purchase weapon (this deducts currency)
    const success = this.shopSystem.purchaseWeapon(weaponType);
    
    if (success) {
      // Create weapon
      const weapon = new Weapon(weaponType);
      
      // Initialize inventory if needed
      if (!playerData.inventory) {
        playerData.inventory = { weapons: [], items: [] };
      }
      
      // Add to inventory
      playerData.inventory.weapons.push(weapon);
      
      // Initialize equippedWeapons array if needed
      if (!playerData.equippedWeapons) {
        playerData.equippedWeapons = [];
      }
      
      // Auto-equip weapon if player has less than 6 equipped
      if (playerData.equippedWeapons.length < 6) {
        playerData.equippedWeapons.push(weapon);
      }
      
      // Update currency in player data
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene to update display
      this.scene.restart();
    }
  }
}
