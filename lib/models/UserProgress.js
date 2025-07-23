import mongoose from "mongoose"

const TrickProgressSchema = new mongoose.Schema({
  trickId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trick",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
  practiceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
})

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
})

const categoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksLearned: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
})

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  tricksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trick" }],
  categoryProgress: [categoryProgressSchema],
  achievements: [achievementSchema],
  accuracy: { type: Number, default: 0 },
  totalPracticeQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  examTarget: { type: String, default: "SSC CGL 2024" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update the updatedAt field before saving
UserProgressSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Calculate streak based on last active date
UserProgressSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastActive = new Date(this.lastActiveDate)
  const diffTime = Math.abs(today - lastActive)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    this.streak += 1
  } else if (diffDays > 1) {
    this.streak = 1
  }

  this.lastActiveDate = today
}

// Add XP and level up if necessary
UserProgressSchema.methods.addXP = function (points) {
  this.xp += points

  // Level up logic (every 1000 XP = 1 level)
  const newLevel = Math.floor(this.xp / 1000) + 1
  if (newLevel > this.level) {
    this.level = newLevel
    return true // Leveled up
  }
  return false
}

// Compound index to ensure one progress record per user-trick pair
UserProgressSchema.index({ userId: 1, tricksCompleted: 1 }, { unique: true })
UserProgressSchema.index({ userId: 1, level: 1 })
UserProgressSchema.index({ lastActiveDate: -1 })

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
