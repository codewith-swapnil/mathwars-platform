import mongoose from "mongoose"

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  example: String,
  formula: String,
})

const practiceQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
})

const examApplicationSchema = new mongoose.Schema({
  examType: {
    type: String,
    required: true,
    enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
  },
  scenario: String,
  timeSaved: String,
  frequency: String,
})

const visualExampleSchema = new mongoose.Schema({
  problem: String,
  solution: String,
  visualization: String,
})

const trickSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: [
        "Speed Arithmetic",
        "Percentage",
        "Compound Interest",
        "Time & Work",
        "Profit & Loss",
        "Ratio & Proportion",
        "Algebra",
        "Geometry",
        "Data Interpretation",
        "Number System",
      ],
    },
    examTypes: [
      {
        type: String,
        enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
      },
    ],
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    timeToLearn: {
      type: Number,
      required: true,
      min: 1,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 10,
    },
    steps: [stepSchema],
    visualExample: visualExampleSchema,
    practiceQuestions: [practiceQuestionSchema],
    examApplications: [examApplicationSchema],
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
trickSchema.index({ category: 1, difficulty: 1 })
trickSchema.index({ examTypes: 1 })
trickSchema.index({ tags: 1 })
trickSchema.index({ createdAt: -1 })

// Virtual for formatted time
trickSchema.virtual("formattedTime").get(function () {
  if (this.timeToLearn < 60) {
    return `${this.timeToLearn} min`
  } else {
    const hours = Math.floor(this.timeToLearn / 60)
    const minutes = this.timeToLearn % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
})

// Method to increment views
trickSchema.methods.incrementViews = function () {
  this.views += 1
  return this.save()
}

// Method to increment completions
trickSchema.methods.incrementCompletions = function () {
  this.completions += 1
  return this.save()
}

// Static method to get tricks by category
trickSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ createdAt: -1 })
}

// Static method to get tricks by exam type
trickSchema.statics.getByExamType = function (examType) {
  return this.find({ examTypes: examType, isActive: true }).sort({ createdAt: -1 })
}

export default mongoose.models.Trick || mongoose.model("Trick", trickSchema)
