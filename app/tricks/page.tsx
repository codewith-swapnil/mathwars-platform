"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Star, CheckCircle, Play, Calculator, Users } from "lucide-react"
import Link from "next/link"

export default function TricksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedExam, setSelectedExam] = useState("all")

  const trickCategories = [
    { id: "speed-arithmetic", name: "Speed Arithmetic", count: 45, color: "bg-blue-500" },
    { id: "percentage", name: "Percentage", count: 32, color: "bg-green-500" },
    { id: "ratio-proportion", name: "Ratio & Proportion", count: 28, color: "bg-purple-500" },
    { id: "time-work", name: "Time & Work", count: 25, color: "bg-orange-500" },
    { id: "profit-loss", name: "Profit & Loss", count: 22, color: "bg-red-500" },
    { id: "simple-interest", name: "Simple Interest", count: 18, color: "bg-indigo-500" },
    { id: "compound-interest", name: "Compound Interest", count: 15, color: "bg-pink-500" },
    { id: "number-system", name: "Number System", count: 35, color: "bg-teal-500" },
  ]

  const tricks = [
    {
      id: 1,
      title: "Square of Numbers ending in 5",
      description: "Learn to calculate squares of numbers ending in 5 in seconds",
      category: "Speed Arithmetic",
      difficulty: "Easy",
      timeToLearn: "3 min",
      examRelevance: ["SSC", "Banking", "Railway"],
      rating: 4.8,
      studentsLearned: 12500,
      completed: true,
      preview: "25² = 625, 35² = 1225, 45² = 2025...",
      keyPoints: ["Works for any number ending in 5", "Mental calculation possible", "Saves 80% time"],
    },
    {
      id: 2,
      title: "Percentage to Fraction Quick Conversion",
      description: "Convert percentages to fractions instantly without calculation",
      category: "Percentage",
      difficulty: "Medium",
      timeToLearn: "5 min",
      examRelevance: ["SSC", "Banking"],
      rating: 4.9,
      studentsLearned: 9800,
      completed: false,
      preview: "25% = 1/4, 33.33% = 1/3, 66.67% = 2/3...",
      keyPoints: ["Memorize common conversions", "Useful in DI questions", "Reduces calculation time"],
    },
    {
      id: 3,
      title: "Multiplication by 11 Trick",
      description: "Multiply any number by 11 using this amazing shortcut",
      category: "Speed Arithmetic",
      difficulty: "Easy",
      timeToLearn: "4 min",
      examRelevance: ["SSC", "Banking", "Railway", "Others"],
      rating: 4.7,
      studentsLearned: 15200,
      completed: false,
      preview: "23 × 11 = 253, 45 × 11 = 495, 67 × 11 = 737...",
      keyPoints: ["Add adjacent digits", "Works for any 2-digit number", "Expandable to larger numbers"],
    },
    {
      id: 4,
      title: "Compound Interest Formula Shortcut",
      description: "Calculate compound interest without complex formulas",
      category: "Banking Math",
      difficulty: "Hard",
      timeToLearn: "8 min",
      examRelevance: ["Banking", "SSC"],
      rating: 4.6,
      studentsLearned: 7500,
      completed: false,
      preview: "Quick calculation for 2-3 years with percentage shortcuts",
      keyPoints: ["Avoid lengthy calculations", "Pattern recognition", "Banking exam essential"],
    },
    {
      id: 5,
      title: "Time and Work Unitary Method",
      description: "Solve time and work problems in 30 seconds",
      category: "Time & Work",
      difficulty: "Medium",
      timeToLearn: "6 min",
      examRelevance: ["SSC", "Railway", "Banking"],
      rating: 4.8,
      studentsLearned: 11000,
      completed: true,
      preview: "If A can do work in 10 days, B in 15 days...",
      keyPoints: ["LCM method", "Efficiency concept", "Combined work shortcuts"],
    },
    {
      id: 6,
      title: "Profit Loss Percentage Tricks",
      description: "Calculate profit/loss percentages without formulas",
      category: "Profit & Loss",
      difficulty: "Medium",
      timeToLearn: "7 min",
      examRelevance: ["SSC", "Banking"],
      rating: 4.5,
      studentsLearned: 8900,
      completed: false,
      preview: "Quick methods for successive discounts and markups",
      keyPoints: ["Avoid formula confusion", "Visual method", "Successive calculations"],
    },
  ]

  const filteredTricks = tricks.filter((trick) => {
    const matchesSearch =
      trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || trick.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || trick.difficulty.toLowerCase() === selectedDifficulty
    const matchesExam =
      selectedExam === "all" ||
      trick.examRelevance.some((exam) => exam.toLowerCase().includes(selectedExam.toLowerCase()))

    return matchesSearch && matchesCategory && matchesDifficulty && matchesExam
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
                  <Calculator className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathTricks Pro
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/tricks" className="text-blue-600 font-medium">
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
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learn Math Tricks 🧠</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Master calculation shortcuts and techniques for competitive exams
          </p>
        </div>

        {/* Categories Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trickCategories.map((category) => (
              <Card key={category.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} tricks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tricks..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="arithmetic">Speed Arithmetic</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="ratio">Ratio & Proportion</SelectItem>
                  <SelectItem value="time">Time & Work</SelectItem>
                  <SelectItem value="profit">Profit & Loss</SelectItem>
                </SelectContent>
              </Select>
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
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="ssc">SSC</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="railway">Railway</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tricks List */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Tricks</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6">
              {filteredTricks.map((trick) => (
                <Card key={trick.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {trick.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Play className="h-5 w-5 text-blue-600" />
                          )}
                          <h3 className="text-lg font-semibold">{trick.title}</h3>
                          <Badge className={getDifficultyColor(trick.difficulty)}>{trick.difficulty}</Badge>
                          <div className="flex items-center space-x-1">
                            {trick.examRelevance.map((exam, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {exam}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-3">{trick.description}</p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Preview:</strong> {trick.preview}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                          <div className="flex flex-wrap gap-2">
                            {trick.keyPoints.map((point, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {trick.timeToLearn}
                          </div>
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                            {trick.rating}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {trick.studentsLearned.toLocaleString()} learned
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Link href={`/tricks/${trick.id}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {trick.completed ? "Review" : "Learn Trick"}
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
              {filteredTricks
                .filter((t) => !t.completed && t.difficulty === "Easy")
                .map((trick) => (
                  <Card key={trick.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold">{trick.title}</h3>
                            <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
                            <Badge className={getDifficultyColor(trick.difficulty)}>{trick.difficulty}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{trick.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {trick.timeToLearn}
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4 text-yellow-500" />
                              {trick.rating}
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link href={`/tricks/${trick.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Start Learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6">
              {filteredTricks
                .filter((t) => t.completed)
                .map((trick) => (
                  <Card key={trick.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">{trick.title}</h3>
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            <Badge className={getDifficultyColor(trick.difficulty)}>{trick.difficulty}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{trick.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                              Mastered
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4 text-yellow-500" />
                              {trick.rating}
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link href={`/tricks/${trick.id}`}>
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
