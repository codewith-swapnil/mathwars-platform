const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface Trick {
  _id: string
  title: string
  description: string
  category: string
  examTypes: string[]
  difficulty: string
  timeToLearn: number
  xpReward: number
  steps: Array<{
    title: string
    description: string
    example?: string
    formula?: string
  }>
  visualExample: {
    problem: string
    solution: string
    visualization: string
  }
  practiceQuestions: Array<{
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
    timeLimit: number
  }>
  examApplications: Array<{
    examType: string
    scenario: string
    timeSaved: string
    frequency: string
  }>
  tags: string[]
  createdAt: string
  completionCount: number
}

interface UserProgress {
  _id: string
  userId: string
  level: number
  totalXP: number
  currentXP: number
  xpToNextLevel: number
  tricksCompleted: number
  totalTimeSpent: number
  averageScore: number
  currentStreak: number
  bestStreak: number
  lastActivityDate: string
  categoryProgress: Array<{
    category: string
    tricksCompleted: number
    totalTricks: number
    averageScore: number
    timeSpent: number
  }>
  examReadiness: {
    SSC: number
    Banking: number
    Railway: number
    Insurance: number
    Other: number
  }
  targetExams: string[]
}

interface DashboardStats {
  userProgress: UserProgress
  recentTricks: Trick[]
  recommendations: Trick[]
  achievements: Array<{
    _id: string
    name: string
    description: string
    icon: string
    unlockedAt?: string
    isCompleted: boolean
  }>
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.request<{ token: string; user: any }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getProfile() {
    return this.request<{ user: any }>("/api/auth/me")
  }

  // Tricks methods
  async getTricks(
    params: {
      category?: string
      difficulty?: string
      examType?: string
      limit?: string
      page?: string
    } = {},
  ) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value)
    })

    const queryString = searchParams.toString()
    return this.request<{ tricks: Trick[]; total: number; page: number; totalPages: number }>(
      `/api/tricks${queryString ? `?${queryString}` : ""}`,
    )
  }

  async getTrick(id: string) {
    return this.request<{ trick: Trick }>(`/api/tricks/${id}`)
  }

  async completeTrick(id: string, data: { timeSpent: number; score?: number }) {
    return this.request<{ success: boolean; xpGained: number; levelUp?: boolean }>(`/api/tricks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Progress methods
  async getUserProgress() {
    return this.request<{ progress: UserProgress }>("/api/user/progress")
  }

  async updateUserProgress(data: Partial<UserProgress>) {
    return this.request<{ progress: UserProgress }>("/api/user/progress", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request<DashboardStats>("/api/dashboard/stats")
  }

  // Seeding methods
  async seedTricks() {
    return this.request<{ success: boolean; message: string }>("/api/seed-tricks", {
      method: "POST",
    })
  }

  async autoSeed() {
    return this.request<{ success: boolean; message: string; seedResult?: any }>("/api/auto-seed")
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string
      database: string
      collections: Record<string, number>
      environment: Record<string, any>
    }>("/api/health")
  }

  // Leaderboard methods
  async getLeaderboard(params: { type?: string; limit?: string } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value)
    })

    const queryString = searchParams.toString()
    return this.request<{ leaderboard: any[] }>(`/api/leaderboard${queryString ? `?${queryString}` : ""}`)
  }

  // Achievements methods
  async getAchievements() {
    return this.request<{ achievements: any[] }>("/api/achievements")
  }
}

export const api = new ApiClient()
export type { Trick, UserProgress, DashboardStats }
