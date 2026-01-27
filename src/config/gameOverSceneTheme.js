/**
 * Game Over Scene Theme Configuration
 * Centralized styling for the game over screen
 * Matches the professional design of other scenes
 */
export const GAME_OVER_SCENE_THEME = {
  colors: {
    // Background - brighter to match other scenes
    background: 0x1a1a2e,
    backgroundGradientTop: 0x2a1a2e,
    backgroundGradientBottom: 0x3a2a3e,
    
    // Title box
    titleBg: 0x16213e,
    titleBorder: 0xe94560,
    title: '#ff6b6b',
    titleStroke: '#000000',
    titleShadow: '#8b0000',
    
    // Skull decoration
    skullColor: 0xff6b6b,
    skullEyeGlow: 0xff0000,
    
    // Info box - brighter
    infoBg: 0x16213e,
    infoBorder: 0xe94560,
    
    // Text - brighter colors
    roundLabel: '#ffffff',
    roundValue: '#ff6b6b',
    messageText: '#ffffff',
    messageTextStroke: '#000000',
    
    // Stats display - brighter
    statsLabel: '#cccccc',
    statsValue: '#ffff00',
    characterValue: '#00ffff',
    weaponsValue: '#ff8800',
    itemsValue: '#00ff88',
    
    // Buttons
    restartBg: 0xe94560,
    restartBgHover: 0xff6b6b,
    restartBorder: 0xff6b6b,
    restartText: '#ffffff',
    restartTextStroke: '#000000',
    
    menuBg: 0x0f3460,
    menuBgHover: 0x16213e,
    menuBorder: 0x4488ff,
    menuText: '#ffffff',
    menuTextStroke: '#000000',
  },
  
  fonts: {
    title: 'bold 56px monospace',
    roundLabel: '18px monospace',
    roundValue: 'bold 48px monospace',
    message: 'bold 24px monospace',
    statsLabel: '16px monospace',
    statsValue: 'bold 20px monospace',
    button: 'bold 24px monospace',
  },
  
  stroke: {
    title: {
      color: '#000000',
      thickness: 5,
    },
    message: {
      color: '#000000',
      thickness: 3,
    },
    roundValue: {
      color: '#000000',
      thickness: 4,
    },
    button: {
      color: '#000000',
      thickness: 3,
    },
  },
  
  layout: {
    // Title box
    titleY: 50,
    titleBoxWidth: 500,
    titleBoxHeight: 80,
    titleBorderWidth: 3,
    
    // Skull decorations
    skullLeftX: -280,
    skullRightX: 280,
    skullY: 50,
    skullSize: 30,
    
    // Info box - contains round info and message
    infoBoxY: 200,
    infoBoxWidth: 600,
    infoBoxHeight: 180,
    infoBorderWidth: 3,
    
    // Round display - inside info box
    roundLabelY: 150,
    roundValueY: 190,
    
    // Message - inside info box
    messageY: 250,
    
    // Stats - aligned with left edge of info box (600px wide = ±300 from center)
    statsStartY: 340,
    statsSpacing: 35,
    statsLeftX: -280,  // Left edge of info box + 20px padding
    statsRightX: 20,   // Right side, 20px padding from center
    
    // Buttons - at bottom
    buttonY: 470,
    restartButtonX: -120,
    menuButtonX: 120,
    buttonWidth: 220,
    buttonHeight: 60,
    buttonBorderWidth: 3,
  },
  
  animation: {
    titlePulse: {
      scale: 1.03,
      duration: 1500,
    },
    skullGlow: {
      alpha: 0.5,
      duration: 1000,
    },
    buttonHover: {
      scale: 1.05,
      duration: 150,
    },
    fadeIn: {
      duration: 800,
      delay: 200,
    },
    roundValuePulse: {
      scale: 1.05,
      duration: 1200,
    },
  },
  
  effects: {
    vignette: {
      enabled: false,  // Disabled to keep screen brighter
      color: 0x000000,
      alpha: 0.2,
    },
    screenShake: {
      duration: 300,
      intensity: 0.01,
    },
  },
};
