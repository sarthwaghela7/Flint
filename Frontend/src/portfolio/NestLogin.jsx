import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import './Core.css'
import './NestLogin.css'

// Rule-based access — validated in the frontend only (no backend auth yet).
const NEST_EMAIL = 'sarthwaghela7@gmail.com'
const NEST_PASSWORD = '#Trisha8928'

const Mark = () => <span className="wordmark">flint</span>

export default function NestLogin() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (sessionStorage.getItem('nest-auth') === 'ok') {
    return <Navigate to="/app" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const email = String(fields.get('email') || '').trim().toLowerCase()
    const password = String(fields.get('password') || '')

    if (email === NEST_EMAIL && password === NEST_PASSWORD) {
      sessionStorage.setItem('nest-auth', 'ok')
      navigate('/app')
      return
    }
    setError('Invalid email or password. Nest is restricted to the Flint team.')
  }

  return (
    <div className="core-site nest-login">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Flint home"><Mark /><span>Nest team sign in</span></Link>
        <Link className="text-link" to="/"><ArrowLeft size={15} /> Back to site</Link>
      </header>

      <main className="nest-login-main">
        <section className="nest-login-card" aria-label="Nest sign in">
          <p className="eyebrow"><i /> Flint Nest</p>
          <h1>Sign in to <em>Nest.</em></h1>
          <p className="nest-login-intro">Team access only. Sign in to open mail, meetings and the Flint workspace.</p>
          <form className="contact-form nest-login-form" onSubmit={handleSubmit}>
            <label>Email<input name="email" type="email" required autoComplete="username" placeholder="you@teamflint.in" /></label>
            <label>Password<input name="password" type="password" required autoComplete="current-password" placeholder="Your password" /></label>
            <button className="button button-dark" type="submit">Sign in <ArrowRight size={16} /></button>
            {error && <p className="form-note form-error" role="alert">{error}</p>}
          </form>
          <p className="nest-login-note"><Lock size={12} /> Access is limited to authorized Flint accounts</p>
        </section>
      </main>
    </div>
  )
}
