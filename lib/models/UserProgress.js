import mongoose from "mongoose"

const CategoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  lastUpdated: { type: Date, default: Date.now },
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
  rating: { type: Number, min: 1, max: 5 },
})

const AchievementUnlockedSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
  unlockedAt: { type: Date, default: Date.now },
  xpEarned: { type: Number, required: true },
})

const DailyActivitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  tricksCompleted: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  score: { type: Number, default: 0 },
})

const ExamReadinessSchema = new mongoose.Schema({
  SSC: { type: Number, default: 0, min: 0, max: 100 },
  Banking: { type: Number, default: 0, min: 0, max: 100 },
  Railway: { type: Number, default: 0, min: 0, max: 100 },
  Insurance: { type: Number, default: 0, min: 0, max: 100 },
  Others: { type: Number, default: 0, min: 0, max: 100 },
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
    lastActivityDate: { type: Date },
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
    examReadiness: { type: ExamReadinessSchema, default: () => ({}) },

    // Individual Trick Progress
    completedTricks: [TrickCompletionSchema],

    // Achievements
    achievements: [AchievementUnlockedSchema],

    // Daily Activity
    dailyActivity: [DailyActivitySchema],

    // Goals
    goals: {
      dailyTricks: { type: Number, default: 3 },
      weeklyTricks: { type: Number, default: 20 },
      targetScore: { type: Number, default: 80 },
    },

    // Statistics
    statistics: {
      totalSessions: { type: Number, default: 0 },
      averageSessionTime: { type: Number, default: 0 }, // in seconds
      perfectScores: { type: Number, default: 0 },
      improvementRate: { type: Number, default: 0 }, // percentage
      favoriteCategory: { type: String },
      strongestExamType: { type: String },
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

// Method to calculate XP to next level based on current level
UserProgressSchema.methods.calculateXPToNextLevel = function () {
  const baseXP = 100
  const multiplier = 1.5
  return Math.floor(baseXP * Math.pow(multiplier, this.level - 1))
}

// Method to add XP and handle level up
UserProgressSchema.methods.addXP = function (xp) {
  this.totalXP += xp
  this.currentXP += xp

  let leveledUp = false
  while (this.currentXP >= this.xpToNextLevel) {
    this.currentXP -= this.xpToNextLevel
    this.level += 1
    leveledUp = true
    this.xpToNextLevel = this.calculateXPToNextLevel()
  }

  return leveledUp
}

// Method to complete a trick
UserProgressSchema.methods.completeTrick = function (trickId, timeSpent, score, xpEarned, rating) {
  // Add to completed tricks
  this.completedTricks.push({
    trickId,
    timeSpent,
    score,
    xpEarned,
    rating,
  })

  // Update overall stats
  this.tricksCompleted += 1
  this.totalTimeSpent += timeSpent

  // Update average score
  const totalCompletions = this.tricksCompleted
  this.averageScore = (this.averageScore * (totalCompletions - 1) + score) / totalCompletions

  // Update last activity
  this.lastActivityDate = new Date()

  // Add XP
  this.addXP(xpEarned)

  return this.save()
}

// Method to update streak
UserProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastActivity = this.lastActivityDate

  if (!lastActivity) {
    this.currentStreak = 1
  } else {
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      this.currentStreak += 1
    } else if (daysDiff > 1) {
      this.currentStreak = 1
    }
    // If daysDiff === 0, it's the same day, don't change streak
  }

  if (this.currentStreak > this.bestStreak) {
    this.bestStreak = this.currentStreak
  }

  this.lastActivityDate = today
}

// Method to unlock achievement
UserProgressSchema.methods.unlockAchievement = function (achievementId, xpEarned) {
  // Check if already unlocked
  const alreadyUnlocked = this.achievements.some(
    (achievement) => achievement.achievementId.toString() === achievementId.toString(),
  )

  if (!alreadyUnlocked) {
    this.achievements.push({
      achievementId,
      xpEarned,
    })

    this.addXP(xpEarned)
  }

  return this.save()
}

// Static method to get leaderboard
UserProgressSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find().populate("userId", "username fullName").sort({ totalXP: -1 }).limit(limit)
}

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
