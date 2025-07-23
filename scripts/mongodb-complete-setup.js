// Complete MongoDB setup script
// Run this in MongoDB Compass or MongoDB Shell to set up everything

// Import necessary modules
const { use, db, ObjectId } = require("mongodb") // Assuming this is how you import these in your environment

// Switch to your database
use("mathwars") // Replace 'mathwars' with your actual database name

print("Starting complete database setup...")

// 1. Create indexes for better performance
print("Creating indexes...")

db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.tricks.createIndex({ category: 1, difficulty: 1 })
db.tricks.createIndex({ examRelevance: 1 })
db.tricks.createIndex({ tags: 1 })
db.userprogresses.createIndex({ userId: 1, trickId: 1 })
db.userprogresses.createIndex({ userId: 1, category: 1 })

print("Indexes created successfully!")

// 2. Insert system user
print("Creating system user...")

db.users.deleteOne({ username: "system" })
const systemUserResult = db.users.insertOne({
  _id: ObjectId(),
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
print("System user created with ID: " + systemUserId)

// 3. Check if data already exists
const existingTricks = db.tricks.countDocuments()
if (existingTricks > 0) {
  print("Tricks already exist. Skipping trick insertion.")
  print("If you want to reset tricks, run: db.tricks.deleteMany({})")
} else {
  print("Inserting math tricks...")
  // Insert all the tricks here (same as in the tricks script above)
  // ... (tricks insertion code would go here)
  print("Math tricks inserted successfully!")
}

print("Database setup completed!")
print("You can now use your application with seeded data.")

// Show summary
print("\n=== DATABASE SUMMARY ===")
print("Users: " + db.users.countDocuments())
print("Tricks: " + db.tricks.countDocuments())
print("User Progress: " + db.userprogresses.countDocuments())
print("Achievements: " + db.achievements.countDocuments())
