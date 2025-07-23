"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Database, Zap } from "lucide-react"
import { api } from "@/lib/api"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setIsSeeding(true)
    setError(null)
    setSeedResult(null)

    try {
      const result = await api.seedTricks()
      setSeedResult(result)
    } catch (err: any) {
      setError(err.message || "Failed to seed database")
    } finally {
      setIsSeeding(false)
    }
  }

  const handleHealthCheck = async () => {
    try {
      const result = await api.healthCheck()
      alert(`Health Check: ${result.status} at ${result.timestamp}`)
    } catch (err: any) {
      alert(`Health Check Failed: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Database Seeding Panel</h1>
          <p className="text-gray-600 dark:text-gray-300">Initialize your MathTricks Pro database with sample data</p>
        </div>

        <div className="grid gap-6">
          {/* Seeding Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-blue-600" />
                Seed Math Tricks Database
              </CardTitle>
              <CardDescription>
                Load comprehensive math tricks for competitive exams (SSC, Banking, Railway)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What will be seeded:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 6 comprehensive math tricks with step-by-step explanations</li>
                  <li>• Practice questions with detailed solutions</li>
                  <li>• Exam-specific applications and time-saving tips</li>
                  <li>• Categories: Speed Arithmetic, Percentage, Banking Math, etc.</li>
                  <li>• Difficulty levels: Easy, Medium, Hard</li>
                </ul>
              </div>

              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Seed Database Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          {(seedResult || error) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {error ? (
                    <>
                      <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                      Seeding Failed
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Seeding Successful
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-green-700 dark:text-green-300 mb-2">✅ {seedResult.message}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Successfully added {seedResult.count} math tricks to the database.
                      </p>
                    </div>

                    {seedResult.tricks && (
                      <div>
                        <h4 className="font-semibold mb-3">Seeded Tricks:</h4>
                        <div className="grid gap-2">
                          {seedResult.tricks.map((trick: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div>
                                <h5 className="font-medium">{trick.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{trick.category}</p>
                              </div>
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        🎉 Your database is now ready! You can:
                      </p>
                      <div className="space-y-2">
                        <a
                          href="/dashboard"
                          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Go to Dashboard
                        </a>
                        <a
                          href="/tricks"
                          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Browse Tricks
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Health Check Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>System Health Check</CardTitle>
              <CardDescription>Test database connectivity and API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleHealthCheck} variant="outline" className="w-full bg-transparent">
                Run Health Check
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
