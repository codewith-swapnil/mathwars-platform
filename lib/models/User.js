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
      maxlength: 30,
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
      default: "",
    },
    preferences: {
      examType: {
        type: String,
        enum: ["SSC", "Banking", "Railway", "Insurance", "General"],
        default: "General",
      },
      difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard", "Mixed"],
        default: "Mixed",
      },
      dailyGoal: {
        type: Number,
        default: 3,
        min: 1,
        max: 20,
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        streak: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
    },
    stats: {
      totalProblems: { type: Number, default: 0 },
      correctProblems: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
      bestStreak: { type: Number, default: 0 },
      totalXP: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "premium", "pro"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      features: [
        {
          name: String,
          enabled: Boolean,
        },
      ],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
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

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ "stats.totalXP": -1 })

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
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
  const xp = this.stats.totalXP
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

// Get XP needed for next level
userSchema.methods.getXPForNextLevel = function () {
  const currentLevel = this.calculateLevel()
  const nextLevelXP = Math.pow(currentLevel, 2) * 100
  return nextLevelXP - this.stats.totalXP
}

// Update stats method
userSchema.methods.updateStats = function (newStats) {
  Object.assign(this.stats, newStats)
  this.stats.level = this.calculateLevel()
  return this.save()
}

// Get user profile (without sensitive data)
userSchema.methods.getProfile = function () {
  const user = this.toObject()
  delete user.password
  delete user.verificationToken
  delete user.resetPasswordToken
  delete user.resetPasswordExpires
  return user
}

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
  return this.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  })
}

// Virtual for accuracy percentage
userSchema.virtual("accuracyPercentage").get(function () {
  if (this.stats.totalProblems === 0) return 0
  return Math.round((this.stats.correctProblems / this.stats.totalProblems) * 100)
})

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true })
userSchema.set("toObject", { virtuals: true })

module.exports = mongoose.models.User || mongoose.model("User", userSchema)
