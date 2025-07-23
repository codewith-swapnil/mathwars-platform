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

const UserProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    tricksLearned: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    examTarget: {
      type: String,
      enum: [
        "SSC CGL",
        "SSC CHSL",
        "IBPS PO",
        "IBPS Clerk",
        "SBI PO",
        "SBI Clerk",
        "RRB NTPC",
        "RRB Group D",
        "Others",
      ],
      default: "SSC CGL",
    },
    categoryProgress: {
      "Speed Arithmetic": {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Percentage: {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      "Ratio & Proportion": {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      "Time & Work": {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      "Profit & Loss": {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      "Banking Math": {
        learned: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    trickProgress: [TrickProgressSchema],
    achievements: [
      {
        name: String,
        description: String,
        earnedAt: { type: Date, default: Date.now },
        icon: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

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
UserProgressSchema.index({ userId: 1, trickProgress: 1 }, { unique: true })
UserProgressSchema.index({ userId: 1, level: 1 })
UserProgressSchema.index({ lastActiveDate: -1 })

export default mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema)
