// MongoDB script to insert user progress data
// Run this in MongoDB Compass Shell or MongoDB Shell (mongosh)

// Declare the db variable
const db = db.getSiblingDB("yourDatabaseName") // Replace 'yourDatabaseName' with your actual database name

// Get user IDs and trick IDs
const users = db.users.find({}).toArray()
const tricks = db.tricks.find({}).toArray()

// Clear existing progress
db.userprogresses.deleteMany({})

// Insert sample progress for each user
users.forEach((user) => {
  if (user.username !== "system") {
    // Create progress for some tricks (randomly select 2-4 tricks)
    const numTricksCompleted = Math.floor(Math.random() * 3) + 2 // 2-4 tricks
    const completedTricks = tricks.slice(0, numTricksCompleted)

    completedTricks.forEach((trick, index) => {
      db.userprogresses.insertOne({
        userId: user._id,
        trickId: trick._id,
        completed: true,
        completedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000), // Completed on different days
        timeSpent: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        practiceScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        attempts: Math.floor(Math.random() * 3) + 1, // 1-3 attempts
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Create category progress summary
    const categories = ["Speed Arithmetic", "Percentage", "Banking Math", "Time & Work", "Profit & Loss"]
    categories.forEach((category) => {
      const categoryTricks = tricks.filter((t) => t.category === category)
      const userCompletedInCategory = completedTricks.filter((t) => t.category === category).length

      if (categoryTricks.length > 0) {
        db.userprogresses.insertOne({
          userId: user._id,
          category: category,
          tricksCompleted: userCompletedInCategory,
          totalTricks: categoryTricks.length,
          averageScore: Math.floor(Math.random() * 25) + 75, // 75-100%
          timeSpent: userCompletedInCategory * (Math.floor(Math.random() * 300) + 180), // Total time
          lastActivity: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000), // Within last 2 days
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })
  }
})

print("User progress data inserted successfully!")
print("Total progress entries: " + db.userprogresses.countDocuments())
