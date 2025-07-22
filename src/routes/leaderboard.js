const express = require("express")
const { query, validationResult } = require("express-validator")
const User = require("../models/User")
const UserProgress = require("../models/UserProgress")

const router = express.Router()

// Get global leaderboard
router.get(
  "/",
  [
    query("timeframe").optional().isIn(["daily", "weekly", "monthly", "all-time"]),
    query("category")
      .optional()
      .isIn(["overall", "algebra", "geometry", "calculus", "number-theory", "combinatorics", "probability"]),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { timeframe = "all-time", category = "overall", limit = 50 } = req.query
      const userId = req.user.userId

      let leaderboard = []
      let userRank = null

      if (category === "overall") {
        // Overall leaderboard based on XP
        const users = await User.find({ isActive: true })
          .select("username fullName avatar level xp streak stats")
          .sort({ xp: -1, level: -1 })
          .limit(Number.parseInt(limit))

        leaderboard = users.map((user, index) => ({
          rank: index + 1,
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          problemsSolved: user.stats.totalProblems,
          accuracy: user.accuracy,
          change: 0, // You'd calculate this based on previous rankings
        }))

        // Find current user's rank
        const userRankData = await User.countDocuments({
          isActive: true,
          $or: [
            { xp: { $gt: (await User.findById(userId)).xp } },
            { xp: (await User.findById(userId)).xp, level: { $gt: (await User.findById(userId)).level } },
          ],
        })
        userRank = userRankData + 1
      } else {
        // Category-specific leaderboard
        const topicMap = {
          algebra: "Algebra",
          geometry: "Geometry",
          calculus: "Calculus",
          "number-theory": "Number Theory",
          combinatorics: "Combinatorics",
          probability: "Probability",
        }

        const topic = topicMap[category]

        // Get users with progress in this topic
        const pipeline = [
          {
            $lookup: {
              from: "userprogressions",
              localField: "_id",
              foreignField: "userId",
              as: "progress",
            },
          },
          {
            $lookup: {
              from: "problems",
              localField: "progress.problemId",
              foreignField: "_id",
              as: "problems",
            },
          },
          {
            $addFields: {
              topicProgress: {
                $filter: {
                  input: "$progress",
                  as: "prog",
                  cond: {
                    $and: [{ $eq: ["$$prog.solved", true] }, { $in: [topic, "$problems.topic"] }],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              topicScore: { $size: "$topicProgress" },
            },
          },
          {
            $match: { topicScore: { $gt: 0 } },
          },
          {
            $sort: { topicScore: -1, xp: -1 },
          },
          {
            $limit: Number.parseInt(limit),
          },
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
              level: 1,
              xp: 1,
              streak: 1,
              "stats.totalProblems": 1,
              "stats.correctProblems": 1,
              topicScore: 1,
            },
          },
        ]

        const users = await User.aggregate(pipeline)

        leaderboard = users.map((user, index) => ({
          rank: index + 1,
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          problemsSolved: user.stats.totalProblems,
          accuracy:
            user.stats.totalProblems > 0
              ? Math.round((user.stats.correctProblems / user.stats.totalProblems) * 100)
              : 0,
          topicScore: user.topicScore,
          change: 0,
        }))
      }

      res.json({
        leaderboard,
        userRank,
        timeframe,
        category,
        total: leaderboard.length,
      })
    } catch (error) {
      console.error("Leaderboard error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's rank in different categories
router.get("/user-ranks", async (req, res) => {
  try {
    const userId = req.user.userId
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Overall rank
    const overallRank =
      (await User.countDocuments({
        isActive: true,
        xp: { $gt: user.xp },
      })) + 1

    // Category ranks (simplified)
    const categories = ["Algebra", "Geometry", "Calculus", "Number Theory", "Combinatorics", "Probability"]
    const categoryRanks = {}

    for (const category of categories) {
      // This is a simplified calculation - you'd want more sophisticated ranking
      const solved = await UserProgress.countDocuments({
        userId,
        solved: true,
      })

      categoryRanks[category.toLowerCase().replace(" ", "-")] = Math.floor(Math.random() * 100) + 1 // Mock data
    }

    res.json({
      overall: overallRank,
      categories: categoryRanks,
      user: {
        xp: user.xp,
        level: user.level,
        problemsSolved: user.stats.totalProblems,
        accuracy: user.accuracy,
      },
    })
  } catch (error) {
    console.error("User ranks error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
