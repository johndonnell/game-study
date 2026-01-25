import Phaser from 'phaser';

/**
 * StartScene
 * Initial start screen that enables audio context after user interaction
 */
export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create dramatic background gradient
    const background = this.add.graphics();
    background.fillGradientStyle(0x1a0033, 0x1a0033, 0x4a0080, 0x4a0080, 1);
    background.fillRect(0, 0, width, height);

    // Add animated particles/stars in background
    this.createBackgroundParticles();

    // Create glowing title with shadow effect
    const titleShadow = this.add.text(width / 2 + 4, height / 2 - 96, 'MONSTER SMASH', {
      font: 'bold 64px monospace',
      fill: '#000000'
    }).setOrigin(0.5);
    titleShadow.setAlpha(0.5);

    const title = this.add.text(width / 2, height / 2 - 100, 'MONSTER SMASH', {
      font: 'bold 64px monospace',
      fill: '#ff0000',
      stroke: '#ffff00',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Add pulsing glow effect to title
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Animated color shift for title
    this.time.addEvent({
      delay: 100,
      callback: () => {
        const colors = ['#ff0000', '#ff4500', '#ff8c00', '#ffd700', '#ff4500'];
        const currentColor = colors[Math.floor(Date.now() / 200) % colors.length];
        title.setFill(currentColor);
      },
      loop: true
    });

    // Subtitle with glow
    const subtitle = this.add.text(width / 2, height / 2 - 20, 'Survive 20 Rounds of Chaos', {
      font: 'bold 28px monospace',
      fill: '#00ffff',
      stroke: '#0088ff',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Pulsing subtitle
    this.tweens.add({
      targets: subtitle,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Decorative elements - swords crossed
    this.createDecorativeSwords(width / 2 - 250, height / 2 - 100);
    this.createDecorativeSwords(width / 2 + 250, height / 2 - 100, true);

    // Click to start button with glow
    const buttonGlow = this.add.rectangle(width / 2, height / 2 + 100, 320, 70, 0xff4500);
    buttonGlow.setAlpha(0.3);
    
    this.tweens.add({
      targets: buttonGlow,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const startButton = this.add.rectangle(width / 2, height / 2 + 100, 300, 60, 0xff6600);
    startButton.setInteractive({ useHandCursor: true });

    const startText = this.add.text(width / 2, height / 2 + 100, 'START GAME', {
      font: 'bold 28px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Hover effects with color change
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0xff8800);
      startText.setScale(1.1);
      this.tweens.add({
        targets: startButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0xff6600);
      startText.setScale(1);
      this.tweens.add({
        targets: startButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // Start game on click - this user interaction enables audio
    startButton.on('pointerdown', () => {
      // Flash effect
      this.cameras.main.flash(200, 255, 255, 255);
      
      // Resume audio context if needed
      if (this.sound.context && this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      
      // Go to character selection
      this.time.delayedCall(200, () => {
        this.scene.start('CharacterSelectScene');
      });
    });

    // Instructions with better styling
    const instructions = this.add.text(width / 2, height - 80, 'WASD or Arrow Keys to Move | Space to Pause', {
      font: 'bold 16px monospace',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Feature highlights
    const features = [
      '⚔️ 20 Unique Weapons',
      '👹 5 Enemy Types',
      '🎯 Epic Boss Battles'
    ];

    features.forEach((feature, index) => {
      const featureText = this.add.text(
        width / 2 + (index - 1) * 200,
        height - 40,
        feature,
        {
          font: 'bold 14px monospace',
          fill: '#00ff00',
          stroke: '#004400',
          strokeThickness: 2
        }
      ).setOrigin(0.5);

      // Stagger the pulse animation
      this.tweens.add({
        targets: featureText,
        y: height - 35,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: index * 300,
        ease: 'Sine.easeInOut'
      });
    });
  }

  /**
   * Create animated background particles
   */
  createBackgroundParticles() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create multiple particle layers for depth
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(1, 3);
      const color = Phaser.Math.Between(0, 1) > 0.5 ? 0xffff00 : 0xff8800;

      const particle = this.add.circle(x, y, size, color, 0.6);

      // Twinkling effect
      this.tweens.add({
        targets: particle,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Slow drift
      this.tweens.add({
        targets: particle,
        y: y + Phaser.Math.Between(-20, 20),
        x: x + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create decorative crossed swords
   */
  createDecorativeSwords(x, y, flip = false) {
    const graphics = this.add.graphics();
    
    // Sword blade (silver)
    graphics.fillStyle(0xcccccc, 1);
    graphics.fillRect(x - 2, y - 40, 4, 60);
    graphics.fillTriangle(x - 2, y - 40, x + 2, y - 40, x, y - 50);
    
    // Sword handle (gold)
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(x - 3, y + 20, 6, 15);
    
    // Crossguard (gold)
    graphics.fillRect(x - 12, y + 18, 24, 4);
    
    // Pommel (red gem)
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(x, y + 38, 4);

    if (flip) {
      graphics.scaleX = -1;
    }

    // Rotate for crossed effect
    graphics.rotation = flip ? -0.3 : 0.3;

    // Add glow
    this.tweens.add({
      targets: graphics,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
