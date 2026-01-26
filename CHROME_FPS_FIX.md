# Chrome 30 FPS Fix

## The Problem
Chrome has flagged localhost:3000 as a "low performance" site and is permanently throttling it to 30 FPS, even after code fixes. This is a Chrome-specific issue that doesn't affect Safari.

## Solutions (Try in order)

### Solution 1: Clear Chrome's Site Data
1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to Application tab
3. Click "Clear site data" button
4. Hard refresh (Cmd+Shift+R)

### Solution 2: Use a Different Port
Chrome's throttling is tied to the specific origin (localhost:3000). Change the port:

1. Edit `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change from 3000 to 3001
  open: true
}
```

2. Restart dev server: `npm run dev`
3. Open http://localhost:3001

### Solution 3: Disable Chrome's Performance Throttling
1. Open Chrome flags: `chrome://flags`
2. Search for "throttle"
3. Disable these flags:
   - "Throttle Javascript timers in background"
   - "Intensive throttling of Javascript timers"
4. Restart Chrome

### Solution 4: Use Chrome Incognito Mode
Incognito mode doesn't have the same throttling history:
1. Open Chrome Incognito (Cmd+Shift+N)
2. Navigate to http://localhost:3000
3. Should run at 60 FPS

### Solution 5: Reset Chrome's Performance History
```bash
# Close Chrome completely
# Delete Chrome's performance cache (Mac)
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database
# Restart Chrome
```

### Solution 6: Use Chrome Canary or Chromium
Chrome Canary and Chromium don't share the same performance history:
- Download Chrome Canary: https://www.google.com/chrome/canary/
- Or use Chromium

## Why This Happens
Chrome uses machine learning to identify "low performance" sites and throttles them permanently to save battery/resources. Once flagged, the throttling persists even after the performance issues are fixed. This is why Safari works fine - it doesn't have this aggressive throttling system.

## Verification
After trying a solution, check the FPS counter in the top-right of the game. It should show 60 FPS instead of 30 FPS.
