// MongoDB script to insert users directly
// Run this in MongoDB Compass or MongoDB Shell

// Import necessary modules
const { ObjectId } = require("mongodb")
const use = require("use")

// Switch to your database
use("mathwars") // Replace 'mathwars' with your actual database name

// Declare db variable
const db = require("db")

// Insert a system user first
db.users.insertOne({
  _id: ObjectId(),
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
    _id: ObjectId(),
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
    _id: ObjectId(),
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
