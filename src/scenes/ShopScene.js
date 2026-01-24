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
      font: '18px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.displayWeapons(width / 2, 135);

    // Items section (positioned below weapons grid)
    this.add.text(width / 2, 410, 'Items', {
      font: '18px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.displayItems(width / 2, 440);

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

  displayWeapons(centerX, startY) {
    const weapons = this.shopSystem.displayAvailableWeapons();
    const boxWidth = 110;
    const boxHeight = 60;
    const padding = 8;
    const columns = 5;
    
    // Calculate total width and starting X to center the weapons
    const totalWidth = (boxWidth * columns) + (padding * (columns - 1));
    const startX = centerX - (totalWidth / 2);

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
      this.add.text(x + boxWidth / 2, y + 10, weapon.type, {
        font: '10px monospace',
        fill: textColor
      }).setOrigin(0.5);

      // Cost
      this.add.text(x + boxWidth / 2, y + 28, `${weapon.cost}g`, {
        font: '12px monospace',
        fill: '#ffff00'
      }).setOrigin(0.5);

      // Stats
      this.add.text(x + boxWidth / 2, y + 45, `D:${weapon.baseDamage} R:${weapon.range}`, {
        font: '9px monospace',
        fill: textColor
      }).setOrigin(0.5);
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

  displayItems(centerX, startY) {
    const allItems = this.shopSystem.displayAvailableItems();
    
    // Select 3 random items
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const randomItems = shuffled.slice(0, 3);
    
    const boxWidth = 110;
    const boxHeight = 110;
    const padding = 15;
    
    // Calculate total width and starting X to center the items
    const totalWidth = (boxWidth * 3) + (padding * 2);
    const startX = centerX - (totalWidth / 2);

    randomItems.forEach((item, index) => {
      const x = startX + (index * (boxWidth + padding));
      const y = startY;

      const canAfford = this.shopSystem.canAffordItem(item.type);
      const boxColor = canAfford ? 0x444444 : 0x222222;
      const textColor = canAfford ? '#ffffff' : '#666666';

      // Item box
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
          this.purchaseItem(item.type);
        });
      }

      // Item name (smaller font for long names)
      const nameText = this.add.text(x + boxWidth / 2, y + 8, item.type, {
        font: '9px monospace',
        fill: textColor,
        wordWrap: { width: boxWidth - 10 }
      });
      nameText.setOrigin(0.5, 0);

      // Cost
      this.add.text(x + boxWidth / 2, y + 32, `${item.cost}g`, {
        font: '12px monospace',
        fill: '#ffff00'
      }).setOrigin(0.5);

      // Display bonuses
      let yOffset = 50;
      if (item.bonuses && item.bonuses.length > 0) {
        item.bonuses.forEach(bonus => {
          const value = bonus.isPercentage ? `+${bonus.value}%` : `+${bonus.value}`;
          const shortAttr = this.getShortAttribute(bonus.attribute);
          this.add.text(x + boxWidth / 2, y + yOffset, `${shortAttr}:${value}`, {
            font: '8px monospace',
            fill: '#00ff00'
          }).setOrigin(0.5);
          yOffset += 12;
        });
      }

      // Display penalties
      if (item.penalties && item.penalties.length > 0) {
        item.penalties.forEach(penalty => {
          const value = penalty.isPercentage ? `-${penalty.value}%` : `-${penalty.value}`;
          const shortAttr = this.getShortAttribute(penalty.attribute);
          this.add.text(x + boxWidth / 2, y + yOffset, `${shortAttr}:${value}`, {
            font: '8px monospace',
            fill: '#ff0000'
          }).setOrigin(0.5);
          yOffset += 12;
        });
      }
    });
  }

  getShortAttribute(attribute) {
    const shortNames = {
      'strength': 'STR',
      'defense': 'DEF',
      'speed': 'SPD',
      'vitality': 'VIT'
    };
    return shortNames[attribute] || attribute.substring(0, 3).toUpperCase();
  }

  purchaseItem(itemType) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();

    // Purchase item (this deducts currency)
    const success = this.shopSystem.purchaseItem(itemType);
    
    if (success) {
      // Create item
      const item = new Item(itemType);
      
      // Initialize inventory if needed
      if (!playerData.inventory) {
        playerData.inventory = { weapons: [], items: [] };
      }
      
      // Add to inventory
      playerData.inventory.items.push(item);
      
      // Initialize equippedItems array if needed
      if (!playerData.equippedItems) {
        playerData.equippedItems = [];
      }
      
      // Auto-equip item
      playerData.equippedItems.push(item);
      
      // Update currency in player data
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene to update display
      this.scene.restart();
    }
  }
}
