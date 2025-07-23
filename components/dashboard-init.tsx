"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

export function DashboardInit() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [hasProblems, setHasProblems] = useState(true)

  useEffect(() => {
    checkForProblems()
  }, [])

  const checkForProblems = async () => {
    try {
      const response = await api.getProblems({ limit: "1" })
      setHasProblems(response.problems.length > 0)
    } catch (error) {
      console.error("Error checking problems:", error)
      setHasProblems(false)
    }
  }

  const seedProblems = async () => {
    setIsSeeding(true)
    try {
      await api.seedProblems()
      setHasProblems(true)
      window.location.reload() // Refresh to show new problems
    } catch (error) {
      console.error("Error seeding problems:", error)
      alert("Failed to seed problems. Please try again.")
    } finally {
      setIsSeeding(false)
    }
  }

  if (hasProblems) {
    return null // Don't show anything if problems exist
  }

  return (
    <Card className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="text-yellow-800 dark:text-yellow-200">Welcome to MathWars! 🎉</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          It looks like this is a fresh installation. Would you like to load some sample problems to get started?
        </p>
        <Button onClick={seedProblems} disabled={isSeeding} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          {isSeeding ? "Loading Problems..." : "Load Sample Problems"}
        </Button>
      </CardContent>
    </Card>
  )
}
