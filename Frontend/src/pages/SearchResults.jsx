import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InboxList from '../components/InboxList'
import EmailView from '../components/EmailView'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { searchEmails, markStar } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function SearchResults({ onCompose }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = [new URLSearchParams(window.location.search)]
  const q = params.get('q') || ''
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    searchEmails(q)
      .then((data) => setEmails(data.emails ?? data))
      .catch((err) => setError(err.message || 'Search failed'))
      .finally(() => setLoading(false))
  }, [q])

  const toggleStar = async (emailId, starred) => {
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, starred } : e)))
    try {
      await markStar(emailId, starred)
    } catch {
      setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, starred: !starred } : e)))
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className="min-h-0 w-full overflow-y-auto border-r border-ink/[0.08] md:w-96 md:shrink-0">
        <p className="border-b border-ink/[0.08] px-4 py-2.5 text-xs text-ink/40">
          Results for &ldquo;{q}&rdquo;
        </p>
        {loading && <LoadingState label="Searching…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && emails.length === 0 && (
          <EmptyState title="No results" subtitle="Try a different search term." />
        )}
        {!loading && !error && emails.length > 0 && (
          <InboxList emails={emails} selectedId={id} onSelect={(emailId) => navigate(`/app/search/${emailId}?q=${encodeURIComponent(q)}`)} onToggleStar={toggleStar} />
        )}
      </div>
      <div className="min-h-0 flex-1">
        <EmptyState title="Select an email" subtitle="Choose a message from the results to read it." />
      </div>
    </div>
  )
}
