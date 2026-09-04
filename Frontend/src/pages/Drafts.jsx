import MailLayout from './MailLayout'

export default function Drafts({ onCompose }) {
  return <MailLayout folder="drafts" emptyTitle="No drafts" onCompose={onCompose} />
}
