import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get("difficulty")
  const topic = searchParams.get("topic")

  let query = supabase.from("problems").select("*").order("created_at", { ascending: false })

  if (difficulty && difficulty !== "all") {
    query = query.eq("difficulty", difficulty)
  }

  if (topic && topic !== "all") {
    query = query.eq("topic", topic)
  }

  const { data: problems, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ problems })
}
