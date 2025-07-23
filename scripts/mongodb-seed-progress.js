// MongoDB script to insert user progress data
// Run this in MongoDB Compass or MongoDB Shell

// Import necessary modules
const { ObjectId } = require("mongodb")
const use = require("use") // Placeholder for database switching, as MongoDB Shell does not require imports for 'use'
const db = require("db") // Placeholder for database object, as MongoDB Shell does not require imports for 'db'

// Switch to your database
use("mathwars") // Replace 'mathwars' with your actual database name

// Get user IDs
const users = db.users.find({}).toArray()
const tricks = db.tricks.find({}).toArray()

// Clear existing progress
db.userprogresses.deleteMany({})

// Insert sample progress for each user
users.forEach((user) => {
  if (user.username !== "system") {
    // Create progress for some tricks
    const completedTricks = tricks.slice(0, Math.floor(Math.random() * 3) + 1)

    completedTricks.forEach((trick) => {
      db.userprogresses.insertOne({
        _id: ObjectId(),
        userId: user._id,
        trickId: trick._id,
        completed: true,
        completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        timeSpent: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
        practiceScore: Math.floor(Math.random() * 40) + 60, // 60-100%
        attempts: Math.floor(Math.random() * 3) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Create category progress
    const categories = ["Speed Arithmetic", "Percentage", "Banking Math", "Time & Work", "Profit & Loss"]
    categories.forEach((category) => {
      const categoryTricks = tricks.filter((t) => t.category === category)
      const completed = Math.floor(Math.random() * categoryTricks.length)

      db.userprogresses.insertOne({
        _id: ObjectId(),
        userId: user._id,
        category: category,
        tricksCompleted: completed,
        totalTricks: categoryTricks.length,
        averageScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        timeSpent: completed * (Math.floor(Math.random() * 300) + 180), // 3-8 minutes per trick
        lastActivity: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random date within last 3 days
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
  }
})

print("User progress data inserted successfully!")
