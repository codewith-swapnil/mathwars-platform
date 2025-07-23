import mongoose from "mongoose"

const ConditionSchema = new mongoose.Schema({
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

const AchievementSchema = new mongoose.Schema(
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
      enum: ["tricks_completed", "streak", "score", "time", "category", "exam", "special"],
    },
    condition: ConditionSchema,
    xpReward: {
      type: Number,
      required: true,
      min: 1,
    },
    badgeColor: {
      type: String,
      required: true,
      enum: ["bronze", "silver", "gold", "platinum"],
    },
    rarity: {
      type: String,
      required: true,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unlockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unlockCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
AchievementSchema.index({ type: 1, order: 1 })
AchievementSchema.index({ rarity: 1 })
AchievementSchema.index({ isActive: 1 })

// Virtual for unlock rate
AchievementSchema.virtual("unlockRate").get(function () {
  // This would need total user count to calculate properly
  return this.unlockCount
})

// Method to check if user qualifies for achievement
AchievementSchema.methods.checkQualification = function (userProgress) {
  const { type, value, category, examType } = this.condition

  switch (type) {
    case "count":
      return userProgress.tricksCompleted >= value

    case "streak":
      return userProgress.currentStreak >= value

    case "score":
      // Check if user has 'value' number of perfect scores
      const perfectScores = userProgress.completedTricks.filter((trick) => trick.score === 100).length
      return perfectScores >= value

    case "time":
      // Check if user completed any trick in less than 'value' minutes
      const fastCompletions = userProgress.completedTricks.filter((trick) => trick.timeSpent <= value).length
      return fastCompletions > 0

    case "category":
      if (!category) return false
      const categoryProgress = userProgress.categoryProgress.find((cp) => cp.category === category)
      return categoryProgress && categoryProgress.tricksCompleted >= value

    case "exam":
      if (!examType) return false
      const examReadiness = userProgress.examReadiness[examType]
      return examReadiness >= value

    default:
      return false
  }
}

// Static method to check all achievements for a user
AchievementSchema.statics.checkUserAchievements = async function (userId, userProgress) {
  const achievements = await this.find({ isActive: true })
  const newAchievements = []

  for (const achievement of achievements) {
    // Check if user already has this achievement
    const hasAchievement = userProgress.achievements.some((ua) => ua.achievementId.equals(achievement._id))

    if (!hasAchievement && achievement.checkQualification(userProgress)) {
      // User qualifies for this achievement
      newAchievements.push(achievement)

      // Add to user's achievements
      userProgress.achievements.push({
        achievementId: achievement._id,
        unlockedAt: new Date(),
      })

      // Add XP reward
      await userProgress.addXP(achievement.xpReward)

      // Update achievement unlock count
      achievement.unlockCount += 1
      achievement.unlockedBy.push(userId)
      await achievement.save()
    }
  }

  if (newAchievements.length > 0) {
    await userProgress.save()
  }

  return newAchievements
}

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema)
