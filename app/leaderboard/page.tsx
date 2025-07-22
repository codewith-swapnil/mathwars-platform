"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Crown, Star, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("all-time")
  const [category, setCategory] = useState("overall")

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      username: "mathqueen2024",
      xp: 15420,
      level: 28,
      problemsSolved: 342,
      accuracy: 94,
      streak: 45,
      change: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🏆", "⚡", "🎯"],
    },
    {
      rank: 2,
      name: "Alex Rodriguez",
      username: "algebramaster",
      xp: 14890,
      level: 27,
      problemsSolved: 318,
      accuracy: 91,
      streak: 23,
      change: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🥈", "🔥", "📚"],
    },
    {
      rank: 3,
      name: "Emma Thompson",
      username: "geometryguru",
      xp: 14250,
      level: 26,
      problemsSolved: 295,
      accuracy: 89,
      streak: 18,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🥉", "📐", "⭐"],
    },
    {
      rank: 4,
      name: "David Kim",
      username: "calculuskid",
      xp: 13680,
      level: 25,
      problemsSolved: 287,
      accuracy: 92,
      streak: 31,
      change: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🎓", "🚀", "💡"],
    },
    {
      rank: 5,
      name: "Maya Patel",
      username: "numberninja",
      xp: 13120,
      level: 24,
      problemsSolved: 276,
      accuracy: 88,
      streak: 12,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🥷", "🔢", "⚡"],
    },
    {
      rank: 6,
      name: "James Wilson",
      username: "probsolver",
      xp: 12890,
      level: 24,
      problemsSolved: 264,
      accuracy: 90,
      streak: 8,
      change: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🧩", "🎯", "📊"],
    },
    {
      rank: 7,
      name: "Lisa Zhang",
      username: "mathwiz",
      xp: 12450,
      level: 23,
      problemsSolved: 251,
      accuracy: 87,
      streak: 15,
      change: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["🧙‍♀️", "✨", "📈"],
    },
    {
      rank: 8,
      name: "Ryan O'Connor",
      username: "speedsolver",
      xp: 12180,
      level: 23,
      problemsSolved: 243,
      accuracy: 85,
      streak: 6,
      change: -2,
      avatar: "/placeholder.svg?height=40&width=40",
      badges: ["⚡", "🏃‍♂️", "⏱️"],
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <span className="text-gray-400">-</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathWars
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/problems" className="text-gray-600 hover:text-gray-900">
                  Problems
                </Link>
                <Link href="/tournaments" className="text-gray-600 hover:text-gray-900">
                  Tournaments
                </Link>
                <Link href="/leaderboard" className="text-blue-600 font-medium">
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard 🏆</h1>
          <p className="text-gray-600 dark:text-gray-300">
            See how you rank against the best math minds in the community
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="daily">Today</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="algebra">Algebra</SelectItem>
              <SelectItem value="geometry">Geometry</SelectItem>
              <SelectItem value="calculus">Calculus</SelectItem>
              <SelectItem value="number-theory">Number Theory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Top Performers
                </CardTitle>
                <CardDescription>Rankings based on XP, accuracy, and consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        user.rank <= 3
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800"
                          : "border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">{getRankIcon(user.rank)}</div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {user.badges.map((badge, i) => (
                              <span key={i} className="text-sm">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-600 mr-1" />
                            <span className="font-bold">{user.xp.toLocaleString()}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">XP</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="font-bold">{user.problemsSolved}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">Solved</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-bold">{user.accuracy}%</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">Accuracy</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            {getChangeIcon(user.change)}
                            <span className="ml-1 font-bold">
                              {user.change > 0 ? `+${user.change}` : user.change === 0 ? "0" : user.change}
                            </span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">Change</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">#142</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You're in the top 5% of all users!</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>XP:</span>
                      <span className="font-bold">2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Problems:</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Algebra</span>
                    <Badge variant="secondary">Rank #23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Geometry</span>
                    <Badge variant="secondary">Rank #45</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Calculus</span>
                    <Badge variant="secondary">Rank #67</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Number Theory</span>
                    <Badge variant="secondary">Rank #89</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Hall of Fame</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <p className="text-sm font-medium">Monthly Champion</p>
                      <p className="text-xs text-gray-500">Sarah Chen</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <p className="text-sm font-medium">Speed Demon</p>
                      <p className="text-xs text-gray-500">Ryan O'Connor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <p className="text-sm font-medium">Perfect Accuracy</p>
                      <p className="text-xs text-gray-500">Emma Thompson</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
