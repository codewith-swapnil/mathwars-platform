const express = require("express")
const User = require("../models/User")
const router = express.Router()

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { fullName, grade, school } = req.body
    const user = await User.findByIdAndUpdate(req.user.userId, { fullName, grade, school }, { new: true }).select(
      "-password",
    )

    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
