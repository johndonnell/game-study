import ArenaBackground from './ArenaBackground.js';
import CaveBackground from './CaveBackground.js';
import HellBackground from './HellBackground.js';
import CastleBackground from './CastleBackground.js';

/**
 * BackgroundManager
 * Manages battle arena backgrounds based on round progression
 */
export default class BackgroundManager {
  /**
   * Determine background type based on round number
   * @param {number} roundNumber - Current round number
   * @returns {string} Background type ('arena', 'cave', 'hell', 'castle')
   */
  static determineBackgroundType(roundNumber) {
    if (roundNumber <= 5) {
      return 'arena'; // Early rounds: basic arena
    } else if (roundNumber <= 10) {
      return 'cave'; // Rounds 6-10: trolls appear, cave environment
    } else if (roundNumber <= 15) {
      return 'hell'; // Rounds 11-15: demons appear, hellish environment
    } else {
      return 'castle'; // Rounds 16-20: dragons appear, castle environment
    }
  }

  /**
   * Render background based on type
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {number} width - Screen width
   * @param {number} height - Screen height
   * @param {string} backgroundType - Type of background to render
   */
  static renderBackground(scene, width, height, backgroundType = 'arena') {
    const graphics = scene.add.graphics();
    
    switch (backgroundType) {
      case 'cave':
        CaveBackground.render(graphics, width, height);
        break;
      case 'hell':
        HellBackground.render(graphics, width, height);
        break;
      case 'castle':
        CastleBackground.render(graphics, width, height);
        break;
      default:
        ArenaBackground.render(graphics, width, height);
    }
    
    // Send background to back
    graphics.setDepth(-1);
    
    return graphics;
  }
}
