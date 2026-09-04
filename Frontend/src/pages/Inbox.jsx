import MailLayout from './MailLayout'

export default function Inbox({ onCompose }) {
  return <MailLayout folder="inbox" emptyTitle="Inbox zero" onCompose={onCompose} />
}
