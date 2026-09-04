import { useState } from 'react'

export default function InviteModal({ code, onClose }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/app/vct/join/${code}`

  const copy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-meetpanel p-5 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Your meeting is ready</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-white/10">✕</button>
        </div>

        <p className="mb-1 text-xs text-white/50">Meeting code</p>
        <div className="mb-3 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
          <span className="font-mono text-sm tracking-wide">{code}</span>
          <button type="button" onClick={() => copy(code)} className="text-xs text-accent hover:underline">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="mb-1 text-xs text-white/50">Shareable link</p>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
          <span className="truncate text-sm">{link}</span>
          <button type="button" onClick={() => copy(link)} className="ml-2 shrink-0 text-xs text-accent hover:underline">
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
