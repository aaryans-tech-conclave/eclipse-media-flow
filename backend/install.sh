#!/bin/bash

echo "🚀 Setting up Google Trends API Backend..."

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo "✅ Backend setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "The server will run on http://localhost:5000"
echo "API endpoints will be available at http://localhost:5000/api/" 