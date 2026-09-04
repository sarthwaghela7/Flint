import { useState } from 'react'
import { ArrowRight, ArrowUpRight, BrainCircuit, Cloud, Code2, Menu, Send, X } from 'lucide-react'
import './Core.css'

// Same-origin by default (vite dev proxy / Netlify /api rewrite); set VITE_API_URL to call the backend directly.
const API = import.meta.env.VITE_API_URL || ''

const serviceTeasers = [
  ['01', BrainCircuit, 'AI & Generative AI', 'Custom AI applications, assistants, agents, and LLM integration built around your workflows.'],
  ['02', Cloud, 'RAG, ML & Data', 'Knowledge systems, predictive models, and analytics platforms grounded in your own data.'],
  ['03', Code2, 'Software & Automation', 'Full-stack products, voice AI, and workflow automation that connect your entire stack.'],
]

const Mark = () => <span className="wordmark">flint</span>

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactStatus, setContactStatus] = useState('idle')
  const closeMenu = () => setMenuOpen(false)
  const submitContact = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    setContactStatus('sending')
    try {
      const response = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.get('name'),
          email: fields.get('email'),
          brief: fields.get('brief'),
        }),
      })
      if (!response.ok) throw new Error('Contact request failed')
      form.reset()
      setContactStatus('sent')
    } catch {
      setContactStatus('error')
    }
  }

  return <div className="core-site">
    <header className="site-header">
      <a href="#home" className="brand" onClick={closeMenu} aria-label="Flint home"><Mark /><span>Applied AI &amp; IT engineering</span></a>
      <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Primary navigation">
        <a href="#home" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="/services" onClick={closeMenu}>Services</a><a href="#contact" onClick={closeMenu}>Contact</a>
        <a href="/nest" className="app-link" onClick={closeMenu}>Nest <ArrowUpRight size={15} /></a>
      </nav>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><i /> Built for ambitious teams</p>
          <h1>We build technology that <em>moves work forward.</em></h1>
          <p className="hero-intro">Flint is an applied AI and IT engineering studio. We turn difficult business problems into clear, reliable digital systems.</p>
          <div className="hero-actions"><a className="button button-dark" href="#contact">Start a project <ArrowRight size={17} /></a><a className="text-link" href="/services">See our services <ArrowRight size={16} /></a></div>
        </div>
        <aside className="project-window" aria-label="Flint project preview">
          <div className="window-bar"><span><i /><i /><i /></span><small>FLINT / WORKSPACE</small><b>LIVE</b></div>
          <div className="window-body">
            <div className="window-title"><small>FROM COMPLEXITY</small><strong>Clear systems.<br /><em>Real progress.</em></strong></div>
            <div className="project-card">
              <div><span>01</span><small>NOW BUILDING</small></div>
              <h3>Intelligence your team can actually use.</h3>
              <div className="progress-line"><i /></div>
              <footer><span>DISCOVER</span><span>DESIGN</span><span>DELIVER</span></footer>
            </div>
          </div>
        </aside>
        <div className="hero-foot"><span>Strategy / Design / Engineering</span><span>Global delivery</span><span>Built to last</span></div>
      </section>

      <section className="section about" id="about">
        <div className="section-heading"><p className="eyebrow"><i /> 01 / About us</p><h2>Small team.<br />Serious systems.</h2></div>
        <div className="about-copy"><p className="about-lead">We bring strategy, design, and engineering together under one roof.</p><p>Flint partners with teams that need more than another slide deck. We listen closely, find the clearest path through complexity, and build the working product with you.</p><div className="about-values"><span><b>01</b> Clear thinking</span><span><b>02</b> Open collaboration</span><span><b>03</b> Durable outcomes</span></div></div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading services-heading"><div><p className="eyebrow"><i /> 02 / Our services</p><h2>One team for the whole system.</h2></div><p>From the first useful idea to the platform your team relies on every day.</p></div>
        <div className="service-grid">{serviceTeasers.map(([number, Icon, title, description]) => <article className="service-card" key={number}><div className="service-top"><span>{number}</span><Icon size={24} strokeWidth={1.7} /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        <a className="text-link services-more-link" href="/services">View the full service catalog <ArrowRight size={16} /></a>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-copy"><p className="eyebrow"><i /> 03 / Contact us</p><h2>Have a problem worth solving?</h2><p>Tell us what you are building, where things feel stuck, and what a successful outcome looks like.</p><a href="mailto:teamflint.info@gmail.com">teamflint.info@gmail.com <ArrowUpRight size={16} /></a></div>
        <form className="contact-form" onSubmit={submitContact}><label>Name<input name="name" required maxLength="100" placeholder="Your name" /></label><label>Email<input name="email" type="email" required maxLength="254" placeholder="you@company.com" /></label><label>Project brief<textarea name="brief" required minLength="10" maxLength="5000" rows="4" placeholder="A little about your project..." /></label><button className="button button-dark" type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending...' : 'Send enquiry'} <Send size={16} /></button>{contactStatus === 'sent' && <p className="form-note" role="status">Thanks — your message was sent to the Flint team.</p>}{contactStatus === 'error' && <p className="form-note form-error" role="alert">We couldn’t send your message. Please email us directly.</p>}</form>
      </section>
    </main>
    <footer className="site-footer"><Mark /><span>Applied AI &amp; IT engineering</span><span>© {new Date().getFullYear()} Flint</span></footer>
  </div>
}
