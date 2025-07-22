const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Problem = require("../models/Problem")
const Achievement = require("../models/Achievement")
const Tournament = require("../models/Tournament")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mathwars", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...")

    // Clear existing data
    await User.deleteMany({})
    await Problem.deleteMany({})
    await Achievement.deleteMany({})
    await Tournament.deleteMany({})

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@mathwars.com",
      password: "admin123",
      fullName: "Admin User",
      level: 50,
      xp: 50000,
      streak: 100,
    })
    await adminUser.save()

    // Create sample users
    const users = []
    const sampleUsers = [
      { username: "mathqueen2024", email: "sarah@example.com", fullName: "Sarah Chen", xp: 15420, level: 28 },
      { username: "algebramaster", email: "alex@example.com", fullName: "Alex Rodriguez", xp: 14890, level: 27 },
      { username: "geometryguru", email: "emma@example.com", fullName: "Emma Thompson", xp: 14250, level: 26 },
      { username: "calculuskid", email: "david@example.com", fullName: "David Kim", xp: 13680, level: 25 },
      { username: "numberninja", email: "maya@example.com", fullName: "Maya Patel", xp: 13120, level: 24 },
    ]

    for (const userData of sampleUsers) {
      const user = new User({
        ...userData,
        password: "password123",
        stats: {
          totalProblems: Math.floor(Math.random() * 300) + 50,
          correctProblems: Math.floor(Math.random() * 250) + 40,
        },
      })
      users.push(user)
      await user.save()
    }

    // Create achievements
    const achievements = [
      {
        name: "First Steps",
        description: "Solve your first problem",
        icon: "🎯",
        category: "solving",
        condition: { type: "problems_solved", value: 1 },
        rewards: { xp: 50 },
        rarity: "common",
      },
      {
        name: "Problem Solver",
        description: "Solve 10 problems",
        icon: "🧩",
        category: "solving",
        condition: { type: "problems_solved", value: 10 },
        rewards: { xp: 100 },
        rarity: "common",
      },
      {
        name: "Math Master",
        description: "Solve 50 problems",
        icon: "🏆",
        category: "solving",
        condition: { type: "problems_solved", value: 50 },
        rewards: { xp: 250 },
        rarity: "rare",
      },
      {
        name: "Speed Demon",
        description: "Solve a problem in under 5 minutes",
        icon: "⚡",
        category: "speed",
        condition: { type: "speed_solve", value: 300 },
        rewards: { xp: 100 },
        rarity: "rare",
      },
      {
        name: "Streak Warrior",
        description: "Maintain a 7-day solving streak",
        icon: "🔥",
        category: "streak",
        condition: { type: "streak_days", value: 7 },
        rewards: { xp: 150 },
        rarity: "rare",
      },
      {
        name: "Perfectionist",
        description: "Achieve 95% accuracy over 20 problems",
        icon: "💎",
        category: "accuracy",
        condition: { type: "accuracy_rate", value: 95 },
        rewards: { xp: 200 },
        rarity: "epic",
      },
    ]

    for (const achievementData of achievements) {
      const achievement = new Achievement(achievementData)
      await achievement.save()
    }

    // Create sample problems
    const problems = [
      {
        title: "Quadratic Equation Challenge",
        description: "Solve complex quadratic equations with multiple variables",
        content: `Find all real solutions to the equation x² + 6x + 9 = 0, and determine the nature of the roots.

**Requirements:**
1. Find all real solutions
2. Determine the discriminant
3. Classify the nature of the roots
4. Show your complete working

**Additional Questions:**
- What is the vertex of the parabola y = x² + 6x + 9?
- At what point(s) does this parabola intersect the x-axis?`,
        difficulty: "Medium",
        topic: "Algebra",
        xpReward: 150,
        timeLimit: 30,
        hints: [
          { text: "Try factoring the quadratic expression first.", xpPenalty: 10 },
          { text: "Notice that this might be a perfect square trinomial.", xpPenalty: 10 },
          { text: "The discriminant formula is b² - 4ac.", xpPenalty: 15 },
        ],
        solution: {
          explanation: "This is a perfect square trinomial that factors as (x + 3)².",
          steps: [
            "Identify coefficients: a = 1, b = 6, c = 9",
            "Calculate discriminant: Δ = b² - 4ac = 36 - 36 = 0",
            "Since Δ = 0, there is one repeated real root",
            "Factor: x² + 6x + 9 = (x + 3)²",
            "Solve: (x + 3)² = 0, so x = -3",
          ],
          answer: "x = -3 (repeated root)",
        },
        tags: ["quadratic", "factoring", "discriminant"],
        author: adminUser._id,
      },
      {
        title: "Geometric Proof Master",
        description: "Prove geometric theorems using advanced techniques",
        content: `Prove that in any triangle ABC, if D is the midpoint of BC, then AD² = (2AB² + 2AC² - BC²)/4.

**Given:**
- Triangle ABC
- D is the midpoint of BC

**To Prove:**
AD² = (2AB² + 2AC² - BC²)/4

**Instructions:**
Use coordinate geometry or vector methods to prove this theorem.`,
        difficulty: "Hard",
        topic: "Geometry",
        xpReward: 250,
        timeLimit: 45,
        hints: [
          { text: "Consider placing the triangle in a coordinate system.", xpPenalty: 15 },
          { text: "Use the midpoint formula.", xpPenalty: 15 },
          { text: "Apply the distance formula.", xpPenalty: 20 },
        ],
        solution: {
          explanation: "This is the median length formula, provable using coordinate geometry.",
          steps: [
            "Place B at origin (0,0) and C at (2a,0)",
            "Let A be at point (p,q)",
            "D is midpoint of BC, so D = (a,0)",
            "Calculate AD² = (p-a)² + q²",
            "Calculate AB² = p² + q²",
            "Calculate AC² = (p-2a)² + q²",
            "Substitute and simplify to get the formula",
          ],
          answer: "AD² = (2AB² + 2AC² - BC²)/4",
        },
        tags: ["geometry", "proof", "median", "coordinate"],
        author: adminUser._id,
      },
      {
        title: "Number Theory Basics",
        description: "Explore prime numbers and divisibility rules",
        content: `Find all prime numbers p such that p² + 2 is also prime.

**Requirements:**
1. List all such prime numbers p
2. Prove that your list is complete
3. Explain why no other primes work

**Hint:** Consider the cases p = 2, p = 3, and p > 3 separately.`,
        difficulty: "Easy",
        topic: "Number Theory",
        xpReward: 100,
        timeLimit: 20,
        hints: [
          { text: "Start with small primes.", xpPenalty: 5 },
          { text: "Consider remainders when dividing by 3.", xpPenalty: 10 },
          { text: "Think about even and odd numbers.", xpPenalty: 10 },
        ],
        solution: {
          explanation: "Only p = 3 works due to divisibility by 3.",
          steps: [
            "Check p = 2: p² + 2 = 6 (not prime)",
            "Check p = 3: p² + 2 = 11 (prime) ✓",
            "For p > 3: p ≡ 1 or 2 (mod 3)",
            "If p ≡ 1 (mod 3): p² ≡ 1 (mod 3), so p² + 2 ≡ 0 (mod 3)",
            "If p ≡ 2 (mod 3): p² ≡ 1 (mod 3), so p² + 2 ≡ 0 (mod 3)",
            "Therefore p² + 2 is divisible by 3 for all p > 3",
          ],
          answer: "Only p = 3",
        },
        tags: ["prime", "modular", "divisibility"],
        author: adminUser._id,
      },
    ]

    for (const problemData of problems) {
      const problem = new Problem(problemData)
      await problem.save()
    }

    // Create sample tournament
    const tournament = new Tournament({
      name: "Weekly AMC Challenge",
      description: "Test your skills in this weekly competition",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: 120,
      maxParticipants: 500,
      difficulty: "Intermediate",
      topics: ["Algebra", "Geometry"],
      registrationDeadline: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      createdBy: adminUser._id,
    })
    await tournament.save()

    console.log("✅ Database seeded successfully!")
    console.log(`👤 Created ${users.length + 1} users`)
    console.log(`🧩 Created ${problems.length} problems`)
    console.log(`🏆 Created ${achievements.length} achievements`)
    console.log("🎯 Created 1 tournament")

    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    process.exit(1)
  }
}

seedData()
