const mongoose = require("mongoose")

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    maxParticipants: {
      type: Number,
      default: 1000,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    topics: [
      {
        type: String,
        enum: ["Algebra", "Geometry", "Calculus", "Number Theory", "Combinatorics", "Probability"],
      },
    ],
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        score: {
          type: Number,
          default: 0,
        },
        rank: {
          type: Number,
          default: 0,
        },
        problemsSolved: {
          type: Number,
          default: 0,
        },
        totalTime: {
          type: Number,
          default: 0,
        },
        submissions: [
          {
            problemId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Problem",
            },
            solution: String,
            submittedAt: Date,
            timeSpent: Number,
            correct: Boolean,
            points: Number,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    prizes: [
      {
        rank: Number,
        reward: String,
        xpBonus: Number,
      },
    ],
    rules: {
      type: String,
      default: "Standard tournament rules apply",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
tournamentSchema.index({ startTime: 1, status: 1 })
tournamentSchema.index({ status: 1, isPublic: 1 })
tournamentSchema.index({ "participants.userId": 1 })

// Virtual for participant count
tournamentSchema.virtual("participantCount").get(function () {
  return this.participants.length
})

// Method to add participant
tournamentSchema.methods.addParticipant = function (userId) {
  const existingParticipant = this.participants.find((p) => p.userId.toString() === userId.toString())

  if (existingParticipant) {
    throw new Error("User already registered for this tournament")
  }

  if (this.participants.length >= this.maxParticipants) {
    throw new Error("Tournament is full")
  }

  if (new Date() > this.registrationDeadline) {
    throw new Error("Registration deadline has passed")
  }

  this.participants.push({ userId })
  return this.save()
}

// Method to update leaderboard
tournamentSchema.methods.updateLeaderboard = function () {
  // Sort participants by score (descending) and total time (ascending)
  this.participants.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return a.totalTime - b.totalTime
  })

  // Update ranks
  this.participants.forEach((participant, index) => {
    participant.rank = index + 1
  })

  return this.save()
}

module.exports = mongoose.model("Tournament", tournamentSchema)
