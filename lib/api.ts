const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

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
  visualExample: {
    problem: string
    solution: string
    visualization: string
  }
  practiceQuestions: Array<{
    question: string
    options: string[]
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
  userId: string
  totalXP: number
  currentXP: number
  level: number
  xpToNextLevel: number
  tricksCompleted: number
  totalTimeSpent: number
  averageScore: number
  currentStreak: number
  bestStreak: number
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
  }
}

interface Achievement {
  _id: string
  name: string
  description: string
  icon: string
  type: string
  xpReward: number
  badgeColor: string
  rarity: string
  condition: {
    type: string
    value: number
  }
}

interface DashboardStats {
  user: {
    level: number
    totalXP: number
    currentXP: number
    xpToNextLevel: number
    currentStreak: number
    bestStreak: number
  }
  progress: {
    tricksCompleted: number
    totalTimeSpent: number
    averageScore: number
    perfectScores: number
  }
  today: {
    tricksCompleted: number
    timeSpent: number
    xpEarned: number
    goalProgress: {
      completed: number
      target: number
      percentage: number
    }
  }
  categoryProgress: Array<{
    category: string
    completed: number
    total: number
    percentage: number
    averageScore: number
  }>
  examReadiness: {
    SSC: number
    Banking: number
    Railway: number
    Insurance: number
  }
  recommendedTricks: Trick[]
  recentAchievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
    xpEarned: number
    rarity: string
  }>
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Health check
  async health(): Promise<ApiResponse> {
    return this.request("/health")
  }

  // Auto seed
  async autoSeed(): Promise<ApiResponse> {
    return this.request("/auto-seed")
  }

  // Seed tricks
  async seedTricks(): Promise<ApiResponse> {
    return this.request("/seed-tricks", { method: "POST" })
  }

  // Tricks
  async getTricks(params?: {
    category?: string
    difficulty?: string
    examType?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ tricks: Trick[]; pagination: any }>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    return this.request(`/tricks${queryString ? `?${queryString}` : ""}`)
  }

  async getTrick(id: string): Promise<ApiResponse<Trick>> {
    return this.request(`/tricks/${id}`)
  }

  async completeTrick(
    id: string,
    data: {
      userId: string
      timeSpent: number
      score: number
      practiceAnswers?: string[]
    },
  ): Promise<ApiResponse> {
    return this.request(`/tricks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Dashboard
  async getDashboardStats(userId: string): Promise<ApiResponse<DashboardStats>> {
    return this.request(`/dashboard/stats?userId=${userId}`)
  }

  // User Progress
  async getUserProgress(userId: string): Promise<ApiResponse<UserProgress>> {
    return this.request(`/user/progress?userId=${userId}`)
  }

  // Achievements
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request("/achievements")
  }

  // Leaderboard
  async getLeaderboard(type: "xp" | "streak" | "tricks" = "xp"): Promise<ApiResponse> {
    return this.request(`/leaderboard?type=${type}`)
  }
}

export const api = new ApiClient()
export type { Trick, UserProgress, Achievement, DashboardStats, ApiResponse }
