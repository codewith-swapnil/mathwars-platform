// API configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // Use relative URLs in production (same domain)
    : "http://localhost:3000"

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Auth endpoints
  register: (userData: {
    username: string
    email: string
    password: string
    fullName: string
    grade?: string
    school?: string
  }) =>
    makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    makeRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => makeRequest("/api/auth/me"),

  // Tricks endpoints
  getTricks: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters)
    return makeRequest(`/api/tricks?${params}`)
  },

  getTrick: (id: string) => makeRequest(`/api/tricks/${id}`),

  completeTrick: (
    trickId: string,
    progressData: {
      timeSpent: number
      practiceScore?: number
    },
  ) =>
    makeRequest(`/api/tricks/${trickId}/complete`, {
      method: "POST",
      body: JSON.stringify(progressData),
    }),

  // User progress endpoints
  getUserProgress: () => makeRequest("/api/user/progress"),

  // Dashboard endpoints
  getDashboardStats: () => makeRequest("/api/dashboard/stats"),

  // Utility endpoints
  healthCheck: () => makeRequest("/api/health"),
  seedTricks: () => makeRequest("/api/seed-tricks", { method: "POST" }),
}

export default api
