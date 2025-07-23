const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://your-app-name.vercel.app/api" : "/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

interface Trick {
  _id: string
  title: string
  description: string
  category: string
  difficulty: string
  timeToLearn: string
  examRelevance: string[]
  steps: Array<{
    title: string
    content: string
    example?: string
    visual?: string
  }>
  keyPoints: string[]
  tips: string[]
  practiceQuestions: Array<{
    question: string
    answer: string
    explanation?: string
  }>
  examApplications: Array<{
    exam: string
    usage: string
    timesSaved?: string
  }>
  rating: number
  studentsLearned: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface UserProgress {
  _id: string
  userId: string
  level: number
  xp: number
  streak: number
  tricksCompleted: string[]
  categoryProgress: Array<{
    category: string
    tricksLearned: number
    totalTricks: number
  }>
  achievements: Array<{
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
  accuracy: number
  examTarget: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Tricks API
  async getTricks(
    params: {
      category?: string
      difficulty?: string
      examRelevance?: string
      limit?: string
      page?: string
    } = {},
  ): Promise<{
    tricks: Trick[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    const queryString = queryParams.toString()
    return this.request(`/tricks${queryString ? `?${queryString}` : ""}`)
  }

  async getTrick(id: string): Promise<Trick> {
    return this.request(`/tricks/${id}`)
  }

  async completeTrick(
    id: string,
    data: {
      userId: string
      practiceScore?: number
    },
  ): Promise<{
    message: string
    xpEarned: number
    newLevel: number
    userProgress: UserProgress
  }> {
    return this.request(`/tricks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Progress API
  async getUserProgress(userId = "default"): Promise<{
    userProgress: UserProgress
    recentAchievements: Array<{
      name: string
      description: string
      icon: string
      earnedAt: string
    }>
  }> {
    return this.request(`/user/progress?userId=${userId}`)
  }

  // Dashboard API
  async getDashboardStats(userId = "default"): Promise<{
    userStats: {
      level: number
      xp: number
      xpToNext: number
      streak: number
      tricksLearned: number
      examTarget: string
    }
    todaysTricks: Trick[]
    examProgress: Array<{
      name: string
      progress: number
      learned: number
      total: number
      color: string
    }>
    upcomingExams: Array<{
      name: string
      date: string
      daysLeft: number
      registered: boolean
    }>
  }> {
    return this.request(`/dashboard/stats?userId=${userId}`)
  }

  // Seeding API
  async seedTricks(): Promise<{
    message: string
    count: number
    tricks: Array<{
      title: string
      category: string
      difficulty: string
    }>
  }> {
    return this.request("/seed-tricks", {
      method: "POST",
    })
  }

  // Auth API (for future use)
  async login(credentials: {
    email: string
    password: string
  }): Promise<{
    user: any
    token: string
  }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    username: string
    email: string
    password: string
    fullName: string
  }): Promise<{
    user: any
    token: string
  }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/health")
  }
}

export const api = new ApiClient()
export type { Trick, UserProgress }
