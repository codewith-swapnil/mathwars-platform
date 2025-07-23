// MongoDB script to insert users directly
// Run this in MongoDB Compass Shell or MongoDB Shell (mongosh)

// Declare the db variable
const db = db.getSiblingDB("yourDatabaseName") // Replace 'yourDatabaseName' with your actual database name

// Clear existing users except system
db.users.deleteMany({ username: { $ne: "system" } })

// Insert a system user first
db.users.insertOne({
  username: "system",
  email: "system@mathtricks.com",
  password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O", // This is a hashed password for "systempassword123"
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

// Insert sample users
db.users.insertMany([
  {
    username: "testuser1",
    email: "test1@example.com",
    password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O", // password: "password123"
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
    password: "$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O", // password: "password123"
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

print("Users inserted successfully!")
print("Total users: " + db.users.countDocuments())
