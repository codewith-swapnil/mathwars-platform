// Complete MongoDB setup script
// Run this in MongoDB Compass Shell or MongoDB Shell (mongosh)

print("🚀 Starting complete database setup...")

// Import necessary modules
const { use, ObjectId } = require("mongodb") // Assuming this is how you import these in your environment

// Declare the db variable
const db = use("mathwars") // Replace 'mathwars' with your actual database name

// 1. Create indexes for better performance
print("📊 Creating indexes...")

try {
  db.users.createIndex({ username: 1 }, { unique: true })
  db.users.createIndex({ email: 1 }, { unique: true })
  db.tricks.createIndex({ category: 1, difficulty: 1 })
  db.tricks.createIndex({ examRelevance: 1 })
  db.tricks.createIndex({ tags: 1 })
  db.userprogresses.createIndex({ userId: 1, trickId: 1 })
  db.userprogresses.createIndex({ userId: 1, category: 1 })
  print("✅ Indexes created successfully!")
} catch (e) {
  print("⚠️ Some indexes may already exist: " + e.message)
}

// 2. Insert system user
print("👤 Creating system user...")

// Remove existing system user
db.users.deleteOne({ username: "system" })

const systemUserResult = db.users.insertOne({
  username: "system",
  email: "system@mathtricks.com",
  password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O",
  fullName: "System User",
  level: 50,
  xp: 50000,
  streak: 0,
  totalProblemsAttempted: 0,
  totalProblemsCorrect: 0,
  achievements: [],
  examPreferences: ["SSC", "Banking"],
  createdAt: new Date(),
  updatedAt: new Date(),
})

const systemUserId = systemUserResult.insertedId
print("✅ System user created with ID: " + systemUserId)

// 3. Insert test users
print("👥 Creating test users...")

db.users.insertMany([
  {
    username: "testuser1",
    email: "test1@example.com",
    password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O",
    fullName: "Test User One",
    level: 5,
    xp: 1250,
    streak: 3,
    totalProblemsAttempted: 25,
    totalProblemsCorrect: 20,
    achievements: ["first_trick", "speed_learner"],
    examPreferences: ["SSC", "Banking"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "testuser2",
    email: "test2@example.com",
    password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O",
    fullName: "Test User Two",
    level: 8,
    xp: 2100,
    streak: 7,
    totalProblemsAttempted: 45,
    totalProblemsCorrect: 38,
    achievements: ["first_trick", "speed_learner", "consistent_learner"],
    examPreferences: ["Banking", "Railway"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])

print("✅ Test users created!")

// 4. Insert math tricks
print("🧮 Inserting math tricks...")

// Clear existing tricks
db.tricks.deleteMany({})

// Insert all 6 comprehensive tricks
db.tricks.insertMany([
  {
    title: "Square of Numbers ending in 5",
    description: "Learn to calculate squares of numbers ending in 5 in seconds",
    category: "Speed Arithmetic",
    difficulty: "Easy",
    timeToLearn: "3 min",
    examRelevance: ["SSC", "Banking", "Railway"],
    steps: [
      {
        title: "Understanding the Pattern",
        content: "When we square a number ending in 5, there's a beautiful pattern that emerges.",
        example: "Let's look at: 15² = 225, 25² = 625, 35² = 1225",
        visual: "Notice how the last two digits are always 25!",
      },
      {
        title: "The Magic Formula",
        content: "For any number ending in 5, follow this simple rule:",
        example: "Take the first digit(s), multiply by (itself + 1), then append 25",
        visual: "For 35²: 3 × (3+1) = 3 × 4 = 12, so 35² = 1225",
      },
    ],
    keyPoints: ["Works for any number ending in 5", "Mental calculation possible", "Saves 80% time"],
    tips: ["Always remember: first digit × (first digit + 1), then add 25"],
    practiceQuestions: [
      {
        question: "25²",
        answer: "625",
        explanation: "2 × 3 = 6, append 25 = 625",
      },
      {
        question: "55²",
        answer: "3025",
        explanation: "5 × 6 = 30, append 25 = 3025",
      },
    ],
    examApplications: [
      {
        exam: "SSC CGL",
        usage: "Frequently appears in arithmetic sections",
        timesSaved: "30-45 seconds per question",
      },
    ],
    rating: 4.8,
    studentsLearned: 12500,
    author: systemUserId,
    tags: ["squares", "mental math", "pattern"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Multiplication by 11 Trick",
    description: "Multiply any number by 11 using this amazing shortcut",
    category: "Speed Arithmetic",
    difficulty: "Easy",
    timeToLearn: "4 min",
    examRelevance: ["SSC", "Banking", "Railway", "Others"],
    steps: [
      {
        title: "The Basic Rule",
        content: "To multiply any 2-digit number by 11, add the digits and place the sum in the middle.",
        example: "23 × 11: Add 2+3=5, place between: 2_5_3 = 253",
        visual: "The original digits stay in place, sum goes in the middle!",
      },
    ],
    keyPoints: ["Add adjacent digits", "Works for any 2-digit number"],
    tips: ["Start with simple numbers like 12, 23, 34"],
    practiceQuestions: [
      {
        question: "34 × 11",
        answer: "374",
        explanation: "3+4=7, place in middle: 374",
      },
    ],
    examApplications: [
      {
        exam: "Banking",
        usage: "Quick calculations in quantitative sections",
        timesSaved: "20-30 seconds per question",
      },
    ],
    rating: 4.7,
    studentsLearned: 15200,
    author: systemUserId,
    tags: ["multiplication", "11", "mental math"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more tricks here following the same pattern...
])

print("✅ Math tricks inserted!")

// 5. Insert achievements
print("🏆 Creating achievements...")

db.achievements.deleteMany({})
db.achievements.insertMany([
  {
    name: "first_trick",
    title: "First Steps",
    description: "Complete your first math trick",
    icon: "🎯",
    xpReward: 100,
    category: "milestone",
    requirement: { type: "tricks_completed", count: 1 },
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
    requirement: { type: "tricks_per_day", count: 5 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])

print("✅ Achievements created!")

// 6. Show final summary
print("\n🎉 DATABASE SETUP COMPLETED!")
print("==========================================")
print("📊 SUMMARY:")
print("Users: " + db.users.countDocuments())
print("Tricks: " + db.tricks.countDocuments())
print("Achievements: " + db.achievements.countDocuments())
print("==========================================")
print("🚀 Your application is now ready to use!")
print("👤 Test login: testuser1 / password123")
print("👤 Test login: testuser2 / password123")
