#!/bin/bash

echo "🚀 Setting up MathWars Backend..."

# Create project structure
mkdir -p mathwars-backend/src/{models,routes,middleware,scripts,socket}
cd mathwars-backend

# Initialize npm project
npm init -y

# Install dependencies
echo "📦 Installing dependencies..."
npm install express mongoose bcryptjs jsonwebtoken cors helmet express-rate-limit express-validator multer cloudinary nodemailer socket.io redis dotenv morgan compression

# Install dev dependencies
npm install --save-dev nodemon jest supertest

# Create basic .env file
cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mathwars
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
EOL

echo "✅ Setup complete!"
echo "📝 Next steps:"
echo "1. Copy the source files from v0 into the src/ directory"
echo "2. Start MongoDB: mongod"
echo "3. Seed database: npm run seed"
echo "4. Start server: npm run dev"
