import type Anthropic from '@anthropic-ai/sdk'

/**
 * Marks the last content block of the last message with a cache_control
 * breakpoint, so a growing conversation reads its already-processed prefix
 * from cache instead of reprocessing it on every call.
 *
 * Deliberately non-mutating: `msgs` (the caller's running history) is
 * returned untouched, and only the array built for this one API call carries
 * the marker. Baking cache_control into the stored history would leave a
 * stale breakpoint on an old message every time a new one is appended -
 * harmless per se, but the API caps requests at 4 breakpoints total, so a
 * long conversation would eventually hit that ceiling for no benefit (the
 * marker's only job is to sit on the *current* last block).
 */
export function withCacheBreakpoint(msgs: Anthropic.MessageParam[]): Anthropic.MessageParam[] {
  if (msgs.length === 0) return msgs
  const last = msgs[msgs.length - 1]
  if (!Array.isArray(last.content) || last.content.length === 0) return msgs

  // Thinking blocks are the one content-block type that rejects cache_control
  // (this route never enables extended thinking, so this shouldn't occur in
  // practice - guarded because the SDK's own types disallow it there).
  const lastIdx = last.content.length - 1
  const lastBlock = last.content[lastIdx]
  if (lastBlock.type === 'thinking' || lastBlock.type === 'redacted_thinking') return msgs

  const content = [...last.content]
  content[lastIdx] = { ...lastBlock, cache_control: { type: 'ephemeral' } }

  return [...msgs.slice(0, -1), { ...last, content }]
}
