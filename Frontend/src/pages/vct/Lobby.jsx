import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMeeting, getMeeting } from '../../api/vct/signaling'

export default function Lobby() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const startMeeting = async () => {
    try {
      const meeting = await createMeeting(title.trim() || 'Untitled meeting')
      navigate(`/app/vct/join/${meeting.code}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const joinExisting = async (e) => {
    e.preventDefault()
    try {
      await getMeeting(code.trim())
      navigate(`/app/vct/join/${code.trim()}`)
    } catch {
      setError('Meeting not found')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg px-4 text-ink">
      <div className="flex items-baseline gap-3">
        <span className="font-logo text-2xl lowercase tracking-tighter translate-y-[1.2px]">flint</span>
        <span className="text-3xl text-ink/15">|</span>
        <span className="text-3xl font-medium">VCT</span>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Meeting title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/40"
          />
          <button
            type="button"
            onClick={startMeeting}
            className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
          >
            New meeting
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink/35">
          <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={joinExisting} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a code or link"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent/40"
          />
          <button type="submit" className="rounded-full border border-ink/10 px-4 py-2.5 text-sm font-medium hover:border-accent/40 hover:text-accent">
            Join
          </button>
        </form>

        {error && <p className="text-xs text-accent">{error}</p>}
      </div>
    </div>
  )
}
