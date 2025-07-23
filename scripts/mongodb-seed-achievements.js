// MongoDB script to insert achievements data
// Run this in MongoDB Compass Shell or MongoDB Shell (mongosh)

// Declare the db variable
const db = db.getSiblingDB("your_database_name") // Replace 'your_database_name' with your actual database name

// Clear existing achievements
db.achievements.deleteMany({})

// Insert achievement definitions
db.achievements.insertMany([
  {
    name: "first_trick",
    title: "First Steps",
    description: "Complete your first math trick",
    icon: "🎯",
    xpReward: 100,
    category: "milestone",
    requirement: {
      type: "tricks_completed",
      count: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "speed_learner",
    title: "Speed Learner",
    description: "Complete 5 tricks in one day",
    icon: "⚡",
    xpReward: 250,
    category: "speed",
    requirement: {
      type: "tricks_per_day",
      count: 5,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "consistent_learner",
    title: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    xpReward: 500,
    category: "consistency",
    requirement: {
      type: "streak_days",
      count: 7,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "math_master",
    title: "Math Master",
    description: "Complete all tricks in a category",
    icon: "👑",
    xpReward: 1000,
    category: "mastery",
    requirement: {
      type: "category_complete",
      count: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "perfect_score",
    title: "Perfect Score",
    description: "Get 100% on 3 practice sessions",
    icon: "💯",
    xpReward: 300,
    category: "accuracy",
    requirement: {
      type: "perfect_scores",
      count: 3,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "quick_learner",
    title: "Quick Learner",
    description: "Complete a trick in under 2 minutes",
    icon: "⚡",
    xpReward: 150,
    category: "speed",
    requirement: {
      type: "fast_completion",
      timeLimit: 120, // 2 minutes in seconds
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])

print("Achievements inserted successfully!")
print("Total achievements: " + db.achievements.countDocuments())
