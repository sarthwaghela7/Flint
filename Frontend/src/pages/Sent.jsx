import MailLayout from './MailLayout'

export default function Sent({ onCompose }) {
  return <MailLayout folder="sent" emptyTitle="No sent messages" onCompose={onCompose} />
}
