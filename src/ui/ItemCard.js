import ShopCard from './ShopCard.js';
import Item from '../entities/Item.js';

/**
 * ItemCard
 * Renders an item card in the shop
 */
export default class ItemCard extends ShopCard {
  /**
   * Render an item card
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Card width
   * @param {number} height - Card height
   * @param {string} itemType - Item type identifier
   * @param {Object} options - Rendering options
   * @param {Object} theme - Theme configuration
   */
  static render(scene, x, y, width, height, itemType, options, theme) {
    const {
      cardIndex,
      alreadyPurchased,
      shopSystem,
      onPurchase
    } = options;
    
    const card = new ItemCard(scene, x, y, width, height, theme);
    const item = new Item(itemType);
    const canAfford = shopSystem.canAffordItem(itemType);
    const canPurchase = canAfford && !alreadyPurchased;
    
    // Determine colors
    const bgColor = alreadyPurchased 
      ? theme.colors.soldBg 
      : (canPurchase ? theme.colors.purchasableBg : theme.colors.unpurchasableBg);
    const borderColor = alreadyPurchased 
      ? theme.colors.soldBorder 
      : (canPurchase ? theme.colors.itemBorder : 0x444444);
    
    // Create background
    const box = card.createBackground(bgColor, borderColor, canPurchase);
    
    if (canPurchase) {
      card.addHoverEffects(box, borderColor);
      card.addClickHandler(box, () => onPurchase(cardIndex, 'item', itemType));
    }
    
    // Type label
    card.addText(card.getCenterX(), 12, 'ITEM', {
      font: theme.fonts.cardLabel,
      fill: theme.colors.itemLabel,
      stroke: theme.stroke.cardLabel.color,
      strokeThickness: theme.stroke.cardLabel.thickness
    });
    
    // Item name
    const nameColor = alreadyPurchased ? theme.colors.nameDisabled : theme.colors.nameNormal;
    card.addText(card.getCenterX(), 32, itemType, {
      font: theme.fonts.cardNameItem,
      fill: nameColor,
      stroke: theme.stroke.cardName.color,
      strokeThickness: theme.stroke.cardName.thickness,
      wordWrap: { width: width - 20 },
      align: 'center'
    });
    
    // Bonuses
    let bonusY = 60;
    if (item.bonuses && item.bonuses.length > 0) {
      card.addText(card.getCenterX(), bonusY, 'BONUSES:', {
        font: theme.fonts.cardBonusLabel,
        fill: theme.colors.bonus
      });
      bonusY += 14;
      
      item.bonuses.forEach(bonus => {
        const value = bonus.isPercentage ? `+${bonus.value}%` : `+${bonus.value}`;
        const text = `${bonus.attribute}: ${value}`;
        card.addText(card.getCenterX(), bonusY, text, {
          font: theme.fonts.cardBonus,
          fill: alreadyPurchased ? theme.colors.statDisabled : theme.colors.bonus
        });
        bonusY += 12;
      });
    }
    
    // Penalties
    if (item.penalties && item.penalties.length > 0) {
      bonusY += 3;
      card.addText(card.getCenterX(), bonusY, 'PENALTIES:', {
        font: theme.fonts.cardBonusLabel,
        fill: theme.colors.penalty
      });
      bonusY += 14;
      
      item.penalties.forEach(penalty => {
        const value = penalty.isPercentage ? `-${penalty.value}%` : `-${penalty.value}`;
        const text = `${penalty.attribute}: ${value}`;
        card.addText(card.getCenterX(), bonusY, text, {
          font: theme.fonts.cardBonus,
          fill: alreadyPurchased ? theme.colors.statDisabled : theme.colors.penalty
        });
        bonusY += 12;
      });
    }
    
    // Cost
    const costColor = alreadyPurchased ? theme.colors.costDisabled : theme.colors.costNormal;
    card.addText(card.getCenterX(), height - 30, `${item.cost} GOLD`, {
      font: theme.fonts.cardCost,
      fill: costColor,
      stroke: theme.stroke.cardCost.color,
      strokeThickness: theme.stroke.cardCost.thickness
    });
    
    // Status text
    if (alreadyPurchased) {
      card.addText(card.getCenterX(), height - 12, 'SOLD', {
        font: theme.fonts.cardStatus,
        fill: theme.colors.costDisabled
      });
    } else if (!canAfford) {
      card.addText(card.getCenterX(), height - 12, 'NOT ENOUGH GOLD', {
        font: theme.fonts.cardStatusSmall,
        fill: theme.colors.error
      });
    }
    
    return card;
  }
}
