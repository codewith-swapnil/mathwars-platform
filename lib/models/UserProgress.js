import mongoose from "mongoose"

const categoryProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in minutes
})

const examProgressSchema = new mongoose.Schema({
  examType: { type: String, required: true },
  tricksCompleted: { type: Number, default: 0 },
  totalTricks: { type: Number, default: 0 },
  readinessScore: { type: Number, default: 0 },
})

const achievementSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
  unlockedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
})

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  tricksCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trick" }],
  categoryProgress: [categoryProgressSchema],
  examProgress: [examProgressSchema],
  achievements: [achievementSchema],
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  averageAccuracy: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.UserProgress || mongoose.model("UserProgress", userProgressSchema)
