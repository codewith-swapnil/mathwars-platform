const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId).select("_id username isActive")
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
      const user = await User.findById(decoded.userId).select("_id username isActive")

      if (user && user.isActive) {
        req.user = {
          userId: decoded.userId,
          username: decoded.username,
        }
      }
    }

    next()
  } catch (error) {
    // Continue without authentication for optional auth
    next()
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
}
