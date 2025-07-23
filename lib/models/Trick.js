import mongoose from "mongoose"

const StepSchema = new mongoose.Schema({
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

const PracticeQuestionSchema = new mongoose.Schema({
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

const ExamApplicationSchema = new mongoose.Schema({
  examType: {
    type: String,
    required: true,
    enum: ["SSC", "Banking", "Railway", "Insurance", "Others"],
  },
  scenario: String,
  timeSaved: String,
  frequency: String,
})

const VisualExampleSchema = new mongoose.Schema({
  problem: String,
  solution: String,
  visualization: String,
})

const TrickSchema = new mongoose.Schema(
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
    steps: [StepSchema],
    visualExample: VisualExampleSchema,
    practiceQuestions: [PracticeQuestionSchema],
    examApplications: [ExamApplicationSchema],
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
    viewCount: {
      type: Number,
      default: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
TrickSchema.index({ category: 1, difficulty: 1 })
TrickSchema.index({ examTypes: 1 })
TrickSchema.index({ tags: 1 })
TrickSchema.index({ createdAt: -1 })

// Virtual for completion rate
TrickSchema.virtual("completionRate").get(function () {
  return this.viewCount > 0 ? (this.completionCount / this.viewCount) * 100 : 0
})

// Method to increment view count
TrickSchema.methods.incrementView = function () {
  this.viewCount += 1
  return this.save()
}

// Method to increment completion count
TrickSchema.methods.incrementCompletion = function () {
  this.completionCount += 1
  return this.save()
}

// Static method to get tricks by category
TrickSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ createdAt: -1 })
}

// Static method to get tricks by exam type
TrickSchema.statics.getByExamType = function (examType) {
  return this.find({ examTypes: examType, isActive: true }).sort({ createdAt: -1 })
}

export default mongoose.models.Trick || mongoose.model("Trick", TrickSchema)
