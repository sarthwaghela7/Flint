import { useNavigate, useParams } from 'react-router-dom'
import InboxList from '../components/InboxList'
import EmailView from '../components/EmailView'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import useEmailList from '../hooks/useEmailList'
import useEmailDetail from '../hooks/useEmailDetail'

export default function MailLayout({ folder, emptyTitle, onCompose }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { emails, loading, error, reload, toggleStar } = useEmailList(folder)
  const { email, loading: loadingEmail } = useEmailDetail(id)

  const basePath = folder === 'inbox' ? '/app' : `/app/${folder}`
  const select = (emailId) => navigate(`${basePath}/${emailId}`)

  const reply = (e) => onCompose({ from: e.to, to: e.from, subject: `Re: ${e.subject}`, body: `\n\n---\nOn ${e.date}, ${e.from} wrote:\n${e.bodyText || ''}` })
  const replyAll = (e) => onCompose({ from: e.to, to: [e.from, ...(e.cc || [])].join(', '), subject: `Re: ${e.subject}`, body: `\n\n---\nOn ${e.date}, ${e.from} wrote:\n${e.bodyText || ''}` })
  const forward = (e) => onCompose({ from: e.to, to: '', subject: `Fwd: ${e.subject}`, body: `\n\n---\nForwarded message from ${e.from}:\n${e.bodyText || ''}` })

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className={`min-h-0 w-full overflow-y-auto border-r border-ink/[0.08] md:w-96 md:shrink-0 ${id ? 'hidden md:block' : ''}`}>
        {loading && <LoadingState label="Loading emails…" />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && emails.length === 0 && (
          <EmptyState title={emptyTitle || 'No emails'} subtitle="You're all caught up." />
        )}
        {!loading && !error && emails.length > 0 && (
          <InboxList emails={emails} selectedId={id} onSelect={select} onToggleStar={toggleStar} />
        )}
      </div>

      <div className={`min-h-0 flex-1 ${id ? '' : 'hidden md:block'}`}>
        {id && loadingEmail && <LoadingState label="Loading message…" />}
        {id && !loadingEmail && email && (
          <EmailView email={email} onReply={reply} onReplyAll={replyAll} onForward={forward} onToggleStar={toggleStar} />
        )}
        {!id && (
          <EmptyState title="Select an email" subtitle="Choose a message from the list to read it." />
        )}
      </div>
    </div>
  )
}
