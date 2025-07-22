import { connectDB } from "../../lib/mongodb"
import Problem from "../../lib/models/Problem"
import UserProgress from "../../lib/models/UserProgress"
import { verifyToken } from "../../lib/auth"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    await connectDB()

    const { difficulty, topic, page = 1, limit = 20, search } = req.query
    const userId = decoded.userId

    // Build filter
    const filter = { isActive: true }
    if (difficulty && difficulty !== "all") filter.difficulty = difficulty
    if (topic && topic !== "all") filter.topic = topic
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
}
