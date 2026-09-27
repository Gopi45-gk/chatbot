#!/bin/bash

# MNN AI Bot - Vercel Deployment Script
# Run this script to deploy to Vercel

echo "🚀 MNN AI Bot - Deploying to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login check
echo "🔐 Checking Vercel login status..."
vercel whoami

# Build the project
echo ""
echo "📦 Building project..."
npm run build

# Deploy to production
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🎉 Your MNN AI Bot is now live!"
