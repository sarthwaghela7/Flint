import { useState } from 'react'

export default function ChatPanel({ open, onClose, messages, onSend, selfName }) {
  const [text, setText] = useState('')

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <aside className="fixed inset-0 z-30 flex w-full flex-col bg-meetpanel text-white sm:static sm:z-auto sm:h-full sm:w-80 sm:shrink-0 sm:border-l sm:border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold">In-call messages</h2>
        <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-white/10">✕</button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="mt-4 text-center text-xs text-white/40">No messages yet</p>
        )}
        {messages.map((m, i) => (
          <div key={i}>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold">{m.sender_name === selfName ? 'You' : m.sender_name}</span>
              <span className="text-[0.65rem] text-white/40">
                {new Date(m.sent_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-white/85">{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message"
          className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-accent/50"
        />
        <button type="submit" className="rounded-full bg-accent px-3 py-2 text-sm font-medium">
          Send
        </button>
      </form>
    </aside>
  )
}
