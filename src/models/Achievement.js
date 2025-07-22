const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["solving", "streak", "speed", "accuracy", "social", "tournament", "special"],
      required: true,
    },
    condition: {
      type: {
        type: String,
        enum: [
          "problems_solved",
          "streak_days",
          "speed_solve",
          "accuracy_rate",
          "tournament_win",
          "xp_earned",
          "custom",
        ],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      timeframe: {
        type: String,
        enum: ["all_time", "daily", "weekly", "monthly"],
        default: "all_time",
      },
    },
    rewards: {
      xp: {
        type: Number,
        default: 0,
      },
      badge: {
        type: String,
        default: "",
      },
      title: {
        type: String,
        default: "",
      },
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for performance
achievementSchema.index({ category: 1, isActive: 1 })
achievementSchema.index({ rarity: 1 })

module.exports = mongoose.model("Achievement", achievementSchema)
