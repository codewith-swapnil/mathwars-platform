# MathWars Backend API

A comprehensive Node.js backend for the MathWars competitive mathematics learning platform.

## 🚀 Features

- **User Authentication**: JWT-based auth with registration/login
- **Problem Management**: CRUD operations for math problems
- **Progress Tracking**: User progress and statistics
- **Leaderboards**: Global and category-specific rankings
- **Tournaments**: Live competition system
- **Achievements**: Gamification with badges and rewards
- **Real-time Features**: Socket.io for live updates

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

1. **Clone and install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Set up environment variables:**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. **Start MongoDB:**
\`\`\`bash
# Using MongoDB locally
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

4. **Seed the database:**
\`\`\`bash
npm run seed
\`\`\`

5. **Start the server:**
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Problems
- `GET /api/problems` - Get all problems (with filtering)
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems/:id/submit` - Submit solution
- `POST /api/problems/:id/hint` - Get hint

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/user-ranks` - Get user's ranks

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Get user progress

## 🗄️ Database Schema

### User Model
- Authentication info (username, email, password)
- Profile data (fullName, avatar, grade, school)
- Game stats (level, XP, streak)
- Achievements and preferences

### Problem Model
- Content (title, description, solution)
- Metadata (difficulty, topic, XP reward)
- Hints and test cases
- Statistics tracking

### UserProgress Model
- Tracks user's progress on each problem
- Stores attempts, solutions, time spent
- Links users to problems

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## 🎮 Gamification

- **XP System**: Earn points for solving problems
- **Levels**: Automatic leveling based on XP
- **Streaks**: Daily solving streaks
- **Achievements**: Unlock badges for milestones
- **Leaderboards**: Compete with other users

## 🚀 Deployment

### Using PM2 (Recommended)
\`\`\`bash
npm install -g pm2
pm2 start src/server.js --name mathwars-api
pm2 startup
pm2 save
\`\`\`

### Using Docker
\`\`\`bash
docker build -t mathwars-backend .
docker run -p 5000:5000 mathwars-backend
\`\`\`

## 📊 Monitoring

The API includes:
- Health check endpoint (`/api/health`)
- Request logging with Morgan
- Error handling middleware
- Performance monitoring ready

## 🧪 Testing

\`\`\`bash
npm test
\`\`\`

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
