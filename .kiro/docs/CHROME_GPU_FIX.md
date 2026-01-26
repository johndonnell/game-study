# Chrome GPU/Rendering Fix for 30 FPS Issue

## The Problem
- 30 FPS in Chrome (even Incognito)
- 60 FPS in Safari
- This means Chrome is using different rendering path than Safari

## Diagnosis Steps

### Step 1: Check Chrome GPU Status
1. Open Chrome
2. Go to `chrome://gpu`
3. Look for "Graphics Feature Status" section
4. Check these specific items:

**Should be "Hardware accelerated":**
- Canvas: Hardware accelerated
- Compositing: Hardware accelerated  
- Multiple Raster Threads: Enabled
- Out-of-process Rasterization: Hardware accelerated
- WebGL: Hardware accelerated
- WebGL2: Hardware accelerated

**If any show "Software only" or "Disabled":**
- Chrome is using CPU rendering instead of GPU
- This causes 30 FPS cap

### Step 2: Force Enable GPU Acceleration

#### Option A: Chrome Flags (Recommended)
1. Go to `chrome://flags`
2. Search and enable these:
   - `#ignore-gpu-blocklist` → **Enabled**
   - `#enable-gpu-rasterization` → **Enabled**
   - `#enable-zero-copy` → **Enabled**
3. Click "Relaunch" at bottom

#### Option B: Chrome Command Line
Close Chrome and restart with flags:
```bash
# Mac
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --ignore-gpu-blocklist \
  --enable-gpu-rasterization \
  --enable-zero-copy \
  --disable-gpu-vsync
```

### Step 3: Check Display Settings

Chrome might be detecting your display incorrectly:

1. **System Preferences > Displays**
2. Check "Refresh Rate" - should be 60Hz or higher
3. If using external monitor, try built-in display
4. Some displays report 59.94Hz which Chrome rounds to 30Hz!

### Step 4: Disable Chrome's Frame Rate Limiting

Chrome has hidden frame rate limiting. Check:

1. Go to `chrome://flags`
2. Search for:
   - `#disable-frame-rate-limit` → **Enabled** (if available)
   - `#enable-webgl-draft-extensions` → **Enabled**
3. Relaunch Chrome

### Step 5: Check for Chrome Beta/Canary Bug

Your Chrome version might have a bug. Check:

1. Go to `chrome://settings/help`
2. Note your version
3. Try Chrome Canary: https://www.google.com/chrome/canary/
4. Canary often has fixes not in stable

## Common Causes

### Cause 1: GPU Blocklist
Chrome maintains a blocklist of "problematic" GPUs. Your GPU might be on it.

**Fix:**
- Enable `#ignore-gpu-blocklist` flag
- This forces Chrome to use GPU even if blocklisted

### Cause 2: Integrated vs Dedicated GPU
Macs with dual GPUs might use integrated GPU for Chrome.

**Check:**
1. Activity Monitor
2. View > Window > GPU History
3. See which GPU Chrome is using

**Fix:**
- System Preferences > Battery > Automatic graphics switching (uncheck)
- Forces dedicated GPU usage

### Cause 3: Chrome's Canvas Rendering Path
Chrome might be using different Canvas rendering than Safari.

**Test:**
Open DevTools Console and run:
```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
console.log('Canvas context:', ctx);
console.log('Backing store pixel ratio:', ctx.webkitBackingStorePixelRatio || 1);
```

### Cause 4: Retina Display Scaling
Chrome might be rendering at 2x resolution for Retina.

**Check in DevTools Console:**
```javascript
console.log('Device pixel ratio:', window.devicePixelRatio);
console.log('Canvas size:', canvas.width, 'x', canvas.height);
```

If devicePixelRatio is 2, Chrome is rendering 4x as many pixels!

## Nuclear Options

### Option 1: Reset Chrome Settings
1. Go to `chrome://settings/reset`
2. Click "Restore settings to their original defaults"
3. Confirm

### Option 2: Reinstall Chrome
1. Completely uninstall Chrome
2. Delete: `~/Library/Application Support/Google/Chrome`
3. Reinstall from https://www.google.com/chrome/

### Option 3: Use Different Chromium Browser
Try these Chromium-based browsers:
- **Brave**: https://brave.com/ (often faster than Chrome)
- **Edge**: https://www.microsoft.com/edge (Chromium-based)
- **Chromium**: https://www.chromium.org/getting-involved/download-chromium

## Workaround: Use Safari for Development

Since Safari works at 60 FPS:
1. Use Safari for game development
2. Test in Chrome occasionally
3. Chrome users will likely have same 30 FPS issue
4. Consider adding browser detection warning

## Report to Chrome Team

If none of this works, it might be a Chrome bug:
1. Go to `chrome://gpu`
2. Click "Copy report to clipboard"
3. File bug: https://bugs.chromium.org/p/chromium/issues/entry
4. Include GPU report and mention "30 FPS cap with Phaser WebGL"

## Quick Test

Run this in Chrome DevTools Console:
```javascript
// Test requestAnimationFrame rate
let frames = 0;
let lastTime = performance.now();

function test() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log(`Actual FPS: ${frames}`);
    if (frames < 50) {
      console.log('❌ Chrome is capping at ~30 FPS');
      console.log('Check chrome://gpu for GPU acceleration status');
    } else {
      console.log('✅ Chrome is running at ~60 FPS');
    }
    return;
  }
  requestAnimationFrame(test);
}

test();
```

This tests Chrome's actual frame rate independent of Phaser.
