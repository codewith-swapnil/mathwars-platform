import mongoose from "mongoose"

const trickSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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
        "Algebra",
        "Geometry",
        "Data Interpretation",
        "Mensuration",
      ],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    timeToLearn: {
      type: String,
      required: true, // e.g., "3 min", "5 min"
    },
    examRelevance: [
      {
        type: String,
        enum: ["SSC", "Banking", "Railway", "UPSC", "State PSC", "Defense", "Others"],
      },
    ],
    steps: [
      {
        title: String,
        content: String,
        example: String,
        visual: String,
      },
    ],
    keyPoints: [String],
    tips: [String],
    practiceQuestions: [
      {
        question: String,
        answer: String,
        explanation: String,
      },
    ],
    examApplications: [
      {
        exam: String,
        usage: String,
        timesSaved: String,
      },
    ],
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
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
trickSchema.index({ category: 1, difficulty: 1 })
trickSchema.index({ examRelevance: 1 })
trickSchema.index({ featured: -1, createdAt: -1 })
trickSchema.index({ rating: -1 })
trickSchema.index({ tags: 1 })

export default mongoose.models.Trick || mongoose.model("Trick", trickSchema)
