const express = require("express")
const Achievement = require("../models/Achievement")
const User = require("../models/User")
const router = express.Router()

// Get all achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true })
    const user = await User.findById(req.user.userId)

    const achievementsWithProgress = achievements.map((achievement) => ({
      ...achievement.toObject(),
      earned: user.achievements.some((a) => a.achievementId.toString() === achievement._id.toString()),
    }))

    res.json({ achievements: achievementsWithProgress })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
