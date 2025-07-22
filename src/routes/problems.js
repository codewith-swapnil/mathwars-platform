const express = require("express")
const { body, query, validationResult } = require("express-validator")
const Problem = require("../models/Problem")
const UserProgress = require("../models/UserProgress")
const User = require("../models/User")

const router = express.Router()

// Get all problems with filtering
router.get(
  "/",
  [
    query("difficulty").optional().isIn(["Easy", "Medium", "Hard"]),
    query("topic")
      .optional()
      .isIn(["Algebra", "Geometry", "Calculus", "Number Theory", "Combinatorics", "Probability"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { difficulty, topic, page = 1, limit = 20, search } = req.query
      const userId = req.user.userId

      // Build filter
      const filter = { isActive: true }
      if (difficulty) filter.difficulty = difficulty
      if (topic) filter.topic = topic
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ]
      }

      // Get problems with pagination
      const problems = await Problem.find(filter)
        .select("-solution -testCases")
        .populate("author", "username fullName")
        .sort({ featured: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      // Get user progress for these problems
      const problemIds = problems.map((p) => p._id)
      const userProgress = await UserProgress.find({
        userId,
        problemId: { $in: problemIds },
      })

      // Create progress map
      const progressMap = {}
      userProgress.forEach((progress) => {
        progressMap[progress.problemId] = progress
      })

      // Combine problems with progress
      const problemsWithProgress = problems.map((problem) => ({
        id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        topic: problem.topic,
        xpReward: problem.xpReward,
        timeLimit: problem.timeLimit,
        tags: problem.tags,
        author: problem.author,
        stats: problem.stats,
        successRate: problem.successRate,
        featured: problem.featured,
        progress: progressMap[problem._id] || null,
      }))

      // Get total count for pagination
      const total = await Problem.countDocuments(filter)

      res.json({
        problems: problemsWithProgress,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      })
    } catch (error) {
      console.error("Get problems error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get single problem
router.get("/:id", async (req, res) => {
  try {
    const problemId = req.params.id
    const userId = req.user.userId

    const problem = await Problem.findOne({ _id: problemId, isActive: true }).populate("author", "username fullName")

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    // Get user progress
    const progress = await UserProgress.findOne({ userId, problemId })

    // Don't send solution unless user has solved it
    const problemData = {
      id: problem._id,
      title: problem.title,
      description: problem.description,
      content: problem.content,
      difficulty: problem.difficulty,
      topic: problem.topic,
      subtopic: problem.subtopic,
      xpReward: problem.xpReward,
      timeLimit: problem.timeLimit,
      hints: problem.hints.map((hint) => ({ text: hint.text, xpPenalty: hint.xpPenalty })),
      tags: problem.tags,
      author: problem.author,
      stats: problem.stats,
      successRate: problem.successRate,
      progress: progress || null,
    }

    // Include solution if user has solved it
    if (progress && progress.solved) {
      problemData.solution = problem.solution
    }

    res.json({ problem: problemData })
  } catch (error) {
    console.error("Get problem error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit solution
router.post(
  "/:id/submit",
  [
    body("solution").isLength({ min: 1 }).trim(),
    body("timeSpent").isInt({ min: 0 }),
    body("hintsUsed").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const problemId = req.params.id
      const userId = req.user.userId
      const { solution, timeSpent, hintsUsed = 0 } = req.body

      // Get problem
      const problem = await Problem.findById(problemId)
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" })
      }

      // Get or create user progress
      let progress = await UserProgress.findOne({ userId, problemId })
      if (!progress) {
        progress = new UserProgress({ userId, problemId })
      }

      // Simple solution checking (you'd want more sophisticated checking)
      const isCorrect = solution.toLowerCase().includes(problem.solution.answer.toLowerCase().substring(0, 5))

      // Update progress
      progress.attempts += 1
      progress.solution = solution
      progress.timeSpent = timeSpent
      progress.hintsUsed = hintsUsed
      progress.submittedAt = new Date()

      let xpEarned = 0
      if (isCorrect && !progress.solved) {
        progress.solved = true
        progress.solvedAt = new Date()

        // Calculate XP (reduce for hints used)
        xpEarned = problem.xpReward - hintsUsed * 10
        progress.xpEarned = xpEarned

        // Update user stats
        const user = await User.findById(userId)
        await user.addXP(xpEarned)
        await user.updateStreak()

        // Update user problem stats
        user.stats.totalProblems += 1
        user.stats.correctProblems += 1
        await user.save()

        // Update problem stats
        await problem.updateStats(true, timeSpent, progress.attempts)
      } else if (!isCorrect) {
        // Update problem stats for failed attempt
        await problem.updateStats(false, timeSpent, 1)
      }

      await progress.save()

      res.json({
        success: true,
        correct: isCorrect,
        xpEarned,
        attempts: progress.attempts,
        message: isCorrect ? "Correct solution!" : "Incorrect solution. Try again!",
      })
    } catch (error) {
      console.error("Submit solution error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get hint
router.post("/:id/hint", async (req, res) => {
  try {
    const problemId = req.params.id
    const userId = req.user.userId

    const problem = await Problem.findById(problemId)
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    // Get user progress
    let progress = await UserProgress.findOne({ userId, problemId })
    if (!progress) {
      progress = new UserProgress({ userId, problemId })
      await progress.save()
    }

    const hintIndex = progress.hintsUsed
    if (hintIndex >= problem.hints.length) {
      return res.status(400).json({ message: "No more hints available" })
    }

    const hint = problem.hints[hintIndex]
    progress.hintsUsed += 1
    await progress.save()

    res.json({
      hint: hint.text,
      xpPenalty: hint.xpPenalty,
      hintsUsed: progress.hintsUsed,
      hintsRemaining: problem.hints.length - progress.hintsUsed,
    })
  } catch (error) {
    console.error("Get hint error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
