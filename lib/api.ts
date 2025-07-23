const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

interface ApiResponse<T = any> {
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
  visualExample?: {
    problem: string
    solution: string
    visualization: string
  }
  practiceQuestions: Array<{
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }>
  examApplications: Array<{
    examType: string
    scenario: string
    timeSaved: string
    frequency: string
  }>
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface UserProgress {
  _id: string
  userId: string
  level: number
  totalXP: number
  currentXP: number
  tricksCompleted: number
  totalTimeSpent: number
  averageScore: number
  currentStreak: number
  bestStreak: number
  lastActivityDate: string
  targetExams: string[]
  examReadiness: {
    SSC: number
    Banking: number
    Railway: number
    Insurance: number
    Others: number
  }
  categoryProgress: Array<{
    category: string
    tricksCompleted: number
    totalTricks: number
    averageScore: number
    timeSpent: number
  }>
  completedTricks: Array<{
    trickId: string
    completedAt: string
    score: number
    timeSpent: number
  }>
  achievements: Array<{
    achievementId: string
    unlockedAt: string
  }>
}

interface Achievement {
  _id: string
  name: string
  description: string
  icon: string
  type: string
  condition: {
    type: string
    value: number
    category?: string
    examType?: string
  }
  xpReward: number
  badgeColor: string
  rarity: string
  order: number
  unlockCount: number
}

interface DashboardStats {
  userProgress: UserProgress
  recentTricks: Trick[]
  recommendedTricks: Trick[]
  achievements: Achievement[]
  leaderboard: Array<{
    username: string
    level: number
    totalXP: number
  }>
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    username: string
    email: string
    password: string
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request("/api/auth/me")
  }

  // Tricks
  async getTricks(params?: {
    category?: string
    examType?: string
    difficulty?: string
    limit?: string
    page?: string
  }): Promise<ApiResponse<{ tricks: Trick[]; total: number; page: number; totalPages: number }>> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }

    const queryString = searchParams.toString()
    return this.request(`/api/tricks${queryString ? `?${queryString}` : ""}`)
  }

  async getTrick(id: string): Promise<ApiResponse<Trick>> {
    return this.request(`/api/tricks/${id}`)
  }

  async completeTrick(
    id: string,
    data: { score: number; timeSpent: number },
  ): Promise<ApiResponse<{ xpGained: number; newAchievements: Achievement[] }>> {
    return this.request(`/api/tricks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Progress
  async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    return this.request("/api/user/progress")
  }

  async updateUserProgress(data: Partial<UserProgress>): Promise<ApiResponse<UserProgress>> {
    return this.request("/api/user/progress", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request("/api/dashboard/stats")
  }

  // Achievements
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request("/api/achievements")
  }

  async getUserAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request("/api/user/achievements")
  }

  // Leaderboard
  async getLeaderboard(limit?: number): Promise<
    ApiResponse<
      Array<{
        username: string
        level: number
        totalXP: number
        tricksCompleted: number
      }>
    >
  > {
    return this.request(`/api/leaderboard${limit ? `?limit=${limit}` : ""}`)
  }

  // Seeding and Health
  async seedTricks(): Promise<ApiResponse<any>> {
    return this.request("/api/seed-tricks", {
      method: "POST",
    })
  }

  async autoSeed(): Promise<ApiResponse<any>> {
    return this.request("/api/auto-seed")
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; database: string; timestamp: string }>> {
    return this.request("/api/health")
  }

  // Search
  async searchTricks(query: string): Promise<ApiResponse<Trick[]>> {
    return this.request(`/api/search?q=${encodeURIComponent(query)}`)
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
    return this.request("/api/categories")
  }

  // Exam Types
  async getExamTypes(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
    return this.request("/api/exam-types")
  }
}

export const api = new ApiClient()
export type { Trick, UserProgress, Achievement, DashboardStats }
