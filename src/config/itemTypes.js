/**
 * Item type definitions
 * Defines all 10 item types with balanced trade-offs (bonuses and penalties)
 */

export const ITEM_TYPES = {
  BERSERKER_RING: {
    name: 'Berserker Ring',
    cost: 200,
    bonuses: [
      { attribute: 'strength', value: 30, isPercentage: true }
    ],
    penalties: [
      { attribute: 'defense', value: 20, isPercentage: true }
    ]
  },
  HEAVY_ARMOR: {
    name: 'Heavy Armor',
    cost: 250,
    bonuses: [
      { attribute: 'defense', value: 10, isPercentage: false }
    ],
    penalties: [
      { attribute: 'speed', value: 25, isPercentage: true }
    ]
  },
  SWIFT_BOOTS: {
    name: 'Swift Boots',
    cost: 180,
    bonuses: [
      { attribute: 'speed', value: 40, isPercentage: true }
    ],
    penalties: [
      { attribute: 'vitality', value: 15, isPercentage: true }
    ]
  },
  VITALITY_AMULET: {
    name: 'Vitality Amulet',
    cost: 220,
    bonuses: [
      { attribute: 'vitality', value: 8, isPercentage: false }
    ],
    penalties: [
      { attribute: 'strength', value: 10, isPercentage: true }
    ]
  },
  GLASS_CANNON_CHARM: {
    name: 'Glass Cannon Charm',
    cost: 300,
    bonuses: [
      { attribute: 'strength', value: 50, isPercentage: true },
      { attribute: 'speed', value: 20, isPercentage: true }
    ],
    penalties: [
      { attribute: 'defense', value: 40, isPercentage: true },
      { attribute: 'vitality', value: 30, isPercentage: true }
    ]
  },
  BALANCED_PENDANT: {
    name: 'Balanced Pendant',
    cost: 150,
    bonuses: [
      { attribute: 'strength', value: 3, isPercentage: false },
      { attribute: 'defense', value: 3, isPercentage: false },
      { attribute: 'speed', value: 3, isPercentage: false }
    ],
    penalties: []
  },
  TANK_SHIELD: {
    name: 'Tank Shield',
    cost: 280,
    bonuses: [
      { attribute: 'defense', value: 15, isPercentage: false },
      { attribute: 'vitality', value: 25, isPercentage: true }
    ],
    penalties: [
      { attribute: 'speed', value: 35, isPercentage: true },
      { attribute: 'strength', value: 5, isPercentage: false }
    ]
  },
  ASSASSIN_CLOAK: {
    name: 'Assassin Cloak',
    cost: 240,
    bonuses: [
      { attribute: 'speed', value: 35, isPercentage: true },
      { attribute: 'strength', value: 5, isPercentage: false }
    ],
    penalties: [
      { attribute: 'defense', value: 6, isPercentage: false }
    ]
  },
  WARRIOR_GAUNTLETS: {
    name: 'Warrior Gauntlets',
    cost: 190,
    bonuses: [
      { attribute: 'strength', value: 7, isPercentage: false }
    ],
    penalties: [
      { attribute: 'speed', value: 10, isPercentage: true }
    ]
  },
  CURSED_CROWN: {
    name: 'Cursed Crown',
    cost: 350,
    bonuses: [
      { attribute: 'strength', value: 60, isPercentage: true },
      { attribute: 'vitality', value: 10, isPercentage: false }
    ],
    penalties: [
      { attribute: 'defense', value: 50, isPercentage: true },
      { attribute: 'speed', value: 20, isPercentage: true }
    ]
  },
  PRECISION_GLOVES: {
    name: 'Precision Gloves',
    cost: 210,
    bonuses: [
      { attribute: 'dexterity', value: 35, isPercentage: true }
    ],
    penalties: [
      { attribute: 'strength', value: 15, isPercentage: true }
    ]
  },
  QUICKDRAW_BELT: {
    name: 'Quickdraw Belt',
    cost: 260,
    bonuses: [
      { attribute: 'dexterity', value: 8, isPercentage: false },
      { attribute: 'speed', value: 15, isPercentage: true }
    ],
    penalties: [
      { attribute: 'defense', value: 5, isPercentage: false }
    ]
  },
  MARKSMAN_SCOPE: {
    name: 'Marksman Scope',
    cost: 230,
    bonuses: [
      { attribute: 'dexterity', value: 6, isPercentage: false }
    ],
    penalties: [
      { attribute: 'vitality', value: 10, isPercentage: true }
    ]
  }
};
