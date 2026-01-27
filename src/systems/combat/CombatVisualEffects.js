/**
 * CombatVisualEffects
 * Handles all combat visual feedback (damage numbers, flashes, screen shake)
 */
export default class CombatVisualEffects {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Show damage number pop-up
   * @param {GameObject} target - Target that took damage
   * @param {number} amount - Damage amount
   */
  showDamageNumber(target, amount) {
    const damageText = this.scene.add.text(
      target.x,
      target.y - 20,
      Math.ceil(amount).toString(),
      {
        font: '16px monospace',
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    damageText.setOrigin(0.5);

    // Animate damage number
    this.scene.tweens.add({
      targets: damageText,
      y: target.y - 60,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        damageText.destroy();
      }
    });
  }

  /**
   * Flash enemy white when hit
   * @param {Enemy} enemy - Enemy to flash
   */
  flashEnemy(enemy) {
    // For containers, we need to tint the children (graphics)
    if (enemy.list && enemy.list.length > 0) {
      // Get the graphics object (first child)
      const graphics = enemy.list[0];
      
      // Store original alpha
      const originalAlpha = graphics.alpha;
      
      // Flash by changing alpha
      graphics.alpha = 0.5;
      
      // Restore original alpha after 100ms
      this.scene.time.delayedCall(100, () => {
        if (graphics && graphics.active) {
          graphics.alpha = originalAlpha;
        }
      });
    }
  }

  /**
   * Shake screen when player takes damage
   */
  shakeScreen() {
    this.scene.cameras.main.shake(100, 0.005);
  }

  /**
   * Create enemy death fade-out effect
   * @param {Enemy} enemy - Enemy that died
   */
  createDeathEffect(enemy) {
    // Fade out all children (Graphics objects) in the container
    const targets = enemy.list && enemy.list.length > 0 ? enemy.list : [enemy];
    
    this.scene.tweens.add({
      targets: targets,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        enemy.destroy();
      }
    });
  }
}
