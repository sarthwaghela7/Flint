import { useState } from 'react'

export default function EmailView({ email, onReply, onReplyAll, onForward, onToggleStar }) {
  const [showPlain, setShowPlain] = useState(false)

  if (!email) return null

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-6 md:px-10">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-ink/[0.08] pb-5">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight">{email.subject}</h1>
          <p className="mt-2 text-sm text-ink/60">
            <span className="font-medium text-ink/80">{email.from}</span> → {email.to}
          </p>
          <p className="mt-0.5 text-xs text-ink/35">{new Date(email.date).toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleStar(email.id, !email.starred)}
          className={`shrink-0 rounded-full p-1 text-xl transition-colors ${email.starred ? 'text-accent' : 'text-ink/15 hover:text-ink/35'}`}
        >
          ★
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => onReply(email)} className="rounded-full border border-ink/10 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent">
          Reply
        </button>
        <button type="button" onClick={() => onReplyAll(email)} className="rounded-full border border-ink/10 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent">
          Reply all
        </button>
        <button type="button" onClick={() => onForward(email)} className="rounded-full border border-ink/10 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent">
          Forward
        </button>
        {email.bodyText && (
          <button
            type="button"
            onClick={() => setShowPlain((v) => !v)}
            className="ml-auto rounded-full border border-ink/10 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent"
          >
            {showPlain ? 'View HTML' : 'View plain text'}
          </button>
        )}
      </div>

      <div className="min-w-0 flex-1 rounded-2xl border border-ink/[0.06] bg-white/50 p-5 text-sm leading-relaxed">
        {showPlain || !email.bodyHtml ? (
          <pre className="whitespace-pre-wrap font-body">{email.bodyText}</pre>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />
        )}
      </div>

      {email.attachments?.length > 0 && (
        <div className="mt-6 border-t border-ink/[0.08] pt-4">
          <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-ink/35">Attachments</p>
          <ul className="flex flex-wrap gap-2">
            {email.attachments.map((att) => (
              <li key={att.id}>
                <a
                  href={att.url}
                  download={att.filename}
                  className="rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent"
                >
                  {att.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
