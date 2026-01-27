/**
 * ShopCardGenerator
 * Handles generation of random shop card selections
 */
export default class ShopCardGenerator {
  /**
   * Generate 4 random shop cards (at least 2 weapons)
   * @param {Array} availableWeapons - Array of weapon objects with 'type' property
   * @param {Array} availableItems - Array of item objects with 'type' property
   * @returns {Array} Array of 4 card objects {type: 'weapon'|'item', data: weaponType|itemType}
   */
  static generateCards(availableWeapons, availableItems) {
    const cards = [];
    
    // Validation
    if (!availableWeapons || availableWeapons.length < 2) {
      console.error('ShopCardGenerator: Not enough weapons available (need at least 2)');
      return [];
    }
    
    // Shuffle arrays using Fisher-Yates algorithm
    const shuffledWeapons = this.shuffle([...availableWeapons]);
    const shuffledItems = this.shuffle([...availableItems]);
    
    // Add guaranteed 2 weapons
    cards.push({ type: 'weapon', data: shuffledWeapons[0].type });
    cards.push({ type: 'weapon', data: shuffledWeapons[1].type });
    
    // Build remaining pool from leftover weapons and all items
    const remaining = [
      ...shuffledWeapons.slice(2).map(w => ({ type: 'weapon', data: w.type })),
      ...shuffledItems.map(i => ({ type: 'item', data: i.type }))
    ];
    
    // Fill remaining 2 slots
    if (remaining.length < 2) {
      console.error('ShopCardGenerator: Not enough items/weapons for remaining slots');
      // Fill with what we have
      remaining.forEach(item => cards.push(item));
      // Fallback: add more weapons if needed to reach 4 cards
      for (let i = cards.length; i < 4 && i < shuffledWeapons.length; i++) {
        cards.push({ type: 'weapon', data: shuffledWeapons[i].type });
      }
    } else {
      const shuffledRemaining = this.shuffle(remaining);
      cards.push(shuffledRemaining[0]);
      cards.push(shuffledRemaining[1]);
    }
    
    // Final shuffle to randomize card positions
    return this.shuffle(cards);
  }
  
  /**
   * Shuffle array using Fisher-Yates algorithm
   * More reliable than Array.sort() with random comparator
   * @param {Array} array - Array to shuffle
   * @returns {Array} New shuffled array (does not modify original)
   */
  static shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
