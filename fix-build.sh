#!/bin/bash

# Fix build issues for Render.com deployment
echo "🔧 Fixing build issues for Render.com deployment..."

# Update browserslist database
echo "📦 Updating browserslist database..."
npx update-browserslist-db@latest

# Install the missing babel plugin
echo "🔧 Installing missing babel plugin..."
npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Fix any security vulnerabilities (non-breaking changes only)
echo "🛡️ Fixing security vulnerabilities..."
npm audit fix

# Test the build
echo "🏗️ Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for Render.com deployment."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Commit and push your changes to GitHub"
    echo "2. Deploy to Render.com using the render.yaml configuration"
    echo "3. Set your custom API URLs in the REACT_APP_BASE_URL environment variable"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
