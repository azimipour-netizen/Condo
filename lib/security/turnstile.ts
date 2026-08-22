/**
 * Cloudflare Turnstile server-side verification.
 *
 * Fails CLOSED when a secret is configured: a missing or invalid token is
 * rejected. When no secret is set (local dev, preview) verification is skipped
 * so the signup flow still works.
 */

const SECRET = process.env.TURNSTILE_SECRET_KEY ?? ''
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const turnstileEnabled = !!SECRET

export async function verifyTurnstile(token: unknown, ip?: string): Promise<boolean> {
  if (!SECRET) return true // not configured — nothing to enforce
  if (typeof token !== 'string' || token.length === 0) return false

  try {
    const body = new URLSearchParams({ secret: SECRET, response: token })
    if (ip) body.set('remoteip', ip)

    const res = await fetch(VERIFY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal:  AbortSignal.timeout(10_000),
    })
    if (!res.ok) return false

    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      console.warn('[turnstile] rejected:', (data['error-codes'] ?? []).join(', '))
    }
    return data.success === true
  } catch (err) {
    // A Cloudflare outage should not let bots through.
    console.warn('[turnstile] verification error:', String(err).slice(0, 120))
    return false
  }
}
