# Changelog

All notable changes to the Browser Action Game project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.0] - 2026-01-26

### Added - Varied Enemy Movement Patterns
- **Enemy Movement System** (2026-01-26)
  - Created `EnemyMovementSystem.js` for dynamic enemy AI
  - Each enemy type now has unique movement pattern
  - Prevents simple circle-kiting strategies
  - Makes combat more challenging and engaging
  - 18 new unit tests (194 total tests passing)

- **Goblin Movement: Erratic Zigzag** (2026-01-26)
  - Fast, unpredictable side-to-side darting while approaching
  - Zigzag frequency increases as they get closer to player
  - Makes goblins harder to predict and hit
  - Maintains their fast, aggressive nature

- **Orc Movement: Charge Pattern** (2026-01-26)
  - Alternates between slow approach and sudden charges
  - Locks onto player position and charges at 1.5x speed
  - Brief pause after reaching target before next charge
  - 3-5 second cooldown between charges
  - Creates dangerous burst movement moments

- **Troll Movement: Relentless Pursuit** (2026-01-26)
  - Slow but unstoppable direct movement
  - No fancy patterns, just steady forward momentum
  - Cannot be kited indefinitely due to consistent pressure
  - Maintains troll's tank-like nature

- **Demon Movement: Circle-Strafe** (2026-01-26)
  - Maintains optimal range (200-300 pixels) from player
  - Circles around player while adjusting distance
  - Moves closer if too far, retreats if too close
  - Changes circle direction every 2-4 seconds
  - Makes demons difficult to pin down

- **Dragon Movement: Tactical Positioning** (2026-01-26)
  - Prefers long range (350+ pixels) for fireball attacks
  - Retreats at 1.3x speed when player gets within 200 pixels
  - Maintains safe distance with slight strafing
  - Stops retreating after 2 seconds or reaching safe range
  - Creates challenging ranged boss encounters

- **Implementation Details** (2026-01-26)
  - State tracking per enemy (strafe direction, charge timers, etc.)
  - Frame-rate independent movement calculations
  - Proper cleanup on enemy death and scene shutdown
  - Integrated into GameScene update loop
  - Replaces simple `moveTowards()` direct pursuit
  - All movement patterns use delta time for consistency

## [1.10.1] - 2026-01-26

### Changed - Shop Layout Reorganization
- **Vertical Sidebar Layout** (2026-01-26)
  - Reorganized shop screen with vertical sidebars
  - Sell weapons moved to right side, displayed vertically top-to-bottom
  - Equipped items displayed on left side, vertically top-to-bottom
  - Shop cards remain centered in the middle
  - Better use of screen space with sidebar layout
  
- **Left Sidebar - Equipped Items** (2026-01-26)
  - Title: "EQUIPPED ITEMS" in cyan
  - Positioned at x=90 (left side)
  - Items displayed vertically with 70px spacing
  - Shows item name, first bonus (green), first penalty (red)
  - Cyan borders matching item theme
  - 140x60px boxes
  - Read-only display (no interaction)
  
- **Right Sidebar - Sell Weapons** (2026-01-26)
  - Title: "SELL WEAPONS" in orange with "(50% value)" subtitle
  - Positioned at x=width-90 (right side)
  - Weapons displayed vertically with 70px spacing
  - Shows weapon name, sell value, and SELL button
  - Orange borders matching weapon theme
  - 140x60px clickable boxes
  - Hover effects with green border and scale
  - Red "SELL" text for clear action
  
- **Improved Layout** (2026-01-26)
  - Sidebars start at y=200 (below shop cards)
  - Maximum 6 items per sidebar (inventory limits)
  - Vertical layout more scalable than horizontal
  - Clear visual separation between buy (center) and sell (right)
  - Items display shows what player currently has equipped
  - All 176 tests passing

## [1.10.0] - 2026-01-26

### Added - Weapon Selling in Shop
- **Sell Weapons Functionality** (2026-01-26)
  - Added weapon selling section to shop screen
  - Displays all equipped weapons as clickable sell buttons
  - Weapons sell for 50% of their purchase cost
  - Section appears below shop cards, above action buttons
  - Styled to match existing shop theme
  - Orange weapon borders consistent with weapon cards
  - Hover effects with green border and scale animation
  - Shows weapon type and sell value in gold
  - "SELL" text in red for clear action indication
  - Clicking weapon removes it from inventory and adds gold
  - Currency immediately updated and scene refreshes
  - Section only appears if player has weapons equipped
  - Weapons displayed horizontally with 120px spacing
  - Maximum 6 weapons can be displayed (inventory limit)
  - All 176 tests passing

## [1.9.2] - 2026-01-26

### Refactored - Background System Architecture
- **Background Module Extraction** (2026-01-26)
  - Extracted background rendering logic from GameScene into separate modules
  - Created `src/systems/backgrounds/` directory for background components
  - Created `ArenaBackground.js` - Classic arena rendering (Rounds 1-5)
  - Created `CaveBackground.js` - Dark cave rendering (Rounds 6-10)
  - Created `HellBackground.js` - Hellish environment rendering (Rounds 11-15)
  - Created `CastleBackground.js` - Medieval castle rendering (Rounds 16-20)
  - Created `BackgroundManager.js` - Centralized background selection and rendering
  - Reduced GameScene from ~540 lines to ~250 lines
  - GameScene now simply calls `BackgroundManager.renderBackground()`
  - Follows same component-based pattern as shop system refactoring
  - Each background module is self-contained and testable
  - Improved code organization and maintainability
  - No functionality changes - pure refactoring
  - All 176 tests passing

## [1.9.1] - 2026-01-26

### Fixed - Shop Currency Sync Issue
- **Currency Synchronization** (2026-01-26)
  - Fixed issue where weapons couldn't be purchased in shop on round 1
  - Root cause: ProgressionManager currency not synced with playerData currency
  - CharacterSelectScene sets currency in both places, but ProgressionManager could be out of sync
  - Added currency sync in ShopScene.create() to ensure consistency
  - ProgressionManager now syncs with playerData currency on shop entry
  - PlayerData is treated as source of truth for currency
  - Added console logging for debugging currency sync issues
  - Players can now purchase weapons with their starting 600 gold
  - All 176 tests passing

## [1.9.0] - 2026-01-26

### Added - Dynamic Battle Backgrounds
- **Progressive Environment Changes** (2026-01-26)
  - Battle arena background now changes based on round progression
  - Four distinct environments matching enemy difficulty tiers
  
- **Arena Background (Rounds 1-5)** (2026-01-26)
  - Classic sandy stone arena with tile pattern
  - Corner pillars and battle wear marks
  - Center combat zone circles
  - Light tan/sand color scheme

- **Cave Background (Rounds 6-10)** (2026-01-26)
  - Dark cave environment when trolls appear
  - Rocky dark gray/brown floor
  - Stalactites hanging from ceiling
  - Stalagmites rising from floor
  - Glowing purple/blue crystals for ambient light
  - Rough cave walls

- **Hell Background (Rounds 11-15)** (2026-01-26)
  - Hellish environment when demons appear
  - Dark red floor with lava cracks
  - Glowing orange/red lava pools
  - Burning ember particles
  - Fire glow borders
  - Intense red/orange color scheme

- **Castle Background (Rounds 16-20)** (2026-01-26)
  - Medieval castle when dragons appear
  - Gray stone brick floor pattern
  - Castle walls with battlements (crenellations)
  - Glowing torches on walls
  - Red banner with gold emblem
  - Floor cracks showing wear
  - Fortress atmosphere

- **Implementation Details** (2026-01-26)
  - Created `determineBackgroundType()` method for round-based selection
  - Refactored `createArenaBackground()` to support multiple types
  - Separate rendering methods for each environment
  - All backgrounds use procedural generation for variety
  - Backgrounds set to depth -1 to stay behind gameplay elements
  - All 176 tests passing

## [1.8.1] - 2026-01-26

### Added - Crossbow Weapon Sprite
- **Crossbow Visual Sprite** (2026-01-26)
  - Created `CrossbowSprite.js` sprite module for crossbow weapons
  - Horizontal bow design mounted on wooden stock
  - Features brown wooden stock with trigger mechanism
  - Dark wood/metal horizontal bow limbs with metal reinforced tips
  - Light grey bowstring connecting limbs to stock
  - Metal bolt/arrow rest on top of stock
  - Leather grip wrapping detail
  - Distinct from vertical bow design (crossbow is horizontal/mechanical)
  - Added to GameScene weapon sprite switch statement
  - Crossbows now display proper sprite instead of fallback graphic
  - All 176 tests passing

## [1.8.0] - 2026-01-26

### Added - Troll and Demon Ranged Attacks
- **Troll Rock Throw Attack** (2026-01-26)
  - Trolls now throw giant boulders at the player
  - Created `RockProjectile.js` sprite module with large textured boulder
  - Rock features gray stone with darker spots, highlights, and brown dirt patches
  - Slow tumbling animation (0.75 rotations per second)
  - Attack cooldown: 3.5s (slowest ranged enemy)
  - Attack range: 180px (very short range, trolls are slow and clumsy)
  - Projectile speed: 150px/s (very slow, easy to dodge but hits hard)
  - Large 12px radius boulder for visual impact

- **Demon Fireball Attack** (2026-01-26)
  - Demons now cast fireballs at the player
  - Reuses existing `FireballProjectile.js` sprite (orange/red/yellow gradient)
  - Attack cooldown: 1.2s (fastest ranged enemy)
  - Attack range: 350px (longest range, demons are magical)
  - Projectile speed: 400px/s (very fast, hard to dodge)
  - Makes demons the most dangerous ranged threat

- **All Enemies Now Have Ranged Attacks** (2026-01-26)
  - All 5 enemy types can now attack at range
  - Goblin: Fast spears (1.5s, 250 range, 350 speed)
  - Orc: Medium axes (2.5s, 200 range, 300 speed)
  - Troll: Slow rocks (3.5s, 180 range, 150 speed)
  - Demon: Fast fireballs (1.2s, 350 range, 400 speed)
  - Dragon: Cone fireballs (2s, 300 range, 250 speed)
  - Modified `Enemy.js` to include TROLL and DEMON in ranged capabilities
  - Updated `CombatSystem.checkEnemyRangedAttacks()` with speed/range for all types
  - Updated `ProjectileManager.createEnemyProjectile()` with spawn offsets
  - Updated `Projectile.js` to support TROLL and DEMON enemy types
  - All 176 tests passing

## [1.7.1] - 2026-01-26

### Fixed - Projectile Rotation Timing
- **Frame-Rate Independent Rotation** (2026-01-26)
  - Fixed projectile rotation to be frame-rate independent
  - Changed rotation calculation to multiply by deltaSeconds
  - Previously rotation speed was constant per frame (frame-rate dependent)
  - Now rotation speed is consistent regardless of frame rate
  - Affects spinning projectiles: axes, shurikens
  - Ensures smooth, consistent spinning animation at any FPS
  - All 176 tests passing

## [1.7.0] - 2026-01-26

### Added - Orc Throwing Axe Attack
- **Orc Ranged Attack Capability** (2026-01-26)
  - Orcs now have ranged attack capability with throwing axe projectiles
  - Created `AxeProjectile.js` sprite module with spinning double-bladed axe visual
  - Axe features brown wooden handle and metallic gray blades with highlights
  - Spinning animation (2 full rotations per second) for realistic throwing motion
  - Attack cooldown: 2.5s (slower than goblins, between goblin and dragon)
  - Attack range: 200px (shortest range, orcs prefer melee but can throw)
  - Projectile speed: 300px/s (medium speed)
  - Modified `Enemy.js` to include ORC in ranged attack capabilities
  - Updated `CombatSystem.checkEnemyRangedAttacks()` to handle orc projectiles
  - Updated `ProjectileManager.createEnemyProjectile()` with orc spawn offset
  - Updated `Projectile.js` to support ORC enemy type
  - All 176 tests passing

## [1.6.0] - 2026-01-26

### Added - Dragon Multi-Projectile Attack
- **Dragon Cone Attack Pattern** (2026-01-26)
  - Dragons now fire 3 fireballs simultaneously in a cone pattern
  - Center fireball fires straight at player
  - Left and right fireballs spread at 15-degree angles
  - Creates more challenging and visually impressive dragon attacks
  - Maintains same attack cooldown (2s) and range (300px)
  - Goblins continue to fire single spear projectile
  - All projectiles calculated based on angle to player for accurate targeting
  - Modified `CombatSystem.checkEnemyRangedAttacks()` to detect dragon type
  - Each fireball deals full dragon damage (30 base + scaling)
  - All 176 tests passing

## [1.5.6] - 2026-01-26

### Fixed - Game Over Stats Alignment
- **Aligned Stats with Info Box** (2026-01-26)
  - Moved left column from x=-200 to x=-280 (aligns with info box left edge)
  - Moved right column from x=200 to x=20 (better spacing)
  - Stats now align with the 600px wide info box (±300 from center)
  - Left column starts at info box left edge + 20px padding
  - Creates clean visual alignment with round info box above
  - Maintains proper spacing between stat columns
  - Professional, organized layout

## [1.5.5] - 2026-01-26

### Fixed - Game Over Stats Positioning and Data Accuracy
- **Fixed Stats Positioning** (2026-01-26)
  - Moved stats down to y=340 (from y=320) to be clearly below info box
  - Reduced info box height to 180 (from 240) to better fit content
  - Adjusted info box position to y=200 for optimal spacing
  - Moved buttons down to y=470 (from y=450) for proper spacing
  - Stats now properly positioned below round info with no overlap
  - All elements centered and visually separated

- **Fixed Critical Data Loss Bug** (2026-01-26)
  - **Root Cause**: `resetGame()` was called BEFORE `showGameOver()`, clearing all player data
  - **Solution**: Save player stats (currency, weapons, items, character) BEFORE reset
  - Pass saved stats object to GameOverScene instead of reading from cleared playerData
  - Gold amount now shows actual currency at time of death (was showing 0)
  - Weapon count now shows actual equipped weapons (was showing 0/6)
  - Item count now shows actual equipped items (was showing 0)
  - Character name correctly displayed
  - Console logging added to verify accurate final stats
  - This was a critical bug causing all stats to display as zero/empty

## [1.5.4] - 2026-01-26

### Fixed - Game Over Screen Layout and Stats
- **Fixed Overlapping Elements** (2026-01-26)
  - Moved title up to y=50 (from y=60)
  - Moved info box down to y=220 (from y=180) to avoid title overlap
  - Increased info box height to 240 (from 200) for better spacing
  - Adjusted round label and value positions to fit properly in info box
  - Moved message down to y=260 (from y=240)
  - Moved stats down to y=320 (from y=300) to avoid message overlap
  - Moved buttons down to y=450 (from y=420) to avoid stats overlap
  - All elements now properly spaced with no overlapping boxes

- **Ensured Accurate Stats Display** (2026-01-26)
  - Added console logging to verify player data accuracy
  - Character name now correctly displays selected character
  - Gold amount accurately reflects player's currency at death
  - Weapon count shows actual number of equipped weapons (X/6)
  - Item count shows actual number of equipped items
  - Stats now accurately reflect player state when they died
  - Fixed color coding for character name (cyan instead of default)

## [1.5.3] - 2026-01-26

### Fixed - Game Over Screen Brightness
- **Brightened Game Over Screen** (2026-01-26)
  - Lightened background gradient for better visibility
  - Changed title border from dark red to bright pink (matches game theme)
  - Brightened title color for better contrast
  - Changed round label from gray to white
  - Brightened info box background and border
  - Increased skull decoration visibility
  - Disabled vignette effect (was making screen too dark)
  - Brightened stats labels from dark gray to light gray
  - Overall brightness now matches other scenes (shop, stats, character select)
  - Screen is no longer too dark to read comfortably

## [1.5.2] - 2026-01-26

### Fixed - Shop Currency Display
- **Shop Refresh Currency Sync** (2026-01-26)
  - Fixed currency display not updating after shop refresh
  - Now syncs progressionManager currency to playerData after spending on refresh
  - Ensures displayed gold value is accurate after reroll
  - Matches the pattern used in ShopPurchaseHandler for consistency
  - Currency is properly deducted and saved before scene restart

## [1.5.1] - 2026-01-26

### Changed - Game Over Screen Redesign
- **Professional Game Over Screen** (2026-01-26)
  - Complete visual overhaul to match other scenes' design language
  - Added decorative title box with border and animated skull decorations
  - Added info box with gradient background for better organization
  - Round number displayed prominently with pulsing animation
  - Comprehensive stats display: character, gold, weapons, items
  - Two-button layout: "Try Again" (restart) and "Main Menu" (return to start)
  - Screen shake effect on entry for dramatic impact
  - Vignette effect for atmospheric depth
  - Theme-based configuration for all styling
  - Organized code structure with focused rendering methods
  - Matches professional design of shop, stats, and character select scenes

## [1.5.0] - 2026-01-26

### Added - Scene Theme Configuration
- **Theme Configuration Extraction** (2026-01-26)
  - Created `startSceneTheme.js` for title screen styling (colors, fonts, animations, particles)
  - Created `characterSelectTheme.js` for character selection styling (character boxes, stats, glows)
  - Created `statsSceneTheme.js` for stat allocation styling (rows, columns, buttons, colors)
  - Created `gameOverSceneTheme.js` for game over screen styling (title, stats, button)
  - Created `victorySceneTheme.js` for victory screen styling (title, confetti, effects)
  - Each theme includes comprehensive configuration: colors, fonts, strokes, layout, animations
  - Provides single source of truth for visual design across all scenes
  - Enables easy theme customization and A/B testing
  - Supports future features like dark mode or colorblind mode
  - Consistent with shop scene refactoring architecture (v1.4.0)

## [1.4.0] - 2026-01-26

### Changed - Shop Architecture Refactoring
- **Complete Shop System Refactoring** (2026-01-26)
  - Reduced ShopScene from 600+ lines to ~150 lines of orchestration code
  - Extracted theme configuration into `src/config/shopTheme.js`
  - Created `ShopCardGenerator` for card generation logic with Fisher-Yates shuffle
  - Created `ShopButton` component for reusable button creation
  - Created `ShopLayout` utility for position calculations
  - Created `ShopCard` base class with `WeaponCard` and `ItemCard` renderers
  - Created `ShopPurchaseHandler` for transaction management
  - Created `ShopState` for state management and card tracking
  - Separated concerns: UI rendering, business logic, state management, layout
  - All components testable in isolation
  - Single source of truth for styling (SHOP_THEME)
  - Improved maintainability and code organization
  - No functionality changes - pure refactoring
  - All 176 tests passing

## [1.3.2] - 2026-01-26

### Fixed - Shop Card Generation
- **Improved Shop Card Generation** (2026-01-26)
  - Added error handling for insufficient weapons/items
  - Added validation to ensure 4 cards are always generated
  - Added fallback logic if not enough items available
  - Items are properly included in the remaining 2 card slots
  - Console error logging for debugging shop generation issues
  - Ensures shop always displays 4 cards (at least 2 weapons)

## [1.3.1] - 2026-01-26

### Fixed - Shop Layout
- **Shop Card Sizing** (2026-01-26)
  - Reduced card size from 200×250px to 180×200px
  - Adjusted card starting position from y=200 to y=180
  - Reduced padding between cards from 20px to 15px
  - Scaled down all font sizes proportionally
  - Moved refresh button up (y=-110) and made smaller (220×45px)
  - Reduced continue button size to 280×50px
  - Fixed overlap between cards and buttons at bottom of screen
  - All elements now fit properly without overlapping

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

- **v1.3.2** (2026-01-26): Shop card generation improvements with error handling
- **v1.3.1** (2026-01-26): Shop card sizing fix to prevent overlap with buttons
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
