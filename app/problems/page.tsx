"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Clock, Star, Target, Zap, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")

  const problems = [
    {
      id: 1,
      title: "Quadratic Equation Challenge",
      description: "Solve complex quadratic equations with multiple variables",
      difficulty: "Medium",
      topic: "Algebra",
      xp: 150,
      timeLimit: 30,
      solved: true,
      attempts: 2,
      successRate: 78,
    },
    {
      id: 2,
      title: "Geometric Proof Master",
      description: "Prove geometric theorems using advanced techniques",
      difficulty: "Hard",
      topic: "Geometry",
      xp: 250,
      timeLimit: 45,
      solved: false,
      attempts: 0,
      successRate: 45,
    },
    {
      id: 3,
      title: "Number Theory Basics",
      description: "Explore prime numbers and divisibility rules",
      difficulty: "Easy",
      topic: "Number Theory",
      xp: 100,
      timeLimit: 20,
      solved: true,
      attempts: 1,
      successRate: 92,
    },
    {
      id: 4,
      title: "Combinatorics Challenge",
      description: "Count arrangements and combinations in complex scenarios",
      difficulty: "Hard",
      topic: "Combinatorics",
      xp: 300,
      timeLimit: 60,
      solved: false,
      attempts: 3,
      successRate: 34,
    },
    {
      id: 5,
      title: "Calculus Integration",
      description: "Master integration techniques for complex functions",
      difficulty: "Medium",
      topic: "Calculus",
      xp: 200,
      timeLimit: 40,
      solved: false,
      attempts: 1,
      successRate: 67,
    },
    {
      id: 6,
      title: "Probability Puzzles",
      description: "Solve challenging probability problems",
      difficulty: "Medium",
      topic: "Probability",
      xp: 175,
      timeLimit: 35,
      solved: true,
      attempts: 2,
      successRate: 71,
    },
  ]

  const topics = ["Algebra", "Geometry", "Number Theory", "Combinatorics", "Calculus", "Probability"]

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty.toLowerCase() === selectedDifficulty
    const matchesTopic = selectedTopic === "all" || problem.topic === selectedTopic

    return matchesSearch && matchesDifficulty && matchesTopic
  })

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
                <Link href="/problems" className="text-blue-600 font-medium">
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
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Practice Problems</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sharpen your skills with our curated collection of competitive math problems
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search problems..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problem Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="algebra" className="hidden lg:flex">
              Algebra
            </TabsTrigger>
            <TabsTrigger value="geometry" className="hidden lg:flex">
              Geometry
            </TabsTrigger>
            <TabsTrigger value="calculus" className="hidden lg:flex">
              Calculus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6">
              {filteredProblems.map((problem) => (
                <Card key={problem.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {problem.solved ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <h3 className="text-lg font-semibold">{problem.title}</h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                          <Badge variant="outline">{problem.topic}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Zap className="mr-1 h-4 w-4 text-yellow-600" />+{problem.xp} XP
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {problem.timeLimit} min
                          </div>
                          <div className="flex items-center">
                            <Target className="mr-1 h-4 w-4" />
                            {problem.successRate}% success rate
                          </div>
                          {problem.attempts > 0 && (
                            <div className="flex items-center">
                              <BookOpen className="mr-1 h-4 w-4" />
                              {problem.attempts} attempt{problem.attempts > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-6">
                        <Link href={`/problems/${problem.id}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {problem.solved ? "Review" : "Solve"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            <div className="grid gap-6">
              {filteredProblems
                .filter((p) => !p.solved && p.difficulty === "Medium")
                .map((problem) => (
                  <Card key={problem.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold">{problem.title}</h3>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                            <Badge variant="outline">{problem.topic}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Zap className="mr-1 h-4 w-4 text-yellow-600" />+{problem.xp} XP
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {problem.timeLimit} min
                            </div>
                            <div className="flex items-center">
                              <Target className="mr-1 h-4 w-4" />
                              {problem.successRate}% success rate
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link href={`/problems/${problem.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Solve
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="unsolved" className="mt-6">
            <div className="grid gap-6">
              {filteredProblems
                .filter((p) => !p.solved)
                .map((problem) => (
                  <Card key={problem.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Circle className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-semibold">{problem.title}</h3>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                            <Badge variant="outline">{problem.topic}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Zap className="mr-1 h-4 w-4 text-yellow-600" />+{problem.xp} XP
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {problem.timeLimit} min
                            </div>
                            <div className="flex items-center">
                              <Target className="mr-1 h-4 w-4" />
                              {problem.successRate}% success rate
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link href={`/problems/${problem.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Solve
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="solved" className="mt-6">
            <div className="grid gap-6">
              {filteredProblems
                .filter((p) => p.solved)
                .map((problem) => (
                  <Card key={problem.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">{problem.title}</h3>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                            <Badge variant="outline">{problem.topic}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Zap className="mr-1 h-4 w-4 text-yellow-600" />+{problem.xp} XP
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {problem.timeLimit} min
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                              Solved in {problem.attempts} attempt{problem.attempts > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link href={`/problems/${problem.id}`}>
                            <Button variant="outline">Review</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
