// API configuration that works with both local and Vercel deployment
const getApiUrl = () => {
  // In production (Vercel), use the deployed API URL
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_VERCEL_API_URL || "https://your-api.vercel.app/api"
  }

  // In development, use local backend
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
}

const API_BASE_URL = getApiUrl()

// Helper function to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

export const api = {
  // Auth endpoints
  register: (userData) =>
    makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => makeRequest("/auth/me"),

  refreshToken: () => makeRequest("/auth/refresh", { method: "POST" }),

  // Problems endpoints
  getProblems: (filters = {}) => {
    const params = new URLSearchParams(filters)
    return makeRequest(`/problems?${params}`)
  },

  getProblem: (id) => makeRequest(`/problems/${id}`),

  submitSolution: (problemId, solutionData) =>
    makeRequest(`/problems/${problemId}/submit`, {
      method: "POST",
      body: JSON.stringify(solutionData),
    }),

  getHint: (problemId) =>
    makeRequest(`/problems/${problemId}/hint`, {
      method: "POST",
    }),

  // Leaderboard endpoints
  getLeaderboard: (params = {}) => {
    const queryParams = new URLSearchParams(params)
    return makeRequest(`/leaderboard?${queryParams}`)
  },

  getUserRanks: () => makeRequest("/leaderboard/user-ranks"),

  // User endpoints
  getUserProfile: () => makeRequest("/users/profile"),

  updateUserProfile: (profileData) =>
    makeRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getUserProgress: () => makeRequest("/progress"),

  // Tournament endpoints
  getTournaments: () => makeRequest("/tournaments"),

  joinTournament: (tournamentId) =>
    makeRequest(`/tournaments/${tournamentId}/join`, {
      method: "POST",
    }),

  // Achievement endpoints
  getAchievements: () => makeRequest("/achievements"),
}

export default api
