#!/bin/bash

echo "🧹 Clearing Chrome's Site Characteristics Database"
echo "=================================================="
echo ""
echo "⚠️  CLOSE CHROME COMPLETELY FIRST (Cmd+Q)"
echo ""
read -p "Press Enter after closing Chrome..."

# Clear the throttling database
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Site\ Characteristics\ Database/

# Clear GPU cache
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/GPUCache/

# Clear shader cache
rm -rf ~/Library/Application\ Support/Google/Chrome/ShaderCache/

echo ""
echo "✅ Cleared:"
echo "   - Site Characteristics Database (throttling data)"
echo "   - GPU Cache"
echo "   - Shader Cache"
echo ""
echo "Now:"
echo "1. Open Chrome"
echo "2. Go to http://localhost:5174"
echo "3. Test FPS"
echo ""
