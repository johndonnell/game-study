# Chrome 30 FPS Issue - VSync/Frame Pacing Investigation

## Current Behavior
- Starts at 36-37 FPS
- Drops to 30 FPS and stays there
- Happens even with:
  - Fresh Chrome restart
  - New port (5174)
  - Simplified animations (1 graphic instead of 7)
  - Code reverted to working state

## This Pattern Suggests

The 30 FPS lock is **exactly half of 60 FPS**, which indicates:
- Chrome is dropping every other frame
- VSync is enabled but Chrome is missing the timing window
- Chrome's compositor is running at 30 Hz instead of 60 Hz

## Possible Causes

### 1. Chrome's Frame Rate Limiter
Chrome may have a hidden frame rate limiter active.

**Test**: Open Chrome DevTools
1. Press Cmd+Option+I
2. Press Cmd+Shift+P (Command Palette)
3. Type "rendering"
4. Select "Show Rendering"
5. Look for "Frame Rendering Stats"
6. Check if there's a frame rate cap

### 2. Chrome's Compositor Thread
Chrome uses a separate compositor thread that may be throttled.

**Check**: Navigate to `chrome://tracing`
1. Click "Record"
2. Select "Rendering" category
3. Record for 5 seconds while game is running
4. Stop and analyze frame timing
5. Look for "missed vsync" or "compositor delays"

### 3. macOS-Specific: Display Refresh Rate
Your Mac's display might be set to 30 Hz.

**Check**:
1. System Preferences → Displays
2. Check "Refresh Rate"
3. Should be 60 Hz (or higher for newer Macs)

### 4. Chrome's Hardware Acceleration State
Chrome's GPU process may be in a degraded state.

**Test**: Navigate to `chrome://gpu`

Look for these specific issues:
- "Canvas: Software only" (should be "Hardware accelerated")
- "WebGL: Software only" (should be "Hardware accelerated")
- "Rasterization: Software only" (should be "Hardware accelerated")

If any say "Software only", Chrome is not using GPU properly.

**Fix**:
1. Go to `chrome://settings`
2. Search "hardware acceleration"
3. Toggle OFF, restart Chrome
4. Toggle ON, restart Chrome

### 5. Chrome Flags - Disable Frame Rate Smoothing
Chrome may be "smoothing" frame rates to 30 FPS.

**Fix**: Navigate to `chrome://flags`

Try these flags:
- `#disable-frame-rate-limit` → Enable
- `#enable-gpu-rasterization` → Enable
- `#ignore-gpu-blocklist` → Enable
- `#disable-accelerated-2d-canvas` → Disable (make sure it's disabled)

Restart Chrome after each change and test.

### 6. Chrome's Site Isolation
Chrome's site isolation may be causing performance issues.

**Test**: Navigate to `chrome://flags`
- Search for "site isolation"
- Try disabling "Strict site isolation"
- Restart Chrome

### 7. External Monitor Issue
If you're using an external monitor, Chrome may be syncing to the wrong display.

**Test**:
1. Disconnect external monitors
2. Test game on MacBook's built-in display only
3. Check if FPS improves

### 8. Chrome's Power Saver Mode
Chrome has a power saver that throttles performance.

**Check**: Navigate to `chrome://settings/performance`
- Disable "Energy Saver"
- Disable "Memory Saver"
- Restart Chrome

### 9. macOS Energy Settings
macOS may be throttling Chrome for power saving.

**Check**:
1. System Preferences → Battery (or Energy Saver)
2. Uncheck "Automatic graphics switching" (if available)
3. Set to "High Performance" mode

### 10. Chrome Profile Corruption (Nuclear Option)
Your Chrome profile may have persistent throttling data.

**Test with Incognito**:
1. Open Chrome Incognito (Cmd+Shift+N)
2. Navigate to http://localhost:5174
3. Test FPS

If Incognito works at 60 FPS, your profile is corrupted.

**Fix**:
```bash
# Backup bookmarks first!
# Then remove Chrome profile:
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/
```

## Diagnostic Test: Disable ALL Animations

I've disabled the sword slash animation completely. Test this:

1. Quit Chrome (Cmd+Q)
2. Reopen Chrome
3. Navigate to http://localhost:5174
4. Start round with 0 weapons equipped
5. Check FPS

**If still 30 FPS with 0 weapons and no animations:**
- The issue is NOT our code
- Chrome has a deeper rendering issue
- Try the fixes above

**If 60 FPS with 0 weapons:**
- The issue IS related to weapon rendering
- We need to optimize weapon sprite updates

## Chrome vs Safari Rendering Differences

**Safari (60 FPS):**
- Uses WebKit + native macOS rendering
- Direct Metal API access
- No compositor thread overhead

**Chrome (30 FPS):**
- Uses Blink + Skia + ANGLE
- OpenGL → Metal translation layer
- Separate compositor thread
- More abstraction = more places to fail

## Next Steps

1. **Test with 0 weapons** (animations now disabled)
2. **Check chrome://gpu** for hardware acceleration status
3. **Try Incognito mode** to rule out profile corruption
4. **Check display refresh rate** in System Preferences
5. **Try chrome://flags fixes** listed above

If none of this works, Chrome may have a fundamental issue with your Mac's GPU/display configuration that Safari doesn't have.

## Alternative: Use Safari for Development

Since Safari consistently runs at 60 FPS, consider:
- Develop in Safari
- Test in Chrome periodically
- Deploy knowing Safari users get full performance

Chrome's rendering pipeline is more complex and has more failure modes than Safari on macOS.
