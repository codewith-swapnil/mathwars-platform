const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
const { createServer } = require("http")
const { Server } = require("socket.io")
require("dotenv").config()

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

// Import socket handlers
const socketHandler = require("./socket/socketHandler")

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(morgan("combined"))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mathwars", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Socket.io setup
socketHandler(io)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/problems", authenticateToken, problemRoutes)
app.use("/api/tournaments", authenticateToken, tournamentRoutes)
app.use("/api/leaderboard", authenticateToken, leaderboardRoutes)
app.use("/api/progress", authenticateToken, progressRoutes)
app.use("/api/achievements", authenticateToken, achievementRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
