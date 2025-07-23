import mongoose from "mongoose"

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // Icon name or emoji
  type: {
    type: String,
    required: true,
    enum: ["tricks_completed", "streak", "score", "time", "category", "level", "special"],
  },

  // Unlock Conditions
  condition: {
    type: {
      type: String,
      required: true,
      enum: ["count", "streak", "score", "time", "level", "category_complete", "special"],
    },
    value: { type: Number, required: true },
    category: { type: String }, // For category-specific achievements
    examType: { type: String }, // For exam-specific achievements
  },

  // Rewards
  xpReward: { type: Number, required: true },
  badgeColor: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum", "diamond"],
    default: "bronze",
  },

  // Metadata
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    default: "common",
  },
  isHidden: { type: Boolean, default: false }, // Hidden until unlocked
  order: { type: Number, default: 0 }, // Display order

  // Stats
  unlockedBy: { type: Number, default: 0 }, // Count of users who unlocked this

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
})

// Indexes
AchievementSchema.index({ type: 1 })
AchievementSchema.index({ rarity: 1 })
AchievementSchema.index({ order: 1 })

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema)
