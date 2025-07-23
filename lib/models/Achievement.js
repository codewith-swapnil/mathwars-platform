import mongoose from "mongoose"

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  type: {
    type: String,
    enum: ["tricks_completed", "streak", "category_master", "exam_ready", "speed_demon"],
    required: true,
  },
  requirement: { type: Number, required: true },
  xpReward: { type: Number, required: true },
  rarity: { type: String, enum: ["Common", "Rare", "Epic", "Legendary"], default: "Common" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema)
