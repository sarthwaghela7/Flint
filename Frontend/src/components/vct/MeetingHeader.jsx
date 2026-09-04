export default function MeetingHeader({ title, code, elapsed, participantCount, onToggleCaptions, captionsOn, onOpenParticipants, onOpenChat, recording }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4 text-white">
      <div className="flex items-center gap-3">
        <span className="font-logo text-xs lowercase tracking-tighter">flint</span>
        <span className="hidden text-sm text-white/60 sm:inline">{title || code}</span>
        {recording && (
          <span className="flex items-center gap-1 rounded-full bg-red-600/20 px-2 py-0.5 text-xs text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> REC
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span className="hidden sm:inline">{elapsed}</span>
        <button
          type="button"
          onClick={onToggleCaptions}
          className={`rounded-full p-2 hover:bg-white/10 ${captionsOn ? 'text-accent' : ''}`}
          aria-label="Toggle captions"
        >
          💬
        </button>
        <button type="button" onClick={onOpenChat} className="rounded-full p-2 hover:bg-white/10" aria-label="Chat">
          ✉️
        </button>
        <button
          type="button"
          onClick={onOpenParticipants}
          className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20"
        >
          👥 <span>{participantCount}</span>
        </button>
      </div>
    </header>
  )
}
