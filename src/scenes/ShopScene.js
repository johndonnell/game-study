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
   * Handle refresh button click
   */
  handleRefresh(progressionManager, gameManager) {
    if (this.shopState.getCurrency() >= this.theme.layout.refreshCost) {
      // Deduct refresh cost
      progressionManager.spendCurrency(this.theme.layout.refreshCost);
      
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
