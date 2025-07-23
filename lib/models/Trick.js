import mongoose from "mongoose"

const StepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  example: {
    type: String,
    required: true,
  },
  visual: {
    type: String,
    required: true,
  },
})

const PracticeQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
})

const ExamApplicationSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: true,
  },
  usage: {
    type: String,
    required: true,
  },
  timesSaved: {
    type: String,
    required: true,
  },
})

const TrickSchema = new mongoose.Schema({
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
      "Ratio & Proportion",
      "Time & Work",
      "Profit & Loss",
      "Simple Interest",
      "Compound Interest",
      "Number System",
      "Banking Math",
      "Geometry",
      "Algebra",
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },
  timeToLearn: {
    type: String,
    required: true,
  },
  examRelevance: [
    {
      type: String,
      enum: ["SSC", "Banking", "Railway", "Others"],
    },
  ],
  steps: [StepSchema],
  keyPoints: [String],
  tips: [String],
  practiceQuestions: [PracticeQuestionSchema],
  examApplications: [ExamApplicationSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  studentsLearned: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
TrickSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Create indexes for better query performance
TrickSchema.index({ category: 1, difficulty: 1 })
TrickSchema.index({ examRelevance: 1 })
TrickSchema.index({ tags: 1 })
TrickSchema.index({ rating: -1 })
TrickSchema.index({ studentsLearned: -1 })

export default mongoose.models.Trick || mongoose.model("Trick", TrickSchema)
