import mongoose from "mongoose"

const CategoryProgressSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "Speed Arithmetic",
      "Percentage",
      "Compound Interest",
      "Time & Work",
      "Profit & Loss",
      "Ratio & Proportion",
      "Algebra",
      "Geometry",
      "Data Interpretation",
      "Number System",
    ],
  },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // minutes
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
  timeSpent: { type: Number, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  attempts: { type: Number, default: 1 },
  xpEarned: { type: Number, required: true },
})

const AchievementUnlockedSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
  unlockedAt: { type: Date, default: Date.now },
  xpEarned: { type: Number, required: true },
})

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // Overall Progress
    level: { type: Number, default: 1, min: 1 },
    totalXP: { type: Number, default: 0, min: 0 },
    currentXP: { type: Number, default: 0, min: 0 }, // XP in current level
    tricksCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // minutes
    averageScore: { type: Number, default: 0, min: 0, max: 100 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now },
    xpToNextLevel: { type: Number, default: 100 },
    dailyProgress: { type: Number, default: 0 },
    weeklyProgress: { type: Number, default: 0 },

    // Category Progress
    categoryProgress: [CategoryProgressSchema],

    // Exam Preparation
    targetExams: [
      {
        type: String,
        enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
      },
    ],
    examProgress: [ExamProgressSchema],

    // Individual Trick Progress
    completedTricks: [TrickCompletionSchema],

    // Achievements
    achievementsUnlocked: [AchievementUnlockedSchema],

    // Learning Preferences
    preferredDifficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    dailyGoal: { type: Number, default: 3, min: 1, max: 20 },
    weeklyGoal: { type: Number, default: 15, min: 5, max: 100 },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserProgressSchema.index({ userId: 1 })
UserProgressSchema.index({ level: -1 })
UserProgressSchema.index({ totalXP: -1 })
UserProgressSchema.index({ currentStreak: -1 })

// Virtual for progress percentage to next level
UserProgressSchema.virtual("levelProgress").get(function () {
  return Math.round((this.currentXP / this.xpToNextLevel) * 100)
})

// Method to add XP and handle level up
UserProgressSchema.methods.addXP = function (xp) {
  this.totalXP += xp
  this.currentXP += xp

  // Check for level up
  while (this.currentXP >= this.xpToNextLevel) {
    this.currentXP -= this.xpToNextLevel
    this.level += 1
    this.xpToNextLevel = this.level * 100 // XP required increases with level
  }

  return this.save()
}

// Method to complete a trick
UserProgressSchema.methods.completeTrick = function (trickId, timeSpent, score, xpEarned) {
  // Add to completed tricks
  this.completedTricks.push({
    trickId,
    timeSpent,
    score,
    xpEarned,
  })

  // Update overall stats
  this.tricksCompleted += 1
  this.totalTimeSpent += timeSpent

  // Update average score
  const totalCompletions = this.tricksCompleted
  this.averageScore = (this.averageScore * (totalCompletions - 1) + score) / totalCompletions

  // Update daily and weekly progress
  this.dailyProgress += 1
  this.weeklyProgress += 1

  // Update last activity
  this.lastActivityDate = new Date()

  // Add XP
  this.addXP(xpEarned)

  return this.save()
}

// Method to update streak
UserProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastActivity = new Date(this.lastActivityDate)
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

  if (daysDiff === 1) {
    // Consecutive day
    this.currentStreak += 1
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak
    }
  } else if (daysDiff > 1) {
    // Streak broken
    this.currentStreak = 1
  }
  // If daysDiff === 0, same day, don't change streak

  this.lastActivityDate = today
  return this.save()
}

// Method to unlock achievement
UserProgressSchema.methods.unlockAchievement = function (achievementId, xpEarned) {
  // Check if already unlocked
  const alreadyUnlocked = this.achievementsUnlocked.some(
    (achievement) => achievement.achievementId.toString() === achievementId.toString(),
  )

  if (!alreadyUnlocked) {
    this.achievementsUnlocked.push({
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
