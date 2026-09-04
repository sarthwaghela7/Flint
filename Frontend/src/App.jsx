import { useState } from 'react'
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ComposeModal from './components/ComposeModal'
import Inbox from './pages/Inbox'
import Sent from './pages/Sent'
import Drafts from './pages/Drafts'
import Starred from './pages/Starred'
import SearchResults from './pages/SearchResults'
import VctLobby from './pages/vct/Lobby'
import VctMeetingRoom from './pages/vct/MeetingRoom'
import PortfolioHome from './portfolio/Home'
import ServicesPage from './portfolio/ServicesPage'
import NestLogin from './portfolio/NestLogin'
import { sendEmail } from './api/client'

function MailApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [composeDraft, setComposeDraft] = useState(null)
  const navigate = useNavigate()

  const openCompose = (draft = {}) => setComposeDraft(draft)
  const closeCompose = () => setComposeDraft(null)
  const handleSend = (payload) => sendEmail(payload)
  const handleSearch = (q) => navigate(`/app/search?q=${encodeURIComponent(q)}`)

  return (
    <div className="flex h-screen flex-col bg-bg text-ink font-body">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} onSearch={handleSearch} />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onCompose={() => openCompose()} />
        <main className="min-h-0 flex-1">
          <Routes>
            <Route path="/app" element={<Inbox onCompose={openCompose} />} />
            <Route path="/app/:id" element={<Inbox onCompose={openCompose} />} />
            <Route path="/app/sent" element={<Sent onCompose={openCompose} />} />
            <Route path="/app/sent/:id" element={<Sent onCompose={openCompose} />} />
            <Route path="/app/drafts" element={<Drafts onCompose={openCompose} />} />
            <Route path="/app/drafts/:id" element={<Drafts onCompose={openCompose} />} />
            <Route path="/app/starred" element={<Starred onCompose={openCompose} />} />
            <Route path="/app/starred/:id" element={<Starred onCompose={openCompose} />} />
            <Route path="/app/search" element={<SearchResults onCompose={openCompose} />} />
            <Route path="/app/search/:id" element={<SearchResults onCompose={openCompose} />} />
          </Routes>
        </main>
      </div>

      {composeDraft && (
        <ComposeModal initial={composeDraft} onClose={closeCompose} onSend={handleSend} />
      )}
    </div>
  )
}

function RequireAuth({ children }) {
  // Rule-based gate (frontend-only). NestLogin sets the flag on success.
  if (sessionStorage.getItem('nest-auth') !== 'ok') {
    return <Navigate to="/nest" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHome />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/nest" element={<NestLogin />} />
      <Route path="/app/vct" element={<VctLobby />} />
      <Route path="/app/vct/join/:code" element={<VctMeetingRoom />} />
      <Route path="/app/*" element={<RequireAuth><MailApp /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App


