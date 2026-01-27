/**
 * Stats Scene Theme Configuration
 * Centralized styling for the stat allocation screen
 */
export const STATS_SCENE_THEME = {
  colors: {
    // Background
    background: 0x1a1a2e,
    
    // Title
    titleBg: 0x16213e,
    titleBorder: 0x0f3460,
    title: '#e94560',
    titleStroke: '#000000',
    
    // Points display
    pointsBg: 0x0f3460,
    pointsBorder: 0xe94560,
    pointsText: '#ffff00',
    pointsStroke: '#000000',
    
    // Headers
    headerText: '#888888',
    
    // Row backgrounds (alternating)
    rowBgEven: 0x16213e,
    rowBgOdd: 0x0f3460,
    rowBgAlpha: 0.5,
    rowBorder: 0x0f3460,
    
    // Stat-specific colors
    strength: '#ff6b6b',
    speed: '#4ecdc4',
    defense: '#95e1d3',
    vitality: '#f38181',
    dexterity: '#aa96da',
    
    // Value colors
    baseValue: '#cccccc',
    allocatedPoints: '#888888',
    allocatedValue: '#00ff00',
    itemBonusPositive: '#00ffff',
    itemBonusNegative: '#ff00ff',
    totalValue: '#ffffff',
    noValue: '#444444',
    
    // Button colors
    plusBg: 0x00aa00,
    plusBgHover: 0x00ff00,
    plusBorder: 0x00ff00,
    plusText: '#ffffff',
    plusTextStroke: '#000000',
    
    minusBg: 0xaa0000,
    minusBgHover: 0xff0000,
    minusBorder: 0xff0000,
    minusText: '#ffffff',
    minusTextStroke: '#000000',
    
    // Continue button
    continueBg: 0xe94560,
    continueBgHover: 0xff6b6b,
    continueBorder: 0xff6b6b,
    continueText: '#ffffff',
    continueTextStroke: '#000000',
    
    // Legend
    legend: '#888888',
  },
  
  fonts: {
    title: 'bold 28px monospace',
    points: 'bold 24px monospace',
    header: 'bold 16px monospace',
    statName: 'bold 18px monospace',
    baseValue: 'bold 20px monospace',
    allocatedPoints: '14px monospace',
    allocatedValue: 'bold 16px monospace',
    itemBonus: 'bold 18px monospace',
    totalValue: 'bold 22px monospace',
    noValue: '20px monospace',
    button: 'bold 32px monospace',
    continueButton: 'bold 24px monospace',
    legend: '14px monospace',
  },
  
  stroke: {
    title: {
      color: '#000000',
      thickness: 4,
    },
    points: {
      color: '#000000',
      thickness: 3,
    },
    statName: {
      color: '#000000',
      thickness: 2,
    },
    itemBonus: {
      color: '#000000',
      thickness: 2,
    },
    totalValue: {
      color: '#000000',
      thickness: 3,
    },
    button: {
      color: '#000000',
      thickness: 2,
    },
    continueButton: {
      color: '#000000',
      thickness: 4,
    },
  },
  
  layout: {
    // Title
    titleY: 40,
    titleWidth: 500,
    titleHeight: 60,
    titleBorderWidth: 3,
    
    // Points display
    pointsY: 100,
    pointsWidth: 400,
    pointsHeight: 50,
    pointsBorderWidth: 2,
    
    // Column positions (relative to left edge)
    leftX: 120,
    baseX: 150,      // offset from leftX
    pointsX: 250,    // offset from leftX
    itemsX: 350,     // offset from leftX
    totalX: 450,     // offset from leftX
    plusBtnX: 570,   // offset from leftX
    minusBtnX: 640,  // offset from leftX
    
    // Row layout
    headerY: 160,
    startY: 200,
    rowHeight: 70,
    rowPadding: 10,
    
    // Button dimensions
    buttonSize: 50,
    buttonBorderWidth: 2,
    
    // Continue button
    continueY: -60,  // offset from bottom
    continueWidth: 300,
    continueHeight: 60,
    continueBorderWidth: 3,
    
    // Legend
    legendOffset: 20,
  },
  
  stats: [
    { key: 'strength', name: 'STRENGTH', icon: '💪' },
    { key: 'speed', name: 'SPEED', icon: '⚡' },
    { key: 'defense', name: 'DEFENSE', icon: '🛡️' },
    { key: 'vitality', name: 'VITALITY', icon: '❤️' },
    { key: 'dexterity', name: 'DEXTERITY', icon: '🎯' }
  ],
  
  animation: {
    buttonHover: {
      scale: 1.1,
    },
    continueHover: {
      scale: 1.05,
    },
  },
  
  multiplier: {
    statPoints: 0.25,  // Each stat point = 0.25 attribute value
  },
};
