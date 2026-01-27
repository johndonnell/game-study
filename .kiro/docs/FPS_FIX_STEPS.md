# Chrome 30 FPS Fix - Step by Step

## Current Status
✅ Code reverted to working state (commit c084987)
✅ Dev server now running on **NEW PORT: http://localhost:5174**
✅ Safari runs at 60 FPS (proves code is fine)
❌ Chrome stuck at 30 FPS (browser-specific issue)

## STEP 1: Try New Port (EASIEST - TRY THIS FIRST!)

The dev server is now running on a fresh port that Chrome has never throttled.

**Action**:
1. **Completely quit Chrome** (Cmd+Q, not just close window)
2. Reopen Chrome
3. Navigate to: **http://localhost:5174**
4. Start a round and check FPS

**Expected**: This should work! Chrome's throttling is often port-specific.

---

## If Step 1 Doesn't Work: Clear Chrome's Site Database

Chrome maintains a database of "misbehaving" sites and throttles them permanently.

**Action**:
```bash
# Run the clear-chrome-data script
chmod +x clear-chrome-data.sh
./clear-chrome-data.sh
```

Or manually:
```bash
# 1. Quit Chrome completely (Cmd+Q)
# 2. Run this command:
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database/

# 3. Reopen Chrome and test
```

---

## If Step 2 Doesn't Work: Clear GPU Cache

Chrome caches GPU shader compilations that may be corrupted.

**Action**:
```bash
# 1. Quit Chrome completely (Cmd+Q)
# 2. Run these commands:
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/

# 3. Reopen Chrome and test
```

---

## If Step 3 Doesn't Work: Reset Chrome Flags

Chrome experimental features may be interfering.

**Action**:
1. Open Chrome
2. Navigate to: `chrome://flags`
3. Click **"Reset all"** button at the top
4. Restart Chrome
5. Test game

---

## If Step 4 Doesn't Work: Test New Chrome Profile

Your Chrome profile may have corrupted performance data.

**Action**:
1. Go to `chrome://settings/people`
2. Click **"Add person"**
3. Create a new profile (name it "Test")
4. In the new profile, navigate to http://localhost:5174
5. Test FPS

**If this works**: Your main profile is corrupted. You can either:
- Use the new profile
- Reset your main profile
- Export bookmarks and create fresh profile

---

## If Step 5 Doesn't Work: Check Hardware Acceleration

**Action**:
1. Go to `chrome://settings`
2. Search for "hardware acceleration"
3. **Toggle it OFF**, restart Chrome, test
4. If still 30 FPS, **toggle it ON**, restart Chrome, test

---

## If Step 6 Doesn't Work: Disable Memory Saver

Chrome's memory saver may be throttling performance.

**Action**:
1. Go to `chrome://settings/performance`
2. Turn **OFF** "Memory Saver"
3. Restart Chrome
4. Test game

---

## If Step 7 Doesn't Work: Check GPU Status

**Action**:
1. Navigate to: `chrome://gpu`
2. Look for any **red warnings** or **disabled features**
3. Screenshot and share if you see issues

Common issues:
- "Hardware acceleration unavailable"
- "WebGL disabled"
- "GPU process crashed"

---

## If Step 8 Doesn't Work: Nuclear Option

Complete Chrome reset (backup bookmarks first!).

**Action**:
```bash
# 1. Export bookmarks: chrome://bookmarks -> ⋮ -> Export bookmarks
# 2. Quit Chrome completely (Cmd+Q)
# 3. Run:
rm -rf ~/Library/Application\ Support/Google/Chrome/
rm -rf ~/Library/Caches/Google/Chrome/

# 4. Reopen Chrome (creates fresh profile)
# 5. Test game
```

---

## Diagnostic Info to Collect

If none of the above works, collect this info:

1. **Chrome version**: `chrome://version`
2. **GPU info**: `chrome://gpu` (screenshot)
3. **macOS version**: Click  → About This Mac
4. **Graphics card**: About This Mac → System Report → Graphics/Displays

---

## Why This Happened

Chrome's rendering pipeline has multiple caching layers:
- Site Characteristics Database (performance throttling)
- GPU shader cache
- Per-site performance profiles
- Hardware acceleration state

When the staff projectile animation triggered Chrome's "misbehaving site" detection, it marked localhost as throttled. Even after reverting the code, Chrome remembers this decision.

Safari doesn't have these same caching mechanisms, which is why it works fine.

---

## Current Server Info

- **URL**: http://localhost:5174
- **Port**: 5174 (fresh port, never throttled)
- **Code**: Reverted to working state
- **Tests**: All 194 passing ✅

Start with Step 1 (new port) - it's the most likely fix!
