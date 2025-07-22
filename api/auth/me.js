import { connectDB } from "../../lib/mongodb"
import User from "../../lib/models/User"
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

    const user = await User.findById(decoded.userId).select("-password").populate("achievements.achievementId")

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
}
