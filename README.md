# Browser Action Game

A browser-based action game where players control characters through 20 progressively difficult rounds, fighting enemies with customizable weapons and stats.

## Features

- 3 character types with unique stats (Warrior, Rogue, Mage)
- 20 weapon types with different characteristics
- 10 item types with strategic trade-offs
- Progressive difficulty across 20 rounds
- Real-time combat system
- Character progression with stat points and currency

## Tech Stack

- **Phaser 3**: Game framework
- **JavaScript (ES6+)**: Core language
- **Vite**: Build tool and dev server
- **Jest**: Testing framework
- **fast-check**: Property-based testing

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
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

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
browser-action-game/
├── src/
│   ├── scenes/          # Phaser scene classes
│   ├── entities/        # Game objects
│   ├── systems/         # Game systems
│   ├── managers/        # Core managers
│   ├── config/          # Configuration data
│   ├── utils/           # Utility functions
│   └── main.js          # Entry point
├── tests/
│   ├── unit/            # Jest unit tests
│   ├── property/        # fast-check property tests
│   └── integration/     # Integration tests
├── assets/              # Game assets
├── public/              # Static files
└── package.json
```

## License

MIT
