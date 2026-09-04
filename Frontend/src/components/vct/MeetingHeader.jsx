import { MessageSquare, Users } from 'lucide-react'

export default function MeetingHeader({ title, code, elapsed, participantCount, onOpenParticipants, onOpenChat, recording }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-5 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-logo text-xs lowercase tracking-tighter">flint</span>
        <span className="hidden truncate text-sm text-white/50 sm:inline">{title || code}</span>
        {recording && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[0.65rem] font-semibold text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> REC
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-white/60">
        <span className="mr-1 hidden text-xs tabular-nums sm:inline">{elapsed}</span>
        <button
          type="button"
          onClick={onOpenChat}
          className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="In-call messages"
          title="In-call messages"
        >
          <MessageSquare size={16} />
        </button>
        <button
          type="button"
          onClick={onOpenParticipants}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Participants"
          title="Participants"
        >
          <Users size={16} /> <span className="text-xs tabular-nums">{participantCount}</span>
        </button>
      </div>
    </header>
  )
}
