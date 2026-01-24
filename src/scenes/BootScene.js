import Phaser from 'phaser';

/**
 * BootScene
 * Initial loading and asset management
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    // Update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
    
    // Handle loading errors with fallback
    this.load.on('loaderror', (file) => {
      console.error('Error loading file:', file.key);
      // Continue anyway - game will use simple shapes instead of sprites
    });
    
    // Load assets (placeholder - actual assets would be loaded here)
    // For now, we'll use simple shapes and text
    // this.load.image('player', 'assets/sprites/player.png');
    // this.load.image('enemy', 'assets/sprites/enemy.png');
    
    // Load music files
    console.log('Loading audio file: assets/audio/nostalgia_-_glorytothemachine.mp3');
    this.load.audio('character-select-music', 'assets/audio/nostalgia_-_glorytothemachine.mp3');
    
    // Add load success/error handlers
    this.load.once('filecomplete-audio-character-select-music', () => {
      console.log('Audio file loaded successfully!');
    });
    
    // If no assets to load, ensure complete event fires
    if (this.load.totalToLoad === 0) {
      this.load.once('complete', () => {
        // Proceed to next scene
      });
      this.load.start();
    }
  }

  create() {
    // Transition to start screen (requires user interaction for audio)
    this.scene.start('StartScene');
  }
}
