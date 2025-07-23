"use client"

import { useState } from "react"
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
  CheckCircle,
  Lock,
  Trophy,
  Brain,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user] = useState({
    name: "Rajesh Kumar",
    level: 8,
    xp: 1250,
    xpToNext: 1500,
    streak: 12,
    tricksLearned: 45,
    examTarget: "SSC CGL 2024",
    accuracy: 89,
  })

  const examCategories = [
    { name: "SSC", progress: 65, total: 120, learned: 78, color: "bg-green-500" },
    { name: "Banking", progress: 40, total: 95, learned: 38, color: "bg-blue-500" },
    { name: "Railway", progress: 25, total: 80, learned: 20, color: "bg-purple-500" },
    { name: "Others", progress: 15, total: 60, learned: 9, color: "bg-orange-500" },
  ]

  const recentTricks = [
    {
      id: 1,
      title: "Square of Numbers ending in 5",
      category: "Speed Arithmetic",
      difficulty: "Easy",
      timeToLearn: "3 min",
      completed: true,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Percentage to Fraction Conversion",
      category: "Percentage",
      difficulty: "Medium",
      timeToLearn: "5 min",
      completed: true,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Quick Division by 11",
      category: "Number System",
      difficulty: "Easy",
      timeToLearn: "4 min",
      completed: false,
      rating: 4.7,
    },
  ]

  const todaysTricks = [
    {
      id: 1,
      title: "Multiplication by 11 Trick",
      category: "Speed Arithmetic",
      difficulty: "Easy",
      xp: 50,
      completed: false,
      estimatedTime: "3 min",
    },
    {
      id: 2,
      title: "Compound Interest Shortcut",
      category: "Banking Math",
      difficulty: "Medium",
      xp: 75,
      completed: true,
      estimatedTime: "6 min",
    },
    {
      id: 3,
      title: "Time & Work Formula",
      category: "Arithmetic",
      difficulty: "Hard",
      xp: 100,
      completed: false,
      estimatedTime: "8 min",
    },
  ]

  const upcomingExams = [
    { name: "SSC CGL Tier 1", date: "March 15, 2024", daysLeft: 45, registered: true },
    { name: "IBPS PO Prelims", date: "April 20, 2024", daysLeft: 81, registered: false },
    { name: "RRB NTPC", date: "May 10, 2024", daysLeft: 101, registered: true },
  ]

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
                  {user.streak} day streak
                </span>
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}! 🎯</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to learn some amazing math tricks today? Target: {user.examTarget}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Level</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{user.level}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(user.xp / user.xpToNext) * 100} className="h-2" />
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {user.xp}/{user.xpToNext} XP to next level
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Tricks Learned</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{user.tricksLearned}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <p className="text-xs text-green-600 dark:text-green-400">+5 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Accuracy</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{user.accuracy}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <p className="text-xs text-purple-600 dark:text-purple-400">Excellent performance!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Streak</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{user.streak} days</p>
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
                  Today's Math Tricks
                </CardTitle>
                <CardDescription>Master these tricks to boost your calculation speed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysTricks.map((trick) => (
                  <div
                    key={trick.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${trick.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <h4 className="font-medium">{trick.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              trick.difficulty === "Easy"
                                ? "secondary"
                                : trick.difficulty === "Medium"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {trick.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">+{trick.xp} XP</span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">• {trick.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/tricks/${trick.id}`}>
                      <Button size="sm" disabled={trick.completed}>
                        {trick.completed ? "Completed" : "Learn"}
                      </Button>
                    </Link>
                  </div>
                ))}
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
                {examCategories.map((exam, index) => (
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
                ))}
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

            {/* Recent Tricks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-600" />
                  Recently Learned
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTricks.map((trick) => (
                  <div key={trick.id} className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        trick.completed ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {trick.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{trick.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{trick.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {trick.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">⭐ {trick.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
