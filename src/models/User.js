const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
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
    lastSolvedDate: {
      type: Date,
      default: null,
    },
    grade: {
      type: String,
      enum: ["6", "7", "8", "9", "10", "11", "12", "college"],
      default: "9",
    },
    school: {
      type: String,
      default: "",
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    stats: {
      totalProblems: { type: Number, default: 0 },
      correctProblems: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
      favoriteTopics: [String],
      strongestTopic: String,
      weakestTopic: String,
    },
    achievements: [
      {
        achievementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  },
)

// Index for performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ xp: -1 })
userSchema.index({ level: -1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Calculate accuracy
userSchema.virtual("accuracy").get(function () {
  if (this.stats.totalProblems === 0) return 0
  return Math.round((this.stats.correctProblems / this.stats.totalProblems) * 100)
})

// Update XP and level
userSchema.methods.addXP = function (points) {
  this.xp += points
  this.level = Math.floor(this.xp / 1000) + 1
  return this.save()
}

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date()
  const lastSolved = this.lastSolvedDate

  if (!lastSolved) {
    this.streak = 1
  } else {
    const daysDiff = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      this.streak += 1
    } else if (daysDiff > 1) {
      this.streak = 1
    }
    // If daysDiff === 0, streak remains the same (solved today already)
  }

  this.lastSolvedDate = today
  return this.save()
}

module.exports = mongoose.model("User", userSchema)
