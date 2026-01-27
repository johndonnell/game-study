# Technology Stack

## Core Technologies

- **Phaser 3**: Primary game framework for rendering, physics, and game loop
- **JavaScript (ES6+)**: Core programming language
- **HTML5 Canvas**: Rendering target
- **CSS3**: UI styling for menus and overlays

## Architecture Pattern

Component-based design with clear separation between:
- Game state management
- Rendering (Phaser scenes)
- Game logic (combat, progression, spawning)

## Scene System

The game uses Phaser's scene architecture:
- **BootScene**: Asset loading
- **CharacterSelectScene**: Character selection
- **GameScene**: Main gameplay
- **ShopScene**: Weapon/item purchases
- **StatsScene**: Stat point allocation
- **GameOverScene**: Failure state
- **VictoryScene**: Win state (round 20 completion)

## Testing Framework

### Dual Testing Approach

- **Unit Tests**: Jest for specific examples and edge cases
- **Property-Based Tests**: fast-check for universal correctness properties

### Test Configuration

- Minimum 100 iterations per property test
- Property tests tagged with format: `Feature: browser-action-game, Property {number}: {description}`
- Each correctness property from design.md has a corresponding property-based test

### Test Organization

```
tests/
├── unit/           # Jest unit tests for specific cases
├── property/       # fast-check property-based tests
└── integration/    # Scene transitions and full-round tests
```

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run property-based tests only
npm run test:property

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Browser Compatibility

Target minimum versions:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Minimum performance: 30 FPS on supported browsers.
