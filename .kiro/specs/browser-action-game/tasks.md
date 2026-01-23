# Implementation Plan: Browser Action Game

## Overview

This implementation plan breaks down the browser-based action game into discrete coding tasks. The game will be built using Phaser 3 framework with JavaScript (ES6+). Tasks are organized to build incrementally, starting with core infrastructure, then adding game mechanics, and finally integrating all components.

## Tasks

- [x] 1. Set up project structure and Phaser 3 framework
  - Create project directory structure (src/, assets/, tests/)
  - Initialize npm project with package.json
  - Install Phaser 3, Jest, fast-check, and development dependencies
  - Create index.html with canvas element
  - Set up Webpack or Vite for bundling
  - Create main.js to initialize Phaser game instance
  - Configure Jest for testing with jsdom
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 2. Implement core data models and constants
  - [ ] 2.1 Create character type definitions
    - Define CHARACTER_TYPES constant with Warrior, Rogue, and Mage
    - Include base stats and max health for each type
    - _Requirements: 1.1_
  
  - [ ] 2.2 Create weapon type definitions
    - Define WEAPON_TYPES constant with all 20 weapon types
    - Include baseDamage, attackSpeed, range, and cost for each
    - _Requirements: 2.1_
  
  - [ ] 2.3 Create item type definitions
    - Define ITEM_TYPES constant with all 10 item types
    - Include bonuses, penalties, and costs for each
    - Ensure balanced trade-offs (bonuses with penalties)
    - _Requirements: 12.1_
  
  - [ ] 2.4 Create enemy type definitions
    - Define ENEMY_TYPES constant with all 5 enemy types
    - Include base health, damage, speed, and defense
    - _Requirements: 3.1_

- [ ] 3. Implement PlayerCharacter class
  - [ ] 3.1 Create PlayerCharacter class extending Phaser.GameObjects.Sprite
    - Implement constructor with character type parameter
    - Initialize health, baseAttributes, currentAttributes
    - Initialize equippedWeapons and equippedItems arrays
    - _Requirements: 1.1, 1.2_
  
  - [ ] 3.2 Implement movement methods
    - Add move() method with velocity parameters
    - Clamp movement to screen boundaries
    - _Requirements: 1.3_
  
  - [ ]* 3.3 Write property test for character movement
    - **Property 2: Character Movement Updates Position**
    - **Validates: Requirements 1.3**
  
  - [ ] 3.4 Implement health management
    - Add takeDamage() and heal() methods
    - Clamp health between 0 and maxHealth
    - Add isDead() method
    - _Requirements: 4.3, 4.4_
  
  - [ ] 3.5 Implement weapon equipment methods
    - Add equipWeapon() with 6-weapon limit validation
    - Add unequipWeapon() method
    - Add getEquippedWeapons() method
    - _Requirements: 2.3, 2.5_
  
  - [ ]* 3.6 Write property test for weapon equipment limit
    - **Property 5: Equipment Limit Enforced**
    - **Validates: Requirements 2.3, 2.5**
  
  - [ ] 3.7 Implement item equipment methods
    - Add equipItem() method
    - Add unequipItem() method
    - Add getEquippedItems() method
    - Call recalculateAttributes() when items change
    - _Requirements: 12.2, 12.3, 12.8_
  
  - [ ] 3.8 Implement attribute management
    - Add getAttribute() to return current attribute value
    - Add getBaseAttribute() to return base value
    - Add increaseBaseAttribute() for stat point allocation
    - Add recalculateAttributes() to apply item effects
    - _Requirements: 7.3, 12.2, 12.3_
  
  - [ ]* 3.9 Write property test for stat point allocation
    - **Property 18: Stat Point Allocation Increases Attributes**
    - **Validates: Requirements 7.3**

- [ ] 4. Implement Weapon and Item classes
  - [ ] 4.1 Create Weapon class
    - Implement constructor with weaponType parameter
    - Load properties from WEAPON_TYPES constant
    - Add calculateDamage() method using character attributes
    - Add canAttack() method based on attack speed
    - _Requirements: 2.1, 2.4, 2.6_
  
  - [ ]* 4.2 Write property test for weapon damage calculation
    - **Property 3: Character Stats Affect Combat Damage**
    - **Validates: Requirements 1.5**
  
  - [ ] 4.3 Create Item class
    - Implement constructor with itemType parameter
    - Load bonuses and penalties from ITEM_TYPES constant
    - Add applyEffects() method to modify character attributes
    - Add removeEffects() method to restore attributes
    - Add calculateBonus() for percentage and numeric bonuses
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 4.4 Write property test for item bonus application
    - **Property 21: Item Bonuses Apply to Character Stats**
    - **Validates: Requirements 12.2, 12.4, 12.5**
  
  - [ ]* 4.5 Write property test for item penalty application
    - **Property 22: Item Penalties Apply to Character Stats**
    - **Validates: Requirements 12.3**
  
  - [ ]* 4.6 Write property test for multiple item effects
    - **Property 23: Multiple Item Effects Stack**
    - **Validates: Requirements 12.6, 12.7**
  
  - [ ]* 4.7 Write property test for item unequip
    - **Property 24: Item Unequip Removes Effects**
    - **Validates: Requirements 12.8**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Enemy class
  - [ ] 6.1 Create Enemy class extending Phaser.GameObjects.Sprite
    - Implement constructor with enemyType and roundNumber parameters
    - Scale stats based on round number (health, damage)
    - Initialize health, damage, speed, defense properties
    - _Requirements: 3.1, 3.3, 3.4_
  
  - [ ] 6.2 Implement enemy behavior methods
    - Add moveTowards() method to chase player
    - Add takeDamage() method
    - Add isDead() method
    - Add attack() method
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ]* 6.3 Write property test for enemy death removal
    - **Property 10: Zero Health Triggers Removal or Failure**
    - **Validates: Requirements 4.2, 4.4**

- [ ] 7. Implement EnemySpawner class
  - [ ] 7.1 Create EnemySpawner class
    - Implement spawnEnemiesForRound() method
    - Calculate enemy count: 3 + (roundNumber * 2)
    - Apply difficulty scaling formulas for health and damage
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [ ] 7.2 Implement spawn positioning
    - Add getSpawnPosition() to generate valid spawn coordinates
    - Ensure positions are within screen boundaries
    - Add selectEnemyType() based on round number
    - _Requirements: 3.5_
  
  - [ ]* 7.3 Write property test for enemy spawning scaling
    - **Property 7: Enemy Spawning Scales with Round Number**
    - **Validates: Requirements 3.2, 3.3, 3.4**
  
  - [ ]* 7.4 Write property test for spawn positions
    - **Property 8: Enemy Spawn Positions Within Boundaries**
    - **Validates: Requirements 3.5**

- [ ] 8. Implement CombatSystem class
  - [ ] 8.1 Create CombatSystem class
    - Implement calculatePlayerDamage() considering all equipped weapons
    - Implement calculateEnemyDamage() method
    - Apply character attributes to damage calculations
    - _Requirements: 2.4, 2.6, 4.1, 4.3_
  
  - [ ] 8.2 Implement collision detection
    - Add checkWeaponCollisions() for player attacks
    - Add checkEnemyCollisions() for enemy attacks
    - Add applyDamage() method
    - _Requirements: 4.1, 4.3_
  
  - [ ]* 8.3 Write property test for multiple weapons in combat
    - **Property 6: Multiple Equipped Weapons Apply to Combat**
    - **Validates: Requirements 2.4, 2.6**
  
  - [ ]* 8.4 Write property test for collision damage
    - **Property 9: Collision Damage Application**
    - **Validates: Requirements 4.1, 4.3**
  
  - [ ]* 8.5 Write property test for attribute effects on gameplay
    - **Property 19: Attribute Changes Affect Gameplay**
    - **Validates: Requirements 7.5**

- [ ] 9. Implement ProgressionManager class
  - [ ] 9.1 Create ProgressionManager class
    - Initialize currency and availableStatPoints properties
    - Implement calculateCurrencyReward(): 50 + (roundNumber * 25)
    - Implement calculateStatPointReward(): 2 + Math.floor(roundNumber / 5)
    - _Requirements: 6.1, 6.2, 7.1_
  
  - [ ] 9.2 Implement currency management methods
    - Add addCurrency() method
    - Add spendCurrency() with validation
    - Add getCurrency() method
    - _Requirements: 6.3, 6.5_
  
  - [ ] 9.3 Implement stat point management methods
    - Add addStatPoints() method
    - Add spendStatPoint() with validation
    - Add getAvailableStatPoints() method
    - _Requirements: 7.1, 7.3_
  
  - [ ] 9.4 Implement reset method
    - Add reset() to clear all progression on game over
    - _Requirements: 5.5, 5.6_
  
  - [ ]* 9.5 Write property test for rewards
    - **Property 14: Rewards Awarded on Round Completion**
    - **Validates: Requirements 6.1, 6.2, 7.1**
  
  - [ ]* 9.6 Write property test for currency persistence
    - **Property 15: Currency Persists Across Rounds**
    - **Validates: Requirements 6.3, 9.2**
  
  - [ ]* 9.7 Write property test for purchase deduction
    - **Property 16: Purchase Deducts Currency**
    - **Validates: Requirements 6.5**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement ShopSystem class
  - [ ] 11.1 Create ShopSystem class
    - Implement displayAvailableWeapons() method
    - Implement displayAvailableItems() method
    - Create UI elements for shop interface
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 11.2 Implement purchase methods
    - Add purchaseWeapon() with currency validation
    - Add purchaseItem() with currency validation
    - Deduct currency on successful purchase
    - Add items to player inventory
    - _Requirements: 8.4, 8.5, 8.6, 8.7_
  
  - [ ] 11.3 Implement validation methods
    - Add canAffordWeapon() method
    - Add canAffordItem() method
    - Add hasInventorySpace() method
    - _Requirements: 8.4, 8.5_
  
  - [ ]* 11.4 Write property test for purchase validation
    - **Property 17: Purchase Validation Based on Currency**
    - **Validates: Requirements 8.4, 8.5**
  
  - [ ]* 11.5 Write property test for weapon acquisition
    - **Property 4: Weapon Acquisition Adds to Inventory**
    - **Validates: Requirements 2.2, 8.6**
  
  - [ ]* 11.6 Write property test for item acquisition
    - **Property 25: Item Purchase Adds to Inventory**
    - **Validates: Requirements 8.7**

- [ ] 12. Implement RoundManager class
  - [ ] 12.1 Create RoundManager class
    - Initialize currentRound, enemies array, isRoundActive
    - Implement startRound() to spawn enemies
    - Implement updateRound() for game loop
    - _Requirements: 5.1, 5.2_
  
  - [ ] 12.2 Implement round completion logic
    - Add checkRoundComplete() to detect all enemies defeated
    - Add checkRoundFailed() to detect player death
    - Add onRoundComplete() to award rewards and transition
    - Add onRoundFailed() to reset game state
    - _Requirements: 4.4, 4.5, 5.2, 5.4, 5.5, 5.6_
  
  - [ ] 12.3 Implement enemy management
    - Add removeEnemy() method
    - Add getRemainingEnemyCount() method
    - _Requirements: 4.2_
  
  - [ ]* 12.4 Write property test for round completion
    - **Property 11: All Enemies Defeated Completes Round**
    - **Validates: Requirements 4.5**
  
  - [ ]* 12.5 Write property test for round progression
    - **Property 12: Round Progression Advances Sequentially**
    - **Validates: Requirements 5.2**
  
  - [ ]* 12.6 Write property test for failure reset
    - **Property 13: Complete State Reset on Failure**
    - **Validates: Requirements 5.4, 5.5, 5.6**

- [ ] 13. Implement GameManager class
  - [ ] 13.1 Create GameManager class
    - Initialize with Phaser game instance
    - Implement getCurrentRound() and setCurrentRound()
    - Implement resetGame() method
    - _Requirements: 5.4, 5.5, 5.6, 9.5_
  
  - [ ] 13.2 Implement scene transition methods
    - Add startCharacterSelection() method
    - Add startRound() method
    - Add showShop() method
    - Add showStatsAllocation() method
    - Add showGameOver() method
    - Add showVictory() method
    - _Requirements: 5.3, 8.1_
  
  - [ ] 13.3 Implement player data management
    - Add getPlayerData() method
    - Add savePlayerData() method
    - Maintain PlayerData structure across scenes
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ]* 13.4 Write property test for state persistence
    - **Property 20: Game State Persists Within Session**
    - **Validates: Requirements 7.4, 9.1, 9.3, 9.5**

- [ ] 14. Implement Phaser scenes
  - [ ] 14.1 Create BootScene
    - Load all game assets (sprites, sounds, fonts)
    - Handle asset loading errors
    - Transition to CharacterSelectScene on complete
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 14.2 Create CharacterSelectScene
    - Display three character options with stats
    - Handle character selection input
    - Transition to GameScene with selected character
    - _Requirements: 1.1, 1.2_
  
  - [ ] 14.3 Create GameScene
    - Initialize player character at center
    - Set up input handlers for movement
    - Spawn enemies using EnemySpawner
    - Implement game loop with combat system
    - Display HUD (health, round number, currency)
    - _Requirements: 1.3, 1.4, 4.1, 4.3, 10.1, 10.2, 10.3_
  
  - [ ] 14.4 Create ShopScene
    - Display available weapons and items with costs
    - Handle purchase interactions
    - Show current currency balance
    - Transition back to GameScene or StatsScene
    - _Requirements: 8.1, 8.2, 8.3, 10.3_
  
  - [ ] 14.5 Create StatsScene
    - Display current attributes and available stat points
    - Handle stat point allocation
    - Show base vs current attributes (with item effects)
    - Transition to next round
    - _Requirements: 7.2, 10.4_
  
  - [ ] 14.6 Create GameOverScene
    - Display game over message
    - Show final round reached
    - Provide restart button
    - Reset all game state on restart
    - _Requirements: 5.4_
  
  - [ ] 14.7 Create VictoryScene
    - Display victory message
    - Show game completion stats
    - Provide restart button
    - _Requirements: 5.3_

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement UI and visual feedback
  - [ ] 16.1 Create HUD overlay
    - Display health bar with current/max health
    - Display round number
    - Display currency balance
    - Update in real-time during gameplay
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 16.2 Add damage visual feedback
    - Create damage number pop-ups
    - Add screen shake on player damage
    - Add enemy hit flash effect
    - Ensure feedback appears within 100ms
    - _Requirements: 10.5_
  
  - [ ] 16.3 Add weapon and item visual indicators
    - Display equipped weapons around character
    - Show item effects with icons
    - Add visual range indicators for weapons
    - _Requirements: 2.3, 12.2, 12.3_

- [ ] 17. Implement input handling and controls
  - [ ] 17.1 Set up keyboard controls
    - WASD or arrow keys for movement
    - Space or mouse click for attacks
    - ESC for pause menu
    - _Requirements: 1.3_
  
  - [ ] 17.2 Set up mouse/touch controls
    - Click to move towards position
    - Auto-attack nearest enemy
    - Touch support for mobile browsers
    - _Requirements: 1.3_

- [ ] 18. Add game polish and error handling
  - [ ] 18.1 Implement error handling
    - Add boundary clamping for all positions
    - Handle simultaneous death (player priority)
    - Validate all state transitions
    - Add fallback for missing assets
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 18.2 Add browser compatibility checks
    - Check for Canvas support on load
    - Handle missing localStorage gracefully
    - Monitor and display FPS warnings
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 18.3 Optimize performance
    - Implement object pooling for enemies and projectiles
    - Optimize collision detection with spatial partitioning
    - Ensure 60 FPS target on modern browsers
    - _Requirements: 1.4, 11.5_

- [ ] 19. Write integration tests
  - [ ]* 19.1 Test complete round flow
    - Start round, defeat all enemies, receive rewards
    - Verify state transitions between scenes
    - _Requirements: 4.5, 5.2, 6.1, 7.1_
  
  - [ ]* 19.2 Test game over flow
    - Player death triggers game over
    - All state resets correctly
    - Can restart from character selection
    - _Requirements: 5.4, 5.5, 5.6_
  
  - [ ]* 19.3 Test victory flow
    - Complete all 20 rounds
    - Victory screen displays
    - _Requirements: 5.3_
  
  - [ ]* 19.4 Test shop and stat allocation flow
    - Purchase weapons and items
    - Allocate stat points
    - Verify effects apply in next round
    - _Requirements: 8.1, 8.6, 8.7, 7.2, 7.3_

- [ ] 20. Final checkpoint and documentation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify game runs in Chrome, Firefox, Safari, and Edge
  - Test full 20-round playthrough
  - Document any known issues or limitations

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The game uses Phaser 3 framework for rendering and game loop management
- All state is maintained client-side with no backend requirements
