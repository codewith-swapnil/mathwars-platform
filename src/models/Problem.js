const mongoose = require("mongoose")

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
    subtopic: {
      type: String,
      default: "",
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
      max: 120, // minutes
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
      alternativeSolutions: [String],
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
      averageAttempts: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
problemSchema.index({ difficulty: 1, topic: 1 })
problemSchema.index({ featured: -1, createdAt: -1 })
problemSchema.index({ "stats.successfulSolves": -1 })
problemSchema.index({ tags: 1 })

// Virtual for success rate
problemSchema.virtual("successRate").get(function () {
  if (this.stats.totalAttempts === 0) return 0
  return Math.round((this.stats.successfulSolves / this.stats.totalAttempts) * 100)
})

// Method to update stats
problemSchema.methods.updateStats = function (solved, timeSpent, attempts) {
  this.stats.totalAttempts += attempts
  if (solved) {
    this.stats.successfulSolves += 1
  }

  // Update average time (weighted average)
  const totalSolves = this.stats.successfulSolves
  if (totalSolves > 0) {
    this.stats.averageTime = (this.stats.averageTime * (totalSolves - 1) + timeSpent) / totalSolves
  }

  return this.save()
}

module.exports = mongoose.model("Problem", problemSchema)
