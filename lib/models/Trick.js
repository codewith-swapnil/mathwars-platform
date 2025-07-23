import mongoose from "mongoose"

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  example: { type: String, maxlength: 300 },
  formula: String,
  image: String, // URL to step illustration
})

const practiceQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, maxlength: 300 },
  options: [{ type: String, required: true, maxlength: 100 }],
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true, maxlength: 400 },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  timeLimit: { type: Number, default: 120 }, // in seconds
  points: { type: Number, default: 10 },
})

const examApplicationSchema = new mongoose.Schema({
  examType: {
    type: String,
    required: true,
    enum: ["SSC", "Banking", "Railway", "Insurance", "UPSC", "State PSC", "Defense", "Teaching"],
  },
  usage: { type: String, required: true, maxlength: 200 },
  timesSaved: { type: String, maxlength: 100 },
  frequency: { type: String, enum: ["Very High", "High", "Medium", "Low"], default: "Medium" },
  sampleQuestions: [{ question: String, solution: String, year: Number }],
})

const visualExampleSchema = new mongoose.Schema({
  problem: { type: String, required: true, maxlength: 200 },
  solution: { type: String, required: true, maxlength: 500 },
  explanation: { type: String, required: true, maxlength: 300 },
  image: String, // URL to visual explanation
  animation: String, // URL to animated explanation
})

const trickSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: {
      type: String,
      required: true,
      enum: [
        "Arithmetic",
        "Algebra",
        "Geometry",
        "Percentage",
        "Profit and Loss",
        "Simple Interest",
        "Compound Interest",
        "Time and Work",
        "Time Speed Distance",
        "Ratio and Proportion",
        "Mixtures and Alligations",
        "Number System",
        "Data Interpretation",
        "Mensuration",
        "Probability",
        "Statistics",
      ],
    },
    examTypes: [
      {
        type: String,
        enum: ["SSC", "Banking", "Railway", "Insurance", "UPSC", "State PSC", "Defense", "Teaching"],
        required: true,
      },
    ],
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    xpReward: { type: Number, required: true, min: 10, max: 500 },
    estimatedTime: { type: Number, required: true, min: 5, max: 120 }, // in minutes
    content: {
      introduction: { type: String, required: true, maxlength: 1000 },
      steps: [stepSchema],
      visualExample: visualExampleSchema,
      practiceQuestions: [practiceQuestionSchema],
      examApplications: [examApplicationSchema],
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    prerequisites: [
      {
        concept: { type: String, required: true },
        level: { type: String, enum: ["Basic", "Intermediate", "Advanced"], default: "Basic" },
      },
    ],
    statistics: {
      views: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0 },
      averageCompletionTime: { type: Number, default: 0 },
      successRate: { type: Number, default: 0, min: 0, max: 100 },
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, maxlength: 500 },
        helpful: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
trickSchema.index({ category: 1, difficulty: 1 })
trickSchema.index({ examTypes: 1 })
trickSchema.index({ tags: 1 })
trickSchema.index({ "statistics.views": -1 })
trickSchema.index({ "statistics.averageRating": -1 })
trickSchema.index({ featured: 1, publishedAt: -1 })
trickSchema.index({ title: "text", description: "text", tags: "text" })

// Virtual for rating display
trickSchema.virtual("rating").get(function () {
  return Math.round(this.statistics.averageRating * 10) / 10
})

// Method to increment views
trickSchema.methods.incrementViews = function () {
  this.statistics.views += 1
  return this.save()
}

// Method to add rating
trickSchema.methods.addRating = function (userId, rating, review = "") {
  // Check if user already rated
  const existingRating = this.ratings.find((r) => r.userId.toString() === userId.toString())

  if (existingRating) {
    // Update existing rating
    const oldRating = existingRating.rating
    existingRating.rating = rating
    existingRating.review = review

    // Recalculate average
    const totalScore = this.statistics.averageRating * this.statistics.totalRatings - oldRating + rating
    this.statistics.averageRating = totalScore / this.statistics.totalRatings
  } else {
    // Add new rating
    this.ratings.push({
      userId,
      rating,
      review,
      createdAt: new Date(),
    })

    // Update statistics
    const totalScore = this.statistics.averageRating * this.statistics.totalRatings + rating
    this.statistics.totalRatings += 1
    this.statistics.averageRating = totalScore / this.statistics.totalRatings
  }

  return this.save()
}

// Method to record completion
trickSchema.methods.recordCompletion = function (completionTime, score) {
  this.statistics.completions += 1

  // Update average completion time
  const totalTime = this.statistics.averageCompletionTime * (this.statistics.completions - 1) + completionTime
  this.statistics.averageCompletionTime = totalTime / this.statistics.completions

  // Update success rate
  const totalSuccess = this.statistics.successRate * (this.statistics.completions - 1) + score
  this.statistics.successRate = totalSuccess / this.statistics.completions

  return this.save()
}

// Static method to get tricks by filters
trickSchema.statics.getFiltered = function (filters = {}) {
  const query = { isPublished: true }

  if (filters.category) query.category = filters.category
  if (filters.difficulty) query.difficulty = filters.difficulty
  if (filters.examType) query.examTypes = { $in: [filters.examType] }
  if (filters.featured) query.featured = true
  if (filters.premium !== undefined) query.premium = filters.premium

  let sortOption = {}
  switch (filters.sortBy) {
    case "rating":
      sortOption = { "statistics.averageRating": -1 }
      break
    case "views":
      sortOption = { "statistics.views": -1 }
      break
    case "newest":
      sortOption = { publishedAt: -1 }
      break
    case "completions":
      sortOption = { "statistics.completions": -1 }
      break
    default:
      sortOption = { featured: -1, publishedAt: -1 }
  }

  return this.find(query)
    .sort(sortOption)
    .populate("author", "username fullName avatar")
    .populate("content.relatedTricks", "title category difficulty")
}

// Static method for search
trickSchema.statics.search = function (searchTerm, filters = {}) {
  const query = {
    isPublished: true,
    $text: { $search: searchTerm },
  }

  if (filters.category) query.category = filters.category
  if (filters.difficulty) query.difficulty = filters.difficulty
  if (filters.examType) query.examTypes = { $in: [filters.examType] }

  return this.find(query, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .populate("author", "username fullName avatar")
}

// Get recommended tricks for user
trickSchema.statics.getRecommended = function (userProgress, limit = 5) {
  // Get user's weak categories and preferred exam types
  const weakCategories = []
  const preferredExams = []

  if (userProgress.categoryProgress) {
    Array.from(userProgress.categoryProgress.entries()).forEach(([category, data]) => {
      if (data.averageScore < 70) {
        weakCategories.push(category)
      }
    })
  }

  if (userProgress.examProgress) {
    Array.from(userProgress.examProgress.entries()).forEach(([exam, data]) => {
      if (data.readiness < 80) {
        preferredExams.push(exam)
      }
    })
  }

  const query = {
    isPublished: true,
    $or: [{ category: { $in: weakCategories } }, { examTypes: { $in: preferredExams } }],
  }

  return this.find(query)
    .sort({ "statistics.averageRating": -1, featured: -1 })
    .limit(limit)
    .populate("author", "username fullName avatar")
}

export default mongoose.models.Trick || mongoose.model("Trick", trickSchema)
