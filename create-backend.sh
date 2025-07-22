#!/bin/bash

echo "🚀 Creating MathWars Backend..."

# Create project directory
mkdir -p mathwars-backend
cd mathwars-backend

# Create directory structure
mkdir -p src/{models,routes,middleware,scripts}

# Create package.json
cat > package.json << 'EOL'
{
  "name": "mathwars-backend",
  "version": "1.0.0",
  "description": "Backend API for MathWars - Competitive Mathematics Learning Platform",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/scripts/seedData.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOL

# Create .env.example
cat > .env.example << 'EOL'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mathwars
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000
EOL

# Create .env
cp .env.example .env

echo "✅ Backend structure created!"
echo "📝 Next steps:"
echo "1. cd mathwars-backend"
echo "2. npm install"
echo "3. Copy the source files from v0"
echo "4. npm run seed"
echo "5. npm run dev"
