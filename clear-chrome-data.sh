#!/bin/bash

# Clear Chrome Data Script for Mac
# This script clears Chrome's site data and performance throttling database

echo "🧹 Chrome Data Clearing Script"
echo "=============================="
echo ""

# Check if Chrome is running
if pgrep -x "Google Chrome" > /dev/null; then
    echo "⚠️  WARNING: Chrome is currently running!"
    echo "Please close Chrome completely before running this script."
    echo ""
    read -p "Press Enter after closing Chrome, or Ctrl+C to cancel..."
fi

echo ""
echo "Clearing Chrome data..."
echo ""

# Chrome profile path
CHROME_PROFILE="$HOME/Library/Application Support/Google/Chrome/Default"

if [ ! -d "$CHROME_PROFILE" ]; then
    echo "❌ Chrome profile not found at: $CHROME_PROFILE"
    echo "Are you sure Chrome is installed?"
    exit 1
fi

# Backup option
read -p "Create backup before clearing? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    BACKUP_DIR="$HOME/Desktop/chrome_backup_$(date +%Y%m%d_%H%M%S)"
    echo "📦 Creating backup at: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    [ -d "$CHROME_PROFILE/Site Characteristics Database" ] && cp -r "$CHROME_PROFILE/Site Characteristics Database" "$BACKUP_DIR/"
    [ -d "$CHROME_PROFILE/Local Storage" ] && cp -r "$CHROME_PROFILE/Local Storage" "$BACKUP_DIR/"
    [ -d "$CHROME_PROFILE/IndexedDB" ] && cp -r "$CHROME_PROFILE/IndexedDB" "$BACKUP_DIR/"
    
    echo "✅ Backup created"
fi

echo ""
echo "Clearing the following:"
echo "  - Site Characteristics Database (performance throttling data)"
echo "  - Local Storage (localStorage data)"
echo "  - IndexedDB (database data)"
echo "  - Service Workers"
echo ""

# Clear Site Characteristics Database (this is the throttling data!)
if [ -d "$CHROME_PROFILE/Site Characteristics Database" ]; then
    echo "🗑️  Removing Site Characteristics Database..."
    rm -rf "$CHROME_PROFILE/Site Characteristics Database"
    echo "   ✅ Done"
else
    echo "   ℹ️  Site Characteristics Database not found (already clean)"
fi

# Clear Local Storage
if [ -d "$CHROME_PROFILE/Local Storage" ]; then
    echo "🗑️  Removing Local Storage..."
    rm -rf "$CHROME_PROFILE/Local Storage"
    echo "   ✅ Done"
else
    echo "   ℹ️  Local Storage not found (already clean)"
fi

# Clear IndexedDB
if [ -d "$CHROME_PROFILE/IndexedDB" ]; then
    echo "🗑️  Removing IndexedDB..."
    rm -rf "$CHROME_PROFILE/IndexedDB"
    echo "   ✅ Done"
else
    echo "   ℹ️  IndexedDB not found (already clean)"
fi

# Clear Service Workers
if [ -d "$CHROME_PROFILE/Service Worker" ]; then
    echo "🗑️  Removing Service Workers..."
    rm -rf "$CHROME_PROFILE/Service Worker"
    echo "   ✅ Done"
else
    echo "   ℹ️  Service Workers not found (already clean)"
fi

echo ""
echo "✨ Chrome data cleared successfully!"
echo ""
echo "Next steps:"
echo "1. Open Chrome"
echo "2. Go to http://localhost:3001"
echo "3. Check FPS counter (should show 60 FPS)"
echo ""
echo "If still 30 FPS, try:"
echo "  - Chrome Incognito mode (Cmd+Shift+N)"
echo "  - Different browser (Safari works at 60 FPS)"
echo "  - Check CLEAR_CHROME_DATA.md for more options"
echo ""
