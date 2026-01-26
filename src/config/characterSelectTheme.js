/**
 * Character Select Scene Theme Configuration
 * Centralized styling for the character selection screen
 */
export const CHARACTER_SELECT_THEME = {
  colors: {
    // Background gradient
    backgroundTop: 0x0a0a2e,
    backgroundBottom: 0x16213e,
    
    // Title colors
    title: '#ffd700',
    titleStroke: '#ff8c00',
    titleShadow: '#000000',
    
    // Character box colors
    boxGradientTop: 0x1a1a3e,
    boxGradientBottom: 0x2a2a4e,
    boxGradientTopHover: 0x2a2a4e,
    boxGradientBottomHover: 0x3a3a5e,
    
    // Character-specific glow colors
    warriorGlow: 0xff4444,
    rogueGlow: 0x44ff44,
    mageGlow: 0x4444ff,
    
    // Text colors
    characterName: '#ffffff',
    characterNameStroke: '#000000',
    
    // Stat colors
    statHP: '#ff4444',
    statStrength: '#ff8844',
    statSpeed: '#44ff44',
    statDefense: '#4488ff',
    statDexterity: '#ffff44',
    statStroke: '#000000',
    
    // Instructions
    instructions: '#ffff00',
    instructionsStroke: '#000000',
  },
  
  fonts: {
    title: 'bold 48px monospace',
    characterName: 'bold 24px monospace',
    stats: 'bold 14px monospace',
    instructions: 'bold 18px monospace',
  },
  
  stroke: {
    title: {
      color: '#ff8c00',
      thickness: 3,
    },
    characterName: {
      color: '#000000',
      thickness: 3,
    },
    stats: {
      color: '#000000',
      thickness: 2,
    },
    instructions: {
      color: '#000000',
      thickness: 2,
    },
  },
  
  layout: {
    titleY: 50,
    titleShadowOffset: 3,
    
    // Character box dimensions
    boxWidth: 300,
    boxHeight: 440,
    boxRadius: 10,
    boxBorderWidth: 3,
    boxBorderWidthHover: 4,
    
    // Character positions (fractions of screen width)
    warriorX: 0.25,
    rogueX: 0.5,
    mageX: 0.75,
    characterY: 0.5,
    characterYOffset: 20,
    
    // Sprite positioning
    spriteY: -60,
    spriteYHover: -80,
    spriteScale: 2.5,
    
    // Text positioning within box
    nameY: -180,
    statsStartY: 90,
    statsSpacing: 26,
    statsX: -120,
    
    // Glow circle
    glowRadius: 160,
    glowAlpha: 0.2,
    glowAlphaHover: 0.4,
    
    // Instructions
    instructionsY: -40,
    
    // Hit area
    hitAreaWidth: 320,
    hitAreaHeight: 460,
  },
  
  animation: {
    titlePulse: {
      scale: 1.03,
      duration: 1500,
    },
    instructionsPulse: {
      alpha: 0.6,
      duration: 1000,
    },
    glowHover: {
      scale: 1.2,
      duration: 300,
    },
    spriteJump: {
      duration: 400,
    },
    nameScale: {
      scale: 1.1,
      duration: 200,
    },
    selectFlash: {
      duration: 300,
      color: [255, 255, 255],
    },
    selectScale: {
      scale: 1.1,
      duration: 150,
    },
    idleAnimation: {
      updateDelay: 50,
    },
  },
  
  music: {
    key: 'character-select-music',
    volume: 0.5,
    loop: true,
  },
};
