const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      default: "🏆",
    },
    category: {
      type: String,
      required: true,
      enum: ["learning", "streak", "accuracy", "speed", "completion", "social", "special"],
      default: "learning",
    },
    condition: {
      type: {
        type: String,
        required: true,
        enum: [
          "tricks_completed",
          "streak_days",
          "perfect_sessions",
          "speed_completion",
          "category_mastery",
          "exam_readiness",
          "total_xp",
          "level_reached",
          "consecutive_correct",
          "time_spent",
          "login_streak",
        ],
      },
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      category: String, // Optional: specific category for category-based achievements
      examType: String, // Optional: specific exam type
      timeLimit: Number, // Optional: time limit in seconds for speed achievements
    },
    rewards: {
      xp: {
        type: Number,
        default: 0,
        min: 0,
      },
      badge: {
        name: String,
        icon: String,
        color: String,
      },
      title: String, // Special title for user profile
      unlocks: [String], // Features or content unlocked
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
    statistics: {
      totalUnlocked: { type: Number, default: 0 },
      firstUnlockedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: Date,
      },
      averageTimeToUnlock: { type: Number, default: 0 }, // in days
      unlockRate: { type: Number, default: 0 }, // percentage of users who unlocked
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date, // Optional: for time-limited achievements
    metadata: {
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "extreme"],
        default: "medium",
      },
      estimatedTime: String, // Human readable estimate
      tips: [String], // Tips to help users unlock
      relatedAchievements: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Achievement",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
achievementSchema.index({ category: 1 })
achievementSchema.index({ rarity: 1 })
achievementSchema.index({ isActive: 1 })
achievementSchema.index({ "condition.type": 1 })

// Check if user meets achievement condition
achievementSchema.methods.checkCondition = function (userProgress, additionalData = {}) {
  const { condition } = this

  switch (condition.type) {
    case "tricks_completed":
      return userProgress.tricksCompleted >= condition.value

    case "streak_days":
      return userProgress.streak >= condition.value

    case "perfect_sessions":
      const perfectSessions = userProgress.sessionHistory.filter((s) => s.averageScore === 100).length
      return perfectSessions >= condition.value

    case "speed_completion":
      // Check if user completed a trick within time limit
      return additionalData.completionTime <= condition.value

    case "category_mastery":
      if (!condition.category) return false
      const categoryData = userProgress.categoryProgress.get(condition.category)
      return categoryData && categoryData.completed >= condition.value

    case "exam_readiness":
      if (!condition.examType) return false
      const examData = userProgress.examProgress.get(condition.examType)
      return examData && examData.readiness >= condition.value

    case "total_xp":
      return userProgress.xp >= condition.value

    case "level_reached":
      return userProgress.level >= condition.value

    case "consecutive_correct":
      // This would need to be tracked separately
      return additionalData.consecutiveCorrect >= condition.value

    case "time_spent":
      const totalTime = Array.from(userProgress.categoryProgress.values()).reduce((sum, cat) => sum + cat.timeSpent, 0)
      return totalTime >= condition.value

    case "login_streak":
      // This would need to be tracked in user model
      return additionalData.loginStreak >= condition.value

    default:
      return false
  }
}

// Get achievement progress for a user
achievementSchema.methods.getProgress = function (userProgress, additionalData = {}) {
  const { condition } = this
  let current = 0
  let target = condition.value

  switch (condition.type) {
    case "tricks_completed":
      current = userProgress.tricksCompleted
      break

    case "streak_days":
      current = userProgress.streak
      break

    case "perfect_sessions":
      current = userProgress.sessionHistory.filter((s) => s.averageScore === 100).length
      break

    case "speed_completion":
      current = additionalData.completionTime || 0
      target = condition.value
      break

    case "category_mastery":
      if (condition.category) {
        const categoryData = userProgress.categoryProgress.get(condition.category)
        current = categoryData ? categoryData.completed : 0
      }
      break

    case "exam_readiness":
      if (condition.examType) {
        const examData = userProgress.examProgress.get(condition.examType)
        current = examData ? examData.readiness : 0
      }
      break

    case "total_xp":
      current = userProgress.xp
      break

    case "level_reached":
      current = userProgress.level
      break

    case "time_spent":
      current = Array.from(userProgress.categoryProgress.values()).reduce((sum, cat) => sum + cat.timeSpent, 0)
      break
  }

  return {
    current: Math.min(current, target),
    target,
    percentage: Math.min(100, Math.round((current / target) * 100)),
    completed: current >= target,
  }
}

// Static method to check all achievements for a user
achievementSchema.statics.checkUserAchievements = async function (userId, userProgress, additionalData = {}) {
  const achievements = await this.find({ isActive: true })
  const unlockedAchievements = []

  for (const achievement of achievements) {
    // Check if user already has this achievement
    const hasAchievement = userProgress.achievements.some(
      (a) => a.achievementId.toString() === achievement._id.toString(),
    )

    if (!hasAchievement && achievement.checkCondition(userProgress, additionalData)) {
      // Check prerequisites
      let prerequisitesMet = true
      if (achievement.prerequisites.length > 0) {
        for (const prereqId of achievement.prerequisites) {
          const hasPrereq = userProgress.achievements.some((a) => a.achievementId.toString() === prereqId.toString())
          if (!hasPrereq) {
            prerequisitesMet = false
            break
          }
        }
      }

      if (prerequisitesMet) {
        unlockedAchievements.push(achievement)

        // Update statistics
        achievement.statistics.totalUnlocked += 1
        if (achievement.statistics.totalUnlocked === 1) {
          achievement.statistics.firstUnlockedBy = {
            userId,
            date: new Date(),
          }
        }
        await achievement.save()
      }
    }
  }

  return unlockedAchievements
}

// Get achievements by category
achievementSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ rarity: 1, createdAt: 1 })
}

// Get user's achievement progress
achievementSchema.statics.getUserProgress = async function (userProgress) {
  const achievements = await this.find({ isActive: true, isHidden: false })

  return achievements.map((achievement) => ({
    ...achievement.toObject(),
    progress: achievement.getProgress(userProgress),
    unlocked: userProgress.achievements.some((a) => a.achievementId.toString() === achievement._id.toString()),
    unlockedAt: userProgress.achievements.find((a) => a.achievementId.toString() === achievement._id.toString())
      ?.unlockedAt,
  }))
}

module.exports = mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema)
