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

  // Problems endpoints
  getProblems: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters)
    return makeRequest(`/api/problems?${params}`)
  },

  getProblem: (id: string) => makeRequest(`/api/problems/${id}`),

  submitSolution: (
    problemId: string,
    solutionData: {
      solution: string
      timeSpent: number
      hintsUsed?: number
    },
  ) =>
    makeRequest(`/api/problems/${problemId}/submit`, {
      method: "POST",
      body: JSON.stringify(solutionData),
    }),

  // Health check
  healthCheck: () => makeRequest("/api/health"),
}

export default api
