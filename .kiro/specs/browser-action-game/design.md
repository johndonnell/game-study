# Design Document: Browser Action Game

## Overview

This browser-based action game is built using Phaser 3, a well-established and documented JavaScript game framework. The game features a top-down perspective where players control characters through 20 progressively difficult rounds, fighting enemies with up to 6 equipped weapons simultaneously.

The architecture follows a component-based design with clear separation between game state management, rendering, and game logic. The game runs entirely client-side in the browser with no backend requirements.

**Technology Stack:**
- **Phaser 3**: Primary game framework for rendering, physics, and game loop
- **JavaScript (ES6+)**: Core programming language
- **HTML5 Canvas**: Rendering target
- **CSS3**: UI styling for menus and overlays

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Manager                          │
│  (Orchestrates scenes, manages global state)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│ Character      │   │   Round         │   │  Progression   │
│ Selection      │   │   Manager       │   │  Manager       │
│ Scene          │   │                 │   │                │
└────────────────┘   └─────────────────┘   └────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  Combat        │   │   Enemy         │   │   Weapon       │
│  System        │   │   Spawner       │   │   System       │
└────────────────┘   └─────────────────┘   └────────────────┘
```

### Scene Architecture

The game uses Phaser's scene system to organize different game states:

1. **BootScene**: Initial loading and asset management
2. **CharacterSelectScene**: Character selection interface
3. **GameScene**: Main gameplay with combat and movement
4. **ShopScene**: Between-round shop for purchasing weapons
5. **StatsScene**: Stat point allocation interface
6. **GameOverScene**: Displayed on failure (restart from round 1)
7. **VictoryScene**: Displayed on completing round 20

## Components and Interfaces

### 1. Game Manager

Central orchestrator that manages scene transitions and global game state.

```javascript
class GameManager {
  constructor(phaserGame)
  
  // State management
  getCurrentRound(): number
  setCurrentRound(round: number): void
  resetGame(): void
  
  // Scene transitions
  startCharacterSelection(): void
  startRound(roundNumber: number): void
  showShop(): void
  showStatsAllocation(): void
  showGameOver(): void
  showVictory(): void
  
  // Global state access
  getPlayerData(): PlayerData
  savePlayerData(data: PlayerData): void
}
```

### 2. Player Character

Represents the player-controlled character with stats and equipped weapons.

```javascript
class PlayerCharacter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, characterType)
  
  // Properties
  characterType: string
  health: number
  maxHealth: number
  baseAttributes: {
    strength: number,
    speed: number,
    defense: number,
    vitality: number
  }
  currentAttributes: {
    strength: number,
    speed: number,
    defense: number,
    vitality: number
  }
  equippedWeapons: Weapon[]  // Max 6
  equippedItems: Item[]
  
  // Methods
  move(velocityX: number, velocityY: number): void
  takeDamage(amount: number): void
  heal(amount: number): void
  equipWeapon(weapon: Weapon): boolean
  unequipWeapon(weaponIndex: number): void
  getEquippedWeapons(): Weapon[]
  equipItem(item: Item): void
  unequipItem(itemIndex: number): void
  getEquippedItems(): Item[]
  isDead(): boolean
  
  // Stat management
  getAttribute(attributeName: string): number  // Returns current (modified) value
  getBaseAttribute(attributeName: string): number  // Returns base value
  increaseBaseAttribute(attributeName: string, amount: number): void
  recalculateAttributes(): void  // Recalculates current from base + items
}
```

### 3. Character Types

Three distinct character varieties with different base stats:

```javascript
const CHARACTER_TYPES = {
  WARRIOR: {
    name: "Warrior",
    baseStats: {
      strength: 10,
      speed: 5,
      defense: 8,
      vitality: 12
    },
    maxHealth: 120
  },
  ROGUE: {
    name: "Rogue",
    baseStats: {
      strength: 7,
      speed: 12,
      defense: 4,
      vitality: 8
    },
    maxHealth: 80
  },
  MAGE: {
    name: "Mage",
    baseStats: {
      strength: 12,
      speed: 6,
      defense: 3,
      vitality: 6
    },
    maxHealth: 60
  }
}
```

### 4. Weapon System

Weapons that can be equipped (up to 6 simultaneously) and used in combat.

```javascript
class Weapon {
  constructor(weaponType)
  
  // Properties
  type: string
  baseDamage: number
  attackSpeed: number
  range: number
  cost: number
  
  // Methods
  calculateDamage(characterAttributes: object): number
  canAttack(lastAttackTime: number): boolean
}

// Weapon types (20 total)
const WEAPON_TYPES = {
  SWORD: { baseDamage: 10, attackSpeed: 1.0, range: 50, cost: 100 },
  DAGGER: { baseDamage: 6, attackSpeed: 1.5, range: 30, cost: 80 },
  AXE: { baseDamage: 15, attackSpeed: 0.7, range: 45, cost: 150 },
  SPEAR: { baseDamage: 12, attackSpeed: 0.9, range: 80, cost: 120 },
  BOW: { baseDamage: 8, attackSpeed: 1.2, range: 200, cost: 140 },
  CROSSBOW: { baseDamage: 14, attackSpeed: 0.6, range: 250, cost: 180 },
  STAFF: { baseDamage: 11, attackSpeed: 0.8, range: 100, cost: 130 },
  WAND: { baseDamage: 7, attackSpeed: 1.4, range: 150, cost: 110 },
  HAMMER: { baseDamage: 18, attackSpeed: 0.5, range: 40, cost: 160 },
  MACE: { baseDamage: 13, attackSpeed: 0.8, range: 45, cost: 125 },
  FLAIL: { baseDamage: 14, attackSpeed: 0.7, range: 60, cost: 135 },
  WHIP: { baseDamage: 9, attackSpeed: 1.1, range: 90, cost: 115 },
  KATANA: { baseDamage: 11, attackSpeed: 1.3, range: 55, cost: 145 },
  RAPIER: { baseDamage: 8, attackSpeed: 1.4, range: 50, cost: 105 },
  GREATSWORD: { baseDamage: 20, attackSpeed: 0.4, range: 70, cost: 200 },
  SCYTHE: { baseDamage: 16, attackSpeed: 0.6, range: 85, cost: 170 },
  LANCE: { baseDamage: 17, attackSpeed: 0.5, range: 100, cost: 175 },
  CHAKRAM: { baseDamage: 10, attackSpeed: 1.0, range: 120, cost: 140 },
  SHURIKEN: { baseDamage: 5, attackSpeed: 2.0, range: 150, cost: 90 },
  GAUNTLETS: { baseDamage: 7, attackSpeed: 1.6, range: 25, cost: 95 }
}
```

### 4. Item System

Items provide stat bonuses and penalties to create strategic trade-offs.

```javascript
class Item {
  constructor(itemType)
  
  // Properties
  type: string
  cost: number
  bonuses: {
    attributeName: string,
    value: number,
    isPercentage: boolean
  }[]
  penalties: {
    attributeName: string,
    value: number,
    isPercentage: boolean
  }[]
  
  // Methods
  applyEffects(character: PlayerCharacter): void
  removeEffects(character: PlayerCharacter): void
  calculateBonus(baseValue: number, bonus: object): number
}

// Item types (10 total) - balanced with trade-offs
const ITEM_TYPES = {
  BERSERKER_RING: {
    cost: 200,
    bonuses: [{ attribute: 'strength', value: 30, isPercentage: true }],
    penalties: [{ attribute: 'defense', value: 20, isPercentage: true }]
  },
  HEAVY_ARMOR: {
    cost: 250,
    bonuses: [{ attribute: 'defense', value: 10, isPercentage: false }],
    penalties: [{ attribute: 'speed', value: 25, isPercentage: true }]
  },
  SWIFT_BOOTS: {
    cost: 180,
    bonuses: [{ attribute: 'speed', value: 40, isPercentage: true }],
    penalties: [{ attribute: 'vitality', value: 15, isPercentage: true }]
  },
  VITALITY_AMULET: {
    cost: 220,
    bonuses: [{ attribute: 'vitality', value: 8, isPercentage: false }],
    penalties: [{ attribute: 'strength', value: 10, isPercentage: true }]
  },
  GLASS_CANNON_CHARM: {
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
    cost: 150,
    bonuses: [
      { attribute: 'strength', value: 3, isPercentage: false },
      { attribute: 'defense', value: 3, isPercentage: false },
      { attribute: 'speed', value: 3, isPercentage: false }
    ],
    penalties: []
  },
  TANK_SHIELD: {
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
    cost: 190,
    bonuses: [{ attribute: 'strength', value: 7, isPercentage: false }],
    penalties: [{ attribute: 'speed', value: 10, isPercentage: true }]
  },
  CURSED_CROWN: {
    cost: 350,
    bonuses: [
      { attribute: 'strength', value: 60, isPercentage: true },
      { attribute: 'vitality', value: 10, isPercentage: false }
    ],
    penalties: [
      { attribute: 'defense', value: 50, isPercentage: true },
      { attribute: 'speed', value: 20, isPercentage: true }
    ]
  }
}
```

### 5. Combat System

Manages damage calculation and combat interactions.

```javascript
class CombatSystem {
  constructor(scene)
  
  // Combat calculations
  calculatePlayerDamage(player: PlayerCharacter, enemy: Enemy): number
  calculateEnemyDamage(enemy: Enemy, player: PlayerCharacter): number
  
  // Collision detection and damage application
  checkWeaponCollisions(player: PlayerCharacter, enemies: Enemy[]): void
  checkEnemyCollisions(player: PlayerCharacter, enemies: Enemy[]): void
  
  // Damage formula considers:
  // - All equipped weapons (up to 6)
  // - Character strength attribute
  // - Weapon base damage and attack speed
  // - Enemy defense
  applyDamage(target: GameObject, amount: number): void
}
```

### 6. Enemy System

```javascript
class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, enemyType, roundNumber)
  
  // Properties
  enemyType: string
  health: number
  maxHealth: number
  damage: number
  speed: number
  defense: number
  
  // Methods
  moveTowards(target: PlayerCharacter): void
  takeDamage(amount: number): void
  isDead(): boolean
  attack(target: PlayerCharacter): void
}

// Enemy types (5 total)
const ENEMY_TYPES = {
  GOBLIN: { baseHealth: 20, baseDamage: 5, baseSpeed: 80, baseDefense: 2 },
  ORC: { baseHealth: 40, baseDamage: 10, baseSpeed: 60, baseDefense: 5 },
  TROLL: { baseHealth: 80, baseDamage: 15, baseSpeed: 40, baseDefense: 8 },
  DEMON: { baseHealth: 60, baseDamage: 20, baseSpeed: 100, baseDefense: 4 },
  DRAGON: { baseHealth: 150, baseDamage: 30, baseSpeed: 70, baseDefense: 12 }
}
```

### 7. Enemy Spawner

Manages enemy spawning with progressive difficulty.

```javascript
class EnemySpawner {
  constructor(scene)
  
  // Spawning logic
  spawnEnemiesForRound(roundNumber: number): Enemy[]
  
  // Difficulty scaling formulas:
  // enemyCount = 3 + (roundNumber * 2)
  // enemyHealth = baseHealth * (1 + roundNumber * 0.15)
  // enemyDamage = baseDamage * (1 + roundNumber * 0.1)
  
  getSpawnPosition(): {x: number, y: number}
  selectEnemyType(roundNumber: number): string
}
```

### 8. Progression Manager

Manages currency, stat points, and rewards.

```javascript
class ProgressionManager {
  constructor()
  
  // Properties
  currency: number
  availableStatPoints: number
  
  // Reward calculation
  calculateCurrencyReward(roundNumber: number): number  // 50 + (roundNumber * 25)
  calculateStatPointReward(roundNumber: number): number  // 2 + Math.floor(roundNumber / 5)
  
  // Currency management
  addCurrency(amount: number): void
  spendCurrency(amount: number): boolean
  getCurrency(): number
  
  // Stat point management
  addStatPoints(amount: number): void
  spendStatPoint(): boolean
  getAvailableStatPoints(): number
  
  // Reset on game over
  reset(): void
}
```

### 9. Shop System

Interface for purchasing weapons and items between rounds.

```javascript
class ShopSystem {
  constructor(scene, progressionManager)
  
  // Shop interface
  displayAvailableWeapons(): void
  displayAvailableItems(): void
  purchaseWeapon(weaponType: string): boolean
  purchaseItem(itemType: string): boolean
  
  // Validation
  canAffordWeapon(weaponType: string): boolean
  canAffordItem(itemType: string): boolean
  hasInventorySpace(): boolean
}
```

### 10. Round Manager

Orchestrates round flow and win/loss conditions.

```javascript
class RoundManager {
  constructor(scene, gameManager)
  
  // Properties
  currentRound: number
  enemies: Enemy[]
  isRoundActive: boolean
  
  // Round lifecycle
  startRound(roundNumber: number): void
  updateRound(delta: number): void
  checkRoundComplete(): boolean
  checkRoundFailed(): boolean
  
  // Round completion
  onRoundComplete(): void  // Award currency and stat points, transition to shop
  onRoundFailed(): void    // Reset game to round 1, clear all progress
  
  // Enemy management
  removeEnemy(enemy: Enemy): void
  getRemainingEnemyCount(): number
}
```

## Data Models

### PlayerData

Persistent data structure maintained throughout the game session:

```javascript
{
  characterType: string,
  currentRound: number,
  currency: number,
  availableStatPoints: number,
  baseAttributes: {
    strength: number,
    speed: number,
    defense: number,
    vitality: number
  },
  currentAttributes: {  // Calculated from base + item effects
    strength: number,
    speed: number,
    defense: number,
    vitality: number
  },
  weaponInventory: Weapon[],
  itemInventory: Item[],
  equippedWeapons: Weapon[],  // Max 6
  equippedItems: Item[]
}
```

### GameState

Current game session state:

```javascript
{
  isGameActive: boolean,
  currentScene: string,
  playerData: PlayerData,
  roundData: {
    roundNumber: number,
    enemiesRemaining: number,
    roundStartTime: number
  }
}
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Character Selection Displays Correct Stats

*For any* character type, when that character is selected, the displayed stats should match the base stats defined for that character type in the configuration.

**Validates: Requirements 1.2**

### Property 2: Character Movement Updates Position

*For any* valid direction input (up, down, left, right, or diagonal), applying movement should result in the character's position changing in that direction.

**Validates: Requirements 1.3**

### Property 3: Character Stats Affect Combat Damage

*For any* character with different attribute values, the combat damage calculation should produce different results that reflect those attribute differences.

**Validates: Requirements 1.5**

### Property 4: Weapon Acquisition Adds to Inventory

*For any* weapon, when a player acquires that weapon, it should appear in the player's inventory.

**Validates: Requirements 2.2, 8.5**

### Property 5: Equipment Limit Enforced

*For any* player with fewer than 6 equipped weapons, equipping an additional weapon should succeed. *For any* player with 6 equipped weapons, attempting to equip another weapon should fail.

**Validates: Requirements 2.3, 2.5**

### Property 6: Multiple Equipped Weapons Apply to Combat

*For any* set of equipped weapons (up to 6), the damage calculation should consider all equipped weapons in the final damage value.

**Validates: Requirements 2.4, 2.6**

### Property 7: Enemy Spawning Scales with Round Number

*For any* two rounds where round A > round B, round A should spawn at least as many enemies as round B, and the enemies in round A should have at least as much total health as enemies in round B.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 8: Enemy Spawn Positions Within Boundaries

*For any* spawned enemy, its initial position coordinates should be within the valid game boundary coordinates.

**Validates: Requirements 3.5**

### Property 9: Collision Damage Application

*For any* collision between a weapon and an enemy, damage should be calculated and the enemy's health should decrease. *For any* collision between an enemy and the player, damage should be calculated and the player's health should decrease.

**Validates: Requirements 4.1, 4.3**

### Property 10: Zero Health Triggers Removal or Failure

*For any* enemy whose health reaches zero, that enemy should be removed from the active enemies list. *For any* player character whose health reaches zero, the round should end in failure.

**Validates: Requirements 4.2, 4.4**

### Property 11: All Enemies Defeated Completes Round

*For any* round where all spawned enemies have been defeated (removed), the round should complete successfully.

**Validates: Requirements 4.5**

### Property 12: Round Progression Advances Sequentially

*For any* round N where N < 20, successfully completing round N should advance the game to round N+1.

**Validates: Requirements 5.2**

### Property 13: Complete State Reset on Failure

*For any* round that fails, the game should reset to round 1, character stats should return to base values, currency should be set to zero, and inventory should be cleared.

**Validates: Requirements 5.4, 5.5, 5.6**

### Property 14: Rewards Awarded on Round Completion

*For any* successfully completed round, the player should receive both currency and stat points, with amounts that increase as round number increases.

**Validates: Requirements 6.1, 6.2, 7.1**

### Property 15: Currency Persists Across Rounds

*For any* currency balance at the end of round N, that same balance (minus any purchases) should be available at the start of round N+1.

**Validates: Requirements 6.3, 9.2**

### Property 16: Purchase Deducts Currency

*For any* weapon purchase, the player's currency balance should decrease by exactly the cost of that weapon.

**Validates: Requirements 6.5**

### Property 17: Purchase Validation Based on Currency

*For any* weapon where the player's currency is greater than or equal to the weapon cost, the purchase should succeed. *For any* weapon where the player's currency is less than the weapon cost, the purchase should fail.

**Validates: Requirements 8.3, 8.4**

### Property 18: Stat Point Allocation Increases Attributes

*For any* character attribute, allocating a stat point to that attribute should increase its value by at least 1.

**Validates: Requirements 7.3**

### Property 19: Attribute Changes Affect Gameplay

*For any* character attribute that affects combat or movement, increasing that attribute should result in measurably different combat damage or movement speed.

**Validates: Requirements 7.5**

### Property 20: Game State Persists Within Session

*For any* game state element (character stats, currency, inventory, round number), that element should maintain its value across round transitions within the same session.

**Validates: Requirements 7.4, 9.1, 9.3, 9.5**

### Property 21: Item Bonuses Apply to Character Stats

*For any* item with stat bonuses, when that item is equipped, the character's current attributes should increase according to the bonus values (percentage or numeric).

**Validates: Requirements 12.2, 12.4, 12.5**

### Property 22: Item Penalties Apply to Character Stats

*For any* item with stat penalties, when that item is equipped, the character's current attributes should decrease according to the penalty values (percentage or numeric).

**Validates: Requirements 12.3**

### Property 23: Multiple Item Effects Stack

*For any* set of equipped items, all bonuses and penalties from all items should be applied cumulatively to the character's stats.

**Validates: Requirements 12.6, 12.7**

### Property 24: Item Unequip Removes Effects

*For any* equipped item, when that item is unequipped, the character's current attributes should return to the values they would have without that item's bonuses and penalties.

**Validates: Requirements 12.8**

### Property 25: Item Purchase Adds to Inventory

*For any* item purchase with sufficient currency, the item should be added to the player's item inventory.

**Validates: Requirements 8.7**

## Error Handling

### Input Validation

1. **Movement Boundaries**: Character movement is clamped to screen boundaries to prevent out-of-bounds positions
2. **Equipment Validation**: Attempting to equip more than 6 weapons returns false and displays an error message
3. **Purchase Validation**: Insufficient currency prevents purchase and displays required amount
4. **Stat Allocation Validation**: Attempting to allocate stat points when none are available is prevented

### Combat Edge Cases

1. **Simultaneous Death**: If player and last enemy die simultaneously, round is considered failed (player death takes precedence)
2. **Negative Health**: Health values are clamped to minimum of 0
3. **Damage Overflow**: Damage calculations use safe integer arithmetic to prevent overflow

### Scene Transition Errors

1. **Invalid Scene Transitions**: Scene manager validates transitions and logs errors for invalid requests
2. **Missing Assets**: Boot scene includes error handling for failed asset loads with user-friendly messages
3. **State Corruption**: Game manager validates state before scene transitions and resets to safe state if corruption detected

### Browser Compatibility

1. **Canvas Support**: Check for HTML5 Canvas support on load, display error message if unavailable
2. **LocalStorage**: Gracefully handle missing localStorage API (game still playable, just no persistence)
3. **Performance Degradation**: Monitor frame rate and display warning if consistently below 30 FPS

## Testing Strategy

### Dual Testing Approach

This game will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized testing

### Unit Testing

Unit tests will focus on:

1. **Specific Examples**:
   - Character selection displays correct stats for Warrior, Rogue, and Mage
   - Round 20 completion displays victory screen
   - Page refresh resets game state
   - Shop interface displays after round completion

2. **Edge Cases**:
   - Attempting to equip 7th weapon when 6 are already equipped
   - Simultaneous player and enemy death
   - Zero currency purchase attempts

3. **Integration Points**:
   - Scene transitions between gameplay, shop, and stats screens
   - Phaser game loop integration
   - Asset loading and error handling

### Property-Based Testing

Property-based tests will verify universal correctness properties using **fast-check** (JavaScript property testing library).

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with format: **Feature: browser-action-game, Property {number}: {property_text}**
- Each correctness property implemented as a single property-based test

**Test Coverage**:

Each of the 25 correctness properties listed above will have a corresponding property-based test that:
1. Generates random valid inputs (characters, weapons, items, rounds, etc.)
2. Executes the system behavior
3. Verifies the property holds for all generated inputs

**Example Property Test Structure**:

```javascript
// Feature: browser-action-game, Property 6: Multiple Equipped Weapons Apply to Combat
test('equipped weapons all contribute to damage', () => {
  fc.assert(
    fc.property(
      fc.array(fc.weaponType(), { minLength: 1, maxLength: 6 }),
      fc.characterAttributes(),
      (weapons, attributes) => {
        const player = new PlayerCharacter('test', 0, 0, 'WARRIOR');
        player.attributes = attributes;
        
        weapons.forEach(w => player.equipWeapon(new Weapon(w)));
        
        const damage = combatSystem.calculatePlayerDamage(player, enemy);
        
        // Damage should reflect all equipped weapons
        const expectedMinDamage = weapons.reduce((sum, w) => 
          sum + WEAPON_TYPES[w].baseDamage, 0);
        
        return damage >= expectedMinDamage;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Organization

```
tests/
├── unit/
│   ├── character.test.js
│   ├── weapon.test.js
│   ├── item.test.js
│   ├── enemy.test.js
│   ├── combat.test.js
│   ├── progression.test.js
│   ├── shop.test.js
│   └── round-manager.test.js
├── property/
│   ├── character-properties.test.js
│   ├── weapon-properties.test.js
│   ├── item-properties.test.js
│   ├── combat-properties.test.js
│   ├── progression-properties.test.js
│   └── state-properties.test.js
└── integration/
    ├── scene-transitions.test.js
    └── full-round.test.js
```

### Testing Tools

- **Jest**: Test runner and assertion library
- **fast-check**: Property-based testing library
- **Phaser Test Utilities**: Mocking and scene testing helpers
- **jsdom**: Browser environment simulation for Node.js tests
