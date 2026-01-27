/**
 * HUDManager
 * Manages all HUD elements (health bar, currency, enemy count, etc.)
 */
export default class HUDManager {
  constructor(scene, player, gameManager) {
    this.scene = scene;
    this.player = player;
    this.gameManager = gameManager;
    
    // Track last values to avoid unnecessary updates
    this.lastHealthText = '';
    this.lastCurrencyText = '';
    this.lastEnemyCount = -1;
    this.lastFps = 60;
    this.healthBarColor = 0x00ff00;
    this.fpsWarningShown = false;
    
    this.createHUD();
  }
  
  /**
   * Create all HUD elements
   */
  createHUD() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const playerData = this.gameManager.getPlayerData();

    // Health bar background
    this.healthBarBg = this.scene.add.rectangle(100, 20, 200, 20, 0x333333);
    this.healthBarBg.setOrigin(0, 0);

    // Health bar fill
    this.healthBar = this.scene.add.rectangle(100, 20, 200, 20, 0x00ff00);
    this.healthBar.setOrigin(0, 0);

    // Health text
    this.healthText = this.scene.add.text(10, 20, '', {
      font: '16px monospace',
      fill: '#ffffff'
    });

    // Round number
    this.roundText = this.scene.add.text(10, 50, `Round: ${this.scene.roundNumber}`, {
      font: '16px monospace',
      fill: '#ffffff'
    });

    // Currency
    this.currencyText = this.scene.add.text(10, 80, `Gold: ${playerData.currency || 0}`, {
      font: '16px monospace',
      fill: '#ffff00'
    });
    this.lastCurrencyText = `Gold: ${playerData.currency || 0}`;

    // Enemy count
    this.enemyCountText = this.scene.add.text(10, 110, '', {
      font: '16px monospace',
      fill: '#ff0000'
    });

    // FPS monitor
    this.fpsText = this.scene.add.text(width - 80, height - 30, 'FPS: 60', {
      font: '14px monospace',
      fill: '#ffffff'
    });
  }
  
  /**
   * Update all HUD elements
   * @param {RoundManager} roundManager - Round manager for enemy count
   */
  update(roundManager) {
    this.updateHealthBar();
    this.updateCurrency();
    this.updateEnemyCount(roundManager);
    this.updateFPS();
  }
  
  /**
   * Update health bar and text
   */
  updateHealthBar() {
    const healthPercent = this.player.health / this.player.maxHealth;
    this.healthBar.width = 200 * healthPercent;
    
    // Change color based on health (only when it changes)
    let newColor;
    if (healthPercent > 0.5) {
      newColor = 0x00ff00;
    } else if (healthPercent > 0.25) {
      newColor = 0xffff00;
    } else {
      newColor = 0xff0000;
    }
    
    if (this.healthBarColor !== newColor) {
      this.healthBar.setFillStyle(newColor);
      this.healthBarColor = newColor;
    }

    // Only update text if values changed
    const newHealthText = `HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`;
    if (this.lastHealthText !== newHealthText) {
      this.healthText.setText(newHealthText);
      this.lastHealthText = newHealthText;
    }
  }
  
  /**
   * Update currency display
   */
  updateCurrency() {
    const playerData = this.gameManager.getPlayerData();
    const newCurrencyText = `Gold: ${playerData.currency || 0}`;
    if (this.lastCurrencyText !== newCurrencyText) {
      this.currencyText.setText(newCurrencyText);
      this.lastCurrencyText = newCurrencyText;
    }
  }
  
  /**
   * Update enemy count display
   * @param {RoundManager} roundManager - Round manager
   */
  updateEnemyCount(roundManager) {
    const enemyCount = roundManager.getRemainingEnemyCount();
    if (this.lastEnemyCount !== enemyCount) {
      this.enemyCountText.setText(`Enemies: ${enemyCount}`);
      this.lastEnemyCount = enemyCount;
    }
  }
  
  /**
   * Update FPS display
   */
  updateFPS() {
    const fps = Math.round(this.scene.game.loop.actualFps);
    if (this.lastFps !== fps) {
      this.fpsText.setText(`FPS: ${fps}`);
      this.lastFps = fps;
      
      // Show warning if FPS drops below 30
      if (fps < 30 && !this.fpsWarningShown) {
        this.fpsText.setColor('#ff0000');
        this.fpsWarningShown = true;
      } else if (fps >= 30 && this.fpsWarningShown) {
        this.fpsText.setColor('#ffffff');
        this.fpsWarningShown = false;
      }
    }
  }
  
  /**
   * Reposition HUD elements (called on resize)
   * @param {number} width - New screen width
   * @param {number} height - New screen height
   */
  reposition(width, height) {
    if (this.fpsText) {
      this.fpsText.setPosition(width - 80, height - 30);
    }
  }
  
  /**
   * Destroy all HUD elements
   */
  destroy() {
    if (this.healthBarBg) this.healthBarBg.destroy();
    if (this.healthBar) this.healthBar.destroy();
    if (this.healthText) this.healthText.destroy();
    if (this.roundText) this.roundText.destroy();
    if (this.currencyText) this.currencyText.destroy();
    if (this.enemyCountText) this.enemyCountText.destroy();
    if (this.fpsText) this.fpsText.destroy();
  }
}
