#!/bin/bash

# Neko-Webscout Render.com Deployment Script
echo "🚀 Preparing Neko-Webscout for Render.com deployment..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is available
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Build React frontend
echo "🏗️ Building React frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build React frontend"
    exit 1
fi

# Install backend dependencies
echo "🐍 Installing Python backend dependencies..."
pip install -r backend/requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Ready for Render.com deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Use these settings:"
echo "   - Build Command: npm run render:build"
echo "   - Start Command: npm run render:start"
echo "   - Environment: Node"
echo ""
echo "Environment variables to set in Render dashboard:"
echo "REACT_APP_ENABLE_WEBSCOUT=true"
echo "REACT_APP_BASE_URL={\"Local Backend\": \"/api\"}"
echo "REACT_APP_SHOW_BALANCE=true"
echo "REACT_APP_SHOW_DETAIL=true"
echo ""
echo "🎉 Happy deploying!"
