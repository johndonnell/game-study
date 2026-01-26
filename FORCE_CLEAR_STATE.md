# Force Clear All Game State

If the game state is still persisting, manually clear everything:

## Option 1: Browser Console Commands

Open Chrome DevTools (Cmd+Option+I) and run these commands in the Console tab:

```javascript
// Clear localStorage
localStorage.clear();

// Clear sessionStorage  
sessionStorage.clear();

// Clear IndexedDB
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});

// Clear Service Workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});

// Reload page
location.reload();
```

## Option 2: Chrome DevTools Application Tab

1. Open Chrome DevTools (Cmd+Option+I)
2. Go to **Application** tab
3. In left sidebar, expand **Storage**
4. Click **"Clear site data"** button
5. Check all boxes:
   - Local storage
   - Session storage
   - IndexedDB
   - Web SQL
   - Cookies
   - Cache storage
6. Click **"Clear site data"**
7. Reload page

## Option 3: Chrome Settings

1. Go to `chrome://settings/content/all`
2. Search for "localhost" or "127.0.0.1"
3. Click the trash icon to delete all data
4. Reload page

## Option 4: Nuclear - Clear Everything

```bash
# Close Chrome completely (Cmd+Q)

# Clear ALL Chrome data
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Local\ Storage/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/IndexedDB/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Session\ Storage/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Service\ Worker/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database/

# Reopen Chrome
```

## Verify State is Cleared

After clearing, check the console for these messages:
- `🧹 Clearing existing game instance on page load`
- `✅ Fresh game instance created`

If you see these, the state is being properly cleared.

## Check What's Stored

To see what's currently stored:

```javascript
// Check localStorage
console.log('localStorage:', {...localStorage});

// Check sessionStorage
console.log('sessionStorage:', {...sessionStorage});

// Check IndexedDB
indexedDB.databases().then(dbs => console.log('IndexedDB:', dbs));
```
