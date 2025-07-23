import mongoose from "mongoose"

const CategoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // minutes
  lastActivity: { type: Date, default: Date.now },
})

const TrickProgressSchema = new mongoose.Schema({
  trickId: { type: mongoose.Schema.Types.ObjectId, ref: "Trick", required: true },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "mastered"],
    default: "not_started",
  },
  completedAt: { type: Date },
  timeSpent: { type: Number, default: 0 }, // minutes
  practiceScores: [
    {
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      timeSpent: { type: Number, required: true }, // seconds
      completedAt: { type: Date, default: Date.now },
    },
  ],
  bestScore: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 5 }, // User's rating of the trick
  notes: { type: String }, // User's personal notes
})

const AchievementProgressSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
  unlockedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // For progressive achievements
  isCompleted: { type: Boolean, default: false },
})

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  // Overall Progress
  level: { type: Number, default: 1 },
  totalXP: { type: Number, default: 0 },
  currentXP: { type: Number, default: 0 }, // XP in current level
  xpToNextLevel: { type: Number, default: 100 },

  // Learning Stats
  tricksCompleted: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }, // minutes
  averageScore: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },

  // Category Progress
  categoryProgress: [CategoryProgressSchema],

  // Individual Trick Progress
  trickProgress: [TrickProgressSchema],

  // Achievements
  achievements: [AchievementProgressSchema],

  // Exam Preparation
  targetExams: [
    {
      type: String,
      enum: ["SSC", "Banking", "Railway", "Insurance", "Other"],
    },
  ],
  examReadiness: {
    SSC: { type: Number, default: 0 }, // percentage
    Banking: { type: Number, default: 0 },
    Railway: { type: Number, default: 0 },
    Insurance: { type: Number, default: 0 },
    Other: { type: Number, default: 0 },
  },

  // Learning Preferences
  preferredDifficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
  dailyGoal: { type: Number, default: 3 }, // tricks per day
  reminderTime: { type: String }, // HH:MM format

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Indexes
UserProgressSchema.index({ userId: 1 })
UserProgressSchema.index({ level: -1 })
UserProgressSchema.index({ totalXP: -1 })
UserProgressSchema.index({ lastActivityDate: -1 })

// Methods
UserProgressSchema.methods.addXP = function (xp) {
  this.totalXP += xp
  this.currentXP += xp

  // Level up logic
  while (this.currentXP >= this.xpToNextLevel) {
    this.currentXP -= this.xpToNextLevel
    this.level += 1
    this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2) // 20% increase per level
  }

  this.updatedAt = new Date()
  return this.save()
}

UserProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastActivity = this.lastActivityDate

  if (!lastActivity) {
    this.currentStreak = 1
  } else {
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      // Consecutive day
      this.currentStreak += 1
      this.bestStreak = Math.max(this.bestStreak, this.currentStreak)
    } else if (daysDiff > 1) {
      // Streak broken
      this.currentStreak = 1
    }
    // Same day, no change to streak
  }

  this.lastActivityDate = today
  this.updatedAt = new Date()
  return this.save()
}

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
