import mongoose from "mongoose"
import bcrypt from "bcryptjs"

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
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    preferences: {
      targetExams: [
        {
          type: String,
          enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
        },
      ],
      difficultyPreference: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy",
      },
      dailyGoal: {
        type: Number,
        default: 3,
        min: 1,
        max: 20,
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },
    stats: {
      totalXP: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
      },
      tricksCompleted: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      bestStreak: {
        type: Number,
        default: 0,
      },
      totalTimeSpent: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ "stats.level": -1 })
userSchema.index({ "stats.totalXP": -1 })

// Virtual for user level based on XP
userSchema.virtual("calculatedLevel").get(function () {
  return Math.floor(this.stats.totalXP / 100) + 1
})

// Pre-save middleware to hash password
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

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to add XP and update level
userSchema.methods.addXP = function (xp) {
  this.stats.totalXP += xp
  this.stats.level = Math.floor(this.stats.totalXP / 100) + 1
  return this.save()
}

// Method to update streak
userSchema.methods.updateStreak = function (increment = true) {
  if (increment) {
    this.stats.currentStreak += 1
    if (this.stats.currentStreak > this.stats.bestStreak) {
      this.stats.bestStreak = this.stats.currentStreak
    }
  } else {
    this.stats.currentStreak = 0
  }
  return this.save()
}

// Method to increment tricks completed
userSchema.methods.completeTrick = function (timeSpent = 0, score = 0) {
  this.stats.tricksCompleted += 1
  this.stats.totalTimeSpent += timeSpent

  // Update average score
  const totalSessions = this.stats.tricksCompleted
  this.stats.averageScore = (this.stats.averageScore * (totalSessions - 1) + score) / totalSessions

  return this.save()
}

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ "stats.totalXP": -1 })
    .limit(limit)
    .select("username fullName stats.totalXP stats.level stats.tricksCompleted")
}

export default mongoose.models.User || mongoose.model("User", userSchema)
