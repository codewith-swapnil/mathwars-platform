"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, CheckCircle, AlertTriangle } from "lucide-react"

export default function DashboardInit() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkDataAndSeed()
  }, [])

  const checkDataAndSeed = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if data exists
      const response = await fetch("/api/auto-seed")
      const result = await response.json()

      if (response.ok) {
        setHasData(true)
        if (result.seedResult) {
          // Auto-seeding happened
          console.log("Auto-seeding completed:", result.seedResult)
        }
      } else {
        setError(result.message || "Failed to check database")
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize database")
    } finally {
      setIsLoading(false)
    }
  }

  const manualSeed = async () => {
    try {
      setIsSeeding(true)
      setError(null)

      const response = await fetch("/api/seed-tricks", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setHasData(true)
        alert("Database seeded successfully! " + result.message)
      } else {
        setError(result.message || "Seeding failed")
      }
    } catch (err: any) {
      setError(err.message || "Seeding failed")
    } finally {
      setIsSeeding(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-center text-gray-600">Initializing database...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Database Error
          </CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={manualSeed} disabled={isSeeding} className="w-full">
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Retry Seeding
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (hasData) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
          <p className="text-center text-green-600 font-medium">Database Ready!</p>
          <p className="text-center text-gray-600 text-sm mt-2">
            Your math tricks database is loaded and ready to use.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Setup Required
        </CardTitle>
        <CardDescription>Initialize your database with math tricks</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={manualSeed} disabled={isSeeding} className="w-full">
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Load Sample Tricks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
