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

