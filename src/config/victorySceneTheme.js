/**
 * Victory Scene Theme Configuration
 * Centralized styling for the victory screen
 */
export const VICTORY_SCENE_THEME = {
  colors: {
    // Background
    background: 0x0a1a0a,
    
    // Title
    title: '#00ff00',
    titleStroke: '#004400',
    titleShadow: '#006600',
    titleGlow: 0x00ff00,
    
    // Text
    congratsText: '#ffffff',
    congratsTextStroke: '#000000',
    statsLabel: '#cccccc',
    statsValue: '#ffff00',
    characterValue: '#00ffff',
    
    // Button
    restartBg: 0x00ff00,
    restartBgHover: 0x00cc00,
    restartBorder: 0x00ff00,
    restartText: '#000000',
    restartTextStroke: '#003300',
    
    // Particles/confetti
    confettiColors: [0xffd700, 0xff8c00, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff],
  },
  
  fonts: {
    title: 'bold 72px monospace',
    congratsText: 'bold 28px monospace',
    stats: '20px monospace',
    button: 'bold 28px monospace',
  },
  
  stroke: {
    title: {
      color: '#004400',
      thickness: 6,
    },
    congratsText: {
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
    titleY: -120,
    congratsY: -40,
    statsStartY: 20,
    statsSpacing: 30,
    buttonY: 120,
    buttonWidth: 250,
    buttonHeight: 60,
    buttonBorderWidth: 3,
  },
  
  animation: {
    titlePulse: {
      scale: 1.08,
      duration: 1000,
    },
    titleGlow: {
      alpha: 0.3,
      scale: 1.2,
      duration: 1500,
    },
    titleRainbow: {
      colors: ['#00ff00', '#00ff88', '#00ffff', '#0088ff', '#00ff00'],
      duration: 200,
    },
    buttonHover: {
      scale: 1.05,
      duration: 150,
    },
    fadeIn: {
      duration: 500,
    },
    confetti: {
      count: 50,
      gravity: 200,
      velocityMin: -300,
      velocityMax: -500,
      lifespan: 3000,
    },
  },
  
  effects: {
    glow: {
      color: 0x00ff00,
      alpha: 0.3,
      radius: 200,
    },
  },
};
