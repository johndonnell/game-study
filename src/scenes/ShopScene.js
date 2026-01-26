import Phaser from 'phaser';
import ShopSystem from '../systems/ShopSystem.js';
import Weapon from '../entities/Weapon.js';
import Item from '../entities/Item.js';

/**
 * ShopScene
 * Between-round shop for purchasing weapons and items
 * Shows 4 random cards per round (at least 2 weapons)
 * with 50 gold refresh option
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
    
    // Initialize or retrieve shop cards for this round
    const currentRound = gameManager.getCurrentRound();
    if (!playerData.shopCards || playerData.shopCardsRound !== currentRound) {
      // New round - generate 4 random cards (at least 2 weapons)
      playerData.shopCards = this.generateShopCards();
      playerData.shopCardsRound = currentRound;
      playerData.shopPurchasedCards = []; // Reset purchased cards for new round
      gameManager.savePlayerData(playerData);
    }
    
    // Initialize purchased cards array if it doesn't exist
    if (!playerData.shopPurchasedCards) {
      playerData.shopPurchasedCards = [];
    }
    this.shopCards = playerData.shopCards;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title with decorative border
    const titleBg = this.add.rectangle(width / 2, 40, 400, 60, 0x16213e);
    titleBg.setStrokeStyle(3, 0x0f3460);
    
    this.add.text(width / 2, 40, 'SHOP', {
      font: 'bold 32px monospace',
      fill: '#e94560',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Currency display
    const currencyBg = this.add.rectangle(width / 2, 100, 300, 40, 0x0f3460);
    currencyBg.setStrokeStyle(2, 0xffff00);
    
    this.currencyText = this.add.text(width / 2, 100, `Gold: ${playerData.currency || 0}`, {
      font: 'bold 24px monospace',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Instructions
    const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
    this.add.text(width / 2, 145, `Equipped: ${equippedCount}/6 weapons`, {
      font: '16px monospace',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Display 4 shop cards
    this.displayShopCards(width / 2, 180);

    // Refresh button (50 gold, only if player can afford it)
    const canAffordRefresh = playerData.currency >= 50;
    if (canAffordRefresh) {
      const refreshBtn = this.add.rectangle(width / 2, height - 110, 220, 45, 0x0f3460);
      refreshBtn.setStrokeStyle(3, 0xffff00);
      refreshBtn.setInteractive({ useHandCursor: true });

      const refreshText = this.add.text(width / 2, height - 110, '🔄 REFRESH (50g)', {
        font: 'bold 18px monospace',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);

      refreshBtn.on('pointerover', () => {
        refreshBtn.setFillStyle(0x16213e);
        refreshBtn.setScale(1.05);
      });

      refreshBtn.on('pointerout', () => {
        refreshBtn.setFillStyle(0x0f3460);
        refreshBtn.setScale(1);
      });

      refreshBtn.on('pointerdown', () => {
        if (playerData.currency >= 50) {
          // Deduct 50 gold
          progressionManager.spendCurrency(50);
          playerData.currency = progressionManager.getCurrency();
          
          // Generate new cards
          playerData.shopCards = this.generateShopCards();
          playerData.shopPurchasedCards = []; // Reset purchased cards
          
          gameManager.savePlayerData(playerData);
          this.scene.restart();
        }
      });
    }

    // Continue button
    const continueBtn = this.add.rectangle(width / 2, height - 50, 280, 50, 0xe94560);
    continueBtn.setStrokeStyle(3, 0xff6b6b);
    continueBtn.setInteractive({ useHandCursor: true });

    const buttonText = currentRound === 1 ? 'START ROUND 1' : 'CONTINUE';
    const continueText = this.add.text(width / 2, height - 50, buttonText, {
      font: 'bold 22px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    continueBtn.on('pointerover', () => {
      continueBtn.setFillStyle(0xff6b6b);
      continueBtn.setScale(1.05);
    });

    continueBtn.on('pointerout', () => {
      continueBtn.setFillStyle(0xe94560);
      continueBtn.setScale(1);
    });

    continueBtn.on('pointerdown', () => {
      if (currentRound === 1) {
        gameManager.startRound(1);
      } else {
        gameManager.showStatsAllocation();
      }
    });
  }

  /**
   * Generate 4 random shop cards (at least 2 weapons, rest can be items)
   * @returns {Array} Array of 4 card objects {type: 'weapon'|'item', data: weaponType|itemType}
   */
  generateShopCards() {
    const cards = [];
    
    // Get all available weapons and items
    const allWeapons = this.shopSystem.displayAvailableWeapons();
    const allItems = this.shopSystem.displayAvailableItems();
    
    // Ensure we have enough items and weapons
    if (allWeapons.length < 2) {
      console.error('Not enough weapons available');
      return [];
    }
    
    // Shuffle weapons and items
    const shuffledWeapons = [...allWeapons].sort(() => Math.random() - 0.5);
    const shuffledItems = [...allItems].sort(() => Math.random() - 0.5);
    
    // Add at least 2 weapons
    cards.push({ type: 'weapon', data: shuffledWeapons[0].type });
    cards.push({ type: 'weapon', data: shuffledWeapons[1].type });
    
    // For remaining 2 slots, randomly choose from remaining weapons or items
    const remaining = [
      ...shuffledWeapons.slice(2).map(w => ({ type: 'weapon', data: w.type })),
      ...shuffledItems.map(i => ({ type: 'item', data: i.type }))
    ];
    
    // Ensure we have enough remaining items
    if (remaining.length < 2) {
      console.error('Not enough items/weapons for remaining slots');
      // Fill with what we have
      remaining.forEach(item => cards.push(item));
      // If still not enough, add more weapons
      for (let i = cards.length; i < 4 && i < shuffledWeapons.length; i++) {
        cards.push({ type: 'weapon', data: shuffledWeapons[i].type });
      }
    } else {
      const shuffledRemaining = remaining.sort(() => Math.random() - 0.5);
      cards.push(shuffledRemaining[0]);
      cards.push(shuffledRemaining[1]);
    }
    
    // Shuffle final cards
    return cards.sort(() => Math.random() - 0.5);
  }

  /**
   * Display 4 shop cards in a 2x2 grid
   */
  displayShopCards(centerX, startY) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const purchasedCards = playerData.shopPurchasedCards || [];
    const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
    
    const cardWidth = 180;
    const cardHeight = 200;
    const padding = 15;
    
    // 2x2 grid
    const totalWidth = (cardWidth * 2) + padding;
    const startX = centerX - (totalWidth / 2);

    this.shopCards.forEach((card, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + (column * (cardWidth + padding));
      const y = startY + (row * (cardHeight + padding));

      const alreadyPurchased = purchasedCards.includes(index);
      
      if (card.type === 'weapon') {
        this.displayWeaponCard(x, y, cardWidth, cardHeight, card.data, index, alreadyPurchased, equippedCount >= 6);
      } else {
        this.displayItemCard(x, y, cardWidth, cardHeight, card.data, index, alreadyPurchased);
      }
    });
  }

  /**
   * Display a weapon card
   */
  displayWeaponCard(x, y, width, height, weaponType, cardIndex, alreadyPurchased, weaponsFull) {
    const weapon = new Weapon(weaponType);
    const canAfford = this.shopSystem.canAffordWeapon(weaponType);
    const canPurchase = canAfford && !alreadyPurchased && !weaponsFull;
    
    const boxColor = alreadyPurchased ? 0x1a1a1a : (canPurchase ? 0x16213e : 0x0f3460);
    const borderColor = alreadyPurchased ? 0x333333 : (canPurchase ? 0xff8800 : 0x444444);
    
    // Card background
    const box = this.add.rectangle(x, y, width, height, boxColor);
    box.setOrigin(0, 0);
    box.setStrokeStyle(3, borderColor);

    if (canPurchase) {
      box.setInteractive({ useHandCursor: true });
      
      box.on('pointerover', () => {
        box.setStrokeStyle(4, 0x00ff00);
        box.setScale(1.02);
      });

      box.on('pointerout', () => {
        box.setStrokeStyle(3, borderColor);
        box.setScale(1);
      });

      box.on('pointerdown', () => {
        this.purchaseCard(cardIndex, 'weapon', weaponType);
      });
    }

    // Type label
    this.add.text(x + width / 2, y + 12, 'WEAPON', {
      font: 'bold 10px monospace',
      fill: '#ff8800',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Weapon name
    const nameColor = alreadyPurchased ? '#444444' : '#ffffff';
    this.add.text(x + width / 2, y + 32, weaponType, {
      font: 'bold 13px monospace',
      fill: nameColor,
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: width - 20 }
    }).setOrigin(0.5);

    // Stats
    const statColor = alreadyPurchased ? '#444444' : '#cccccc';
    this.add.text(x + width / 2, y + 60, `Damage: ${weapon.baseDamage}`, {
      font: '12px monospace',
      fill: statColor
    }).setOrigin(0.5);

    this.add.text(x + width / 2, y + 80, `Range: ${weapon.range}`, {
      font: '12px monospace',
      fill: statColor
    }).setOrigin(0.5);

    this.add.text(x + width / 2, y + 100, `Speed: ${weapon.attackSpeed}/s`, {
      font: '12px monospace',
      fill: statColor
    }).setOrigin(0.5);

    // Range type indicator
    const isRanged = weapon.range > 100;
    this.add.text(x + width / 2, y + 120, isRanged ? '🏹 RANGED' : '⚔️ MELEE', {
      font: 'bold 10px monospace',
      fill: isRanged ? '#00ffff' : '#ff8800'
    }).setOrigin(0.5);

    // Cost
    const costColor = alreadyPurchased ? '#666666' : (weaponsFull ? '#666666' : '#ffff00');
    this.add.text(x + width / 2, y + height - 30, `${weapon.cost} GOLD`, {
      font: 'bold 16px monospace',
      fill: costColor,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Status text
    if (alreadyPurchased) {
      this.add.text(x + width / 2, y + height - 12, 'SOLD', {
        font: 'bold 12px monospace',
        fill: '#666666'
      }).setOrigin(0.5);
    } else if (weaponsFull) {
      this.add.text(x + width / 2, y + height - 12, 'INVENTORY FULL', {
        font: 'bold 9px monospace',
        fill: '#ff0000'
      }).setOrigin(0.5);
    } else if (!canAfford) {
      this.add.text(x + width / 2, y + height - 12, 'NOT ENOUGH GOLD', {
        font: 'bold 9px monospace',
        fill: '#ff0000'
      }).setOrigin(0.5);
    }
  }

  /**
   * Display an item card
   */
  displayItemCard(x, y, width, height, itemType, cardIndex, alreadyPurchased) {
    const item = new Item(itemType);
    const canAfford = this.shopSystem.canAffordItem(itemType);
    const canPurchase = canAfford && !alreadyPurchased;
    
    const boxColor = alreadyPurchased ? 0x1a1a1a : (canPurchase ? 0x16213e : 0x0f3460);
    const borderColor = alreadyPurchased ? 0x333333 : (canPurchase ? 0x00ffff : 0x444444);
    
    // Card background
    const box = this.add.rectangle(x, y, width, height, boxColor);
    box.setOrigin(0, 0);
    box.setStrokeStyle(3, borderColor);

    if (canPurchase) {
      box.setInteractive({ useHandCursor: true });
      
      box.on('pointerover', () => {
        box.setStrokeStyle(4, 0x00ff00);
        box.setScale(1.02);
      });

      box.on('pointerout', () => {
        box.setStrokeStyle(3, borderColor);
        box.setScale(1);
      });

      box.on('pointerdown', () => {
        this.purchaseCard(cardIndex, 'item', itemType);
      });
    }

    // Type label
    this.add.text(x + width / 2, y + 12, 'ITEM', {
      font: 'bold 10px monospace',
      fill: '#00ffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Item name
    const nameColor = alreadyPurchased ? '#444444' : '#ffffff';
    this.add.text(x + width / 2, y + 32, itemType, {
      font: 'bold 12px monospace',
      fill: nameColor,
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: width - 20 },
      align: 'center'
    }).setOrigin(0.5);

    // Bonuses
    let bonusY = y + 60;
    if (item.bonuses && item.bonuses.length > 0) {
      this.add.text(x + width / 2, bonusY, 'BONUSES:', {
        font: 'bold 9px monospace',
        fill: '#00ff00'
      }).setOrigin(0.5);
      bonusY += 14;
      
      item.bonuses.forEach(bonus => {
        const value = bonus.isPercentage ? `+${bonus.value}%` : `+${bonus.value}`;
        const text = `${bonus.attribute}: ${value}`;
        this.add.text(x + width / 2, bonusY, text, {
          font: '9px monospace',
          fill: alreadyPurchased ? '#444444' : '#00ff00'
        }).setOrigin(0.5);
        bonusY += 12;
      });
    }

    // Penalties
    if (item.penalties && item.penalties.length > 0) {
      bonusY += 3;
      this.add.text(x + width / 2, bonusY, 'PENALTIES:', {
        font: 'bold 9px monospace',
        fill: '#ff0000'
      }).setOrigin(0.5);
      bonusY += 14;
      
      item.penalties.forEach(penalty => {
        const value = penalty.isPercentage ? `-${penalty.value}%` : `-${penalty.value}`;
        const text = `${penalty.attribute}: ${value}`;
        this.add.text(x + width / 2, bonusY, text, {
          font: '9px monospace',
          fill: alreadyPurchased ? '#444444' : '#ff0000'
        }).setOrigin(0.5);
        bonusY += 12;
      });
    }

    // Cost
    const costColor = alreadyPurchased ? '#666666' : '#ffff00';
    this.add.text(x + width / 2, y + height - 30, `${item.cost} GOLD`, {
      font: 'bold 16px monospace',
      fill: costColor,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Status text
    if (alreadyPurchased) {
      this.add.text(x + width / 2, y + height - 12, 'SOLD', {
        font: 'bold 12px monospace',
        fill: '#666666'
      }).setOrigin(0.5);
    } else if (!canAfford) {
      this.add.text(x + width / 2, y + height - 12, 'NOT ENOUGH GOLD', {
        font: 'bold 9px monospace',
        fill: '#ff0000'
      }).setOrigin(0.5);
    }
  }

  /**
   * Purchase a card (weapon or item)
   */
  purchaseCard(cardIndex, cardType, itemId) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    
    let success = false;
    
    if (cardType === 'weapon') {
      // Check if player already has 6 weapons
      const equippedCount = playerData.equippedWeapons ? playerData.equippedWeapons.length : 0;
      if (equippedCount >= 6) {
        return;
      }
      
      success = this.shopSystem.purchaseWeapon(itemId);
      
      if (success) {
        const weapon = new Weapon(itemId);
        
        if (!playerData.inventory) {
          playerData.inventory = { weapons: [], items: [] };
        }
        playerData.inventory.weapons.push(weapon);
        
        if (!playerData.equippedWeapons) {
          playerData.equippedWeapons = [];
        }
        if (playerData.equippedWeapons.length < 6) {
          playerData.equippedWeapons.push(weapon);
        }
      }
    } else {
      success = this.shopSystem.purchaseItem(itemId);
      
      if (success) {
        const item = new Item(itemId);
        
        if (!playerData.inventory) {
          playerData.inventory = { weapons: [], items: [] };
        }
        playerData.inventory.items.push(item);
        
        if (!playerData.equippedItems) {
          playerData.equippedItems = [];
        }
        playerData.equippedItems.push(item);
      }
    }
    
    if (success) {
      // Track purchased card
      if (!playerData.shopPurchasedCards) {
        playerData.shopPurchasedCards = [];
      }
      playerData.shopPurchasedCards.push(cardIndex);
      
      // Update currency
      playerData.currency = this.shopSystem.progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);

      // Refresh scene
      this.scene.restart();
    }
  }
}
