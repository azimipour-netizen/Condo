process.loadEnvFile('.env.local')

import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '../lib/ai/system-prompt'
import { AI_TOOLS } from '../lib/ai/tools'

/**
 * Live verification against the real API — costs a small amount of real
 * tokens each run, so this is a manual check, not part of a test suite.
 * Confirms the system+tools prefix actually caches: call 1 should show
 * cache_creation_input_tokens > 0 (the write), call 2 should show
 * cache_read_input_tokens > 0 (the read, at ~10% of the write's cost). If
 * read stays 0, the prefix is not byte-identical between calls.
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const model = process.env.AI_MODEL ?? 'claude-sonnet-5'

const messages: Anthropic.MessageParam[] = [
  { role: 'user', content: [{ type: 'text', text: '2 bed condo for rent north york' }] },
]

async function call(label: string) {
  const t0 = Date.now()
  const response = await anthropic.messages.create({
    model,
    max_tokens: 512,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: AI_TOOLS,
    messages,
  })
  const ms = Date.now() - t0
  const u = response.usage
  console.log(
    `${label}  [${ms}ms]  input=${u.input_tokens} output=${u.output_tokens} ` +
    `cache_write=${u.cache_creation_input_tokens ?? 0} cache_read=${u.cache_read_input_tokens ?? 0}`
  )
  return u
}

async function main() {
  console.log(`model: ${model}\n`)
  const first = await call('call 1 (expect a cache WRITE)')
  const second = await call('call 2 (expect a cache READ)')

  console.log('')
  if ((first.cache_creation_input_tokens ?? 0) === 0) {
    console.log('UNEXPECTED: first call wrote nothing to cache. Prefix may be under the model\'s minimum, or a marker is missing.')
  }
  if ((second.cache_read_input_tokens ?? 0) > 0) {
    const pct = Math.round(100 * (second.cache_read_input_tokens ?? 0) / ((second.cache_read_input_tokens ?? 0) + second.input_tokens))
    console.log(`CACHING WORKS: ${second.cache_read_input_tokens} tokens served from cache on call 2 (${pct}% of that call's input).`)
  } else {
    console.log('CACHE MISS on call 2 — something in the prefix is not byte-identical between calls.')
    process.exitCode = 1
  }
}

main().catch(e => { console.error(e); process.exit(1) })
