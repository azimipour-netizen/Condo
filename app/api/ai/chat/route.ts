import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/ai/system-prompt'
import { AI_TOOLS } from '@/lib/ai/tools'
import { getMLSAdapter } from '@/lib/mls/adapter'
import { validateSearchFilters } from '@/lib/search/validators'
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

        try {
          const anthropicMessages: Anthropic.MessageParam[] = messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))

          let continueLoop = true

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

                try {
                  const result = await executeTool(block.name, block.input as Record<string, unknown>)
                  send({ type: 'tool_result', name: block.name, data: result })
                  toolResults.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: JSON.stringify(result),
                  })
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
      const limit = typeof input.limit === 'number' ? Math.min(input.limit, 20) : 6
      return adapter.searchListings(filters, 1, limit)
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
