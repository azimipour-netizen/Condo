import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt'
import { AI_TOOLS } from '@/lib/ai/tools'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { validateSearchFilters } from '@/lib/search/validators'
import { searchListingsDb } from '@/lib/search/db-search'
import { parseQuery } from '@/lib/search/parse-query'
import { describeResults } from '@/lib/search/describe-results'
import { getCachedFilters, setCachedFilters } from '@/lib/search/query-cache'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const rl = ratelimit(`ai:${getIP(req)}`, 8, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages', { status: 400 })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder()

        function send(data: object) {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        // Runs a search entirely outside the Claude loop: query DB, emit the
        // same tool_start/tool_result events the LLM path emits (so the
        // client's existing handling doesn't need to know which path ran),
        // then a short one-line reply — never a per-listing rundown, since
        // the results panel already renders every card.
        async function runFastPath(filters: import('@/types/search').SearchFilters) {
          const validated = validateSearchFilters(filters)
          send({ type: 'tool_start', name: 'search_properties' })
          const result = await searchListingsDb(validated, 1, 20)
          send({ type: 'tool_result', name: 'search_properties', data: result })
          send({ type: 'text', content: describeResults(result, validated) })
          send({ type: 'done' })
          controller.close()
        }

        try {
          // ── Free paths ───────────────────────────────────────────────────
          // Most searches are formulaic ("2 bed condo for rent north york").
          // Two ways to skip Claude entirely, tried in order:
          //
          //  1. The deterministic parser resolves the common structured
          //     phrasing for free, with no cache lookup needed at all.
          //  2. For text the parser can't resolve on its own (free-text
          //     intent like "motivated sellers"), check whether some earlier
          //     user's identically-phrased query already had Claude extract
          //     filters for it. Query text clusters hard on a property site,
          //     so one Claude call ends up serving every later user who types
          //     the same thing.
          //
          // Both are restricted to the opening turn on purpose: once there's
          // history, a message like "for lease, not for sale" only makes
          // sense against what came before, which neither the parser nor the
          // cache key has access to. Those go to Claude, which does.
          const isOpeningTurn = messages.length === 1 && typeof messages[0]?.content === 'string'

          if (isOpeningTurn) {
            const parsed = parseQuery(messages[0].content)

            try {
              if (parsed.confidence === 'high') {
                await runFastPath(parsed.filters)
                return
              }

              const cached = getCachedFilters(messages[0].content)
              if (cached) {
                await runFastPath(cached)
                return
              }
            } catch (err) {
              // Never fail the request over the optimisation - fall through
              // to Claude, which would have handled this turn anyway.
              console.warn('[ai/chat] fast path failed, using model:', String(err).slice(0, 200))
            }
          }

          const anthropicMessages: Anthropic.MessageParam[] = messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))

          let continueLoop = true
          // Counts every tool call across the whole turn, including retries
          // Claude makes after a zero-result search (e.g. sale -> lease
          // fallback). Only the very first one reflects what the raw query
          // actually means — caching a later, broadened retry under the
          // original text would poison the cache with the wrong filters.
          let toolCallCount = 0

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: process.env.AI_MODEL ?? 'claude-sonnet-5',
              max_tokens: 2048,
              system: SYSTEM_PROMPT,
              tools: AI_TOOLS,
              messages: anthropicMessages,
            })

            // Stream text blocks
            for (const block of response.content) {
              if (block.type === 'text') {
                send({ type: 'text', content: block.text })
              }
            }

            if (response.stop_reason === 'tool_use') {
              // Process tool calls
              const toolResults: Anthropic.ToolResultBlockParam[] = []

              for (const block of response.content) {
                if (block.type !== 'tool_use') continue

                send({ type: 'tool_start', name: block.name })
                toolCallCount++
                const isFirstToolCallOfTurn = toolCallCount === 1

                try {
                  const result = await executeTool(block.name, block.input as Record<string, unknown>)
                  send({ type: 'tool_result', name: block.name, data: result })
                  toolResults.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: JSON.stringify(result),
                  })

                  // Record what Claude extracted so the next user who types
                  // this same free-text query hits the cache instead of
                  // paying for another Claude call. Opening-turn AND the
                  // first search of the turn only — a later retry (e.g. a
                  // sale->lease fallback after zero results) reflects a
                  // broadened guess, not the literal query, and must not
                  // overwrite the cache with the wrong filters.
                  if (isOpeningTurn && isFirstToolCallOfTurn && block.name === 'search_properties') {
                    const input = block.input as { filters?: unknown }
                    if (input.filters) {
                      setCachedFilters(messages[0].content, input.filters as import('@/types/search').SearchFilters)
                    }
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : 'Tool error'
                  toolResults.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: JSON.stringify({ error: msg }),
                  })
                }
              }

              // Add assistant turn and tool results, then loop
              anthropicMessages.push({ role: 'assistant', content: response.content })
              anthropicMessages.push({ role: 'user', content: toolResults })
            } else {
              continueLoop = false
            }
          }

          send({ type: 'done' })
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error'
          send({ type: 'error', message: msg })
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return new Response('Bad request', { status: 400 })
  }
}

async function executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  const adapter = getMLSAdapter()

  switch (name) {
    case 'search_properties': {
      const filters = validateSearchFilters(input.filters)
      const limit = typeof input.limit === 'number' ? Math.min(input.limit, 50) : 20
      // DB-backed: local synced Postgres, already geocoded at sync time — no
      // live AMPRE round trip and no per-result geocoding on the request path.
      // That external round trip (search + geocode every row) was the
      // dominant cost in the assistant's ~30s first-response latency.
      return searchListingsDb(filters, 1, limit)
    }

    case 'get_property_details': {
      const id = String(input.propertyId ?? '')
      const property = await adapter.getListing(id)
      if (!property) return { error: 'Property not found' }
      return property
    }

    case 'compare_properties': {
      const ids = Array.isArray(input.propertyIds) ? input.propertyIds.slice(0, 4) : []
      const results = await Promise.all(ids.map(id => adapter.getListing(String(id))))
      return { properties: results.filter(Boolean) }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
