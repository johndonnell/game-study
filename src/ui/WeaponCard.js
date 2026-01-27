import ShopCard from './ShopCard.js';
import Weapon from '../entities/Weapon.js';

/**
 * WeaponCard
 * Renders a weapon card in the shop
 */
export default class WeaponCard extends ShopCard {
  /**
   * Render a weapon card
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Card width
   * @param {number} height - Card height
   * @param {string} weaponType - Weapon type identifier
   * @param {Object} options - Rendering options
   * @param {Object} theme - Theme configuration
   */
  static render(scene, x, y, width, height, weaponType, options, theme) {
    const {
      cardIndex,
      alreadyPurchased,
      weaponsFull,
      shopSystem,
      onPurchase
    } = options;
    
    const card = new WeaponCard(scene, x, y, width, height, theme);
    const weapon = new Weapon(weaponType);
    const canAfford = shopSystem.canAffordWeapon(weaponType);
    const canPurchase = canAfford && !alreadyPurchased && !weaponsFull;
    
    // Determine colors
    const bgColor = alreadyPurchased 
      ? theme.colors.soldBg 
      : (canPurchase ? theme.colors.purchasableBg : theme.colors.unpurchasableBg);
    const borderColor = alreadyPurchased 
      ? theme.colors.soldBorder 
      : (canPurchase ? theme.colors.weaponBorder : 0x444444);
    
    // Create background
    const box = card.createBackground(bgColor, borderColor, canPurchase);
    
    if (canPurchase) {
      card.addHoverEffects(box, borderColor);
      card.addClickHandler(box, () => onPurchase(cardIndex, 'weapon', weaponType));
    }
    
    // Type label
    card.addText(card.getCenterX(), 12, 'WEAPON', {
      font: theme.fonts.cardLabel,
      fill: theme.colors.weaponLabel,
      stroke: theme.stroke.cardLabel.color,
      strokeThickness: theme.stroke.cardLabel.thickness
    });
    
    // Weapon name
    const nameColor = alreadyPurchased ? theme.colors.nameDisabled : theme.colors.nameNormal;
    card.addText(card.getCenterX(), 32, weaponType, {
      font: theme.fonts.cardName,
      fill: nameColor,
      stroke: theme.stroke.cardName.color,
      strokeThickness: theme.stroke.cardName.thickness,
      wordWrap: { width: width - 20 }
    });
    
    // Stats
    const statColor = alreadyPurchased ? theme.colors.statDisabled : theme.colors.statNormal;
    card.addText(card.getCenterX(), 60, `Damage: ${weapon.baseDamage}`, {
      font: theme.fonts.cardStat,
      fill: statColor
    });
    
    card.addText(card.getCenterX(), 80, `Range: ${weapon.range}`, {
      font: theme.fonts.cardStat,
      fill: statColor
    });
    
    card.addText(card.getCenterX(), 100, `Speed: ${weapon.attackSpeed}/s`, {
      font: theme.fonts.cardStat,
      fill: statColor
    });
    
    // Range type indicator
    const isRanged = weapon.isRanged();
    card.addText(card.getCenterX(), 120, isRanged ? '🏹 RANGED' : '⚔️ MELEE', {
      font: theme.fonts.cardIndicator,
      fill: isRanged ? theme.colors.rangedIndicator : theme.colors.meleeIndicator
    });
    
    // Cost
    const costColor = alreadyPurchased 
      ? theme.colors.costDisabled 
      : (weaponsFull ? theme.colors.costDisabled : theme.colors.costNormal);
    card.addText(card.getCenterX(), height - 30, `${weapon.cost} GOLD`, {
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
    } else if (weaponsFull) {
      card.addText(card.getCenterX(), height - 12, 'INVENTORY FULL', {
        font: theme.fonts.cardStatusSmall,
        fill: theme.colors.error
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
