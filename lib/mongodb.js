const mongoose = require("mongoose")

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Auto-migration function
async function runMigrations() {
  try {
    await connectDB()

    // Check if seeding has been done
    const User = require("./models/User")
    const Trick = require("./models/Trick")
    const Achievement = require("./models/Achievement")

    const userCount = await User.countDocuments()
    const trickCount = await Trick.countDocuments()
    const achievementCount = await Achievement.countDocuments()

    console.log(`📊 Current counts - Users: ${userCount}, Tricks: ${trickCount}, Achievements: ${achievementCount}`)

    // If no data exists, run seeding
    if (userCount === 0 || trickCount === 0 || achievementCount === 0) {
      console.log("🌱 Running auto-migration and seeding...")
      await seedDatabase()
      console.log("✅ Auto-migration completed")
    } else {
      console.log("✅ Database already seeded, skipping migration")
    }

    return true
  } catch (error) {
    console.error("❌ Migration error:", error)
    return false
  }
}

// Seeding function
async function seedDatabase() {
  const User = require("./models/User")
  const Trick = require("./models/Trick")
  const Achievement = require("./models/Achievement")
  const UserProgress = require("./models/UserProgress")

  // Create default user
  const defaultUser = await User.create({
    username: "demo_user",
    email: "demo@mathwars.com",
    password: "demo123",
    fullName: "Demo User",
    preferences: {
      examType: "SSC",
      difficulty: "Medium",
      dailyGoal: 3,
    },
  })

  // Create achievements
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first math trick",
      icon: "🎯",
      category: "learning",
      condition: { type: "tricks_completed", value: 1 },
      rewards: { xp: 25 },
      rarity: "common",
    },
    {
      name: "Quick Learner",
      description: "Complete 5 math tricks",
      icon: "⚡",
      category: "learning",
      condition: { type: "tricks_completed", value: 5 },
      rewards: { xp: 50 },
      rarity: "common",
    },
    {
      name: "Math Wizard",
      description: "Complete 10 math tricks",
      icon: "🧙‍♂️",
      category: "learning",
      condition: { type: "tricks_completed", value: 10 },
      rewards: { xp: 100 },
      rarity: "rare",
    },
    {
      name: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      category: "streak",
      condition: { type: "streak_days", value: 7 },
      rewards: { xp: 75 },
      rarity: "rare",
    },
    {
      name: "Perfect Score",
      description: "Get 100% on 3 practice sessions",
      icon: "💎",
      category: "accuracy",
      condition: { type: "perfect_sessions", value: 3 },
      rewards: { xp: 60 },
      rarity: "epic",
    },
    {
      name: "Speed Demon",
      description: "Complete a trick in under 5 minutes",
      icon: "🏃‍♂️",
      category: "speed",
      condition: { type: "speed_completion", value: 300 },
      rewards: { xp: 40 },
      rarity: "rare",
    },
  ]

  await Achievement.insertMany(achievements)

  // Create math tricks
  const tricks = [
    {
      title: "Square of Numbers Ending in 5",
      description: "Quick method to calculate squares of numbers ending in 5",
      category: "Arithmetic",
      difficulty: "Easy",
      examTypes: ["SSC", "Banking", "Railway"],
      xpReward: 50,
      estimatedTime: 10,
      content: {
        introduction:
          "Learn the fastest way to square numbers ending in 5. This trick can save you valuable time in competitive exams.",
        steps: [
          {
            title: "Step 1: Identify the Pattern",
            description: "For any number ending in 5 (like 25, 35, 45), we can use a simple formula.",
            example: "Let's take 25² as an example",
          },
          {
            title: "Step 2: Apply the Formula",
            description: "Take the first digit(s), multiply by (itself + 1), then append 25",
            example: "For 25²: 2 × (2+1) = 2 × 3 = 6, so 25² = 625",
          },
          {
            title: "Step 3: Practice More Examples",
            description: "Try with 35²: 3 × (3+1) = 3 × 4 = 12, so 35² = 1225",
            example: "For 45²: 4 × (4+1) = 4 × 5 = 20, so 45² = 2025",
          },
        ],
        visualExample: {
          problem: "65²",
          solution: "6 × (6+1) = 6 × 7 = 42, so 65² = 4225",
          explanation: "The pattern always works: (first digits) × (first digits + 1) + 25",
        },
        practiceQuestions: [
          {
            question: "Calculate 15²",
            options: ["225", "215", "235", "245"],
            correctAnswer: 0,
            explanation: "1 × (1+1) = 1 × 2 = 2, so 15² = 225",
          },
          {
            question: "Calculate 85²",
            options: ["7225", "7025", "7425", "7125"],
            correctAnswer: 0,
            explanation: "8 × (8+1) = 8 × 9 = 72, so 85² = 7225",
          },
          {
            question: "Calculate 125²",
            options: ["15625", "15525", "15725", "15425"],
            correctAnswer: 0,
            explanation: "12 × (12+1) = 12 × 13 = 156, so 125² = 15625",
          },
        ],
        examApplications: [
          {
            examType: "SSC",
            usage: "Frequently appears in quantitative aptitude sections",
            timesSaved: "30-45 seconds per question",
          },
          {
            examType: "Banking",
            usage: "Common in numerical ability tests",
            timesSaved: "20-30 seconds per question",
          },
        ],
      },
      tags: ["squares", "arithmetic", "speed-math"],
      views: 0,
      rating: 4.8,
      createdAt: new Date(),
    },
    {
      title: "Multiplication by 11 Trick",
      description: "Lightning-fast method to multiply any number by 11",
      category: "Arithmetic",
      difficulty: "Easy",
      examTypes: ["SSC", "Banking", "Railway", "Insurance"],
      xpReward: 60,
      estimatedTime: 12,
      content: {
        introduction:
          "Master the art of multiplying by 11 in seconds. This trick works for any number and is incredibly useful in competitive exams.",
        steps: [
          {
            title: "Step 1: For 2-Digit Numbers",
            description: "Add the two digits and place the sum between them",
            example: "23 × 11: 2 + 3 = 5, so 23 × 11 = 253",
          },
          {
            title: "Step 2: Handle Carrying",
            description: "If the sum is greater than 9, carry over to the left",
            example: "67 × 11: 6 + 7 = 13, write 3 and carry 1, so 67 × 11 = 737",
          },
          {
            title: "Step 3: For Larger Numbers",
            description: "Apply the same principle: add adjacent digits",
            example: "234 × 11: 2_(2+3)_(3+4)_4 = 2574",
          },
        ],
        visualExample: {
          problem: "456 × 11",
          solution: "4_(4+5)_(5+6)_6 = 4_9_11_6 = 5016",
          explanation: "When sum exceeds 9, carry to the left digit",
        },
        practiceQuestions: [
          {
            question: "Calculate 34 × 11",
            options: ["374", "364", "384", "354"],
            correctAnswer: 0,
            explanation: "3 + 4 = 7, so 34 × 11 = 374",
          },
          {
            question: "Calculate 78 × 11",
            options: ["858", "868", "848", "878"],
            correctAnswer: 0,
            explanation: "7 + 8 = 15, write 5 carry 1, so 78 × 11 = 858",
          },
          {
            question: "Calculate 123 × 11",
            options: ["1353", "1343", "1363", "1333"],
            correctAnswer: 0,
            explanation: "1_(1+2)_(2+3)_3 = 1_3_5_3 = 1353",
          },
        ],
        examApplications: [
          {
            examType: "SSC",
            usage: "Direct multiplication questions and percentage calculations",
            timesSaved: "15-25 seconds per question",
          },
          {
            examType: "Banking",
            usage: "Interest calculations and profit-loss problems",
            timesSaved: "20-30 seconds per question",
          },
        ],
      },
      tags: ["multiplication", "arithmetic", "mental-math"],
      views: 0,
      rating: 4.9,
      createdAt: new Date(),
    },
    {
      title: "Percentage to Fraction Conversion",
      description: "Instantly convert common percentages to fractions",
      category: "Percentage",
      difficulty: "Medium",
      examTypes: ["SSC", "Banking", "Railway", "Insurance"],
      xpReward: 75,
      estimatedTime: 15,
      content: {
        introduction:
          "Memorize key percentage-fraction conversions to solve problems lightning fast. Essential for all competitive exams.",
        steps: [
          {
            title: "Step 1: Learn Common Conversions",
            description: "Memorize frequently used percentage-fraction pairs",
            example: "25% = 1/4, 50% = 1/2, 75% = 3/4",
          },
          {
            title: "Step 2: Recognize Patterns",
            description: "Identify patterns in decimal equivalents",
            example: "12.5% = 1/8, 37.5% = 3/8, 62.5% = 5/8",
          },
          {
            title: "Step 3: Apply in Problems",
            description: "Use conversions to simplify calculations",
            example: "Find 33⅓% of 240: 33⅓% = 1/3, so 240 ÷ 3 = 80",
          },
        ],
        visualExample: {
          problem: "Find 16⅔% of 180",
          solution: "16⅔% = 1/6, so 180 ÷ 6 = 30",
          explanation: "Converting to fraction makes division much easier",
        },
        practiceQuestions: [
          {
            question: "What is 12.5% as a fraction?",
            options: ["1/8", "1/6", "1/7", "1/9"],
            correctAnswer: 0,
            explanation: "12.5% = 12.5/100 = 1/8",
          },
          {
            question: "Find 33⅓% of 150",
            options: ["50", "45", "55", "60"],
            correctAnswer: 0,
            explanation: "33⅓% = 1/3, so 150 ÷ 3 = 50",
          },
          {
            question: "What is 83⅓% as a fraction?",
            options: ["5/6", "4/5", "7/8", "3/4"],
            correctAnswer: 0,
            explanation: "83⅓% = 83⅓/100 = 5/6",
          },
        ],
        examApplications: [
          {
            examType: "SSC",
            usage: "Percentage problems, profit-loss, simple interest",
            timesSaved: "45-60 seconds per question",
          },
          {
            examType: "Banking",
            usage: "Interest calculations, ratio problems",
            timesSaved: "30-45 seconds per question",
          },
        ],
      },
      tags: ["percentage", "fractions", "conversion"],
      views: 0,
      rating: 4.7,
      createdAt: new Date(),
    },
    {
      title: "Compound Interest Shortcuts",
      description: "Quick formulas for compound interest calculations",
      category: "Interest",
      difficulty: "Hard",
      examTypes: ["Banking", "SSC", "Insurance"],
      xpReward: 100,
      estimatedTime: 20,
      content: {
        introduction:
          "Master compound interest with powerful shortcuts. Essential for banking exams and advanced mathematical problems.",
        steps: [
          {
            title: "Step 1: Learn the Quick Formula",
            description: "For 2 years: Amount = P(1 + R/100)²",
            example: "P = 1000, R = 10%, T = 2 years: A = 1000(1.1)² = 1210",
          },
          {
            title: "Step 2: Successive Percentage Method",
            description: "Apply percentage increases successively",
            example: "1000 → 10% increase → 1100 → 10% increase → 1210",
          },
          {
            title: "Step 3: Difference Method",
            description: "CI - SI = P(R/100)²/100 for 2 years",
            example: "Difference = 1000 × (10/100)² = 1000 × 0.01 = 10",
          },
        ],
        visualExample: {
          problem: "Find CI on ₹5000 at 20% for 2 years",
          solution: "A = 5000(1.2)² = 5000 × 1.44 = 7200, CI = 7200 - 5000 = 2200",
          explanation: "Using (1 + R/100)² is faster than step-by-step calculation",
        },
        practiceQuestions: [
          {
            question: "CI on ₹2000 at 15% for 2 years is:",
            options: ["₹645", "₹635", "₹655", "₹625"],
            correctAnswer: 0,
            explanation: "A = 2000(1.15)² = 2000 × 1.3225 = 2645, CI = 645",
          },
          {
            question: "Difference between CI and SI on ₹8000 at 25% for 2 years:",
            options: ["₹500", "₹400", "₹600", "₹450"],
            correctAnswer: 0,
            explanation: "Difference = 8000 × (25/100)² = 8000 × 0.0625 = 500",
          },
          {
            question: "If CI for 2 years is ₹1240 and SI is ₹1200, find the rate:",
            options: ["10%", "8%", "12%", "15%"],
            correctAnswer: 0,
            explanation: "Difference = 40, P = 6000, R² = 40×10000/6000 = 66.67, R = 10%",
          },
        ],
        examApplications: [
          {
            examType: "Banking",
            usage: "Core topic in quantitative aptitude",
            timesSaved: "60-90 seconds per question",
          },
          {
            examType: "SSC",
            usage: "Advanced arithmetic problems",
            timesSaved: "45-75 seconds per question",
          },
        ],
      },
      tags: ["compound-interest", "banking", "finance"],
      views: 0,
      rating: 4.6,
      createdAt: new Date(),
    },
    {
      title: "Time and Work LCM Method",
      description: "Solve time and work problems using LCM technique",
      category: "Time and Work",
      difficulty: "Medium",
      examTypes: ["SSC", "Railway", "Banking"],
      xpReward: 85,
      estimatedTime: 18,
      content: {
        introduction:
          "Revolutionary LCM method to solve complex time and work problems in seconds. Works for all types of work problems.",
        steps: [
          {
            title: "Step 1: Find LCM of Time Values",
            description: "Take LCM of all individual time periods",
            example: "A completes in 6 days, B in 8 days: LCM(6,8) = 24",
          },
          {
            title: "Step 2: Calculate Work Rates",
            description: "Divide LCM by individual times to get rates",
            example: "A's rate = 24/6 = 4 units/day, B's rate = 24/8 = 3 units/day",
          },
          {
            title: "Step 3: Solve the Problem",
            description: "Use rates to find combined work or time",
            example: "Together: (4+3) = 7 units/day, Time = 24/7 days",
          },
        ],
        visualExample: {
          problem: "A can do work in 12 days, B in 15 days. Together in how many days?",
          solution: "LCM(12,15) = 60, A's rate = 5, B's rate = 4, Together = 9, Time = 60/9 = 6⅔ days",
          explanation: "LCM method eliminates fractions and makes calculation easier",
        },
        practiceQuestions: [
          {
            question: "A completes work in 10 days, B in 15 days. Together they complete in:",
            options: ["6 days", "5 days", "7 days", "8 days"],
            correctAnswer: 0,
            explanation: "LCM(10,15) = 30, rates: 3+2 = 5, time = 30/5 = 6 days",
          },
          {
            question: "A, B, C can do work in 6, 8, 12 days respectively. Together in:",
            options: ["8/3 days", "7/3 days", "5/3 days", "4/3 days"],
            correctAnswer: 0,
            explanation: "LCM(6,8,12) = 24, rates: 4+3+2 = 9, time = 24/9 = 8/3 days",
          },
          {
            question: "A can do work in 20 days. A and B together in 12 days. B alone can do in:",
            options: ["30 days", "25 days", "35 days", "40 days"],
            correctAnswer: 0,
            explanation: "LCM = 60, A's rate = 3, combined rate = 5, B's rate = 2, B's time = 30 days",
          },
        ],
        examApplications: [
          {
            examType: "SSC",
            usage: "Time and work is a major topic",
            timesSaved: "90-120 seconds per question",
          },
          {
            examType: "Railway",
            usage: "Frequently asked in technical exams",
            timesSaved: "60-90 seconds per question",
          },
        ],
      },
      tags: ["time-work", "lcm", "efficiency"],
      views: 0,
      rating: 4.8,
      createdAt: new Date(),
    },
    {
      title: "Profit Loss Percentage Tricks",
      description: "Master profit and loss calculations with percentage shortcuts",
      category: "Profit and Loss",
      difficulty: "Medium",
      examTypes: ["SSC", "Banking", "Railway", "Insurance"],
      xpReward: 80,
      estimatedTime: 16,
      content: {
        introduction:
          "Learn powerful shortcuts for profit and loss problems. These tricks will help you solve complex percentage problems in competitive exams.",
        steps: [
          {
            title: "Step 1: Learn Key Formulas",
            description: "Memorize essential profit-loss formulas",
            example: "Profit% = (Profit/CP) × 100, Loss% = (Loss/CP) × 100",
          },
          {
            title: "Step 2: Successive Discounts",
            description: "For successive discounts: Net% = a + b - (ab/100)",
            example: "20% and 10% discounts: Net = 20 + 10 - (20×10/100) = 28%",
          },
          {
            title: "Step 3: Marked Price Tricks",
            description: "If MP is x% above CP and discount is y%, then profit% = x - y - (xy/100)",
            example: "MP 25% above CP, 10% discount: Profit% = 25 - 10 - (25×10/100) = 12.5%",
          },
        ],
        visualExample: {
          problem: "Article marked 40% above cost. After 15% discount, find profit%",
          solution: "Profit% = 40 - 15 - (40×15/100) = 40 - 15 - 6 = 19%",
          explanation: "Direct formula saves time compared to step-by-step calculation",
        },
        practiceQuestions: [
          {
            question: "Two successive discounts of 25% and 20% are equivalent to:",
            options: ["40%", "35%", "45%", "38%"],
            correctAnswer: 0,
            explanation: "Net% = 25 + 20 - (25×20/100) = 45 - 5 = 40%",
          },
          {
            question: "If CP is ₹800 and SP is ₹1000, profit% is:",
            options: ["25%", "20%", "30%", "15%"],
            correctAnswer: 0,
            explanation: "Profit = 1000 - 800 = 200, Profit% = (200/800) × 100 = 25%",
          },
          {
            question: "Article marked 50% above cost, 20% discount given. Profit% is:",
            options: ["20%", "25%", "30%", "15%"],
            correctAnswer: 0,
            explanation: "Profit% = 50 - 20 - (50×20/100) = 50 - 20 - 10 = 20%",
          },
        ],
        examApplications: [
          {
            examType: "Banking",
            usage: "Commercial mathematics section",
            timesSaved: "45-60 seconds per question",
          },
          {
            examType: "SSC",
            usage: "Arithmetic reasoning problems",
            timesSaved: "30-45 seconds per question",
          },
        ],
      },
      tags: ["profit-loss", "percentage", "discount"],
      views: 0,
      rating: 4.7,
      createdAt: new Date(),
    },
  ]

  await Trick.insertMany(tricks)

  // Create user progress for demo user
  await UserProgress.create({
    userId: defaultUser._id,
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    tricksCompleted: 0,
    achievements: [],
    categoryProgress: {
      Arithmetic: { completed: 0, total: 2, xp: 0 },
      Percentage: { completed: 0, total: 1, xp: 0 },
      Interest: { completed: 0, total: 1, xp: 0 },
      "Time and Work": { completed: 0, total: 1, xp: 0 },
      "Profit and Loss": { completed: 0, total: 1, xp: 0 },
    },
    examProgress: {
      SSC: { readiness: 0, tricksCompleted: 0, estimatedScore: 0 },
      Banking: { readiness: 0, tricksCompleted: 0, estimatedScore: 0 },
      Railway: { readiness: 0, tricksCompleted: 0, estimatedScore: 0 },
      Insurance: { readiness: 0, tricksCompleted: 0, estimatedScore: 0 },
    },
    goals: {
      daily: { target: 3, completed: 0, streak: 0 },
      weekly: { target: 15, completed: 0, weekStart: new Date() },
      monthly: { target: 60, completed: 0, monthStart: new Date() },
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(`👤 Created 1 demo user`)
  console.log(`🧩 Created ${tricks.length} math tricks`)
  console.log(`🏆 Created ${achievements.length} achievements`)
  console.log(`📊 Created user progress tracking`)
}

module.exports = { connectDB, runMigrations, seedDatabase }

// Export both named and default
module.exports.default = connectDB
