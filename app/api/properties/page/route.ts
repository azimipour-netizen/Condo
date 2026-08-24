import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { validateSearchFilters } from '@/lib/search/validators'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const BodySchema = z.object({
  filters: z.unknown(),
  page: z.number().min(1),
  limit: z.number().min(1).max(50).optional(),
})

// The AI chat's search_properties tool only ever fetches page 1 (to keep the
// model's context small). This route lets the results panel page through the
// rest of result.total using the exact same filters — including location
// shapes (intersection, city) that /api/properties' query-param schema can't
// express — instead of re-running the AI tool call for every page.
export async function POST(req: NextRequest) {
  const rl = ratelimit(`properties-page:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  try {
    const body = BodySchema.parse(await req.json())
    const filters = validateSearchFilters(body.filters)
    const adapter = getMLSAdapter()
    const result = await adapter.searchListings(filters, body.page, body.limit ?? 20)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', issues: err.issues }, { status: 400 })
    }
    console.error('[/api/properties/page]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
