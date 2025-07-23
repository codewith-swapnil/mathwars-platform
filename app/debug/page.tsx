"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

export default function DebugPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string>("")

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name)
    try {
      const result = await testFn()
      setResults((prev) => ({ ...prev, [name]: { success: true, data: result } }))
    } catch (error: any) {
      setResults((prev) => ({ ...prev, [name]: { success: false, error: error.message } }))
    } finally {
      setLoading("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>

        <div className="grid gap-4 mb-8">
          <Button
            onClick={() => testEndpoint("health", () => api.healthCheck())}
            disabled={loading === "health"}
            className="w-full"
          >
            {loading === "health" ? "Testing..." : "Test Health Endpoint"}
          </Button>

          <Button
            onClick={() =>
              testEndpoint("register", () =>
                api.register({
                  username: "testuser" + Date.now(),
                  email: `test${Date.now()}@example.com`,
                  password: "password123",
                  fullName: "Test User",
                  grade: "9",
                }),
              )
            }
            disabled={loading === "register"}
            className="w-full"
          >
            {loading === "register" ? "Testing..." : "Test Registration"}
          </Button>

          <Button
            onClick={() => testEndpoint("problems", () => api.getProblems())}
            disabled={loading === "problems"}
            className="w-full"
          >
            {loading === "problems" ? "Testing..." : "Test Get Problems"}
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([name, result]: [string, any]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle className={`text-lg ${result.success ? "text-green-600" : "text-red-600"}`}>
                  {name.toUpperCase()} - {result.success ? "SUCCESS" : "FAILED"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
