# Setup Custom Hostname to Bypass Chrome Throttling

Chrome's throttling is tied to the hostname (localhost). By using a custom hostname, Chrome will treat it as a completely new site with no throttling history.

## Option 1: Use 127.0.0.1 (Easiest)

Instead of `localhost`, use the IP address directly:

**URL**: `http://127.0.0.1:5174`

This is technically the same as localhost, but Chrome treats it as a different hostname for throttling purposes.

## Option 2: Create Custom Hostname (Recommended)

Add a custom hostname that points to your local machine.

### Steps:

1. **Edit hosts file**:
   ```bash
   sudo nano /etc/hosts
   ```

2. **Add this line** (at the bottom):
   ```
   127.0.0.1    game.local
   ```

3. **Save and exit**:
   - Press `Ctrl+X`
   - Press `Y` to confirm
   - Press `Enter`

4. **Flush DNS cache**:
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

5. **Access game at**:
   ```
   http://game.local:5174
   ```

## Option 3: Use .test Domain (Modern Approach)

macOS automatically resolves `.test` domains to localhost:

**URL**: `http://game.test:5174`

Just try it - no configuration needed!

## Option 4: Configure Vite to Use Custom Host

Update `vite.config.js` to bind to a specific host:

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5174,
    open: true
  }
});
```

Then access via:
- `http://127.0.0.1:5174`
- `http://[your-mac-ip]:5174`
- `http://game.local:5174` (if you set up hosts file)

## Why This Works

Chrome's Site Characteristics Database stores throttling data by hostname:
- `localhost:5174` → throttled
- `127.0.0.1:5174` → clean slate
- `game.local:5174` → clean slate

Each hostname is treated as a completely separate site.

## Recommended: Try 127.0.0.1 First

This is the easiest - just change the URL:

**From**: `http://localhost:5174`
**To**: `http://127.0.0.1:5174`

No configuration needed!
