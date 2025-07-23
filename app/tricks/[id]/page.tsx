"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Calculator,
  Brain,
  Target,
  Trophy,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

export default function TrickDetailPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [practiceScore, setPracticeScore] = useState(0)

  // Mock trick data
  const trick = {
    id: Number.parseInt(params.id),
    title: "Square of Numbers ending in 5",
    description: "Learn to calculate squares of numbers ending in 5 in seconds",
    category: "Speed Arithmetic",
    difficulty: "Easy",
    timeToLearn: "3 min",
    examRelevance: ["SSC", "Banking", "Railway"],
    rating: 4.8,
    studentsLearned: 12500,
    keyPoints: ["Works for any number ending in 5", "Mental calculation possible", "Saves 80% time"],

    steps: [
      {
        title: "Understanding the Pattern",
        content: "When we square a number ending in 5, there's a beautiful pattern that emerges.",
        example: "Let's look at: 15² = 225, 25² = 625, 35² = 1225",
        visual: "Notice how the last two digits are always 25!",
      },
      {
        title: "The Magic Formula",
        content: "For any number ending in 5, follow this simple rule:",
        example: "Take the first digit(s), multiply by (itself + 1), then append 25",
        visual: "For 35²: 3 × (3+1) = 3 × 4 = 12, so 35² = 1225",
      },
      {
        title: "Step-by-Step Method",
        content: "Let's break down the process into simple steps:",
        example: "For 45²:\n1. Take first digit: 4\n2. Multiply by next number: 4 × 5 = 20\n3. Append 25: 2025",
        visual: "45² = 2025 ✓",
      },
      {
        title: "Practice Examples",
        content: "Now let's practice with different numbers:",
        example: "65² = 6 × 7 = 42, so 65² = 4225\n85² = 8 × 9 = 72, so 85² = 7225",
        visual: "The pattern works for any number ending in 5!",
      },
      {
        title: "Advanced Applications",
        content: "This trick works for larger numbers too:",
        example: "125² = 12 × 13 = 156, so 125² = 15625\n235² = 23 × 24 = 552, so 235² = 55225",
        visual: "Master this for lightning-fast calculations in exams!",
      },
    ],

    practiceQuestions: [
      { question: "25²", answer: "625", explanation: "2 × 3 = 6, append 25 = 625" },
      { question: "55²", answer: "3025", explanation: "5 × 6 = 30, append 25 = 3025" },
      { question: "75²", answer: "5625", explanation: "7 × 8 = 56, append 25 = 5625" },
      { question: "95²", answer: "9025", explanation: "9 × 10 = 90, append 25 = 9025" },
    ],

    tips: [
      "Always remember: first digit × (first digit + 1), then add 25",
      "Practice with small numbers first, then move to larger ones",
      "This trick saves 70-80% calculation time in exams",
      "Works perfectly for mental math - no pen and paper needed!",
    ],

    examApplications: [
      {
        exam: "SSC CGL",
        usage: "Frequently appears in arithmetic sections",
        timesSaved: "30-45 seconds per question",
      },
      {
        exam: "Banking",
        usage: "Useful in quantitative aptitude",
        timesSaved: "20-30 seconds per question",
      },
      {
        exam: "Railway",
        usage: "Common in basic math sections",
        timesSaved: "25-35 seconds per question",
      },
    ],
  }

  const handleStepComplete = () => {
    if (currentStep < trick.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/tricks" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tricks
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{trick.timeToLearn}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCurrentStep(0)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trick Header */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{trick.title}</CardTitle>
                    <CardDescription className="text-lg">{trick.description}</CardDescription>
                    <div className="flex items-center space-x-3 mt-4">
                      <Badge className={getDifficultyColor(trick.difficulty)}>{trick.difficulty}</Badge>
                      <Badge variant="outline">{trick.category}</Badge>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="mr-1 h-4 w-4 text-yellow-600" />
                        {trick.rating}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="mr-1 h-4 w-4" />
                        {trick.studentsLearned.toLocaleString()} learned
                      </div>
                    </div>
                  </div>
                  {completed && (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <Badge className="bg-green-100 text-green-800">Completed!</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Progress */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Learning Progress</h3>
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {trick.steps.length}
                  </span>
                </div>
                <Progress value={((currentStep + 1) / trick.steps.length) * 100} className="h-3" />
              </CardContent>
            </Card>

            {/* Learning Steps */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-600" />
                  {trick.steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg">{trick.steps[currentStep].content}</p>
                </div>

                {/* Example */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                    <Calculator className="mr-2 h-4 w-4" />
                    Example
                  </h4>
                  <pre className="text-blue-700 dark:text-blue-300 whitespace-pre-wrap font-mono">
                    {trick.steps[currentStep].example}
                  </pre>
                </div>

                {/* Visual Aid */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Key Insight
                  </h4>
                  <p className="text-green-700 dark:text-green-300">{trick.steps[currentStep].visual}</p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={handleStepComplete}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {currentStep === trick.steps.length - 1 ? "Complete Trick" : "Next Step"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Practice Section */}
            {completed && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-green-600" />
                    Practice Questions
                  </CardTitle>
                  <CardDescription>Test your understanding with these practice problems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trick.practiceQuestions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-lg">{q.question} = ?</span>
                        <Button size="sm" variant="outline">
                          Show Answer
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Answer:</strong> {q.answer}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Benefits */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trick.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Exam Relevance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                  Exam Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trick.examApplications.map((app, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-sm mb-1">{app.exam}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{app.usage}</div>
                    <Badge variant="secondary" className="text-xs">
                      Saves {app.timesSaved}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-orange-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trick.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-2 border-orange-400"
                  >
                    <p className="text-sm text-orange-800 dark:text-orange-200">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Tricks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Related Tricks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tricks/2">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="font-medium text-sm">Multiplication by 11</div>
                    <div className="text-xs text-gray-500">Speed Arithmetic • Easy</div>
                  </div>
                </Link>
                <Link href="/tricks/3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <div className="font-medium text-sm">Square of Numbers near 50</div>
                    <div className="text-xs text-gray-500">Speed Arithmetic • Medium</div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
