import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Plus } from 'lucide-react'
import { createMeeting, getMeeting } from '../../api/vct/signaling'

export default function Lobby() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const startMeeting = async () => {
    setBusy(true)
    setError(null)
    try {
      const meeting = await createMeeting(title.trim() || 'Untitled meeting')
      navigate(`/app/vct/join/${meeting.code}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const joinExisting = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    setError(null)
    try {
      await getMeeting(code.trim())
      navigate(`/app/vct/join/${code.trim()}`)
    } catch {
      setError('Meeting not found')
      setBusy(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-ink">
      <header className="flex h-16 shrink-0 items-center px-6">
        <span className="font-logo text-sm lowercase tracking-tighter">flint</span>
        <span className="mx-3 text-xl leading-none text-ink/15">|</span>
        <span className="text-sm font-medium text-ink/60">Video conferencing</span>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Meet face to face.</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/50">
            Start a new meeting or join with a code. No account needed.
          </p>

          <div className="mt-8 space-y-3">
            <input
              type="text"
              placeholder="Meeting title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-sm outline-none transition-colors focus:border-accent/50"
            />
            <button
              type="button"
              onClick={startMeeting}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Plus size={16} /> New meeting
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-widest text-ink/30">
            <span className="h-px flex-1 bg-ink/10" /> or join with a code <span className="h-px flex-1 bg-ink/10" />
          </div>

          <form onSubmit={joinExisting} className="flex gap-2">
            <input
              type="text"
              placeholder="Meeting code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-sm outline-none transition-colors focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-3 text-sm font-semibold transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
            >
              <KeyRound size={15} /> Join
            </button>
          </form>

          {error && <p className="mt-4 text-center text-xs text-accent">{error}</p>}
        </div>
      </main>
    </div>
  )
}
