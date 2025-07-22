#!/bin/bash

echo "🚀 Setting up MathWars Full Stack Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running (for local development)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Setup environment files
echo "🔧 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your MongoDB URI and JWT secret"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

# Seed the database
echo "🌱 Seeding database..."
cd backend && npm run seed && cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "📝 Available commands:"
echo "   npm run dev              - Start both frontend and backend"
echo "   npm run dev:frontend     - Start only frontend"
echo "   npm run dev:backend      - Start only backend"
echo "   npm run build            - Build both applications"
echo "   npm run seed             - Seed database with sample data"
