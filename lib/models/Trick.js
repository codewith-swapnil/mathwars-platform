import mongoose from "mongoose"

const StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  example: { type: String },
  formula: { type: String },
})

const PracticeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  timeLimit: { type: Number, default: 60 }, // seconds
})

const ExamApplicationSchema = new mongoose.Schema({
  examType: { type: String, required: true }, // SSC, Banking, Railway, etc.
  scenario: { type: String, required: true },
  timeSaved: { type: String }, // e.g., "Saves 30 seconds"
  frequency: { type: String }, // e.g., "Asked in 80% of exams"
})

const TrickSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Speed Arithmetic",
      "Percentage",
      "Profit & Loss",
      "Time & Work",
      "Simple Interest",
      "Compound Interest",
      "Ratio & Proportion",
      "Algebra",
      "Geometry",
      "Data Interpretation",
    ],
  },
  examTypes: [
    {
      type: String,
      enum: ["SSC", "Banking", "Railway", "Insurance", "Other"],
    },
  ],
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },
  timeToLearn: { type: Number, required: true }, // minutes
  xpReward: { type: Number, required: true },
  steps: [StepSchema],
  visualExample: {
    problem: { type: String },
    solution: { type: String },
    visualization: { type: String }, // Could be ASCII art or description
  },
  practiceQuestions: [PracticeQuestionSchema],
  examApplications: [ExamApplicationSchema],
  tags: [{ type: String }],
  prerequisites: [{ type: String }], // Other trick IDs
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  completionCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
})

// Indexes for better performance
TrickSchema.index({ category: 1, difficulty: 1 })
TrickSchema.index({ examTypes: 1 })
TrickSchema.index({ tags: 1 })
TrickSchema.index({ createdAt: -1 })

export default mongoose.models.Trick || mongoose.model("Trick", TrickSchema)
