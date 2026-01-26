# Chrome GPU Status Check

Since the issue happens on ALL hostnames and starts at 40 FPS then drops to 30 FPS, this indicates Chrome is actively throttling during gameplay, not based on cached data.

## Step 1: Check Chrome's GPU Status

1. Open Chrome
2. Navigate to: `chrome://gpu`
3. Look for these sections:

### Critical Items to Check:

**Graphics Feature Status** - Should all be "Hardware accelerated":
- Canvas: Hardware accelerated ✅ (if "Software only" ❌ = problem)
- WebGL: Hardware accelerated ✅
- WebGL2: Hardware accelerated ✅
- Rasterization: Hardware accelerated ✅

**Problems Detected** - Should be empty:
- If you see ANY red text here, that's the issue

**Driver Information**:
- Check if Chrome recognizes your GPU correctly

## Step 2: Check for Specific Issues

### Issue 1: Software Rendering
If you see "Software only" for Canvas or WebGL:

**Fix**:
1. Go to `chrome://settings`
2. Search "hardware acceleration"
3. Make sure it's ENABLED
4. Restart Chrome

### Issue 2: GPU Process Crashed
If you see "GPU process crashed":

**Fix**:
```bash
# Clear GPU cache
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/
```

### Issue 3: Blacklisted GPU
If Chrome blacklisted your GPU:

**Fix**:
1. Go to `chrome://flags`
2. Search "ignore-gpu-blocklist"
3. Set to "Enabled"
4. Restart Chrome

## Step 3: Force Hardware Acceleration

Try these Chrome flags:

1. Navigate to `chrome://flags`
2. Enable these:
   - `#ignore-gpu-blocklist` → Enabled
   - `#enable-gpu-rasterization` → Enabled
   - `#enable-zero-copy` → Enabled
3. Restart Chrome

## Step 4: Check macOS Graphics Switching

If you have a MacBook Pro with dual GPUs:

1. System Preferences → Battery (or Energy Saver)
2. Uncheck "Automatic graphics switching"
3. Force it to use discrete GPU

## Step 5: Test with Different Renderer

Try forcing Canvas renderer instead of WebGL:

Edit `src/main.js` and change:
```javascript
type: Phaser.CANVAS, // Instead of Phaser.WEBGL
```

## What to Report Back

After checking `chrome://gpu`, tell me:

1. **Canvas status**: Hardware accelerated or Software only?
2. **WebGL status**: Hardware accelerated or Software only?
3. **Any red warnings** in "Problems Detected" section?
4. **GPU name**: What GPU does Chrome detect?

This will tell us if Chrome is using software rendering (which would explain 30 FPS).
