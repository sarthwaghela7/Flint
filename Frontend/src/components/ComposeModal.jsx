import { useState, useEffect } from 'react'
import { FROM_ADDRESSES } from '../constants'

export default function ComposeModal({ initial, onClose, onSend }) {
  const [from, setFrom] = useState(FROM_ADDRESSES[0])
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initial) {
      setFrom(initial.from || FROM_ADDRESSES[0])
      setTo(initial.to || '')
      setSubject(initial.subject || '')
      setBody(initial.body || '')
    }
  }, [initial])

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await onSend({ from, to, subject, body, attachments })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-[2px] md:items-center">
      <form
        onSubmit={submit}
        className="flex max-h-[90vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-t-2xl border border-ink/[0.08] bg-bg p-5 shadow-2xl md:rounded-2xl"
      >
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm font-semibold tracking-tight">New message</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink">
            ✕
          </button>
        </div>

        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/40 focus:bg-white focus:ring-4 focus:ring-accent/10"
        >
          {FROM_ADDRESSES.map((addr) => (
            <option key={addr} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-accent/40 focus:bg-white focus:ring-4 focus:ring-accent/10"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-accent/40 focus:bg-white focus:ring-4 focus:ring-accent/10"
        />

        <textarea
          placeholder="Write your message…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="resize-none rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-accent/40 focus:bg-white focus:ring-4 focus:ring-accent/10"
        />

        <input
          type="file"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files))}
          className="text-xs text-ink/50 file:mr-3 file:rounded-full file:border-0 file:bg-ink/[0.06] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink/70"
        />

        {error && <p className="text-xs font-medium text-accent">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium transition-colors hover:border-ink/25 hover:bg-ink/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50 active:scale-[0.98]"
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
