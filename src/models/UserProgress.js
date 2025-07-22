const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    solved: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    hintsUsed: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0, // in seconds
    },
    solution: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    solvedAt: {
      type: Date,
      default: null,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one progress record per user-problem pair
userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true })
userProgressSchema.index({ userId: 1, solved: 1 })
userProgressSchema.index({ solvedAt: -1 })

module.exports = mongoose.model("UserProgress", userProgressSchema)
