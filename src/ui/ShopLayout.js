/**
 * ShopLayout
 * Calculates positions for shop UI elements
 */
export default class ShopLayout {
  /**
   * Calculate card positions for 2x2 grid
   * @param {number} centerX - Center X of screen
   * @param {number} startY - Starting Y position for grid
   * @param {number} cardWidth - Width of each card
   * @param {number} cardHeight - Height of each card
   * @param {number} padding - Padding between cards
   * @returns {Array} Array of {x, y, column, row} positions for 4 cards
   */
  static calculateCardPositions(centerX, startY, cardWidth, cardHeight, padding) {
    const totalWidth = (cardWidth * 2) + padding;
    const startX = centerX - (totalWidth / 2);
    
    const positions = [];
    for (let i = 0; i < 4; i++) {
      const column = i % 2;
      const row = Math.floor(i / 2);
      positions.push({
        x: startX + (column * (cardWidth + padding)),
        y: startY + (row * (cardHeight + padding)),
        column,
        row
      });
    }
    
    return positions;
  }
  
  /**
   * Calculate grid dimensions
   * @param {number} cardWidth - Width of each card
   * @param {number} cardHeight - Height of each card
   * @param {number} padding - Padding between cards
   * @param {number} columns - Number of columns
   * @param {number} rows - Number of rows
   * @returns {Object} Object with {totalWidth, totalHeight}
   */
  static calculateGridDimensions(cardWidth, cardHeight, padding, columns = 2, rows = 2) {
    return {
      totalWidth: (cardWidth * columns) + (padding * (columns - 1)),
      totalHeight: (cardHeight * rows) + (padding * (rows - 1))
    };
  }
  
  /**
   * Calculate centered position for an element
   * @param {number} screenWidth - Width of screen
   * @param {number} screenHeight - Height of screen
   * @param {number} elementWidth - Width of element
   * @param {number} elementHeight - Height of element
   * @returns {Object} Object with {x, y} center position
   */
  static calculateCenterPosition(screenWidth, screenHeight, elementWidth, elementHeight) {
    return {
      x: screenWidth / 2,
      y: screenHeight / 2
    };
  }
}
