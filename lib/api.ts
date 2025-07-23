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
  difficulty: "Easy" | "Medium" | "Hard"
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
  views: number
  completions: number
  averageRating: number
  createdAt: string
  updatedAt: string
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
  dailyGoal: number
  dailyProgress: number
  weeklyGoal: number
  weeklyProgress: number
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
  totalUnlocks: number
}

interface DashboardStats {
  userProgress: UserProgress
  recentTricks: Trick[]
  recommendedTricks: Trick[]
  achievements: Achievement[]
  unlockedAchievements: Achievement[]
  leaderboard: Array<{
    username: string
    level: number
    totalXP: number
    tricksCompleted: number
  }>
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
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

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request("/api/health")
  }

  // Seeding
  async seedTricks(): Promise<ApiResponse> {
    return this.request("/api/seed-tricks", { method: "POST" })
  }

  async autoSeed(): Promise<ApiResponse> {
    return this.request("/api/auto-seed")
  }

  // Tricks
  async getTricks(params?: {
    category?: string
    examType?: string
    difficulty?: string
    search?: string
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
    data: {
      timeSpent: number
      score: number
      answers: Record<string, string>
    },
  ): Promise<ApiResponse<{ xpEarned: number; levelUp: boolean; newAchievements: Achievement[] }>> {
    return this.request(`/api/tricks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Progress
  async getUserProgress(userId?: string): Promise<ApiResponse<UserProgress>> {
    const endpoint = userId ? `/api/user/progress?userId=${userId}` : "/api/user/progress"
    return this.request(endpoint)
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

  async getUserAchievements(userId?: string): Promise<ApiResponse<Achievement[]>> {
    const endpoint = userId ? `/api/achievements/user?userId=${userId}` : "/api/achievements/user"
    return this.request(endpoint)
  }

  // Leaderboard
  async getLeaderboard(limit = 10): Promise<
    ApiResponse<
      Array<{
        username: string
        level: number
        totalXP: number
        tricksCompleted: number
        currentStreak: number
      }>
    >
  > {
    return this.request(`/api/leaderboard?limit=${limit}`)
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
    return this.request("/api/categories")
  }

  // Search
  async searchTricks(query: string): Promise<ApiResponse<Trick[]>> {
    return this.request(`/api/search?q=${encodeURIComponent(query)}`)
  }

  // Statistics
  async getStats(): Promise<
    ApiResponse<{
      totalTricks: number
      totalUsers: number
      totalCompletions: number
      popularCategories: Array<{ category: string; count: number }>
      popularExamTypes: Array<{ examType: string; count: number }>
    }>
  > {
    return this.request("/api/stats")
  }
}

export const api = new ApiClient()
export type { Trick, UserProgress, Achievement, DashboardStats, ApiResponse }
