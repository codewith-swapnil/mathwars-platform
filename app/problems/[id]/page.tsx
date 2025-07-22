"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle,
  X,
  Lightbulb,
  MessageSquare,
  Flag,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

export default function ProblemSolvePage({ params }: { params: { id: string } }) {
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [solution, setSolution] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Mock problem data
  const problem = {
    id: Number.parseInt(params.id),
    title: "Quadratic Equation Challenge",
    description: "Find all real solutions to the equation x² + 6x + 9 = 0, and determine the nature of the roots.",
    difficulty: "Medium",
    topic: "Algebra",
    xp: 150,
    timeLimit: 30,
    content: `
**Problem Statement:**

Solve the quadratic equation: x² + 6x + 9 = 0

**Requirements:**
1. Find all real solutions
2. Determine the discriminant
3. Classify the nature of the roots
4. Show your complete working

**Additional Questions:**
- What is the vertex of the parabola y = x² + 6x + 9?
- At what point(s) does this parabola intersect the x-axis?
    `,
    hints: [
      "Try factoring the quadratic expression first.",
      "Notice that this might be a perfect square trinomial.",
      "The discriminant formula is b² - 4ac.",
    ],
    solution: "The equation x² + 6x + 9 = 0 can be factored as (x + 3)² = 0, giving x = -3 as a repeated root.",
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = () => {
    setSubmitted(true)
    // Mock solution checking
    const isCorrectSolution = solution.toLowerCase().includes("x = -3") || solution.toLowerCase().includes("(x + 3)²")
    setIsCorrect(isCorrectSolution)
    setIsRunning(false)
  }

  const handleStartTimer = () => {
    setIsRunning(true)
  }

  const handlePauseTimer = () => {
    setIsRunning(false)
  }

  const handleResetTimer = () => {
    setTimeLeft(1800)
    setIsRunning(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/problems" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Problems
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className={`font-mono ${timeLeft < 300 ? "text-red-600" : "text-gray-900 dark:text-gray-100"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handleStartTimer} disabled={isRunning}>
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handlePauseTimer} disabled={!isRunning}>
                  <Pause className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetTimer}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Problem Statement */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{problem.title}</CardTitle>
                    <div className="flex items-center space-x-3">
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      <Badge variant="outline">{problem.topic}</Badge>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Zap className="mr-1 h-4 w-4 text-yellow-600" />+{problem.xp} XP
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{problem.content}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Hints */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showHint ? (
                  <Button variant="outline" onClick={() => setShowHint(true)} className="w-full">
                    Show Hint (-10 XP)
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {problem.hints.map((hint, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400"
                      >
                        <p className="text-sm">
                          <strong>Hint {index + 1}:</strong> {hint}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Solution Area */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Your Solution</CardTitle>
                <CardDescription>Write your complete solution with clear working steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your solution here..."
                  className="min-h-[300px] font-mono"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  disabled={submitted}
                />

                {!submitted ? (
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!solution.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Submit Solution
                    </Button>
                    <Button variant="outline">
                      <Flag className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border-l-4 ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                          : "bg-red-50 dark:bg-red-900/20 border-red-400"
                      }`}
                    >
                      <div className="flex items-center">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <span
                          className={`font-medium ${
                            isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                          }`}
                        >
                          {isCorrect ? "Correct Solution!" : "Incorrect Solution"}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isCorrect
                          ? `Great work! You earned ${showHint ? problem.xp - 10 : problem.xp} XP.`
                          : "Review your solution and try again."}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => {
                          setSubmitted(false)
                          setIsCorrect(false)
                        }}
                        variant="outline"
                      >
                        Try Again
                      </Button>
                      <Link href="/problems">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Next Problem
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Discussion */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comments">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="comments" className="mt-4">
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            M
                          </div>
                          <span className="font-medium text-sm">MathMaster2024</span>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm">
                          This problem is a great example of perfect square trinomials. Look for patterns!
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            A
                          </div>
                          <span className="font-medium text-sm">AlgebraAce</span>
                          <span className="text-xs text-gray-500">5 hours ago</span>
                        </div>
                        <p className="text-sm">Don't forget to check your discriminant calculation!</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="solutions" className="mt-4">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Solution discussions will be available after you submit your answer.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
