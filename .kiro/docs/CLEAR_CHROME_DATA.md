# Complete Chrome Data Clearing Guide

## Step 1: Clear Site Data in Chrome DevTools

1. Open Chrome and go to `http://localhost:3001`
2. Open DevTools (Cmd+Option+I or F12)
3. Go to **Application** tab
4. In left sidebar, click **Storage**
5. Click **"Clear site data"** button
6. Confirm the action

## Step 2: Clear Chrome's Performance/Throttling Data

### Option A: Via Chrome Settings (Easiest)
1. Go to `chrome://settings/content/all`
2. Search for "localhost"
3. Click on each localhost entry (3000, 3001, etc.)
4. Click **"Clear data"** or **"Remove"**
5. Repeat for all localhost entries

### Option B: Via Chrome Flags (More Thorough)
1. Go to `chrome://flags`
2. Search for these flags and set to **Disabled**:
   - `#intensive-wake-up-throttling`
   - `#throttle-foreground-timers`
   - `#calculate-native-win-occlusion`
3. Click **"Relaunch"** button at bottom

### Option C: Delete Chrome's Site Characteristics Database (Nuclear Option)
```bash
# CLOSE CHROME COMPLETELY FIRST!

# Mac:
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Local\ Storage
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/IndexedDB

# Then restart Chrome
```

## Step 3: Clear Browser Cache

1. In Chrome, press **Cmd+Shift+Delete** (Mac) or **Ctrl+Shift+Delete** (Windows)
2. Select **"All time"** from time range
3. Check these boxes:
   - ✅ Browsing history
   - ✅ Cookies and other site data
   - ✅ Cached images and files
4. Click **"Clear data"**

## Step 4: Hard Refresh

1. Go to `http://localhost:3001`
2. Press **Cmd+Shift+R** (Mac) or **Ctrl+Shift+F5** (Windows)
3. This forces a complete reload bypassing cache

## Step 5: Verify Clean State

Open DevTools Console and run:
```javascript
// Check localStorage
console.log('localStorage:', localStorage);

// Check if any game data exists
console.log('Game tabs:', localStorage.getItem('game_active_tabs'));

// Clear manually if needed
localStorage.clear();
sessionStorage.clear();
```

## Step 6: Alternative - Use Chrome Incognito

If all else fails, use Incognito mode which has no history:
1. Press **Cmd+Shift+N** (Mac) or **Ctrl+Shift+N** (Windows)
2. Go to `http://localhost:3001`
3. Should run at 60 FPS with clean slate

## Step 7: Nuclear Option - Reset Chrome Profile

If nothing works, create a new Chrome profile:
1. Go to `chrome://settings/people`
2. Click **"Add person"** or **"Add profile"**
3. Create new profile (e.g., "Dev Profile")
4. Switch to new profile
5. Go to `http://localhost:3001`

## Verification Checklist

After clearing, verify:
- [ ] No localhost entries in `chrome://settings/content/all`
- [ ] localStorage is empty (check DevTools > Application > Local Storage)
- [ ] No service workers (DevTools > Application > Service Workers)
- [ ] FPS counter shows 60 FPS (not 30)
- [ ] No "(X tabs)" message in FPS counter

## If Still 30 FPS

If you've done all this and still get 30 FPS:

1. **Check your display refresh rate:**
   ```
   System Preferences > Displays > Refresh Rate
   Should be 60Hz or higher
   ```

2. **Check Chrome's GPU status:**
   - Go to `chrome://gpu`
   - Look for "Graphics Feature Status"
   - All should be "Hardware accelerated"
   - If not, GPU might be disabled

3. **Disable Chrome extensions:**
   - Go to `chrome://extensions`
   - Disable all extensions
   - Restart Chrome
   - Test again

4. **Check Activity Monitor:**
   - Open Activity Monitor (Cmd+Space, type "Activity Monitor")
   - Look for "Google Chrome Helper" processes
   - If CPU usage is very high, something else might be wrong

5. **Try Safari or Firefox:**
   - If it works in Safari (which you said it does at 60 FPS)
   - The issue is definitely Chrome-specific
   - Consider using Safari for development

## Quick Test Script

Run this in Chrome DevTools Console:
```javascript
// Test if throttling is active
let frameCount = 0;
let lastTime = performance.now();

function checkFPS() {
  frameCount++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(checkFPS);
}

checkFPS();
// Let it run for 5 seconds, then check console
// Should show ~60 FPS, not ~30 FPS
```
