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
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      avatar: { type: String },
      bio: { type: String, maxlength: 500 },
      targetExams: [
        {
          type: String,
          enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
        },
      ],
      preferredCategories: [{ type: String }],
      studyGoals: {
        dailyTricks: { type: Number, default: 3 },
        weeklyTricks: { type: Number, default: 20 },
        targetScore: { type: Number, default: 80 },
      },
    },
    preferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        dailyReminder: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: true },
      },
      privacy: {
        showInLeaderboard: { type: Boolean, default: true },
        shareProgress: { type: Boolean, default: true },
      },
    },
    stats: {
      totalLoginDays: { type: Number, default: 0 },
      lastLoginDate: { type: Date },
      accountCreatedDate: { type: Date, default: Date.now },
      totalStudyTime: { type: Number, default: 0 }, // in minutes
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  },
)

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

// Get public profile
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.verificationToken
  delete userObject.resetPasswordToken
  delete userObject.resetPasswordExpires
  return userObject
}

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ "profile.targetExams": 1 })

export default mongoose.models.User || mongoose.model("User", userSchema)
