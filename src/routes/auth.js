const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("username").isLength({ min: 3, max: 20 }).trim(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("fullName").isLength({ min: 2 }).trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { username, email, password, fullName, grade, school } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      })

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email ? "Email already registered" : "Username already taken",
        })
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        fullName,
        grade: grade || "9",
        school: school || "",
      })

      await user.save()

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" },
      )

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error during registration" })
    }
  },
)

// Login
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d",
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password").populate("achievements.achievementId")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        avatar: user.avatar,
        grade: user.grade,
        school: user.school,
        stats: user.stats,
        achievements: user.achievements,
        accuracy: user.accuracy,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Refresh token
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d",
    })

    res.json({ token })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
