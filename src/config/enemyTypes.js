/**
 * Enemy type definitions
 * Defines all 5 enemy types with their base stats
 */

export const ENEMY_TYPES = {
  GOBLIN: {
    name: 'Goblin',
    baseHealth: 20,
    baseDamage: 5,
    baseSpeed: 80,
    baseDefense: 2,
    scaleX: 1.2,
    scaleY: 1.0
  },
  ORC: {
    name: 'Orc',
    baseHealth: 40,
    baseDamage: 10,
    baseSpeed: 60,
    baseDefense: 5,
    scaleX: 1.8,
    scaleY: 1.5
  },
  TROLL: {
    name: 'Troll',
    baseHealth: 80,
    baseDamage: 15,
    baseSpeed: 40,
    baseDefense: 8,
    scaleX: 2.2,
    scaleY: 1.8
  },
  DEMON: {
    name: 'Demon',
    baseHealth: 60,
    baseDamage: 20,
    baseSpeed: 100,
    baseDefense: 4,
    scaleX: 2.5,
    scaleY: 2.0
  },
  DRAGON: {
    name: 'Dragon',
    baseHealth: 150,
    baseDamage: 30,
    baseSpeed: 70,
    baseDefense: 12,
    scaleX: 3.0,
    scaleY: 2.5
  }
};
