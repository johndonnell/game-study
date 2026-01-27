/**
 * Shop Theme Configuration
 * Centralized styling for the shop scene
 */
export const SHOP_THEME = {
  colors: {
    // Background colors
    background: 0x1a1a2e,
    titleBg: 0x16213e,
    titleBorder: 0x0f3460,
    titleText: '#e94560',
    currencyBg: 0x0f3460,
    currencyBorder: 0xffff00,
    currencyText: '#ffff00',
    instructionText: '#cccccc',
    
    // Card colors
    weaponBorder: 0xff8800,
    weaponLabel: '#ff8800',
    itemBorder: 0x00ffff,
    itemLabel: '#00ffff',
    purchasableBg: 0x16213e,
    unpurchasableBg: 0x0f3460,
    soldBg: 0x1a1a1a,
    soldBorder: 0x333333,
    hoverBorder: 0x00ff00,
    
    // Text colors
    nameNormal: '#ffffff',
    nameDisabled: '#444444',
    statNormal: '#cccccc',
    statDisabled: '#444444',
    costNormal: '#ffff00',
    costDisabled: '#666666',
    
    // Status colors
    bonus: '#00ff00',
    penalty: '#ff0000',
    error: '#ff0000',
    rangedIndicator: '#00ffff',
    meleeIndicator: '#ff8800',
    
    // Button colors
    refreshBg: 0x0f3460,
    refreshBgHover: 0x16213e,
    refreshBorder: 0xffff00,
    refreshText: '#ffff00',
    continueBg: 0xe94560,
    continueBgHover: 0xff6b6b,
    continueBorder: 0xff6b6b,
    continueText: '#ffffff',
  },
  
  fonts: {
    title: 'bold 32px monospace',
    currency: 'bold 24px monospace',
    instruction: '16px monospace',
    cardLabel: 'bold 10px monospace',
    cardName: 'bold 13px monospace',
    cardNameItem: 'bold 12px monospace',
    cardStat: '12px monospace',
    cardBonus: '9px monospace',
    cardBonusLabel: 'bold 9px monospace',
    cardCost: 'bold 16px monospace',
    cardStatus: 'bold 12px monospace',
    cardStatusSmall: 'bold 9px monospace',
    cardIndicator: 'bold 10px monospace',
    refreshButton: 'bold 18px monospace',
    continueButton: 'bold 22px monospace',
  },
  
  layout: {
    cardWidth: 180,
    cardHeight: 200,
    cardPadding: 15,
    refreshCost: 50,
    maxWeapons: 6,
  },
  
  stroke: {
    title: {
      color: '#000000',
      thickness: 4,
    },
    currency: {
      color: '#000000',
      thickness: 3,
    },
    cardLabel: {
      color: '#000000',
      thickness: 2,
    },
    cardName: {
      color: '#000000',
      thickness: 2,
    },
    cardCost: {
      color: '#000000',
      thickness: 3,
    },
    button: {
      color: '#000000',
      thickness: 3,
    },
    continueButton: {
      color: '#000000',
      thickness: 4,
    },
  },
  
  hover: {
    scale: 1.05,
    cardScale: 1.02,
    borderWidth: 4,
  },
};
