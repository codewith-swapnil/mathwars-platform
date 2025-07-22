import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { solution } = await request.json()
  const problemId = params.id

  // Get the problem to check solution
  const { data: problem } = await supabase.from("problems").select("*").eq("id", problemId).single()

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 })
  }

  // Simple solution checking (you'd want more sophisticated checking)
  const isCorrect = solution.toLowerCase().includes(problem.solution.toLowerCase().substring(0, 10))

  // Update or insert user progress
  const { data: existingProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("problem_id", problemId)
    .single()

  if (existingProgress) {
    // Update existing progress
    await supabase
      .from("user_progress")
      .update({
        attempts: existingProgress.attempts + 1,
        solved: isCorrect,
        solution,
        solved_at: isCorrect ? new Date().toISOString() : null,
      })
      .eq("id", existingProgress.id)
  } else {
    // Insert new progress
    await supabase.from("user_progress").insert({
      user_id: user.id,
      problem_id: problemId,
      attempts: 1,
      solved: isCorrect,
      solution,
      solved_at: isCorrect ? new Date().toISOString() : null,
    })
  }

  // Update user XP if correct
  if (isCorrect) {
    const { data: profile } = await supabase.from("profiles").select("xp, level").eq("id", user.id).single()

    if (profile) {
      const newXp = profile.xp + problem.xp_reward
      const newLevel = Math.floor(newXp / 1000) + 1 // Simple leveling system

      await supabase.from("profiles").update({ xp: newXp, level: newLevel }).eq("id", user.id)
    }
  }

  return NextResponse.json({
    success: true,
    correct: isCorrect,
    xp_earned: isCorrect ? problem.xp_reward : 0,
  })
}
