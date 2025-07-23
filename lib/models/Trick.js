import mongoose from "mongoose"

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  example: { type: String },
  visual: { type: String },
})

const practiceQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  explanation: { type: String },
})

const examApplicationSchema = new mongoose.Schema({
  exam: { type: String, required: true },
  usage: { type: String, required: true },
  timesSaved: { type: String },
})

const trickSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  timeToLearn: { type: String, required: true },
  examRelevance: [{ type: String }],
  steps: [stepSchema],
  keyPoints: [{ type: String }],
  tips: [{ type: String }],
  practiceQuestions: [practiceQuestionSchema],
  examApplications: [examApplicationSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  studentsLearned: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

trickSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Trick || mongoose.model("Trick", trickSchema)
