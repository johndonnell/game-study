# API Documentation

Browser Action Game - Complete API Reference

Generated from JSDoc comments in source code.

## Table of Contents

1. [Entities](#entities)
   - [PlayerCharacter](#playercharacter)
   - [Enemy](#enemy)
   - [Weapon](#weapon)
   - [Item](#item)
   - [Projectile](#projectile)
2. [Systems](#systems)
   - [CombatSystem](#combatsystem)
   - [DamageCalculator](#damagecalculator)
   - [CollisionDetector](#collisiondetector)
   - [ProjectileManager](#projectilemanager)
   - [CombatVisualEffects](#combatvisualeffects)
   - [AttackAnimationFactory](#attackanimationfactory)
3. [Managers](#managers)
   - [GameManager](#gamemanager)
   - [RoundManager](#roundmanager)
   - [ProgressionManager](#progressionmanager)
   - [EnemySpawner](#enemyspawner)
   - [ShopSystem](#shopsystem)
4. [Configuration](#configuration)
5. [Scenes](#scenes)

---

## Entities

### PlayerCharacter

**File**: `src/entities/PlayerCharacter.js`

**Description**: Represents the player-controlled character with stats and equipment.

**Extends**: `Phaser.GameObjects.Container`

#### Constructor

```javascript
new PlayerCharacter(scene, x, y, characterType)
```

**Parameters**:
- `scene` (Phaser.Scene) - The scene this character belongs to
- `x` (number) - Initial x position
- `y` (number) - Initial y position
- `characterType` (string) - Type of character (WARRIOR, ROGUE, MAGE)

**Throws**: Error if invalid character type

#### Properties

- `characterType` (string) - Character type identifier
- `baseAttributes` (Object) - Base stats (strength, speed, defense, vitality, dexterity)
- `currentAttributes` (Object) - Current stats after item modifications
- `maxHealth` (number) - Maximum health (vitality * 10)
- `health` (number) - Current health
- `equippedWeapons` (Weapon[]) - Array of equipped weapons (max 6)
- `equippedItems` (Item[]) - Array of equipped items
- `isInvincible` (boolean) - Invincibility frame status
- `invincibilityEndTime` (number) - When invincibility expires
- `facingDirection` (number) - 1 = right, -1 = left
- `spriteParts` (Object) - Sprite components from sprite modules


#### Methods

##### Movement

**`move(velocityX, velocityY)`**
- Moves the character with velocity
- Clamps position to screen boundaries
- Parameters:
  - `velocityX` (number) - Horizontal velocity
  - `velocityY` (number) - Vertical velocity

##### Health Management

**`takeDamage(amount, currentTime)`**
- Applies damage to the character
- Grants 0.25s invincibility frames
- Parameters:
  - `amount` (number) - Damage amount
  - `currentTime` (number) - Current game time in milliseconds

**`updateInvincibility(currentTime)`**
- Updates invincibility status (call in game loop)
- Handles flash effect during invincibility
- Parameters:
  - `currentTime` (number) - Current time in milliseconds

**`heal(amount)`**
- Heals the character
- Cannot exceed maxHealth
- Parameters:
  - `amount` (number) - Health to restore

**`isDead()`**
- Returns: (boolean) True if health is zero

##### Weapon Management

**`equipWeapon(weapon)`**
- Equips a weapon (max 6 weapons)
- Parameters:
  - `weapon` (Weapon) - Weapon to equip
- Returns: (boolean) True if successfully equipped

**`unequipWeapon(weaponIndex)`**
- Unequips a weapon by index
- Parameters:
  - `weaponIndex` (number) - Index of weapon to unequip

**`getEquippedWeapons()`**
- Returns: (Weapon[]) Array of equipped weapons

##### Item Management

**`equipItem(item)`**
- Equips an item and recalculates attributes
- Parameters:
  - `item` (Item) - Item to equip

**`unequipItem(itemIndex)`**
- Unequips an item by index and recalculates attributes
- Parameters:
  - `itemIndex` (number) - Index of item to unequip

**`getEquippedItems()`**
- Returns: (Item[]) Array of equipped items

##### Attribute Management

**`getAttribute(attributeName)`**
- Gets current attribute value (modified by items)
- Parameters:
  - `attributeName` (string) - Name of attribute
- Returns: (number) Current attribute value

**`getBaseAttribute(attributeName)`**
- Gets base attribute value (unmodified)
- Parameters:
  - `attributeName` (string) - Name of attribute
- Returns: (number) Base attribute value

**`increaseBaseAttribute(attributeName, amount)`**
- Increases base attribute (stat point allocation)
- Reduced to 0.25x impact for balance
- Parameters:
  - `attributeName` (string) - Name of attribute
  - `amount` (number) - Amount to increase

**`recalculateAttributes()`**
- Recalculates current attributes from base + item effects
- Handles percentage and flat bonuses/penalties
- Updates maxHealth based on vitality

##### Animation

**`updateAnimation(delta, isMoving)`**
- Updates character animation
- Parameters:
  - `delta` (number) - Time since last update in milliseconds
  - `isMoving` (boolean) - Whether character is moving

**`createSprite(characterType)`**
- Creates visual sprite based on character type
- Parameters:
  - `characterType` (string) - Type of character

---

### Enemy

**File**: `src/entities/Enemy.js`

**Description**: Represents a computer-controlled hostile entity.

**Extends**: `Phaser.GameObjects.Container`

#### Constructor

```javascript
new

#### Methods

##### Movement & Animation

**`move(velocityX, velocityY)`**
- Moves the character with velocity and clamps to screen boundaries
- Parameters: velocityX (number), velocityY (number)

**`updateAnimation(delta, isMoving)`**
- Updates character animation based on movement
- Parameters: delta (number) - time since last update, isMoving (boolean)

##### Health Management

**`takeDamage(amount, currentTime)`**
- Applies damage and grants 0.25s invincibility
- Parameters: amount (number), currentTime (number) - current game time in ms

**`updateInvincibility(currentTime)`**
- Updates invincibility status and flash effect
- Parameters: currentTime (number)

**`heal(amount)`**
- Restores health up to maxHealth
- Parameters: amount (number)

**`isDead()`**
- Returns: boolean - true if health is zero

##### Equipment Management

**`equipWeapon(weapon)`**
- Equips a weapon (max 6)
- Parameters: weapon (Weapon)
- Returns: boolean - true if equipped successfully

**`unequipWeapon(weaponIndex)`**
- Removes weapon by index
- Parameters: weaponIndex (number)

**`getEquippedWeapons()`**
- Returns: Weapon[] - copy of equipped weapons array

**`equipItem(item)`**
- Equips an item and recalculates attributes
- Parameters: item (Item)

**`unequipItem(itemIndex)`**
- Removes item by index and recalculates attributes
- Parameters: itemIndex (number)

**`getEquippedItems()`**
- Returns: Item[] - copy of equipped items array

##### Attribute Management

**`getAttribute(attributeName)`**
- Gets current attribute value (modified by items)
- Parameters: attributeName (string)
- Returns: number

**`getBaseAttribute(attributeName)`**
- Gets base attribute value (unmodified)
- Parameters: attributeName (string)
- Returns: number

**`increaseBaseAttribute(attributeName, amount)`**
- Increases base attribute (stat point allocation with 0.25x impact)
- Parameters: attributeName (string), amount (number)

**`recalculateAttributes()`**
- Recalculates current attributes from base + item effects
- Updates maxHealth based on vitality

---

### Enemy

**File**: `src/entities/Enemy.js`

**Description**: Represents a computer-controlled hostile entity with difficulty scaling.

**Extends**: `Phaser.GameObjects.Container`

#### Constructor

```javascript
new Enemy(scene, x, y, enemyType, roundNumber)
```

**Parameters**:
- `scene` (Phaser.Scene) - The scene this enemy belongs to
- `x` (number) - Initial x position
- `y` (number) - Initial y position
- `enemyType` (string) - Type of enemy (GOBLIN, ORC, TROLL, DEMON, DRAGON)
- `roundNumber` (number) - Current round number for difficulty scaling

**Throws**: Error if invalid enemy type

#### Properties

- `enemyType` (string) - Enemy type identifier
- `maxHealth` (number) - Maximum health (scaled by round)
- `health` (number) - Current health
- `damage` (number) - Base damage (scaled by round)
- `speed` (number) - Movement speed
- `defense` (number) - Damage reduction
- `facingDirection` (number) - 1 = right, -1 = left
- `lastAttackTime` (number) - Last ranged attack timestamp
- `attackCooldown` (number) - 1500ms for goblins, 2000ms for dragons
- `attackRange` (number) - 250px for goblins, 300px for dragons
- `spriteParts` (Object) - Sprite components from sprite modules

#### Difficulty Scaling

- **Health**: baseHealth * (1 + roundNumber * 0.15)
- **Damage**: baseDamage * (1 + roundNumber * 0.1)
- **Speed/Defense**: No scaling

#### Methods

**`updateAnimation(delta)`**
- Updates enemy animation and facing direction
- Parameters: delta (number) - time since last update in ms

**`moveTowards(target)`**
- Moves enemy towards target (player)
- Parameters: target (PlayerCharacter)

**`takeDamage(amount)`**
- Applies damage with defense reduction (min 1 damage)
- Parameters: amount (number)

**`isDead()`**
- Returns: boolean - true if health is zero

**`attack(target)`**
- Performs melee attack on target
- Parameters: target (PlayerCharacter)

**`canRangedAttack(currentTime)`**
- Checks if cooldown allows ranged attack
- Parameters: currentTime (number)
- Returns: boolean

**`recordRangedAttack(currentTime)`**
- Records attack time for cooldown tracking
- Parameters: currentTime (number)

**`hasRangedAttack()`**
- Returns: boolean - true for DRAGON and GOBLIN types

**`getRangedAttackRange()`**
- Returns: number - attack range in pixels

---

### Weapon

**File**: `src/entities/Weapon.js`

**Description**: Represents a weapon that can be equipped and used in combat.

#### Constructor

```javascript
new Weapon(weaponType)
```

**Parameters**:
- `weaponType` (string) - Type of weapon (e.g., SWORD, BOW, WAND)

**Throws**: Error if invalid weapon type

#### Properties

- `type` (string) - Weapon type identifier
- `name` (string) - Display name
- `baseDamage` (number) - Base damage value
- `attackSpeed` (number) - Attacks per second
- `range` (number) - Attack range in pixels
- `cost` (number) - Purchase cost
- `lastAttackTime` (number|null) - Last attack timestamp

#### Methods

**`calculateDamage(characterAttributes)`**
- Calculates damage with strength modifier (5% per point)
- Parameters: characterAttributes (Object)
- Returns: number

**`calculateAttackSpeed(characterAttributes)`**
- Calculates effective attack speed with dexterity (2% per point) and multipliers
- Parameters: characterAttributes (Object)
- Returns: number - attacks per second

**`getEffectiveRange(characterAttributes)`**
- Calculates effective range with multipliers
- Parameters: characterAttributes (Object)
- Returns: number - range in pixels

**`canAttack(currentTime, characterAttributes)`**
- Checks if weapon can attack based on cooldown
- Parameters: currentTime (number), characterAttributes (Object)
- Returns: boolean

**`recordAttack(currentTime)`**
- Updates last attack time
- Parameters: currentTime (number)

---

### Item

**File**: `src/entities/Item.js`

**Description**: Represents an item that provides stat bonuses and penalties.

#### Constructor

```javascript
new Item(itemType)
```

**Parameters**:
- `itemType` (string) - Type of item (e.g., BERSERKER_RING, HEAVY_ARMOR)

**Throws**: Error if invalid item type

#### Properties

- `type` (string) - Item type identifier
- `name` (string) - Display name
- `cost` (number) - Purchase cost
- `bonuses` (Array) - Array of bonus objects {attribute, value, isPercentage}
- `penalties` (Array) - Array of penalty objects {attribute, value, isPercentage}

#### Methods

**`applyEffects(character)`**
- Triggers character attribute recalculation
- Parameters: character (PlayerCharacter)

**`removeEffects(character)`**
- Triggers character attribute recalculation
- Parameters: character (PlayerCharacter)

**`calculateBonus(baseValue, bonus)`**
- Calculates bonus value (percentage or numeric)
- Parameters: baseValue (number), bonus (Object)
- Returns: number

---

### Projectile

**File**: `src/entities/Projectile.js`

**Description**: Represents a projectile fired from a ranged weapon or enemy.

**Extends**: `Phaser.GameObjects.Graphics`

#### Constructor

```javascript
new Projectile(scene, x, y, targetX, targetY, damage, speed, weaponType, enemyType)
```

**Parameters**:
- `scene` (Phaser.Scene) - The scene this projectile belongs to
- `x` (number) - Starting x position
- `y` (number) - Starting y position
- `targetX` (number) - Target x position
- `targetY` (number) - Target y position
- `damage` (number) - Damage this projectile deals
- `speed` (number) - Speed of projectile (default 300)
- `weaponType` (string|null) - Type of weapon firing (for visual style)
- `enemyType` (string|null) - Type of enemy firing (for enemy projectiles)

#### Properties

- `damage` (number) - Damage dealt on hit
- `speed` (number) - Movement speed
- `hasHit` (boolean) - Whether projectile has hit a target
- `weaponType` (string|null) - Weapon type for visual
- `enemyType` (string|null) - Enemy type for visual
- `velocityX` (number) - Horizontal velocity
- `velocityY` (number) - Vertical velocity
- `rotationSpeed` (number) - Rotation speed for spinning projectiles

#### Projectile Types

- **Arrow** (BOW, CROSSBOW): Wooden shaft, metal tip, fletching
- **Spear** (GOBLIN): Crude wooden spear with iron tip
- **Fireball** (DRAGON, WAND, STAFF): Orange/red gradient effect
- **Shuriken** (SHURIKEN): 4-pointed spinning star

#### Methods

**`update(delta)`**
- Updates projectile position and checks bounds
- Parameters: delta (number) - time since last update in ms

**`hit()`**
- Marks projectile as hit and destroys it

**`drawProjectile(weaponType, enemyType)`**
- Draws projectile visual based on type
- Parameters: weaponType (string|null), enemyType (string|null)

**`drawArrow()`** - Draws arrow projectile
**`drawSpear()`** - Draws spear projectile
**`drawFireball()`** - Draws fireball projectile
**`drawShuriken()`** - Draws shuriken projectile

---

## Systems

### CombatSystem

**File**: `src/systems/combat/CombatSystem.js`

**Description**: Orchestrates combat interactions by delegating to specialized components.

#### Architecture

Thin orchestrator that coordinates:
- **DamageCalculator**: Pure damage calculation logic
- **CollisionDetector**: All collision detection algorithms
- **ProjectileManager**: Projectile lifecycle management
- **CombatVisualEffects**: Visual feedback (damage numbers, flashes, screen shake)
- **AttackAnimationFactory**: Weapon-specific attack animations

#### Constructor

```javascript
new CombatSystem(scene)
```

**Parameters**:
- `scene` (Phaser.Scene) - The scene this combat system belongs to

#### Methods

##### Damage Calculation

**`calculatePlayerDamage(player, enemy)`**
- Calculates total damage from all equipped weapons
- Parameters: player (PlayerCharacter), enemy (Enemy)
- Returns: number

**`calculateEnemyDamage(enemy, player)`**
- Calculates enemy damage with player defense
- Parameters: enemy (Enemy), player (PlayerCharacter)
- Returns: number

##### Combat Checks

**`checkWeaponCollisions(player, enemies, weaponSprites)`**
- Checks weapon attacks and applies damage (automatic attacks)
- Handles both ranged and melee weapons
- Parameters: player (PlayerCharacter), enemies (Enemy[]), weaponSprites (Array)

**`checkEnemyCollisions(player, enemies)`**
- Checks enemy melee attacks on player
- Parameters: player (PlayerCharacter), enemies (Enemy[])

**`checkEnemyRangedAttacks(enemies, player, currentTime)`**
- Checks and creates enemy ranged projectiles
- Parameters: enemies (Enemy[]), player (PlayerCharacter), currentTime (number)

##### Projectile Management

**`updateProjectiles(delta, enemies, currentTime)`**
- Updates player projectiles and checks hits
- Parameters: delta (number), enemies (Enemy[]), currentTime (number)

**`updateEnemyProjectiles(delta, player, currentTime)`**
- Updates enemy projectiles and checks hits on player
- Parameters: delta (number), player (PlayerCharacter), currentTime (number)

##### Damage Application

**`applyDamage(target, amount, currentTime)`**
- Applies damage to target with visual feedback
- Parameters: target (GameObject), amount (number), currentTime (number)

##### Visual Effects (Delegated)

**`showDamageNumber(target, amount)`**
**`flashEnemy(enemy)`**
**`shakeScreen()`**
**`createMeleeAttackEffect(player, enemy, weapon, effectiveRange)`**

---

### DamageCalculator

**File**: `src/systems/combat/DamageCalculator.js`

**Description**: Pure damage calculation logic without side effects.

#### Static Methods

**`calculatePlayerDamage(player, enemy)`**
- Sums damage from all equipped weapons with strength modifier
- Parameters: player (PlayerCharacter), enemy (Enemy)
- Returns: number

**`calculateEnemyDamage(enemy, player)`**
- Calculates enemy damage reduced by player defense (min 1)
- Parameters: enemy (Enemy), player (PlayerCharacter)
- Returns: number

---

### CollisionDetector

**File**: `src/systems/combat/CollisionDetector.js`

**Description**: Handles all collision detection logic.

#### Static Methods

**`findClosestEnemyInRange(player, enemies, range)`**
- Finds closest enemy within weapon range
- Parameters: player (PlayerCharacter), enemies (Enemy[]), range (number)
- Returns: {enemy: Enemy|null, distance: number}

**`checkProjectileHit(projectile, enemy, hitRadius)`**
- Checks if projectile hits enemy
- Parameters: projectile (Projectile), enemy (Enemy), hitRadius (number, default 20)
- Returns: boolean

**`checkProjectileHitPlayer(projectile, player, hitRadius)`**
- Checks if projectile hits player
- Parameters: projectile (Projectile), player (PlayerCharacter), hitRadius (number, default 20)
- Returns: boolean

**`checkEnemyMeleeRange(player, enemy, attackRange)`**
- Checks if enemy is in melee range
- Parameters: player (PlayerCharacter), enemy (Enemy), attackRange (number, default 30)
- Returns: boolean

**`checkMeleeHitboxCollision(player, enemy, weapon, attackAngle, effectiveRange)`**
- Checks if enemy is hit by weapon-specific attack hitbox
- Parameters: player (PlayerCharacter), enemy (Enemy), weapon (Weapon), attackAngle (number), effectiveRange (number)
- Returns: boolean

**Weapon-Specific Hitboxes**:
- Sword/Katana/Rapier/Greatsword: 90° slash arc
- Axe/Hammer/Mace: 90° overhead swing
- Dagger: 45° quick stab
- Spear/Lance: 30° thrust
- Whip/Flail/Scythe: 120° sweeping arc
- Gauntlets: Circular punch area

**`checkArcCollision(enemyDistance, enemyAngle, attackAngle, range, enemyRadius, arcHalfAngle)`**
- Helper for arc-shaped hitbox collision
- Returns: boolean

---

### ProjectileManager

**File**: `src/systems/combat/ProjectileManager.js`

**Description**: Manages all projectiles (player and enemy).

#### Constructor

```javascript
new ProjectileManager(scene)
```

#### Properties

- `projectiles` (Projectile[]) - Player projectiles
- `enemyProjectiles` (Projectile[]) - Enemy projectiles

#### Methods

**`createPlayerProjectile(x, y, targetX, targetY, damage, speed, weaponType)`**
- Creates player projectile
- Returns: Projectile

**`createEnemyProjectile(enemy, targetX, targetY, damage, speed)`**
- Creates enemy projectile with type-specific spawn offset
- Parameters: enemy (Enemy), targetX (number), targetY (number), damage (number), speed (number)
- Returns: Projectile

**Spawn Offsets**:
- Dragon: x=45 (head), y=-10
- Goblin: x=15 (hand), y=0

**`updatePlayerProjectiles(delta, enemies, onHit)`**
- Updates player projectiles and checks hits
- Parameters: delta (number), enemies (Enemy[]), onHit (Function)

**`updateEnemyProjectiles(delta, player, onHit)`**
- Updates enemy projectiles and checks hits
- Parameters: delta (number), player (PlayerCharacter), onHit (Function)

**`clear()`**
- Destroys all projectiles

---

## Managers

### GameManager

**File**: `src/managers/GameManager.js`

**Description**: Central orchestrator that manages scene transitions and global game state.

#### Constructor

```javascript
new GameManager(phaserGame)
```

**Parameters**:
- `phaserGame` (Phaser.Game) - The Phaser game instance

#### Properties

- `playerData` (Object) - Global player state
  - `characterType` (string|null)
  - `currentRound` (number)
  - `currency` (number)
  - `availableStatPoints` (number)
  - `baseAttributes` (Object)
  - `currentAttributes` (Object)
  - `weaponInventory` (Array)
  - `itemInventory` (Array)
  - `equippedWeapons` (Array)
  - `equippedItems` (Array)

#### Methods

**`getCurrentRound()`** - Returns: number
**`setCurrentRound(round)`** - Parameters: round (number)
**`resetGame()`** - Resets all player data to initial state

**Scene Transitions**:
- **`startCharacterSelection()`** - Starts character select scene
- **`startRound(roundNumber)`** - Starts game scene with round number
- **`showShop()`** - Shows shop scene (stops game music)
- **`showStatsAllocation()`** - Shows stats scene
- **`showGameOver(finalRound)`** - Shows game over scene (stops game music)
- **`showVictory()`** - Shows victory scene (stops game music)

**Data Management**:
- **`getPlayerData()`** - Returns: Object
- **`savePlayerData(data)`** - Parameters: data (Object)

**Event Handlers**:
- **`onRoundComplete(roundNumber)`** - Awards currency/stats, advances round
- **`onRoundFailed()`** - Resets game and shows game over

---

## Configuration

### Character Types

**File**: `src/config/characterTypes.js`

Defines 3 playable character types with base stats:
- **WARRIOR**: High vitality, strength
- **ROGUE**: High speed, dexterity
- **MAGE**: Balanced stats

### Weapon Types

**File**: `src/config/weaponTypes.js`

Defines 20 weapon types with properties:
- name, baseDamage, attackSpeed, range, cost

Categories: Swords, Axes, Spears, Daggers, Bows, Magic, Exotic

### Item Types

**File**: `src/config/itemTypes.js`

Defines 10 item types with balanced trade-offs:
- bonuses: Array of {attribute, value, isPercentage}
- penalties: Array of {attribute, value, isPercentage}

### Enemy Types

**File**: `src/config/enemyTypes.js`

Defines 5 enemy types with base stats:
- GOBLIN: Low health, fast, ranged (spear)
- ORC: Medium health, moderate speed
- TROLL: High health, slow, high defense
- DEMON: Medium health, very fast, high damage
- DRAGON: Very high health, ranged (fireball), high damage

---

## Scenes

### Scene Hierarchy

1. **StartScene** - Initial start screen (enables audio context)
2. **BootScene** - Asset loading
3. **CharacterSelectScene** - Character selection with animated sprites
4. **GameScene** - Main gameplay with combat and movement
5. **ShopScene** - Weapon and item purchases
6. **StatsScene** - Stat point allocation
7. **GameOverScene** - Failure state
8. **VictoryScene** - Win state (round 20 completion)

---

## Testing

All classes have comprehensive unit tests in `tests/unit/`:
- 176 total unit tests
- Coverage for all major systems
- Jest with ES modules support

---

## Notes

- All positions are in pixels
- Time values are in milliseconds
- Attack speed is in attacks per second
- Angles are in radians
- All classes use ES6 module syntax
- Phaser 3 framework for rendering and game loop

