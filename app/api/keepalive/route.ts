import { NextResponse } from 'next/server'

// Supabase keep-alive.
// Supabase pauses free-tier projects after about a week without database
// activity; its docs say a few real database reads a day is typically
// enough to count as active. Vercel Cron calls this route once a day
// (see vercel.json) and it reads the recipes table three times through
// PostgREST. Reads must reach Postgres to count; auth or storage health
// endpoints would not register as database activity.
//
// Response contract (keep unambiguous for monitoring):
//   200 { "status": "ok" }                   - all reads reached the database
//   200 { "status": "skipped_unconfigured" } - Supabase env vars missing,
//                                              nothing was pinged; NOT healthy
//   502 { "status": "error" }                - database read failed
//   401 { "status": "unauthorized" }         - CRON_SECRET set, wrong caller

export const dynamic = 'force-dynamic'

const PINGS_PER_RUN = 3

export async function GET(request: Request) {
  // If a CRON_SECRET env var is set, only Vercel Cron may call this route.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ status: 'unauthorized' }, { status: 401 })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase is not configured; nothing was pinged. Reported as a skip,
    // never as a successful keep-alive.
    return NextResponse.json({ status: 'skipped_unconfigured' })
  }

  const statuses: number[] = []
  for (let i = 0; i < PINGS_PER_RUN; i++) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/recipes?select=id&limit=1`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        cache: 'no-store',
      })
      statuses.push(res.status)
      if (!res.ok) break
    } catch {
      statuses.push(0)
      break
    }
  }

  const ok = statuses.length === PINGS_PER_RUN && statuses.every((s) => s === 200)

  return NextResponse.json(
    { status: ok ? 'ok' : 'error', statuses, at: new Date().toISOString() },
    { status: ok ? 200 : 502 },
  )
}
