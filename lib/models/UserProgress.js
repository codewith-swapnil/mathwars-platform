import mongoose from "mongoose"

const CategoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // minutes
})

const ExamReadinessSchema = new mongoose.Schema({
  SSC: { type: Number, default: 0, min: 0, max: 100 },
  Banking: { type: Number, default: 0, min: 0, max: 100 },
  Railway: { type: Number, default: 0, min: 0, max: 100 },
  Insurance: { type: Number, default: 0, min: 0, max: 100 },
  Others: { type: Number, default: 0, min: 0, max: 100 },
})

const UserProgressSchema = new mongoose.Schema({
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

  // Category Progress
  categoryProgress: [CategoryProgressSchema],

  // Individual Trick Progress
  completedTricks: [
    {
      trickId: { type: mongoose.Schema.Types.ObjectId, ref: "Trick" },
      completedAt: { type: Date, default: Date.now },
      score: { type: Number, min: 0, max: 100 },
      timeSpent: { type: Number, min: 0 },
    },
  ],

  // Achievements
  achievements: [
    {
      achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
      unlockedAt: { type: Date, default: Date.now },
    },
  ],

  // Exam Preparation
  targetExams: [
    {
      type: String,
      enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
    },
  ],
  examReadiness: ExamReadinessSchema,

  // Learning Preferences
  preferredDifficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
  dailyGoal: { type: Number, default: 3 }, // tricks per day
  reminderTime: { type: String }, // HH:MM format
})

// Indexes
UserProgressSchema.index({ userId: 1 })
UserProgressSchema.index({ level: -1 })
UserProgressSchema.index({ totalXP: -1 })

// Virtual for XP needed for next level
UserProgressSchema.virtual("xpForNextLevel").get(function () {
  return this.level * 100 // 100 XP per level
})

// Virtual for progress to next level
UserProgressSchema.virtual("progressToNextLevel").get(function () {
  const xpNeeded = this.xpForNextLevel
  return (this.currentXP / xpNeeded) * 100
})

// Method to add XP and handle level up
UserProgressSchema.methods.addXP = function (xp) {
  this.totalXP += xp
  this.currentXP += xp

  // Check for level up
  const xpNeeded = this.level * 100
  if (this.currentXP >= xpNeeded) {
    this.level += 1
    this.currentXP -= xpNeeded
  }

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
  // If daysDiff === 0, same day, no change needed

  this.lastActivityDate = today
  return this.save()
}

// Method to complete a trick
UserProgressSchema.methods.completeTrick = function (trickId, score, timeSpent) {
  // Add to completed tricks
  this.completedTricks.push({
    trickId,
    score,
    timeSpent,
  })

  // Update overall stats
  this.tricksCompleted += 1
  this.totalTimeSpent += timeSpent

  // Recalculate average score
  const totalScore = this.completedTricks.reduce((sum, trick) => sum + trick.score, 0)
  this.averageScore = totalScore / this.completedTricks.length

  // Update streak
  this.updateStreak()

  return this.save()
}

// Static method to get leaderboard
UserProgressSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find().sort({ totalXP: -1, level: -1 }).limit(limit).populate("userId", "username email")
}

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
