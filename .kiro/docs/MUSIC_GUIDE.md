# Adding Music to Your Game

## Quick Start Guide

### 1. Add Music Files

Place your music files in `assets/audio/`:
- `character-select.mp3` - Menu/selection music
- `game-music.mp3` - Combat/gameplay music  
- `shop-music.mp3` - Shop/upgrade music

**Recommended formats:** MP3 (best browser compatibility) or OGG

### 2. Enable Music Loading

In `src/scenes/BootScene.js`, uncomment these lines (around line 70):

```javascript
this.load.audio('character-select-music', 'assets/audio/character-select.mp3');
this.load.audio('game-music', 'assets/audio/game-music.mp3');
this.load.audio('shop-music', 'assets/audio/shop-music.mp3');
```

### 3. Add Music to CharacterSelectScene

Add this to the `create()` method in `src/scenes/CharacterSelectScene.js`:

```javascript
create() {
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;

  // Start character select music
  if (this.sound.get('character-select-music')) {
    this.music = this.sound.add('character-select-music', {
      loop: true,
      volume: 0.5
    });
    this.music.play();
  }

  // ... rest of your create code
}
```

And add cleanup in the `selectCharacter()` method:

```javascript
selectCharacter(characterType) {
  // Stop music when leaving scene
  if (this.music) {
    this.music.stop();
  }
  
  // ... rest of your selectCharacter code
}
```

### 4. Add Music to GameScene

Add this to the `create()` method in `src/scenes/GameScene.js`:

```javascript
create() {
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;

  // Start game music
  if (this.sound.get('game-music')) {
    this.music = this.sound.add('game-music', {
      loop: true,
      volume: 0.4
    });
    this.music.play();
  }

  // ... rest of your create code
}
```

And add cleanup when the scene ends (add this method):

```javascript
shutdown() {
  // Stop music when scene shuts down
  if (this.music) {
    this.music.stop();
  }
}
```

### 5. Add Music to ShopScene

Add this to the `create()` method in `src/scenes/ShopScene.js`:

```javascript
create() {
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;

  // Start shop music
  if (this.sound.get('shop-music')) {
    this.music = this.sound.add('shop-music', {
      loop: true,
      volume: 0.5
    });
    this.music.play();
  }

  // ... rest of your create code
}
```

And add cleanup in the continue button handler:

```javascript
continueBtn.on('pointerdown', () => {
  // Stop music when leaving scene
  if (this.music) {
    this.music.stop();
  }
  
  // ... rest of your continue code
});
```

## Music Configuration Options

```javascript
this.sound.add('music-key', {
  loop: true,        // Loop the music
  volume: 0.5,       // Volume (0.0 to 1.0)
  rate: 1.0,         // Playback speed (1.0 = normal)
  detune: 0,         // Pitch adjustment in cents
  seek: 0,           // Start position in seconds
  delay: 0           // Delay before playing in seconds
});
```

## Free Music Resources

- **OpenGameArt.org** - https://opengameart.org/
- **Freesound.org** - https://freesound.org/
- **Incompetech** - https://incompetech.com/ (Kevin MacLeod)
- **Purple Planet Music** - https://www.purple-planet.com/
- **Bensound** - https://www.bensound.com/
- **ccMixter** - https://ccmixter.org/

## Tips

1. **Keep file sizes small** - Compress your audio files (128-192 kbps MP3 is usually fine)
2. **Use looping tracks** - Make sure your music loops seamlessly
3. **Adjust volumes** - Game music should be quieter (0.3-0.5) than menu music (0.5-0.7)
4. **Test on different browsers** - MP3 has the best compatibility
5. **Add a mute button** - Let players turn off music if they want

## Adding a Mute Button (Optional)

You can add a global mute toggle by storing music state in the registry:

```javascript
// In main.js or BootScene
this.registry.set('musicEnabled', true);

// In any scene
const musicEnabled = this.registry.get('musicEnabled');
if (musicEnabled && this.sound.get('music-key')) {
  this.music = this.sound.add('music-key', { loop: true, volume: 0.5 });
  this.music.play();
}

// Toggle function
toggleMusic() {
  const enabled = this.registry.get('musicEnabled');
  this.registry.set('musicEnabled', !enabled);
  
  if (this.music) {
    if (enabled) {
      this.music.pause();
    } else {
      this.music.resume();
    }
  }
}
```

## Troubleshooting

**Music not playing?**
- Check browser console for loading errors
- Verify file paths are correct
- Make sure files are in `assets/audio/` directory
- Try different audio formats (MP3, OGG, WAV)
- Check that audio files aren't corrupted

**Music continues between scenes?**
- Make sure you're calling `this.music.stop()` when leaving scenes
- Add `shutdown()` methods to clean up music

**Music is too loud/quiet?**
- Adjust the `volume` parameter (0.0 to 1.0)
- Different scenes can have different volumes
