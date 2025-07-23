import mongoose from "mongoose"

const conditionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "tricks_completed",
      "streak_days",
      "perfect_scores",
      "category_mastery",
      "exam_readiness",
      "speed_completion",
      "total_xp",
      "level_reached",
      "time_spent",
      "consecutive_days",
    ],
  },
  value: { type: Number, required: true },
  category: { type: String }, // Optional: specific category
  examType: { type: String }, // Optional: specific exam type
  timeLimit: { type: Number }, // Optional: time limit in seconds
})

const achievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Emoji or icon name
    type: {
      type: String,
      required: true,
      enum: ["milestone", "streak", "performance", "category", "exam", "special"],
    },
    condition: { type: conditionSchema, required: true },
    xpReward: { type: Number, required: true, min: 1 },
    badgeColor: {
      type: String,
      required: true,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
    },
    rarity: {
      type: String,
      required: true,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
    },
    order: { type: Number, default: 0 }, // Display order
    totalUnlocks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    requirements: {
      minLevel: { type: Number, default: 1 },
      prerequisiteAchievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
    },
    metadata: {
      category: { type: String },
      examType: { type: String },
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
      tags: [{ type: String }],
    },
  },
  {
    timestamps: true,
  },
)

// Check if user meets achievement condition
achievementSchema.methods.checkCondition = function (userProgress) {
  const { type, value, category, examType, timeLimit } = this.condition

  switch (type) {
    case "tricks_completed":
      if (category) {
        const categoryProg = userProgress.categoryProgress.find((cp) => cp.category === category)
        return categoryProg ? categoryProg.tricksCompleted >= value : false
      }
      return userProgress.tricksCompleted >= value

    case "streak_days":
      return userProgress.currentStreak >= value

    case "perfect_scores":
      return userProgress.statistics.perfectScores >= value

    case "total_xp":
      return userProgress.totalXP >= value

    case "level_reached":
      return userProgress.level >= value

    case "category_mastery":
      if (category) {
        const categoryProg = userProgress.categoryProgress.find((cp) => cp.category === category)
        return categoryProg ? categoryProg.averageScore >= value : false
      }
      return false

    case "exam_readiness":
      if (examType) {
        return userProgress.examReadiness[examType] >= value
      }
      return false

    case "speed_completion":
      // Check if user has completed tricks within time limit
      const recentCompletions = userProgress.completedTricks.filter(
        (ct) => ct.timeSpent <= (timeLimit || 300), // default 5 minutes
      )
      return recentCompletions.length >= value

    case "time_spent":
      return userProgress.totalTimeSpent >= value * 60 // convert minutes to seconds

    case "consecutive_days":
      return userProgress.bestStreak >= value

    default:
      return false
  }
}

// Indexes
achievementSchema.index({ type: 1, rarity: 1 })
achievementSchema.index({ order: 1 })
achievementSchema.index({ isActive: 1 })

export default mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema)
