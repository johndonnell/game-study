# Changelog

All notable changes to the Browser Action Game project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-26

### Changed - Shop System
- **Shop Card System Redesign** (2026-01-26)
  - Reduced shop to 4 random cards per round (was showing all items)
  - Guaranteed at least 2 weapons in every shop
  - Remaining 2 slots randomly filled with weapons or items
  - Cards displayed in clean 2x2 grid layout
  - Added 50 gold refresh button to reroll all 4 cards
  - Refresh button only appears when player has 50+ gold
  - Purchased cards marked as "SOLD" and cannot be repurchased
  - Each card shows detailed stats and clear purchase status
  - Weapon cards: orange border, show damage/range/speed, melee/ranged indicator
  - Item cards: cyan border, show bonuses and penalties clearly
  - Hover effects with scale animation on purchasable cards
  - Better visual hierarchy with game-like aesthetic
  - Matches stats screen design language

## [1.2.1] - 2026-01-26

### Fixed - UI Alignment
- **Stats Screen Header Alignment** (2026-01-26)
  - Fixed "STAT" column header to align vertically with other headers
  - Added `.setOrigin(0, 0.5)` to match alignment of BASE, POINTS, ITEMS, TOTAL headers

## [1.2.0] - 2026-01-26

### Added - UI Improvements
- **Stats Screen Redesign** (2026-01-26)
  - Complete visual overhaul with game-like aesthetic
  - Dark themed background with colored stat rows
  - Clear column organization: BASE | POINTS | ITEMS | TOTAL
  - Stat icons (💪 ⚡ 🛡️ ❤️ 🎯) for visual identification
  - Color-coded stats (red, cyan, green, pink, purple)
  - Separated display of allocated points vs actual stat increase (×0.25 multiplier shown)
  - Item bonuses clearly displayed in separate column
  - Alternating row backgrounds for better readability
  - Larger, styled +/- buttons with hover effects
  - Prominent "START ROUND" button
  - Legend explaining each column
  - No more overlapping text or confusing layout

## [1.1.1] - 2026-01-26

### Refactored - Projectile System
- **Projectile Sprite Extraction** (2026-01-26)
  - Extracted projectile rendering logic into separate sprite modules
  - Created `src/sprites/projectiles/` directory structure
  - New modules: ArrowProjectile, SpearProjectile, FireballProjectile, ShurikenProjectile, DefaultProjectile
  - Each module provides `draw()`, `shouldRotate()`, and `getRotationSpeed()` methods
  - Projectile.js now uses dependency injection pattern
  - Improved maintainability and separation of concerns
  - All 176 unit tests passing

## [1.1.0] - 2026-01-26

### Added - Combat Features
- **Goblin Spear-Throwing Attack** (2026-01-26)
  - Goblins now have ranged attack capability with spear projectiles
  - Faster attack speed (1.5s cooldown) compared to dragons (2s)
  - Shorter attack range (250px) compared to dragons (300px)
  - Spear projectile visual with crude goblin craftsmanship aesthetic

- **Bow Weapon and Arrow Projectiles** (2026-01-26)
  - Added BowSprite with curved bow design
  - Arrow projectiles with wooden shaft, metal arrowhead, and fletching
  - Arrows rotate to face direction of travel
  - Support for both BOW and CROSSBOW weapon types

- **Dragon Fireball Projectile Attack** (Earlier)
  - Dragons can shoot fireballs at range
  - Fireball visual with gradient orange/red/yellow effect
  - Pulsing animation effect

- **Shuriken Weapon** (Earlier)
  - 4-pointed spinning star projectile
  - Larger size for better visibility
  - Metallic appearance with edge highlights

### Added - Character Sprites
- **Wizard/Mage Sprite** (2026-01-26)
  - Flowing blue robe with gold trim
  - Pointed wizard hat with stars and moon
  - Large magical staff with glowing crystal orb
  - Floating animation with staff movement

- **Barbarian/Warrior Sprite** (2026-01-26)
  - Proper human proportions with extended limbs
  - Conan-style black hair
  - Large double-bladed battleaxe
  - Muscular build with brown boots

- **Rogue Character Sprite** (Earlier)
  - Hooded cape design
  - Stealthy appearance
  - Proper body part connections

### Added - Enemy Sprites
- **Animated Enemy Sprites** (Earlier)
  - Goblin: Small, green, animated sprite
  - Orc: Orange, medium-sized warrior
  - Troll: Large, brown, slow-moving
  - Demon: Red, fast-moving threat
  - Dragon: Purple, side-profile quadrupedal with bat wings

### Refactored - Combat System
- **Major Combat System Refactoring** (2026-01-26)
  - Split monolithic CombatSystem (768 lines) into 6 focused classes
  - `CombatSystem.js` (150 lines) - Thin orchestrator
  - `DamageCalculator.js` (45 lines) - Pure damage calculations
  - `CollisionDetector.js` (160 lines) - Collision detection algorithms
  - `ProjectileManager.js` (230 lines) - Projectile lifecycle management
  - `CombatVisualEffects.js` (85 lines) - Visual feedback
  - `AttackAnimationFactory.js` (200 lines) - Weapon-specific animations
  - Attack speed calculations remain in Weapon class
  - All 176 unit tests passing after refactoring

### Refactored - Sprite System
- **Sprite Module Extraction** (Earlier)
  - Extracted sprite creation and animation into separate modules
  - Character sprites: BarbarianSprite, WizardSprite, RogueSprite
  - Enemy sprites: GoblinSprite, OrcSprite, TrollSprite, DemonSprite, DragonSprite
  - Weapon sprites: GreatswordSprite, BowSprite, WandSprite, ShurikenSprite
  - Cleaner separation of concerns

### Added - Game Systems
- **Dexterity Stat and Attack Speed System** (Earlier)
  - Dexterity attribute affects attack speed
  - Formula: cooldown = baseAttackSpeed / (1 + dexterity * 0.02)
  - Higher dexterity = faster attacks

- **Item System with Trade-offs** (Earlier)
  - 10 item types with balanced bonuses and penalties
  - Attack speed and range modifier items
  - Strategic equipment choices

- **Invincibility Frames** (Earlier)
  - 0.25 second invincibility after taking damage
  - Visual flash effect during invincibility

- **Melee Attack Animations** (Earlier)
  - Weapon-specific attack animations
  - Slash, thrust, swing, and punch animations
  - Hitbox-based AoE damage for melee weapons
  - Animations scale to weapon range

### Added - UI/UX Features
- **Character Selection Screen** (Earlier)
  - Large animated character sprites
  - Detailed stat display
  - Colorful impactful design

- **Title Screen** (Earlier)
  - Redesigned with colorful impactful design
  - Audio context enablement

- **Shop System** (Earlier)
  - Visual weapon grid with color-coding by type
  - Item cards with detailed stats
  - Weapon selling mechanism
  - One item purchase per round limit

- **Battle Arena Background** (Earlier)
  - Visual arena for combat
  - Improved enemy visibility

### Added - Audio
- **Background Music** (Earlier)
  - Game music with 27-second loop
  - Character select screen music
  - Proper audio context management
  - Music stops on scene transitions

### Changed - Game Balance
- **Difficulty Adjustments** (Earlier)
  - Enemy count multiplier: 2x (reduced from 10x)
  - Starting gold: 200 (increased)
  - Stat impact: 0.25x (reduced for balance)
  - Strength damage scaling: 5% per point (increased from 1%)
  - Player movement speed: Reduced
  - Enemy multiplier: 2x with increased starting gold

- **Health System** (Earlier)
  - Vitality now increases max health (10 HP per point)
  - Max health based solely on vitality
  - Health set to max after stat/item modifications

### Fixed - Critical Bugs
- **Projectile System** (2026-01-26)
  - Fixed Phaser Graphics API usage (lineTo instead of quadraticCurveTo)
  - Unified projectile class for player and enemy projectiles
  - Proper enemy-specific spawn offsets

- **Character Sprites** (2026-01-26)
  - Fixed stats text overflow in character select boxes
  - Fixed barbarian sprite proportions and weapon visibility
  - Fixed wizard sprite proportions and staff visibility

- **Scene Management** (Earlier)
  - Properly stop scenes during transitions
  - Stop music when transitioning between scenes
  - Fix duplicate scene starts

- **Combat System** (Earlier)
  - Fix enemy collision detection with Container-based enemies
  - Properly render colored enemy sprites
  - Fix weapon range indicator removal
  - Spawn projectiles from weapon sprite positions

- **Shop System** (Earlier)
  - Persist random item selection per round
  - Fix item box height to fit all stats
  - Auto-equip purchased weapons
  - Disable weapon purchases when player has 6 weapons

- **Player System** (Earlier)
  - Invincibility frames properly expire after 0.25s
  - Use camera dimensions for movement bounds
  - Change PlayerCharacter from Sprite to Container

- **Enemy System** (Earlier)
  - Use camera dimensions for spawn positions
  - Safe enemy spawning
  - Fix enemy animation offsets
  - Extend enemy body rectangles to connect with legs

### Documentation
- **Comprehensive Refactoring Summary** (2026-01-26)
  - Detailed documentation of combat system refactoring
  - Architecture decisions and rationale
  - Component responsibilities

- **Music Integration Guide** (Earlier)
  - Comprehensive guide for audio integration
  - Best practices for Phaser audio

### Testing
- **Unit Test Suite** (Throughout)
  - 176 unit tests covering all major systems
  - Tests for: CombatSystem, Enemy, EnemySpawner, GameManager, Item, PlayerCharacter, ProgressionManager, RoundManager, ShopSystem, Weapon
  - All tests passing after major refactorings

### Infrastructure
- **Project Setup** (Initial)
  - Phaser 3 framework integration
  - Vite build system
  - Jest testing framework with ES modules support
  - ESLint configuration
  - Browser compatibility checks
  - Error handling improvements
  - Full-window game display

## [0.1.0] - Initial Release

### Added
- Core game loop with 20 rounds
- 3 character types (Warrior, Rogue, Mage)
- 20 weapon types with different stats
- 10 item types with bonuses and penalties
- 5 enemy types with difficulty scaling
- Shop system for purchasing weapons and items
- Stat allocation system
- Scene system (Boot, CharacterSelect, Game, Shop, Stats, GameOver, Victory)
- Combat system with automatic attacks
- Progression system with currency and stat points
- Round management system
- Enemy spawning system

---

## Version History Summary

- **v1.3.0** (2026-01-26): Shop redesign with 4-card system and 50 gold refresh option
- **v1.2.1** (2026-01-26): Stats screen header alignment fix
- **v1.2.0** (2026-01-26): Stats screen redesign with clear layout and game-like aesthetic
- **v1.1.1** (2026-01-26): Projectile sprite extraction and refactoring for better maintainability
- **v1.1.0** (2026-01-26): Goblin ranged attacks, bow sprites, combat system refactoring, comprehensive documentation
- **v1.0.0**: Initial game implementation with core features

---

## Contributing

When adding entries to this changelog:
1. Use the format: `- **Feature Name** (Date)` followed by bullet points
2. Group related changes under appropriate categories
3. Use conventional commit types: feat, fix, refactor, docs, test, chore
4. Include relevant file paths when helpful
5. Note breaking changes prominently
