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
    
    // Initialize or retrieve random items for this round
    const currentRound = gameManager.getCurrentRound();
    if (!playerData.shopRandomItems || playerData.shopRandomItemsRound !== currentRound) {
      // New round - select new random items and reset purchased items
      const allItems = this.shopSystem.displayAvailableItems();
      const shuffled = [...allItems].sort(() => Math.random() - 0.5);
      playerData.shopRandomItems = shuffled.slice(0, 3);
      playerData.shopRandomItemsRound = currentRound;
      playerData.shopPurchasedItems = []; // Reset purchased items for new round
      gameManager.savePlayerData(playerData);
    }
    
    // Initialize purchased items array if it doesn't exist
    if (!playerData.shopPurchasedItems) {
      playerData.shopPurchasedItems = [];
    }
    this.randomItems = playerData.shopRandomItems;

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
    
    // Color legend for weapons
    this.add.text(width / 2 - 100, 130, 'Melee', {
      font: '10px monospace',
      fill: '#ff8800'
    }).setOrigin(0.5);
    
    this.add.text(width / 2 + 100, 130, 'Ranged', {
      font: '10px monospace',
      fill: '#00ffff'
    }).setOrigin(0.5);

    this.displayWeapons(width / 2, 145);

    // Equipped weapons section (right side)
    this.add.text(width - 150, 110, 'Your Weapons', {
      font: '16px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    this.displayEquippedWeapons(width - 150, 140);

    // Items section (positioned below weapons grid)
    this.add.text(width / 2, 420, 'Items', {
      font: '18px monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.displayItems(width / 2, 450);

    // Continue button - changes based on current round
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
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
    const isFull = equippedCount >= 6;
    
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
      const canPurchase = canAfford && !isFull;
      const boxColor = canPurchase ? 0x444444 : 0x222222;
      const textColor = canPurchase ? '#ffffff' : '#666666';

      // Weapon box
      const box = this.add.rectangle(x, y, boxWidth, boxHeight, boxColor);
      box.setOrigin(0, 0);
      box.setStrokeStyle(2, canPurchase ? 0xffffff : 0x444444);

      if (canPurchase) {
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

      // Weapon name - color based on melee (range <= 100) vs ranged (range > 100)
      const isRanged = weapon.range > 100;
      const nameColor = canPurchase ? (isRanged ? '#00ffff' : '#ff8800') : '#666666';
      
      this.add.text(x + boxWidth / 2, y + 10, weapon.type, {
        font: '10px monospace',
        fill: nameColor
      }).setOrigin(0.5);

      // Cost
      this.add.text(x + boxWidth / 2, y + 28, `${weapon.cost}g`, {
        font: '12px monospace',
        fill: isFull ? '#666666' : '#ffff00'
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
    
    // Check if player already has 6 weapons
    const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
    if (equippedCount >= 6) {
      return; // Can't purchase more weapons
    }

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
    // Use the pre-selected random items for this round
    const randomItems = this.randomItems;
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const purchasedItems = playerData.shopPurchasedItems || [];
    
    const boxWidth = 180;
    const boxHeight = 90;
    const padding = 15;
    
    // Calculate total width and starting X to center the items
    const totalWidth = (boxWidth * 3) + (padding * 2);
    const startX = centerX - (totalWidth / 2);

    randomItems.forEach((item, index) => {
      const x = startX + (index * (boxWidth + padding));
      const y = startY;

      const alreadyPurchased = purchasedItems.includes(item.type);
      const canAfford = this.shopSystem.canAffordItem(item.type) && !alreadyPurchased;
      const boxColor = alreadyPurchased ? 0x1a1a1a : (canAfford ? 0x444444 : 0x222222);
      const textColor = alreadyPurchased ? '#444444' : (canAfford ? '#ffffff' : '#666666');

      // Item box
      const box = this.add.rectangle(x, y, boxWidth, boxHeight, boxColor);
      box.setOrigin(0, 0);
      box.setStrokeStyle(2, alreadyPurchased ? 0x333333 : (canAfford ? 0xffffff : 0x444444));

      if (canAfford && !alreadyPurchased) {
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

      // Item name (top center)
      const itemName = alreadyPurchased ? `${item.type} (SOLD)` : item.type;
      const nameText = this.add.text(x + boxWidth / 2, y + 8, itemName, {
        font: '9px monospace',
        fill: textColor,
        wordWrap: { width: boxWidth - 10 }
      });
      nameText.setOrigin(0.5, 0);

      // Cost (below name)
      this.add.text(x + boxWidth / 2, y + 28, `${item.cost}g`, {
        font: '12px monospace',
        fill: alreadyPurchased ? '#666666' : '#ffff00'
      }).setOrigin(0.5);

      // Bonuses on left side
      const leftX = x + 30;
      let leftY = y + 48;
      if (item.bonuses && item.bonuses.length > 0) {
        item.bonuses.forEach(bonus => {
          const value = bonus.isPercentage ? `+${bonus.value}%` : `+${bonus.value}`;
          const shortAttr = this.getShortAttribute(bonus.attribute);
          this.add.text(leftX, leftY, `${shortAttr}:${value}`, {
            font: '8px monospace',
            fill: '#00ff00'
          }).setOrigin(0, 0.5);
          leftY += 12;
        });
      }

      // Penalties on right side
      const rightX = x + boxWidth - 30;
      let rightY = y + 48;
      if (item.penalties && item.penalties.length > 0) {
        item.penalties.forEach(penalty => {
          const value = penalty.isPercentage ? `-${penalty.value}%` : `-${penalty.value}`;
          const shortAttr = this.getShortAttribute(penalty.attribute);
          this.add.text(rightX, rightY, `${shortAttr}:${value}`, {
            font: '8px monospace',
            fill: '#ff0000'
          }).setOrigin(1, 0.5);
          rightY += 12;
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
      
      // Track purchased item for this round
      if (!playerData.shopPurchasedItems) {
        playerData.shopPurchasedItems = [];
      }
      playerData.shopPurchasedItems.push(itemType);
      
      // Update currency in player data
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene to update display
      this.scene.restart();
    }
  }

  displayEquippedWeapons(centerX, startY) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const equippedWeapons = playerData.equippedWeapons || [];
    
    const boxWidth = 140;
    const boxHeight = 70;
    const spacing = 10;
    
    equippedWeapons.forEach((weapon, index) => {
      const x = centerX - boxWidth / 2;
      const y = startY + (index * (boxHeight + spacing));
      
      // Weapon box
      const box = this.add.rectangle(x, y, boxWidth, boxHeight, 0x333333);
      box.setOrigin(0, 0);
      box.setStrokeStyle(2, 0x666666);
      
      // Weapon name - color based on melee (range <= 100) vs ranged (range > 100)
      const isRanged = weapon.range > 100;
      const nameColor = isRanged ? '#00ffff' : '#ff8800';
      
      this.add.text(x + boxWidth / 2, y + 15, weapon.type, {
        font: '11px monospace',
        fill: nameColor
      }).setOrigin(0.5);
      
      // Weapon stats
      this.add.text(x + boxWidth / 2, y + 32, `D:${weapon.baseDamage} R:${weapon.range}`, {
        font: '9px monospace',
        fill: '#cccccc'
      }).setOrigin(0.5);
      
      // Sell button
      const sellValue = Math.floor(weapon.cost / 2);
      const sellText = this.add.text(x + boxWidth / 2, y + 52, `Sell (${sellValue}g)`, {
        font: '10px monospace',
        fill: '#ffaa00'
      }).setOrigin(0.5);
      
      sellText.setInteractive({ useHandCursor: true });
      
      sellText.on('pointerover', () => {
        sellText.setColor('#ffff00');
      });
      
      sellText.on('pointerout', () => {
        sellText.setColor('#ffaa00');
      });
      
      sellText.on('pointerdown', () => {
        this.sellWeapon(index, sellValue);
      });
    });
  }

  sellWeapon(weaponIndex, sellValue) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const progressionManager = this.registry.get('progressionManager');
    
    // Remove weapon from equipped weapons
    playerData.equippedWeapons.splice(weaponIndex, 1);
    
    // Add currency
    progressionManager.addCurrency(sellValue);
    playerData.currency = progressionManager.getCurrency();
    
    // Save and refresh
    gameManager.savePlayerData(playerData);
    this.scene.restart();
  }
}

