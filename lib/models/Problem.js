import mongoose from "mongoose"

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: ["Algebra", "Geometry", "Calculus", "Number Theory", "Combinatorics", "Probability", "Statistics"],
    },
    xpReward: {
      type: Number,
      required: true,
      min: 50,
      max: 500,
    },
    timeLimit: {
      type: Number,
      required: true,
      min: 5,
      max: 120,
    },
    hints: [
      {
        text: String,
        xpPenalty: {
          type: Number,
          default: 10,
        },
      },
    ],
    solution: {
      explanation: String,
      steps: [String],
      answer: String,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stats: {
      totalAttempts: { type: Number, default: 0 },
      successfulSolves: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for success rate
problemSchema.virtual("successRate").get(function () {
  if (this.stats.totalAttempts === 0) return 0
  return Math.round((this.stats.successfulSolves / this.stats.totalAttempts) * 100)
})

export default mongoose.models.Problem || mongoose.model("Problem", problemSchema)
