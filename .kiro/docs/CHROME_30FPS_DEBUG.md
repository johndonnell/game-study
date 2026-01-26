# Chrome 30 FPS Issue - Deep Debugging Guide

## Current Situation
- **Safari**: 60 FPS ✅
- **Chrome**: 30 FPS ❌ (even after code revert and MacBook restart)
- **Code**: Reverted to working state (commit c084987)

## This Indicates
Chrome has entered a persistent throttled state that survives:
- Page refreshes
- Hard refreshes (Cmd+Shift+R)
- Browser restarts
- MacBook restarts
- Code reverts

## Possible Chrome-Specific Causes

### 1. Site Characteristics Database (Most Likely)
Chrome maintains a database of "misbehaving" sites and throttles them permanently.

**Location**: `~/Library/Application Support/Google/Chrome/Default/Site Characteristics Database/`

**Fix**:
```bash
# Close Chrome completely first!
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database/
```

### 2. Chrome's GPU Process Cache
Chrome caches GPU shader compilations and rendering decisions.

**Fix**:
```bash
# Close Chrome completely
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/
```

### 3. Chrome Flags - Frame Rate Limiting
Chrome may have enabled experimental frame limiting.

**Check**: Navigate to `chrome://flags` and search for:
- `#frame-rate` - Should be "Default"
- `#enable-gpu-rasterization` - Should be "Default" or "Enabled"
- `#ignore-gpu-blocklist` - Try enabling this

**Reset All**: Click "Reset all" button at top of chrome://flags

### 4. Chrome's Per-Site Performance Settings
Chrome tracks performance per domain and may throttle localhost.

**Fix**:
1. Open Chrome DevTools (Cmd+Option+I)
2. Go to Performance tab
3. Click gear icon (⚙️)
4. Uncheck "Enable advanced paint instrumentation"
5. Check "Disable JavaScript samples"

### 5. Hardware Acceleration Issues
Chrome's hardware acceleration may be in a bad state.

**Test**:
1. Go to `chrome://settings`
2. Search for "hardware acceleration"
3. Toggle it OFF, restart Chrome, test
4. Toggle it ON, restart Chrome, test

### 6. Chrome Profile Corruption
Your Chrome profile may have corrupted performance data.

**Test with Fresh Profile**:
1. Go to `chrome://settings/people`
2. Click "Add person"
3. Create new profile
4. Test game in new profile

### 7. Port-Specific Throttling
Chrome may have throttled localhost:3001 specifically.

**Test Different Port**:
```bash
# Stop current server
# Edit vite.config.js to use port 5173 (default)
npm run dev
# Test at http://localhost:5173
```

### 8. Chrome's Background Tab Throttling
Even though tab is active, Chrome may think it's background.

**Check**:
1. Open `chrome://discards`
2. Look for your localhost tab
3. Check if it's marked as "discarded" or "throttled"

### 9. Chrome's Memory Saver Mode
Chrome's new memory saver may be throttling.

**Fix**:
1. Go to `chrome://settings/performance`
2. Turn OFF "Memory Saver"
3. Restart Chrome

### 10. macOS-Specific: Chrome's Metal Backend
Chrome on macOS uses Metal for rendering, which may have issues.

**Test**:
1. Go to `chrome://flags`
2. Search for "metal"
3. Try toggling `#use-angle-metal` to "Disabled"
4. Restart Chrome

## Nuclear Option: Complete Chrome Reset

If nothing else works:

```bash
# 1. Close Chrome completely
# 2. Backup bookmarks/passwords if needed
# 3. Remove Chrome completely
rm -rf ~/Library/Application\ Support/Google/Chrome/
rm -rf ~/Library/Caches/Google/Chrome/
rm -rf ~/Library/Saved\ Application\ State/com.google.Chrome.savedState/

# 4. Restart Chrome (will create fresh profile)
```

## Diagnostic Commands

### Check Chrome Processes
```bash
ps aux | grep Chrome
```

### Check Chrome GPU Status
Navigate to: `chrome://gpu`
Look for any warnings or disabled features.

### Check Chrome Internals
Navigate to: `chrome://system`
Look for performance-related flags.

## Recommended Testing Order

1. ✅ Try different port (easiest)
2. ✅ Clear Site Characteristics Database
3. ✅ Clear GPU Cache
4. ✅ Reset Chrome flags
5. ✅ Test with new Chrome profile
6. ✅ Toggle hardware acceleration
7. ✅ Disable Memory Saver
8. ✅ Check chrome://gpu for issues
9. ✅ Nuclear option: Complete Chrome reset

## Why Safari Works But Chrome Doesn't

Safari and Chrome use different rendering engines:
- **Safari**: WebKit with native macOS rendering
- **Chrome**: Blink + Skia + ANGLE (OpenGL to Metal translation)

Chrome's additional abstraction layers can get into bad states that Safari never encounters.

## Next Steps

Try the fixes in order above. After each fix:
1. Completely quit Chrome (Cmd+Q)
2. Reopen Chrome
3. Navigate to game
4. Check FPS counter

If you find the fix that works, document it so we know the root cause!
