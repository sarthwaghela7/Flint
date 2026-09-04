import MailLayout from './MailLayout'

export default function Starred({ onCompose }) {
  return <MailLayout folder="starred" emptyTitle="No starred messages" onCompose={onCompose} />
}
