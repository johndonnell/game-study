/**
 * Character type definitions
 * Defines the three playable character types with their base stats
 */

export const CHARACTER_TYPES = {
  WARRIOR: {
    name: 'Warrior',
    baseStats: {
      strength: 10,
      speed: 5,
      defense: 8,
      vitality: 12
    },
    maxHealth: 120
  },
  ROGUE: {
    name: 'Rogue',
    baseStats: {
      strength: 7,
      speed: 12,
      defense: 4,
      vitality: 8
    },
    maxHealth: 80
  },
  MAGE: {
    name: 'Mage',
    baseStats: {
      strength: 12,
      speed: 6,
      defense: 3,
      vitality: 6
    },
    maxHealth: 60
  }
};
