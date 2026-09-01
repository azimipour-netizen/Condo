import { checkFreeChatLimit, recordFreeChat, FREE_CHAT_LIMIT } from '../lib/ai/free-chat-limit'

let pass = 0, fail = 0
function check(label: string, cond: boolean) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`)
  cond ? pass++ : fail++
}

check('FREE_CHAT_LIMIT is 3 (matches "three chats free")', FREE_CHAT_LIMIT === 3)

const ip = '203.0.113.1' // TEST-NET-3, never a real client IP
check('fresh IP is allowed', checkFreeChatLimit(ip).allowed === true)
check('fresh IP shows 0 used', checkFreeChatLimit(ip).used === 0)

for (let i = 1; i <= FREE_CHAT_LIMIT; i++) {
  const before = checkFreeChatLimit(ip)
  check(`chat ${i}/${FREE_CHAT_LIMIT} allowed`, before.allowed === true)
  recordFreeChat(ip)
}

const afterLimit = checkFreeChatLimit(ip)
check(`chat ${FREE_CHAT_LIMIT + 1} is blocked`, afterLimit.allowed === false)
check(`used count reads back as ${FREE_CHAT_LIMIT}`, afterLimit.used === FREE_CHAT_LIMIT)

// A different IP must be completely unaffected.
const otherIp = '203.0.113.2'
check('a different IP is independently allowed', checkFreeChatLimit(otherIp).allowed === true)

// Calling recordFreeChat past the limit shouldn't do anything catastrophic
// (e.g. the route calls it once per successful gate check, but this
// guards against any future double-call).
recordFreeChat(ip)
recordFreeChat(ip)
check('over-limit IP stays blocked after extra records', checkFreeChatLimit(ip).allowed === false)

console.log(`\n${pass} passed, ${fail} failed`)
// The module's prune setInterval keeps the process alive otherwise.
process.exit(fail ? 1 : 0)
