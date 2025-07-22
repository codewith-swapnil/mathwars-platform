import mongoose from "mongoose"

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
  },
  {
    timestamps: true,
  },
)

// Virtual for accuracy
userSchema.virtual("accuracy").get(function () {
  if (this.stats.totalProblems === 0) return 0
  return Math.round((this.stats.correctProblems / this.stats.totalProblems) * 100)
})

export default mongoose.models.User || mongoose.model("User", userSchema)
