import Phaser from 'phaser';
import ShopSystem from '../systems/ShopSystem.js';
import ShopCardGenerator from '../systems/ShopCardGenerator.js';
import ShopPurchaseHandler from '../systems/ShopPurchaseHandler.js';
import ShopState from '../systems/ShopState.js';
import ShopButton from '../ui/ShopButton.js';
import ShopLayout from '../ui/ShopLayout.js';
import WeaponCard from '../ui/WeaponCard.js';
import ItemCard from '../ui/ItemCard.js';
import { SHOP_THEME } from '../config/shopTheme.js';

/**
 * ShopScene
 * Between-round shop for purchasing weapons and items
 * Shows 4 random cards per round (at least 2 weapons)
 * with 50 gold refresh option
 * 
 * Refactored to use component-based architecture:
 * - ShopState: State management
 * - ShopCardGenerator: Card generation logic
 * - ShopPurchaseHandler: Purchase transactions
 * - ShopButton: Reusable button components
 * - WeaponCard/ItemCard: Card rendering
 * - ShopLayout: Layout calculations
 * - SHOP_THEME: Centralized styling
 */
export default class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
    this.theme = SHOP_THEME;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get managers
    const gameManager = this.registry.get('gameManager');
    const progressionManager = this.registry.get('progressionManager');
    const currentRound = gameManager.getCurrentRound();

    // IMPORTANT: Sync ProgressionManager currency with playerData
    // This ensures currency is consistent between character select and shop
    const playerData = gameManager.getPlayerData();
    if (playerData.currency !== undefined && playerData.currency !== progressionManager.getCurrency()) {
      console.log(`Syncing currency: playerData=${playerData.currency}, progressionManager=${progressionManager.getCurrency()}`);
      // Set ProgressionManager to match playerData (playerData is source of truth)
      progressionManager.currency = playerData.currency;
    }

    // Initialize systems
    this.shopSystem = new ShopSystem(this, progressionManager);
    this.shopState = new ShopState(gameManager, currentRound);
    this.purchaseHandler = new ShopPurchaseHandler(this.shopSystem, gameManager);
    
    // Initialize or retrieve shop cards for this round
    if (!this.shopState.getCards().length) {
      const cards = this.generateShopCards();
      this.shopState.setCards(cards);
    }
    this.shopCards = this.shopState.getCards();

    // Render UI
    this.renderBackground(width, height);
    this.renderTitle(width);
    this.renderCurrency(width);
    this.renderInstructions(width);
    this.renderShopCards(width);
    this.renderEquippedItems(width, height);
    this.renderSellWeapons(width, height);
    this.renderButtons(width, height, currentRound);
  }
  
  /**
   * Render background
   */
  renderBackground(width, height) {
    this.add.rectangle(0, 0, width, height, this.theme.colors.background).setOrigin(0);
  }
  
  /**
   * Render title with decorative border
   */
  renderTitle(width) {
    const titleBg = this.add.rectangle(width / 2, 40, 400, 60, this.theme.colors.titleBg);
    titleBg.setStrokeStyle(3, this.theme.colors.titleBorder);
    
    this.add.text(width / 2, 40, 'SHOP', {
      font: this.theme.fonts.title,
      fill: this.theme.colors.titleText,
      stroke: this.theme.stroke.title.color,
      strokeThickness: this.theme.stroke.title.thickness
    }).setOrigin(0.5);
  }
  
  /**
   * Render currency display
   */
  renderCurrency(width) {
    const currencyBg = this.add.rectangle(width / 2, 100, 300, 40, this.theme.colors.currencyBg);
    currencyBg.setStrokeStyle(2, this.theme.colors.currencyBorder);
    
    this.currencyText = this.add.text(width / 2, 100, `Gold: ${this.shopState.getCurrency()}`, {
      font: this.theme.fonts.currency,
      fill: this.theme.colors.currencyText,
      stroke: this.theme.stroke.currency.color,
      strokeThickness: this.theme.stroke.currency.thickness
    }).setOrigin(0.5);
  }
  
  /**
   * Render instructions
   */
  renderInstructions(width) {
    const equippedCount = this.shopState.getEquippedWeaponCount();
    this.add.text(width / 2, 145, `Equipped: ${equippedCount}/${this.theme.layout.maxWeapons} weapons`, {
      font: this.theme.fonts.instruction,
      fill: this.theme.colors.instructionText
    }).setOrigin(0.5);
  }
  
  /**
   * Render shop cards
   */
  renderShopCards(width) {
    const positions = ShopLayout.calculateCardPositions(
      width / 2,
      180,
      this.theme.layout.cardWidth,
      this.theme.layout.cardHeight,
      this.theme.layout.cardPadding
    );
    
    this.shopCards.forEach((card, index) => {
      const pos = positions[index];
      const alreadyPurchased = this.shopState.isCardPurchased(index);
      
      if (card.type === 'weapon') {
        WeaponCard.render(
          this,
          pos.x,
          pos.y,
          this.theme.layout.cardWidth,
          this.theme.layout.cardHeight,
          card.data,
          {
            cardIndex: index,
            alreadyPurchased,
            weaponsFull: this.shopState.isWeaponInventoryFull(),
            shopSystem: this.shopSystem,
            onPurchase: this.handlePurchase.bind(this)
          },
          this.theme
        );
      } else {
        ItemCard.render(
          this,
          pos.x,
          pos.y,
          this.theme.layout.cardWidth,
          this.theme.layout.cardHeight,
          card.data,
          {
            cardIndex: index,
            alreadyPurchased,
            shopSystem: this.shopSystem,
            onPurchase: this.handlePurchase.bind(this)
          },
          this.theme
        );
      }
    });
  }
  
  /**
   * Render equipped items on the left side
   */
  renderEquippedItems(width, height) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const equippedItems = playerData.equippedItems || [];
    
    if (equippedItems.length === 0) {
      return; // No items to display
    }
    
    // Section title
    const leftX = 90;
    const startY = 200;
    
    this.add.text(leftX, startY, 'EQUIPPED ITEMS', {
      font: 'bold 14px monospace',
      fill: this.theme.colors.itemLabel,
      stroke: this.theme.stroke.cardLabel.color,
      strokeThickness: this.theme.stroke.cardLabel.thickness
    }).setOrigin(0.5);
    
    // Display equipped items vertically
    const itemSpacing = 70;
    
    equippedItems.forEach((item, index) => {
      const y = startY + 40 + (index * itemSpacing);
      
      // Item box
      const box = this.add.rectangle(leftX, y, 140, 60, this.theme.colors.purchasableBg);
      box.setStrokeStyle(2, this.theme.colors.itemBorder);
      
      // Item name
      this.add.text(leftX, y - 20, item.type, {
        font: '10px monospace',
        fill: this.theme.colors.nameNormal,
        wordWrap: { width: 130 }
      }).setOrigin(0.5);
      
      // Show first bonus
      if (item.bonuses && Object.keys(item.bonuses).length > 0) {
        const bonusKey = Object.keys(item.bonuses)[0];
        const bonusValue = item.bonuses[bonusKey];
        this.add.text(leftX, y, `+${bonusValue} ${bonusKey}`, {
          font: '9px monospace',
          fill: this.theme.colors.bonus
        }).setOrigin(0.5);
      }
      
      // Show first penalty
      if (item.penalties && Object.keys(item.penalties).length > 0) {
        const penaltyKey = Object.keys(item.penalties)[0];
        const penaltyValue = item.penalties[penaltyKey];
        this.add.text(leftX, y + 12, `${penaltyValue} ${penaltyKey}`, {
          font: '9px monospace',
          fill: this.theme.colors.penalty
        }).setOrigin(0.5);
      }
    });
  }
  
  /**
   * Render sell weapons on the right side
   */
  renderSellWeapons(width, height) {
    const gameManager = this.registry.get('gameManager');
    const playerData = gameManager.getPlayerData();
    const equippedWeapons = playerData.equippedWeapons || [];
    
    if (equippedWeapons.length === 0) {
      return; // No weapons to sell
    }
    
    // Section title
    const rightX = width - 90;
    const startY = 200;
    
    this.add.text(rightX, startY, 'SELL WEAPONS', {
      font: 'bold 14px monospace',
      fill: this.theme.colors.weaponLabel,
      stroke: this.theme.stroke.cardLabel.color,
      strokeThickness: this.theme.stroke.cardLabel.thickness
    }).setOrigin(0.5);
    
    this.add.text(rightX, startY + 15, '(50% value)', {
      font: '10px monospace',
      fill: this.theme.colors.instructionText
    }).setOrigin(0.5);
    
    // Display equipped weapons vertically
    const weaponSpacing = 70;
    
    equippedWeapons.forEach((weapon, index) => {
      const y = startY + 50 + (index * weaponSpacing);
      const sellValue = Math.floor(weapon.cost / 2);
      
      // Weapon box
      const box = this.add.rectangle(rightX, y, 140, 60, this.theme.colors.purchasableBg);
      box.setStrokeStyle(2, this.theme.colors.weaponBorder);
      box.setInteractive({ useHandCursor: true });
      
      // Weapon name
      this.add.text(rightX, y - 15, weapon.type, {
        font: '10px monospace',
        fill: this.theme.colors.nameNormal,
        wordWrap: { width: 130 }
      }).setOrigin(0.5);
      
      // Sell value
      this.add.text(rightX, y + 5, `${sellValue} GOLD`, {
        font: 'bold 12px monospace',
        fill: this.theme.colors.costNormal
      }).setOrigin(0.5);
      
      // Sell button text
      const sellText = this.add.text(rightX, y + 20, 'SELL', {
        font: 'bold 10px monospace',
        fill: '#ff0000'
      }).setOrigin(0.5);
      
      // Hover effects
      box.on('pointerover', () => {
        box.setStrokeStyle(3, this.theme.colors.hoverBorder);
        box.setScale(this.theme.hover.cardScale);
        sellText.setScale(this.theme.hover.cardScale);
      });
      
      box.on('pointerout', () => {
        box.setStrokeStyle(2, this.theme.colors.weaponBorder);
        box.setScale(1);
        sellText.setScale(1);
      });
      
      // Click handler
      box.on('pointerdown', () => {
        this.handleSellWeapon(index, weapon, sellValue);
      });
    });
  }
  
  /**
   * Render buttons (refresh and continue)
   */
  renderButtons(width, height, currentRound) {
    const gameManager = this.registry.get('gameManager');
    const progressionManager = this.registry.get('progressionManager');
    
    // Refresh button (only if player can afford it)
    if (this.shopState.canAffordRefresh(this.theme.layout.refreshCost)) {
      ShopButton.createRefreshButton(
        this,
        width / 2,
        height - 110,
        () => this.handleRefresh(progressionManager, gameManager),
        this.theme
      );
    }
    
    // Continue button
    const buttonText = currentRound === 1 ? 'START ROUND 1' : 'CONTINUE';
    ShopButton.createContinueButton(
      this,
      width / 2,
      height - 50,
      buttonText,
      () => this.handleContinue(currentRound, gameManager),
      this.theme
    );
  }

  /**
   * Generate 4 random shop cards (at least 2 weapons)
   * @returns {Array} Array of 4 card objects
   */
  generateShopCards() {
    const availableWeapons = this.shopSystem.displayAvailableWeapons();
    const availableItems = this.shopSystem.displayAvailableItems();
    return ShopCardGenerator.generateCards(availableWeapons, availableItems);
  }

  /**
   * Handle purchase of a card
   */
  handlePurchase(cardIndex, cardType, itemId) {
    let success = false;
    
    if (cardType === 'weapon') {
      success = this.purchaseHandler.purchaseWeapon(itemId);
    } else {
      success = this.purchaseHandler.purchaseItem(itemId);
    }
    
    if (success) {
      this.purchaseHandler.markCardPurchased(cardIndex);
      this.scene.restart();
    }
  }
  
  /**
   * Handle selling a weapon
   */
  handleSellWeapon(weaponIndex, weapon, sellValue) {
    const gameManager = this.registry.get('gameManager');
    const progressionManager = this.registry.get('progressionManager');
    const playerData = gameManager.getPlayerData();
    
    // Remove weapon from equipped weapons
    if (playerData.equippedWeapons && playerData.equippedWeapons[weaponIndex]) {
      playerData.equippedWeapons.splice(weaponIndex, 1);
      
      // Add currency
      progressionManager.addCurrency(sellValue);
      playerData.currency = progressionManager.getCurrency();
      
      // Save player data
      gameManager.savePlayerData(playerData);
      
      // Restart scene to update display
      this.scene.restart();
    }
  }
  
  /**
   * Handle refresh button click
   */
  handleRefresh(progressionManager, gameManager) {
    if (this.shopState.getCurrency() >= this.theme.layout.refreshCost) {
      // Deduct refresh cost
      progressionManager.spendCurrency(this.theme.layout.refreshCost);
      
      // Update player data with new currency value
      const playerData = gameManager.getPlayerData();
      playerData.currency = progressionManager.getCurrency();
      gameManager.savePlayerData(playerData);
      
      // Generate new cards
      const newCards = this.generateShopCards();
      this.shopState.setCards(newCards);
      this.shopState.resetPurchasedCards();
      
      // Restart scene
      this.scene.restart();
    }
  }
  
  /**
   * Handle continue button click
   */
  handleContinue(currentRound, gameManager) {
    if (currentRound === 1) {
      gameManager.startRound(1);
    } else {
      gameManager.showStatsAllocation();
    }
  }
}
