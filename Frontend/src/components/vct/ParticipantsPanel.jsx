import { Crown, Mic, MicOff, UserMinus, X } from 'lucide-react'

export default function ParticipantsPanel({ open, onClose, participants, waitingRoom, isHost, onMute, onRemove, onApprove }) {
  if (!open) return null

  return (
    <aside className="fixed inset-0 z-30 flex w-full flex-col bg-meetpanel text-white sm:static sm:z-auto sm:h-full sm:w-80 sm:shrink-0 sm:border-l sm:border-white/10">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold">People ({participants.length})</h2>
        <button type="button" onClick={onClose} aria-label="Close participants" className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {isHost && waitingRoom.length > 0 && (
        <div className="shrink-0 border-b border-white/10 px-4 py-3">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-white/40">
            Waiting to join ({waitingRoom.length})
          </p>
          <ul className="space-y-2">
            {waitingRoom.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{p.name}</span>
                <button
                  type="button"
                  onClick={() => onApprove(p.id)}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-90"
                >
                  Admit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-white/5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[0.65rem] font-semibold">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="truncate text-sm">{p.name}</span>
              {p.is_host && <Crown size={13} className="shrink-0 text-accent" aria-label="Host" />}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {p.muted ? (
                <MicOff size={14} className="text-accent" aria-label="Muted" />
              ) : (
                <Mic size={14} className="text-white/35" aria-label="Unmuted" />
              )}
              {isHost && !p.is_host && (
                <>
                  <button
                    type="button"
                    onClick={() => onMute(p.id)}
                    className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={`Mute ${p.name}`}
                    title="Mute"
                  >
                    <MicOff size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-accent/15 hover:text-accent"
                    aria-label={`Remove ${p.name}`}
                    title="Remove"
                  >
                    <UserMinus size={14} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
