"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calculator,
  Zap,
  Target,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Star,
  FlameIcon as Fire,
  Trophy,
  Brain,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { DashboardInit } from "@/components/dashboard-init"
import { api } from "@/lib/api"

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  streak: number
  tricksLearned: number
  examTarget: string
}

interface TodaysTrick {
  _id: string
  title: string
  category: string
  difficulty: string
  timeToLearn: string
  rating: number
}

interface ExamProgress {
  name: string
  progress: number
  learned: number
  total: number
  color: string
}

interface UpcomingExam {
  name: string
  date: string
  daysLeft: number
  registered: boolean
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNext: 1000,
    streak: 0,
    tricksLearned: 0,
    examTarget: "SSC CGL 2024",
  })
  const [todaysTricks, setTodaysTricks] = useState<TodaysTrick[]>([])
  const [examProgress, setExamProgress] = useState<ExamProgress[]>([])
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([])
  const [userProgress, setUserProgress] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load dashboard stats and user progress in parallel
      const [dashboardData, progressData] = await Promise.all([
        api.getDashboardStats(),
        api
          .getUserProgress()
          .catch(() => null), // Don't fail if user progress doesn't exist
      ])

      setUserStats(dashboardData.userStats)
      setTodaysTricks(dashboardData.todaysTricks || [])
      setExamProgress(dashboardData.examProgress || [])
      setUpcomingExams(dashboardData.upcomingExams || [])
      setUserProgress(progressData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
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
                  <Calculator className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathTricks Pro
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/tricks" className="text-gray-600 hover:text-gray-900">
                  Learn Tricks
                </Link>
                <Link href="/practice" className="text-gray-600 hover:text-gray-900">
                  Practice
                </Link>
                <Link href="/exams" className="text-gray-600 hover:text-gray-900">
                  Mock Tests
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 px-3 py-1 rounded-full">
                <Fire className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {userStats.streak} day streak
                </span>
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back! 🎯</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to learn some amazing math tricks today? Target: {userStats.examTarget}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <Button onClick={loadDashboardData} className="mt-2" size="sm">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Initialization */}
        <DashboardInit />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Level</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{userStats.level}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} className="h-2" />
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{userStats.xpToNext} XP to next level</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Tricks Learned</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{userStats.tricksLearned}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <p className="text-xs text-green-600 dark:text-green-400">Keep learning!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Accuracy</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {userProgress?.userProgress?.accuracy || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <p className="text-xs text-purple-600 dark:text-purple-400">Practice performance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Streak</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{userStats.streak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Fire className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <p className="text-xs text-orange-600 dark:text-orange-400">Keep it up!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Learning */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                  Recommended Math Tricks
                </CardTitle>
                <CardDescription>Master these tricks to boost your calculation speed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysTricks.length > 0 ? (
                  todaysTricks.map((trick) => (
                    <div
                      key={trick._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div>
                          <h4 className="font-medium">{trick.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getDifficultyColor(trick.difficulty)}>{trick.difficulty}</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{trick.category}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">• {trick.timeToLearn}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">{trick.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link href={`/tricks/${trick._id}`}>
                        <Button size="sm">Learn</Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No tricks available yet.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Load sample tricks to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Exam Preparation Progress
                </CardTitle>
                <CardDescription>Track your progress across different competitive exams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {examProgress.length > 0 ? (
                  examProgress.map((exam, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${exam.color}`} />
                          <span className="font-medium">{exam.name}</span>
                          <Badge variant="outline">
                            {exam.learned}/{exam.total} tricks
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{exam.progress}%</span>
                      </div>
                      <Progress value={exam.progress} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No exam progress data available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Exams */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{exam.name}</h4>
                      {exam.registered ? (
                        <Badge className="bg-green-100 text-green-800">Registered</Badge>
                      ) : (
                        <Badge variant="outline">Not Registered</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{exam.date}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{exam.daysLeft} days left</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            {userProgress?.recentAchievements && userProgress.recentAchievements.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-yellow-600" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProgress.recentAchievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tricks">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse All Tricks
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Practice Session
                  </Button>
                </Link>
                <Link href="/mock-tests">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Trophy className="mr-2 h-4 w-4" />
                    Take Mock Test
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
