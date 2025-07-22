"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Zap, Target, BookOpen, Users, TrendingUp, Award, Clock, Star, FlameIcon as Fire } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user] = useState({
    name: "Alex Chen",
    level: 15,
    xp: 2450,
    xpToNext: 3000,
    streak: 7,
    rank: 142,
    totalProblems: 89,
    correctRate: 87,
  })

  const recentAchievements = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Solved 10 problems in under 5 minutes",
      icon: "⚡",
      date: "2 days ago",
    },
    { id: 2, title: "Algebra Master", description: "Completed Algebra fundamentals", icon: "🎯", date: "1 week ago" },
    { id: 3, title: "Streak Warrior", description: "7-day solving streak", icon: "🔥", date: "Today" },
  ]

  const upcomingTournaments = [
    { id: 1, name: "Weekly AMC Challenge", participants: 234, startTime: "2 hours", difficulty: "Intermediate" },
    { id: 2, name: "Geometry Masters", participants: 156, startTime: "1 day", difficulty: "Advanced" },
    { id: 3, name: "Speed Math Sprint", participants: 89, startTime: "3 days", difficulty: "Beginner" },
  ]

  const dailyChallenges = [
    { id: 1, title: "Quadratic Equations", difficulty: "Medium", xp: 150, completed: false },
    { id: 2, title: "Number Theory", difficulty: "Hard", xp: 250, completed: true },
    { id: 3, title: "Combinatorics", difficulty: "Easy", xp: 100, completed: false },
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
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathWars
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/problems" className="text-gray-600 hover:text-gray-900">
                  Problems
                </Link>
                <Link href="/tournaments" className="text-gray-600 hover:text-gray-900">
                  Tournaments
                </Link>
                <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">
                  Leaderboard
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
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-300">Ready to tackle some challenging problems today?</p>
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
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Global Rank</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">#{user.rank}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <p className="text-xs text-green-600 dark:text-green-400">+12 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Problems Solved</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{user.totalProblems}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <p className="text-xs text-purple-600 dark:text-purple-400">{user.correctRate}% accuracy</p>
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
            {/* Daily Challenges */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                  Daily Challenges
                </CardTitle>
                <CardDescription>Complete these challenges to earn bonus XP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${challenge.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              challenge.difficulty === "Easy"
                                ? "secondary"
                                : challenge.difficulty === "Medium"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">+{challenge.xp} XP</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" disabled={challenge.completed}>
                      {challenge.completed ? "Completed" : "Start"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Tournaments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Upcoming Tournaments
                </CardTitle>
                <CardDescription>Join live competitions with students worldwide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{tournament.name}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {tournament.participants} participants
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Starts in {tournament.startTime}
                        </div>
                        <Badge variant="outline">{tournament.difficulty}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{achievement.date}</p>
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
                <Link href="/problems">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Practice Problems
                  </Button>
                </Link>
                <Link href="/tournaments">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Trophy className="mr-2 h-4 w-4" />
                    Join Tournament
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
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
