import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSearch(q.trim())
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/30">⌕</span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search subject, sender, body…"
        className="w-full rounded-full border border-ink/10 bg-ink/[0.03] py-2 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-accent/40 focus:bg-white focus:ring-4 focus:ring-accent/10"
      />
    </form>
  )
}
