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
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      targetExams: [
        {
          type: String,
          enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
        },
      ],
      difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard", "Mixed"],
        default: "Mixed",
      },
      dailyGoal: {
        type: Number,
        default: 2, // tricks per day
        min: 1,
        max: 10,
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        streak: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
    },
    stats: {
      joinDate: {
        type: Date,
        default: Date.now,
      },
      lastLogin: {
        type: Date,
        default: Date.now,
      },
      totalSessions: {
        type: Number,
        default: 0,
      },
      totalTimeSpent: {
        type: Number,
        default: 0, // in seconds
      },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim() || this.username
})

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

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.stats.lastLogin = new Date()
  this.stats.totalSessions += 1
  return this.save()
}

// Check if user has target exam
userSchema.methods.hasTargetExam = function (examType) {
  return this.preferences.targetExams.includes(examType)
}

// Get user level based on XP (this would typically come from UserProgress)
userSchema.virtual("level").get(() => {
  // This is a placeholder - actual level comes from UserProgress
  return 1
})

export default mongoose.models.User || mongoose.model("User", userSchema)
