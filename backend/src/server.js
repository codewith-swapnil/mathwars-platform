const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
require("dotenv").config()

// Import CORS configuration
const corsOptions = require("./config/cors")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const problemRoutes = require("./routes/problems")
const tournamentRoutes = require("./routes/tournaments")
const leaderboardRoutes = require("./routes/leaderboard")
const progressRoutes = require("./routes/progress")
const achievementRoutes = require("./routes/achievements")

// Import middleware
const errorHandler = require("./middleware/errorHandler")
const { authenticateToken } = require("./middleware/auth")

const app = express()

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

app.use(compression())
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
app.use(cors(corsOptions))

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Higher limit for development
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api/", limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Database connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mathwars", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/problems", authenticateToken, problemRoutes)
app.use("/api/tournaments", authenticateToken, tournamentRoutes)
app.use("/api/leaderboard", authenticateToken, leaderboardRoutes)
app.use("/api/progress", authenticateToken, progressRoutes)
app.use("/api/achievements", authenticateToken, achievementRoutes)

// Health check with more details
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 MathWars API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      problems: "/api/problems",
      leaderboard: "/api/leaderboard",
    },
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

module.exports = app
