const express = require("express")
const Tournament = require("../models/Tournament")
const router = express.Router()

// Get all tournaments
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find({ isPublic: true })
      .populate("createdBy", "username")
      .sort({ startTime: 1 })

    res.json({ tournaments })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Join tournament
router.post("/:id/join", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
    await tournament.addParticipant(req.user.userId)

    res.json({ message: "Successfully joined tournament" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
