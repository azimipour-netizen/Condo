import { withCacheBreakpoint } from '../lib/ai/prompt-cache'
import type Anthropic from '@anthropic-ai/sdk'

let pass = 0, fail = 0
function check(label: string, cond: boolean) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`)
  cond ? pass++ : fail++
}

// Empty history is a no-op.
check('empty array unchanged', withCacheBreakpoint([]).length === 0)

// Marks the last block of the last message.
const msgs: Anthropic.MessageParam[] = [
  { role: 'user', content: [{ type: 'text', text: 'first' }] },
  { role: 'assistant', content: [{ type: 'text', text: 'reply' }] },
  { role: 'user', content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] },
]
const marked = withCacheBreakpoint(msgs)
const lastMsg = marked[marked.length - 1]
const lastBlock = Array.isArray(lastMsg.content) ? lastMsg.content[lastMsg.content.length - 1] : null
check('marks the LAST block of the LAST message, not the first', (lastBlock as any)?.cache_control?.type === 'ephemeral')
const firstBlockOfLastMsg = Array.isArray(lastMsg.content) ? lastMsg.content[0] : null
check('earlier blocks in that same message are untouched', (firstBlockOfLastMsg as any)?.cache_control === undefined)

// Does not mutate the caller's array — critical, since the route keeps
// pushing onto the original `anthropicMessages` across loop iterations.
check('original array not mutated', (msgs[msgs.length - 1].content as any)[1].cache_control === undefined)
check('original message objects not mutated (different reference)', msgs[msgs.length - 1] !== marked[marked.length - 1])

// Earlier messages in the returned array are untouched (only 1 breakpoint).
const firstReturnedMsg = marked[0]
const firstReturnedBlock = Array.isArray(firstReturnedMsg.content) ? firstReturnedMsg.content[0] : null
check('only ONE breakpoint total, not one per message', (firstReturnedBlock as any)?.cache_control === undefined)

// String content (shouldn't occur post-fix, but must not throw).
const stringContentMsgs = [{ role: 'user', content: 'plain string' }] as unknown as Anthropic.MessageParam[]
let threw = false
try { withCacheBreakpoint(stringContentMsgs) } catch { threw = true }
check('string content does not throw (returned as-is)', !threw)

// Thinking block guard — SDK types reject cache_control there.
const thinkingMsgs: Anthropic.MessageParam[] = [
  { role: 'assistant', content: [{ type: 'thinking', thinking: 'reasoning...', signature: 'sig' }] },
]
const thinkingResult = withCacheBreakpoint(thinkingMsgs)
const thinkingBlock = Array.isArray(thinkingResult[0].content) ? thinkingResult[0].content[0] : null
check('thinking blocks are skipped, not marked', (thinkingBlock as any)?.cache_control === undefined)

console.log(`\n${pass} passed, ${fail} failed`)
if (fail) process.exit(1)
