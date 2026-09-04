function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function initials(from) {
  const name = (from || '').split('<')[0].trim() || from || '?'
  return name.slice(0, 2).toUpperCase()
}

export default function InboxList({ emails, selectedId, onSelect, onToggleStar }) {
  if (!emails.length) return null

  return (
    <ul className="divide-y divide-ink/[0.06]">
      {emails.map((email) => {
        const active = selectedId === email.id
        return (
          <li key={email.id} className="relative">
            {!email.read && (
              <span className="absolute left-0 top-0 h-full w-0.5 bg-accent" aria-hidden="true" />
            )}
            <button
              type="button"
              onClick={() => onSelect(email.id)}
              className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                active ? 'bg-accent/[0.06]' : 'hover:bg-ink/[0.03]'
              }`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold ${
                  email.read ? 'bg-ink/[0.06] text-ink/50' : 'bg-ink text-bg'
                }`}
              >
                {initials(email.from)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-sm ${email.read ? 'font-normal text-ink/70' : 'font-semibold text-ink'}`}
                  >
                    {email.from}
                  </span>
                  <span className="shrink-0 text-xs text-ink/35">{formatDate(email.date)}</span>
                </span>
                <span className={`block truncate text-sm ${email.read ? 'text-ink/60' : 'font-medium text-ink'}`}>
                  {email.subject}
                </span>
                <span className="block truncate text-xs text-ink/40">{email.preview}</span>
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStar(email.id, !email.starred)
                }}
                className={`mt-1 shrink-0 text-base transition-colors ${
                  email.starred ? 'text-accent' : 'text-ink/15 hover:text-ink/35'
                }`}
              >
                ★
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
