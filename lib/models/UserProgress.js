import mongoose from "mongoose"

const CategoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  lastActivity: { type: Date, default: Date.now },
})

const ExamProgressSchema = new mongoose.Schema({
  examType: {
    type: String,
    required: true,
    enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
  },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  readinessScore: { type: Number, default: 0, min: 0, max: 100 },
  lastUpdated: { type: Date, default: Date.now },
})

const TrickCompletionSchema = new mongoose.Schema({
  trickId: { type: mongoose.Schema.Types.ObjectId, ref: "Trick", required: true },
  completedAt: { type: Date, default: Date.now },
  timeSpent: { type: Number, required: true, min: 0 }, // in seconds
  score: { type: Number, required: true, min: 0, max: 100 },
  attempts: { type: Number, default: 1 },
  practiceScores: [
    {
      questionIndex: Number,
      isCorrect: Boolean,
      timeSpent: Number,
      attempts: Number,
    },
  ],
})

const AchievementUnlockedSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
  unlockedAt: { type: Date, default: Date.now },
  xpEarned: { type: Number, required: true },
})

const StreakDataSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  tricksCompleted: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
})

const UserProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Overall Progress
    level: { type: Number, default: 1, min: 1 },
    totalXP: { type: Number, default: 0, min: 0 },
    currentXP: { type: Number, default: 0, min: 0 }, // XP in current level
    tricksCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    averageScore: { type: Number, default: 0, min: 0, max: 100 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now },
    xpToNextLevel: { type: Number, default: 100 },

    // Category Progress
    categoryProgress: [CategoryProgressSchema],

    // Exam Preparation
    targetExams: [
      {
        type: String,
        enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
      },
    ],
    examReadiness: {
      SSC: { type: Number, default: 0, min: 0, max: 100 },
      Banking: { type: Number, default: 0, min: 0, max: 100 },
      Railway: { type: Number, default: 0, min: 0, max: 100 },
      Insurance: { type: Number, default: 0, min: 0, max: 100 },
      Others: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Individual Trick Progress
    completedTricks: [TrickCompletionSchema],

    // Achievements
    achievementsUnlocked: [AchievementUnlockedSchema],

    // Streak Data
    streakData: [StreakDataSchema],

    // Statistics
    statistics: {
      perfectScores: { type: Number, default: 0 },
      averageTimePerTrick: { type: Number, default: 0 },
      fastestCompletion: { type: Number, default: 0 },
      totalPracticeQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      favoriteCategory: { type: String, default: "" },
      weeklyGoalsMet: { type: Number, default: 0 },
      monthlyGoalsMet: { type: Number, default: 0 },
    },

    // Goals and Targets
    goals: {
      daily: {
        target: { type: Number, default: 2 },
        completed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now },
      },
      weekly: {
        target: { type: Number, default: 10 },
        completed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now },
      },
      monthly: {
        target: { type: Number, default: 40 },
        completed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now },
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserProgressSchema.index({ userId: 1 })
UserProgressSchema.index({ level: -1, totalXP: -1 })
UserProgressSchema.index({ "completedTricks.trickId": 1 })

// Virtual for progress percentage to next level
UserProgressSchema.virtual("levelProgress").get(function () {
  return Math.round((this.currentXP / this.xpToNextLevel) * 100)
})

// Method to calculate XP needed for next level
UserProgressSchema.methods.calculateXPForNextLevel = function () {
  // XP required increases by 100 each level: Level 1->2: 100, Level 2->3: 200, etc.
  return this.level * 100
}

// Add XP and handle level ups
UserProgressSchema.methods.addXP = function (xpAmount) {
  this.totalXP += xpAmount
  this.currentXP += xpAmount

  const xpNeeded = this.calculateXPForNextLevel()

  // Check for level up
  while (this.currentXP >= xpNeeded) {
    this.currentXP -= xpNeeded
    this.level += 1
  }

  this.xpToNextLevel = this.calculateXPForNextLevel() - this.currentXP
  return this.save()
}

// Complete a trick
UserProgressSchema.methods.completeTrick = function (trickData) {
  const { trickId, timeSpent, score, practiceScores } = trickData

  // Add to completed tricks
  this.completedTricks.push({
    trickId,
    timeSpent,
    score,
    practiceScores: practiceScores || [],
  })

  // Update overall stats
  this.tricksCompleted += 1
  this.totalTimeSpent += timeSpent

  // Recalculate average score
  const totalScore = this.completedTricks.reduce((sum, trick) => sum + trick.score, 0)
  this.averageScore = Math.round(totalScore / this.completedTricks.length)

  // Update statistics
  if (score === 100) {
    this.statistics.perfectScores += 1
  }

  if (practiceScores) {
    this.statistics.totalPracticeQuestions += practiceScores.length
    this.statistics.correctAnswers += practiceScores.filter((ps) => ps.isCorrect).length
  }

  // Update fastest completion
  if (this.statistics.fastestCompletion === 0 || timeSpent < this.statistics.fastestCompletion) {
    this.statistics.fastestCompletion = timeSpent
  }

  // Update average time per trick
  this.statistics.averageTimePerTrick = Math.round(this.totalTimeSpent / this.tricksCompleted)

  // Update last activity
  this.lastActivityDate = new Date()

  return this.save()
}

// Update streak
UserProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastActivity = new Date(this.lastActivityDate)

  // Check if last activity was yesterday
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    // Same day, don't change streak
    return this.save()
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    this.currentStreak += 1
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak
    }
  } else {
    // Streak broken
    this.currentStreak = 1
  }

  this.lastActivityDate = today
  return this.save()
}

// Update category progress
UserProgressSchema.methods.updateCategoryProgress = function (category, trickScore, timeSpent) {
  let categoryProg = this.categoryProgress.find((cp) => cp.category === category)

  if (!categoryProg) {
    categoryProg = {
      category,
      tricksCompleted: 0,
      totalTricks: 0,
      averageScore: 0,
      timeSpent: 0,
      lastActivity: new Date(),
    }
    this.categoryProgress.push(categoryProg)
  }

  categoryProg.tricksCompleted += 1
  categoryProg.timeSpent += timeSpent
  categoryProg.lastActivity = new Date()

  // Recalculate average score for this category
  const categoryTricks = this.completedTricks.filter((ct) => {
    // This would need to be populated with trick data to get category
    return true // Placeholder
  })

  if (categoryTricks.length > 0) {
    const totalScore = categoryTricks.reduce((sum, trick) => sum + trick.score, 0)
    categoryProg.averageScore = Math.round(totalScore / categoryTricks.length)
  }

  return this.save()
}

// Get progress percentage for a category
UserProgressSchema.methods.getCategoryProgress = function (category) {
  const categoryProg = this.categoryProgress.find((cp) => cp.category === category)
  if (!categoryProg || categoryProg.totalTricks === 0) return 0
  return Math.round((categoryProg.tricksCompleted / categoryProg.totalTricks) * 100)
}

// Check daily goal
UserProgressSchema.methods.checkDailyGoal = function () {
  const today = new Date()
  const lastReset = new Date(this.goals.daily.lastReset)

  // Reset daily goal if it's a new day
  if (today.toDateString() !== lastReset.toDateString()) {
    this.goals.daily.completed = 0
    this.goals.daily.lastReset = today
  }

  return this.goals.daily.completed >= this.goals.daily.target
}

// Increment daily goal progress
UserProgressSchema.methods.incrementDailyGoal = function () {
  const today = new Date()
  const lastReset = new Date(this.goals.daily.lastReset)

  // Reset if new day
  if (today.toDateString() !== lastReset.toDateString()) {
    this.goals.daily.completed = 0
    this.goals.daily.lastReset = today
  }

  this.goals.daily.completed += 1
  return this.save()
}

// Static method to get leaderboard
UserProgressSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find().populate("userId", "username fullName").sort({ totalXP: -1 }).limit(limit)
}

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
