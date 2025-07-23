import mongoose from "mongoose"

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  example: { type: String },
  formula: { type: String },
})

const practiceQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
})

const examApplicationSchema = new mongoose.Schema({
  examType: { type: String, required: true },
  scenario: { type: String, required: true },
  timeSaved: { type: String, required: true },
  frequency: { type: String, required: true },
})

const visualExampleSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  visualization: { type: String, required: true },
})

const trickSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Arithmetic",
        "Algebra",
        "Geometry",
        "Percentage",
        "Time & Work",
        "Profit & Loss",
        "Simple Interest",
        "Compound Interest",
        "Ratio & Proportion",
        "Data Interpretation",
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
    timeToLearn: { type: Number, required: true, min: 1 }, // in minutes
    xpReward: { type: Number, required: true, min: 1 },
    steps: [stepSchema],
    visualExample: visualExampleSchema,
    practiceQuestions: [practiceQuestionSchema],
    examApplications: [examApplicationSchema],
    tags: [{ type: String, trim: true }],
    views: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
trickSchema.index({ category: 1, difficulty: 1 })
trickSchema.index({ examTypes: 1 })
trickSchema.index({ tags: 1 })
trickSchema.index({ title: "text", description: "text", tags: "text" })

export default mongoose.models.Trick || mongoose.model("Trick", trickSchema)
