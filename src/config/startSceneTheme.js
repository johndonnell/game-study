/**
 * Start Scene Theme Configuration
 * Centralized styling for the start/title screen
 */
export const START_SCENE_THEME = {
  colors: {
    // Background gradient
    backgroundTop: 0x1a0033,
    backgroundBottom: 0x4a0080,
    
    // Title colors
    titlePrimary: '#ff0000',
    titleStroke: '#ffff00',
    titleShadow: '#000000',
    titleAnimatedColors: ['#ff0000', '#ff4500', '#ff8c00', '#ffd700', '#ff4500'],
    
    // Subtitle
    subtitle: '#00ffff',
    subtitleStroke: '#0088ff',
    
    // Button colors
    buttonBg: 0xff6600,
    buttonBgHover: 0xff8800,
    buttonGlow: 0xff4500,
    buttonText: '#ffffff',
    buttonTextStroke: '#000000',
    
    // Instructions and features
    instructions: '#ffff00',
    instructionsStroke: '#000000',
    featureText: '#00ff00',
    featureTextStroke: '#004400',
    
    // Particles
    particleColors: [0xffff00, 0xff8800],
    
    // Decorative swords
    swordBlade: 0xcccccc,
    swordHandle: 0xffd700,
    swordPommel: 0xff0000,
  },
  
  fonts: {
    title: 'bold 64px monospace',
    subtitle: 'bold 28px monospace',
    button: 'bold 28px monospace',
    instructions: 'bold 16px monospace',
    features: 'bold 14px monospace',
  },
  
  stroke: {
    title: {
      color: '#ffff00',
      thickness: 4,
    },
    subtitle: {
      color: '#0088ff',
      thickness: 2,
    },
    button: {
      color: '#000000',
      thickness: 3,
    },
    instructions: {
      color: '#000000',
      thickness: 2,
    },
    features: {
      color: '#004400',
      thickness: 2,
    },
  },
  
  layout: {
    titleY: -100,
    subtitleY: -20,
    buttonY: 100,
    buttonWidth: 300,
    buttonHeight: 60,
    buttonGlowWidth: 320,
    buttonGlowHeight: 70,
    instructionsY: -80,
    featuresY: -40,
    featureSpacing: 200,
    swordOffsetX: 250,
  },
  
  animation: {
    titlePulse: {
      scale: 1.05,
      duration: 1000,
    },
    titleColorShift: {
      delay: 100,
    },
    subtitlePulse: {
      alpha: 0.7,
      duration: 1500,
    },
    buttonGlow: {
      scale: 1.1,
      alpha: 0.5,
      duration: 800,
    },
    buttonHover: {
      scale: 1.05,
      duration: 100,
    },
    featureBounce: {
      offset: 5,
      duration: 1000,
      stagger: 300,
    },
    particleTwinkle: {
      alphaMin: 0.2,
      alphaMax: 0.6,
      durationMin: 1000,
      durationMax: 2000,
    },
    particleDrift: {
      driftRange: 20,
      durationMin: 3000,
      durationMax: 5000,
    },
    swordGlow: {
      alpha: 0.7,
      duration: 1500,
    },
  },
  
  particles: {
    count: 30,
    sizeMin: 1,
    sizeMax: 3,
    alpha: 0.6,
  },
  
  effects: {
    flashDuration: 200,
    flashColor: [255, 255, 255],
  },
};
