const express = require("express")
const UserProgress = require("../models/UserProgress")
const router = express.Router()

// Get user progress
router.get("/", async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.userId })
      .populate("problemId", "title difficulty topic xpReward")
      .sort({ updatedAt: -1 })

    res.json({ progress })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
