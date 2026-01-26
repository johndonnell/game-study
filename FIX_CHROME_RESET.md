# Chrome Suddenly Throttling - Emergency Reset

## Situation
- Game was running at 60 FPS for days
- TODAY it suddenly started throttling to 30 FPS
- Even minimal Phaser test (just a spinning square) drops to 30 FPS
- This indicates Chrome itself changed, not our code

## Likely Causes

### 1. Chrome Auto-Updated (Most Likely)
Chrome may have auto-updated to a version with a Phaser/WebGL bug.

**Check Chrome Version**:
1. Go to `chrome://settings/help`
2. Note the version number
3. Check if it updated recently

**Rollback** (if updated today):
- Unfortunately, Chrome doesn't allow easy rollback
- But we can try disabling the problematic features

### 2. Chrome Flags Changed
Chrome may have auto-enabled an experimental flag.

**Reset ALL Flags**:
1. Go to `chrome://flags`
2. Click **"Reset all"** at the top
3. Restart Chrome
4. Test game

### 3. Hardware Acceleration Broke
Chrome's GPU acceleration may have entered a bad state.

**Reset GPU**:
```bash
# Close Chrome completely (Cmd+Q)

# Delete GPU cache
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Code\ Cache/

# Reopen Chrome
```

### 4. Chrome's Site Isolation Changed
Chrome may have changed site isolation settings.

**Disable Site Isolation**:
1. Go to `chrome://flags`
2. Search "site-per-process"
3. Set to **Disabled**
4. Restart Chrome

### 5. macOS Updated
macOS may have updated and changed GPU drivers.

**Check macOS Version**:
1. Click  → About This Mac
2. Check if macOS updated today
3. If yes, restart Mac again

## Emergency Workaround

Since Safari works fine, use Safari for development until Chrome fixes itself:

```bash
# Safari is the recommended browser for this game on macOS
# Chrome has known performance issues with Phaser on macOS
```

## Nuclear Option: Reinstall Chrome

If nothing works:

```bash
# 1. Export bookmarks (chrome://bookmarks → Export)
# 2. Close Chrome (Cmd+Q)
# 3. Delete Chrome completely:
rm -rf /Applications/Google\ Chrome.app
rm -rf ~/Library/Application\ Support/Google/Chrome/
rm -rf ~/Library/Caches/Google/Chrome/
rm -rf ~/Library/Google/Chrome/

# 4. Download fresh Chrome from google.com/chrome
# 5. Install and test
```

## Diagnostic Steps

### Step 1: Check What Changed
```bash
# Check Chrome version history
ls -la ~/Library/Application\ Support/Google/Chrome/

# Check when Chrome was last updated
stat -f "%Sm" /Applications/Google\ Chrome.app
```

### Step 2: Try Different Chrome Channels
- Chrome Stable (current)
- Chrome Beta
- Chrome Canary

Download from: https://www.google.com/chrome/beta/ or https://www.google.com/chrome/canary/

### Step 3: Check Chrome GPU Status
1. Go to `chrome://gpu`
2. Look for any RED warnings
3. Check "Problems Detected" section
4. Screenshot and analyze

### Step 4: Force Software Rendering
Test if it's a GPU issue:

1. Go to `chrome://flags`
2. Search "disable-accelerated-2d-canvas"
3. Set to **Enabled**
4. Restart Chrome
5. Test (will be slower but should be stable)

## What to Report

If you need to report this to Chrome team:

1. Chrome version: `chrome://version`
2. GPU info: `chrome://gpu`
3. macOS version
4. When it started happening
5. That minimal Phaser test also affected
6. That Safari works fine

## Temporary Solution

**Use Safari for development** until Chrome fixes itself or we identify the specific Chrome change that broke it.

The game code is fine (proven by Safari's 60 FPS and the fact it worked in Chrome for days).
