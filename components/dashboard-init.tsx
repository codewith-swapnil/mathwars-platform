"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

export function DashboardInit() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [hasTricks, setHasTricks] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkForTricks()
  }, [])

  const checkForTricks = async () => {
    try {
      const response = await api.getTricks({ limit: "1" })
      setHasTricks(response.tricks && response.tricks.length > 0)
      setError(null)
    } catch (error) {
      console.error("Error checking tricks:", error)
      setHasTricks(false)
      setError("Failed to check for existing tricks")
    }
  }

  const seedTricks = async () => {
    setIsSeeding(true)
    setError(null)
    try {
      await api.seedTricks()
      setHasTricks(true)
      // Refresh the page to show new tricks
      window.location.reload()
    } catch (error) {
      console.error("Error seeding tricks:", error)
      setError("Failed to seed tricks. Please try again.")
    } finally {
      setIsSeeding(false)
    }
  }

  if (hasTricks && !error) {
    return null // Don't show anything if tricks exist and no error
  }

  return (
    <Card className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="text-yellow-800 dark:text-yellow-200">Welcome to MathTricks Pro! 🧠✨</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="space-y-4">
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <Button onClick={checkForTricks} variant="outline" className="mr-4 bg-transparent">
              Try Again
            </Button>
            <Button onClick={seedTricks} disabled={isSeeding} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              {isSeeding ? "Loading Tricks..." : "Load Sample Tricks"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              It looks like this is a fresh installation. Would you like to load some sample math tricks to get started?
              These include shortcuts for SSC, Banking, Railway, and other competitive exams.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-800/20 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Sample tricks include:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Square of numbers ending in 5</li>
                <li>• Multiplication by 11 trick</li>
                <li>• Percentage to fraction conversions</li>
                <li>• Time and work shortcuts</li>
                <li>• Banking math formulas</li>
              </ul>
            </div>
            <Button onClick={seedTricks} disabled={isSeeding} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              {isSeeding ? "Loading Tricks..." : "Load Sample Tricks"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
