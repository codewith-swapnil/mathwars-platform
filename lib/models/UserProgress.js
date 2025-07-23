import mongoose from "mongoose"

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trickId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trick",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    totalSteps: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0, // in seconds
    },
    practiceScore: {
      type: Number,
      default: 0, // percentage score in practice questions
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one progress record per user-trick pair
userProgressSchema.index({ userId: 1, trickId: 1 }, { unique: true })
userProgressSchema.index({ userId: 1, completed: 1 })
userProgressSchema.index({ completedAt: -1 })

export default mongoose.models.UserProgress || mongoose.model("UserProgress", userProgressSchema)
