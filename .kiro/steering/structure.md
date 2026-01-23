# Project Structure

## Directory Organization

```
game-study/
├── .kiro/
│   ├── specs/
│   │   └── browser-action-game/
│   │       ├── requirements.md    # Feature requirements and acceptance criteria
│   │       ├── design.md          # Architecture, components, and correctness properties
│   │       └── tasks.md           # Implementation task list
│   └── steering/                  # AI assistant guidance documents
├── src/
│   ├── scenes/                    # Phaser scene classes
│   │   ├── BootScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── GameScene.js
│   │   ├── ShopScene.js
│   │   ├── StatsScene.js
│   │   ├── GameOverScene.js
│   │   └── VictoryScene.js
│   ├── entities/                  # Game objects
│   │   ├── PlayerCharacter.js
│   │   ├── Enemy.js
│   │   ├── Weapon.js
│   │   └── Item.js
│   ├── systems/                   # Game systems
│   │   ├── CombatSystem.js
│   │   ├── EnemySpawner.js
│   │   ├── ProgressionManager.js
│   │   ├── ShopSystem.js
│   │   └── RoundManager.js
│   ├── managers/                  # Core managers
│   │   └── GameManager.js
│   ├── config/                    # Configuration data
│   │   ├── characterTypes.js
│   │   ├── weaponTypes.js
│   │   ├── itemTypes.js
│   │   └── enemyTypes.js
│   ├── utils/                     # Utility functions
│   └── main.js                    # Entry point
├── tests/
│   ├── unit/                      # Jest unit tests
│   ├── property/                  # fast-check property tests
│   └── integration/               # Integration tests
├── assets/                        # Game assets (sprites, audio, etc.)
│   ├── sprites/
│   ├── audio/
│   └── ui/
├── public/                        # Static files
│   └── index.html
└── package.json
```

## File Naming Conventions

- **Classes**: PascalCase (e.g., `PlayerCharacter.js`, `GameManager.js`)
- **Config files**: camelCase (e.g., `weaponTypes.js`, `characterTypes.js`)
- **Test files**: Match source file with `.test.js` suffix (e.g., `PlayerCharacter.test.js`)
- **Property test files**: Descriptive with `-properties.test.js` suffix (e.g., `combat-properties.test.js`)

## Code Organization Principles

### Component Separation

- **Scenes**: Handle UI, rendering, and user input
- **Entities**: Game objects with state and behavior
- **Systems**: Stateless logic that operates on entities
- **Managers**: Coordinate between systems and maintain global state
- **Config**: Static data definitions (no logic)

### State Management

- **PlayerData**: Persistent across rounds (managed by GameManager)
- **GameState**: Current session state
- **Scene-local state**: Temporary state within a scene

### Testing Co-location

- Unit tests can be co-located with source files using `.test.js` suffix
- Property tests organized by feature area in `tests/property/`
- Integration tests in `tests/integration/`

## Import Conventions

Use ES6 module imports:
```javascript
import { WEAPON_TYPES } from '../config/weaponTypes.js';
import PlayerCharacter from '../entities/PlayerCharacter.js';
```

## Configuration Data

All game balance data (weapon stats, enemy stats, character stats, item effects) should be defined in config files, not hardcoded in logic files. This allows easy tuning without touching game logic.

## Spec-Driven Development

This project follows spec-driven development:
1. Requirements define what the system should do
2. Design defines how it should be built
3. Tasks break down implementation into steps
4. Correctness properties define testable guarantees
5. Property-based tests verify those guarantees hold

Always reference the spec documents in `.kiro/specs/browser-action-game/` when implementing features.
