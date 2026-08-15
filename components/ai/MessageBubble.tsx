import type { AIMessage } from '@/types/ai'

interface Props {
  message: AIMessage
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z" fill="white" />
          </svg>
        </div>
      )}

      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-[color:var(--accent)] text-white rounded-br-sm'
            : 'bg-[color:var(--bg-surface-2)] text-[color:var(--foreground)] rounded-bl-sm border border-[color:var(--border)]',
        ].join(' ')}
      >
        {message.content ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : isStreaming ? (
          <TypingIndicator />
        ) : null}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <span className="flex gap-1 items-center h-4">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[color:var(--text-muted)] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
