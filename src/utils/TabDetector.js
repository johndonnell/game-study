/**
 * TabDetector
 * Detects if multiple instances of the game are running
 */
export default class TabDetector {
  /**
   * Check if multiple tabs are running the game
   * @returns {boolean} True if multiple tabs detected
   */
  static hasMultipleTabs() {
    try {
      // Use localStorage to track active tabs
      const tabId = Date.now() + Math.random();
      const storageKey = 'game_active_tabs';
      
      // Get existing tabs
      const existingTabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Clean up old tabs (older than 5 seconds)
      const now = Date.now();
      const activeTabs = existingTabs.filter(tab => now - tab.timestamp < 5000);
      
      // Add this tab
      activeTabs.push({ id: tabId, timestamp: now });
      localStorage.setItem(storageKey, JSON.stringify(activeTabs));
      
      // Store this tab's ID for cleanup
      window.gameTabId = tabId;
      
      // Set up heartbeat to keep this tab registered
      if (window.gameTabHeartbeat) {
        clearInterval(window.gameTabHeartbeat);
      }
      
      window.gameTabHeartbeat = setInterval(() => {
        try {
          const tabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const now = Date.now();
          const updated = tabs.filter(tab => now - tab.timestamp < 5000);
          
          // Update this tab's timestamp
          const thisTab = updated.find(t => t.id === tabId);
          if (thisTab) {
            thisTab.timestamp = now;
          } else {
            updated.push({ id: tabId, timestamp: now });
          }
          
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('Tab heartbeat error:', e);
        }
      }, 2000);
      
      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        try {
          const tabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const filtered = tabs.filter(tab => tab.id !== tabId);
          localStorage.setItem(storageKey, JSON.stringify(filtered));
          
          if (window.gameTabHeartbeat) {
            clearInterval(window.gameTabHeartbeat);
          }
        } catch (e) {
          console.warn('Tab cleanup error:', e);
        }
      });
      
      // Return true if more than 1 tab
      return activeTabs.length > 1;
      
    } catch (e) {
      console.warn('Tab detection error:', e);
      return false;
    }
  }
  
  /**
   * Get count of active tabs
   * @returns {number} Number of active tabs
   */
  static getTabCount() {
    try {
      const storageKey = 'game_active_tabs';
      const tabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const now = Date.now();
      const activeTabs = tabs.filter(tab => now - tab.timestamp < 5000);
      return activeTabs.length;
    } catch (e) {
      return 1;
    }
  }
  
  /**
   * Show warning if multiple tabs detected
   * @param {Phaser.Scene} scene - Scene to show warning in
   */
  static showMultipleTabWarning(scene) {
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
    
    // Create warning overlay
    const overlay = scene.add.rectangle(width / 2, 50, width - 40, 80, 0xff6600, 0.9);
    overlay.setScrollFactor(0);
    overlay.setDepth(10000);
    
    const warningText = scene.add.text(width / 2, 50, 
      `⚠️ WARNING: ${this.getTabCount()} tabs detected!\nClose other tabs for better performance (60 FPS)`,
      {
        font: '16px monospace',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 60 }
      }
    );
    warningText.setOrigin(0.5);
    warningText.setScrollFactor(0);
    warningText.setDepth(10001);
    
    // Auto-hide after 5 seconds
    scene.time.delayedCall(5000, () => {
      overlay.destroy();
      warningText.destroy();
    });
  }
}
