/**
 * Game Over Scene Theme Configuration
 * Centralized styling for the game over screen
 */
export const GAME_OVER_SCENE_THEME = {
  colors: {
    // Background
    background: 0x1a0a0a,
    
    // Title
    title: '#ff0000',
    titleStroke: '#000000',
    titleShadow: '#660000',
    
    // Text
    roundText: '#ffffff',
    roundTextStroke: '#000000',
    statsLabel: '#cccccc',
    statsValue: '#ffff00',
    
    // Button
    restartBg: 0x00ff00,
    restartBgHover: 0x00cc00,
    restartBorder: 0x00ff00,
    restartText: '#000000',
    restartTextStroke: '#003300',
  },
  
  fonts: {
    title: 'bold 64px monospace',
    roundText: 'bold 28px monospace',
    stats: '20px monospace',
    button: 'bold 28px monospace',
  },
  
  stroke: {
    title: {
      color: '#000000',
      thickness: 6,
    },
    roundText: {
      color: '#000000',
      thickness: 3,
    },
    stats: {
      color: '#000000',
      thickness: 2,
    },
    button: {
      color: '#003300',
      thickness: 2,
    },
  },
  
  layout: {
    titleY: -100,
    roundTextY: -20,
    statsStartY: 40,
    statsSpacing: 35,
    buttonY: 120,
    buttonWidth: 250,
    buttonHeight: 60,
    buttonBorderWidth: 3,
  },
  
  animation: {
    titlePulse: {
      scale: 1.05,
      duration: 1000,
    },
    titleGlow: {
      alpha: 0.8,
      duration: 1500,
    },
    buttonHover: {
      scale: 1.05,
      duration: 150,
    },
    fadeIn: {
      duration: 500,
    },
  },
  
  effects: {
    vignette: {
      color: 0x000000,
      alpha: 0.6,
      radius: 0.7,
    },
  },
};
