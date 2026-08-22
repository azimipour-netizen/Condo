/**
 * Cheap signup guards that need no third-party keys.
 *
 * Blocks throwaway inbox providers, which is where automated signups almost
 * always come from. Deliberately a small curated list rather than a huge
 * blocklist: false positives lock out real buyers, which costs more than
 * letting a few spam accounts through.
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com',
  'grr.la', 'guerrillamailblock.com', 'spam4.me',
  '10minutemail.com', '10minutemail.net', 'tempmail.com', 'temp-mail.org',
  'throwawaymail.com', 'yopmail.com', 'yopmail.fr', 'maildrop.cc',
  'getnada.com', 'nada.email', 'dispostable.com', 'trashmail.com',
  'trashmail.de', 'mytrashmail.com', 'fakeinbox.com', 'mailnesia.com',
  'tempinbox.com', 'emailondeck.com', 'mohmal.com', 'moakt.com',
  'tempr.email', 'discard.email', 'mailcatch.com', 'inboxbear.com',
  'harakirimail.com', 'spambog.com', 'mailexpire.com', 'burnermail.io',
  'anonaddy.me', 'simplelogin.io', 'linshiyouxiang.net', 'cock.li',
  'einrot.com', 'tempmailo.com', 'minuteinbox.com', 'mail-temp.com',
  'tmpmail.org', 'tmpmail.net', 'luxusmail.org', 'vomoto.com',
])

export interface EmailGuardResult {
  ok: boolean
  reason?: string
}

export function checkSignupEmail(email: string): EmailGuardResult {
  const normalized = email.trim().toLowerCase()
  const domain = normalized.split('@')[1]
  if (!domain) return { ok: false, reason: 'Invalid email address.' }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, reason: 'Please use a permanent email address.' }
  }

  // Long random local parts ("kx8f2p9qmzt41vd") are a bot signature; real
  // addresses of that length almost always contain a separator or a digit run.
  const local = normalized.split('@')[0]
  if (local.length >= 14 && /^[a-z0-9]+$/.test(local)) {
    const digits = (local.match(/\d/g) ?? []).length
    const hasVowel = /[aeiou]/.test(local)
    if (digits >= 4 && !hasVowel) {
      return { ok: false, reason: 'Please use a different email address.' }
    }
  }

  return { ok: true }
}
