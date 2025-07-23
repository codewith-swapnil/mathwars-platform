import mongoose from "mongoose"

const conditionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["count", "streak", "score", "time", "category", "exam"],
  },
  value: {
    type: Number,
    required: true,
  },
  category: String, // For category-specific achievements
  examType: String, // For exam-specific achievements
})

const achievementSchema = new mongoose.Schema(
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
    icon: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "tricks_completed",
        "streak",
        "score",
        "time",
        "category_master",
        "exam_ready",
        "speed_demon",
        "perfectionist",
        "dedicated_learner",
        "milestone",
      ],
    },
    condition: conditionSchema,
    xpReward: {
      type: Number,
      required: true,
      min: 1,
    },
    badgeColor: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      default: "common",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    unlockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalUnlocks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
achievementSchema.index({ type: 1 })
achievementSchema.index({ rarity: 1 })
achievementSchema.index({ order: 1 })
achievementSchema.index({ isActive: 1 })

// Virtual for unlock percentage
achievementSchema.virtual("unlockPercentage").get(function () {
  // This would need total user count to calculate properly
  return Math.round((this.totalUnlocks / 1000) * 100) // Assuming 1000 total users for now
})

// Method to check if user meets condition
achievementSchema.methods.checkCondition = function (userProgress) {
  const { type, value, category, examType } = this.condition

  switch (type) {
    case "count":
      return userProgress.tricksCompleted >= value

    case "streak":
      return userProgress.currentStreak >= value

    case "score":
      // Check if user has scored 100% on 'value' number of tricks
      const perfectScores = userProgress.completedTricks.filter((trick) => trick.score === 100).length
      return perfectScores >= value

    case "time":
      // Check if user has completed a trick in under 'value' minutes
      const fastCompletions = userProgress.completedTricks.filter((trick) => trick.timeSpent <= value * 60).length
      return fastCompletions >= 1

    case "category":
      // Check if user has completed all tricks in a category
      const categoryProgress = userProgress.categoryProgress.find((cat) => cat.category === category)
      return categoryProgress && categoryProgress.tricksCompleted >= categoryProgress.totalTricks

    case "exam":
      // Check if user has reached readiness score for an exam
      return userProgress.examReadiness[examType] >= value

    default:
      return false
  }
}

// Static method to check achievements for a user
achievementSchema.statics.checkUserAchievements = async function (userProgress) {
  const achievements = await this.find({ isActive: true })
  const newAchievements = []

  for (const achievement of achievements) {
    // Check if user already has this achievement
    const alreadyUnlocked = userProgress.achievementsUnlocked.some(
      (unlocked) => unlocked.achievementId.toString() === achievement._id.toString(),
    )

    if (!alreadyUnlocked && achievement.checkCondition(userProgress)) {
      newAchievements.push(achievement)
    }
  }

  return newAchievements
}

// Method to unlock for user
achievementSchema.methods.unlockForUser = function (userId) {
  if (!this.unlockedBy.includes(userId)) {
    this.unlockedBy.push(userId)
    this.totalUnlocks += 1
    return this.save()
  }
  return Promise.resolve(this)
}

export default mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema)
