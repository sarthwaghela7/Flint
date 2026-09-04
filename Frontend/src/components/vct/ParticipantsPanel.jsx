export default function ParticipantsPanel({ open, onClose, participants, waitingRoom, isHost, onMute, onRemove, onApprove }) {
  if (!open) return null

  return (
    <aside className="fixed inset-0 z-30 flex w-full flex-col bg-meetpanel text-white sm:static sm:z-auto sm:h-full sm:w-80 sm:shrink-0 sm:border-l sm:border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold">People ({participants.length})</h2>
        <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-white/10">✕</button>
      </div>

      {isHost && waitingRoom.length > 0 && (
        <div className="border-b border-white/10 px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
            Waiting to join ({waitingRoom.length})
          </p>
          <ul className="space-y-2">
            {waitingRoom.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{p.name}</span>
                <button
                  type="button"
                  onClick={() => onApprove(p.id)}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-medium"
                >
                  Admit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="truncate text-sm">
                {p.name} {p.is_host && <span className="text-white/40">(Host)</span>}
              </span>
            </div>
            {isHost && !p.is_host && (
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onMute(p.id)}
                  className="rounded-full p-1.5 text-xs hover:bg-white/10"
                  aria-label="Mute participant"
                >
                  🔇
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="rounded-full p-1.5 text-xs hover:bg-white/10"
                  aria-label="Remove participant"
                >
                  ⛔
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
