import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'Condohill <noreply@condohill.com>'
const YEAR = new Date().getFullYear()

// ─── Base template ────────────────────────────────────────────────────────────

function base(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Condohill</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F5F7FA;">${preheader}</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Header -->
  <tr>
    <td style="background:#0D9488;padding:24px 32px;border-radius:12px 12px 0 0;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="background:rgba(255,255,255,0.18);width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle;">
          <span style="color:white;font-size:18px;line-height:32px;">&#10022;</span>
        </td>
        <td style="padding-left:10px;">
          <span style="color:white;font-size:18px;font-weight:700;letter-spacing:-0.3px;">Condohill</span>
        </td>
      </tr></table>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid #DDE3EE;border-top:none;">
      ${body}
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:24px 0 8px;text-align:center;">
      <p style="margin:0 0 6px;color:#94A3B8;font-size:12px;">© ${YEAR} Condohill Real Estate · Toronto, Ontario</p>
      <p style="margin:0;color:#94A3B8;font-size:11px;">Not intended to solicit buyers or sellers currently under contract.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Reusable snippets ────────────────────────────────────────────────────────

function h1(text: string) {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0B1120;letter-spacing:-0.3px;">${text}</h1>`
}

function p(text: string, muted = false) {
  const color = muted ? '#5A6A7E' : '#0B1120'
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${color};">${text}</p>`
}

function cta(label: string, href: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td style="background:#0D9488;border-radius:8px;">
    <a href="${href}" style="display:inline-block;padding:12px 28px;color:white;font-size:14px;font-weight:600;text-decoration:none;">${label}</a>
  </td></tr>
</table>
<p style="margin:0 0 16px;font-size:12px;color:#94A3B8;">Or copy this link: <a href="${href}" style="color:#0D9488;">${href}</a></p>`
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #DDE3EE;margin:24px 0;"/>`
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#5A6A7E;width:40%;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:#0B1120;font-weight:500;">${value}</td>
  </tr>`
}

function table(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`
}

function listingCard(title: string, price: string, city: string, href: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;border:1px solid #DDE3EE;border-radius:8px;">
  <tr>
    <td style="padding:14px 16px;">
      <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0B1120;">${title}</p>
      <p style="margin:0 0 8px;font-size:13px;color:#5A6A7E;">${price} · ${city}</p>
      <a href="${href}" style="font-size:13px;color:#0D9488;text-decoration:none;font-weight:500;">View listing →</a>
    </td>
  </tr>
</table>`
}

// ─── Send helper ──────────────────────────────────────────────────────────────

interface SendOptions {
  to: string | string[]
  subject: string
  html: string
  text: string
}

export async function sendEmail(opts: SendOptions): Promise<void> {
  const key = process.env.RESEND_API_KEY
  console.log(`[EMAIL] key present=${!!key} keyLength=${key?.length ?? 0}`)
  if (!key || key.length < 5) return
  const resend = new Resend(key)
  await resend.emails.send({ from: FROM, ...opts })
}

// ─── Email templates ──────────────────────────────────────────────────────────

export function emailContactConfirmation(name: string, subject: string, message: string) {
  const html = base(
    `We received your message about "${subject}"`,
    `${h1('We got your message')}
${p(`Hi ${name}, thanks for reaching out. We'll get back to you within one business day.`)}
${divider()}
${p('Your message:', true)}
<blockquote style="margin:0 0 16px;padding:12px 16px;background:#F5F7FA;border-left:3px solid #0D9488;border-radius:0 6px 6px 0;">
  <p style="margin:0;font-size:14px;color:#0B1120;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
</blockquote>
${p('— The Condohill Team', true)}`
  )
  const text = `Hi ${name},\n\nThanks for reaching out. We received your message about "${subject}" and will reply within one business day.\n\nYour message:\n"${message}"\n\n— The Condohill Team`
  return { html, text, subject: `We received your message — ${subject}` }
}

export function emailVerifyAddress(name: string, verifyUrl: string) {
  const html = base(
    'Verify your email to complete sign-up',
    `${h1('Verify your email')}
${p(`Hi ${name}, one more step — click the button below to verify your email address.`)}
${cta('Verify email address', verifyUrl)}
${divider()}
${p('This link expires in 24 hours. If you did not create a Condohill account, ignore this email.', true)}`
  )
  const text = `Hi ${name},\n\nVerify your email address:\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you did not create a Condohill account, ignore this email.`
  return { html, text, subject: 'Verify your Condohill email' }
}

export function emailResetPassword(name: string, resetUrl: string) {
  const html = base(
    'Reset your Condohill password',
    `${h1('Reset your password')}
${p(`Hi ${name}, we received a request to reset the password for your Condohill account.`)}
${cta('Reset password', resetUrl)}
${divider()}
${p('This link expires in 1 hour. If you did not request a password reset, you can ignore this email — your password will not change.', true)}`
  )
  const text = `Hi ${name},\n\nReset your password:\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`
  return { html, text, subject: 'Reset your Condohill password' }
}

export function emailShowingRequest(
  name: string,
  listingId: string,
  preferredDate: string,
  preferredTime: string | undefined,
  message: string | undefined,
  dashboardUrl: string,
) {
  const when = `${preferredDate}${preferredTime ? ' at ' + preferredTime : ''}`
  const html = base(
    `New showing request from ${name}`,
    `${h1('New Showing Request')}
${p('A buyer has requested a showing.')}
${table(
  row('Buyer', name) +
  row('Listing', listingId) +
  row('Requested', when) +
  (message ? row('Message', message) : '')
)}
${cta('View in dashboard', dashboardUrl)}`)
  const text = `New showing request\nBuyer: ${name}\nListing: ${listingId}\nDate: ${when}${message ? '\nMessage: ' + message : ''}\n\nDashboard: ${dashboardUrl}`
  return { html, text, subject: `New showing request — ${name}` }
}

export function emailOpenHouseConfirmation(name: string, propertyTitle: string, dateStr: string) {
  const html = base(
    `You're registered for the open house at ${propertyTitle}`,
    `${h1("You're registered!")}
${p(`Hi ${name}, you're all set for the open house.`)}
${table(
  row('Property', propertyTitle) +
  row('Date &amp; time', dateStr)
)}
${divider()}
${p('We look forward to seeing you. If you have any questions, reply to this email or contact us directly.', true)}
${p('— The Condohill Team', true)}`
  )
  const text = `Hi ${name},\n\nYou're registered for the open house!\n\nProperty: ${propertyTitle}\nDate & time: ${dateStr}\n\nSee you there!\n\n— Condohill Team`
  return { html, text, subject: `You're registered — Open House at ${propertyTitle}` }
}

export function emailBroadcast(name: string, subject: string, message: string, appUrl: string) {
  const html = base(
    subject,
    `${h1(subject)}
${p(`Hi ${name},`)}
<div style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#0B1120;">${message.replace(/\n/g, '<br/>')}</div>
${divider()}
<p style="margin:0;font-size:12px;color:#94A3B8;">
  You're receiving this because you have a Condohill account.
  <a href="${appUrl}/account/saved-searches" style="color:#0D9488;">Manage preferences</a>
</p>`
  )
  const text = `Hi ${name},\n\n${message}\n\n— Condohill Real Estate\n${appUrl}`
  return { html, text }
}

export function emailPropertyAlert(
  name: string,
  searchName: string,
  listings: Array<{ id: string; title: string; price: number; city: string; neighbourhood?: string | null }>,
  appUrl: string,
) {
  const count = listings.length
  const cards = listings.slice(0, 5).map(p =>
    listingCard(
      p.title,
      `$${Number(p.price).toLocaleString()}`,
      p.neighbourhood ?? p.city,
      `${appUrl}/property/${p.id}`,
    )
  ).join('')

  const html = base(
    `${count} new listing${count !== 1 ? 's' : ''} match your search "${searchName}"`,
    `${h1(`${count} new listing${count !== 1 ? 's' : ''} for you`)}
${p(`Hi ${name}, ${count} new listing${count !== 1 ? 's match' : ' matches'} your saved search <strong>"${searchName}"</strong>.`)}
${cards}
${count > 5 ? p(`And ${count - 5} more — <a href="${appUrl}/search" style="color:#0D9488;">view all on Condohill</a>.`) : ''}
${divider()}
<p style="margin:0;font-size:12px;color:#94A3B8;">
  Manage your saved searches: <a href="${appUrl}/account/saved-searches" style="color:#0D9488;">account settings</a>
</p>`
  )

  const textList = listings.slice(0, 5).map(p =>
    `• ${p.title} — $${Number(p.price).toLocaleString()} (${p.neighbourhood ?? p.city})\n  ${appUrl}/property/${p.id}`
  ).join('\n')
  const text = `Hi ${name},\n\n${count} new listing${count !== 1 ? 's match' : ' matches'} your saved search "${searchName}":\n\n${textList}\n\nManage saved searches: ${appUrl}/account/saved-searches`

  return {
    html,
    text,
    subject: `${count} new listing${count !== 1 ? 's' : ''} match your search "${searchName}"`,
  }
}
