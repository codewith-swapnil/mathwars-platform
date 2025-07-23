import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be less than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
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
    stats: {
      totalProblems: { type: Number, default: 0, min: 0 },
      correctProblems: { type: Number, default: 0, min: 0 },
      averageTime: { type: Number, default: 0, min: 0 },
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
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })

// Virtual for accuracy
userSchema.virtual("accuracy").get(function () {
  if (this.stats.totalProblems === 0) return 0
  return Math.round((this.stats.correctProblems / this.stats.totalProblems) * 100)
})

// Handle duplicate key errors
userSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0]
    next(new Error(`${field} already exists`))
  } else {
    next(error)
  }
})

export default mongoose.models.User || mongoose.model("User", userSchema)
