'use client'

import { useState } from 'react'

interface Props {
  title: string
  url?: string
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[color:var(--text-muted)] mr-1">Share:</span>

      <button
        onClick={copyLink}
        title="Copy link"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]"
      >
        {copied ? '✓ Copied' : '🔗 Copy link'}
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className="flex items-center px-2.5 py-1.5 text-xs border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]"
      >
        WhatsApp
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        className="flex items-center px-2.5 py-1.5 text-xs border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]"
      >
        X
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className="flex items-center px-2.5 py-1.5 text-xs border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--bg-surface-2)] transition-colors text-[color:var(--foreground)]"
      >
        Facebook
      </a>
    </div>
  )
}
