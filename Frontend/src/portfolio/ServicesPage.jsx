import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, BarChart3, BrainCircuit, Code2, Database, Menu, Mic, Search, Workflow, X } from 'lucide-react'
import './Core.css'
import './ServicesPage.css'

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const categories = [
  {
    name: 'AI & Generative AI',
    icon: BrainCircuit,
    blurb: 'Applications, assistants, and agents built on top of modern language models.',
    services: [
      { title: 'Custom AI Applications', desc: 'Purpose-built AI products designed around specific business workflows, data, and requirements.', highlights: ['Workflow-specific design', 'Built on your own data', 'Production-ready delivery'] },
      { title: 'AI Assistants & Copilots', desc: 'Intelligent assistants that can interact with company data, tools, APIs, and internal systems.', highlights: ['Connects to internal tools', 'Context-aware answers', 'Secure data access'] },
      { title: 'AI Agents', desc: 'Autonomous systems that can reason, make decisions, use tools, and execute multi-step business tasks.', highlights: ['Multi-step reasoning', 'Tool & API use', 'Autonomous execution'] },
      { title: 'LLM Integration', desc: 'Integration of OpenAI, Anthropic, Gemini, Mistral, and open-source models into existing products.', highlights: ['Model-agnostic setup', 'Existing product integration', 'Open-source options'] },
    ],
  },
  {
    name: 'RAG & Knowledge Systems',
    icon: Search,
    blurb: 'Search and question-answering systems grounded in your own documents and data.',
    services: [
      { title: 'Enterprise RAG Systems', desc: "Private AI search and question-answering systems built around a company's internal documents and knowledge.", highlights: ['Private, secure search', 'Company knowledge base', 'Grounded answers'] },
      { title: 'Legal & Case Research AI', desc: 'Systems for searching judgments, laws, case files, and internal legal documents with contextual answers and citations.', highlights: ['Case & statute search', 'Citation-backed answers', 'Legal document parsing'] },
      { title: 'Semantic & Hybrid Search', desc: 'Combines keyword, semantic, vector, and reranking techniques to deliver highly relevant results.', highlights: ['Vector & keyword hybrid', 'Reranking for relevance', 'Fast, accurate retrieval'] },
      { title: 'Document Intelligence', desc: 'Extract, classify, summarize, and analyze information from large collections of business documents.', highlights: ['Bulk document extraction', 'Auto classification', 'Summarization at scale'] },
    ],
  },
  {
    name: 'Machine Learning & Data Science',
    icon: BarChart3,
    blurb: 'Predictive models and data science solutions trained on real business signals.',
    services: [
      { title: 'Predictive Analytics', desc: 'ML models that forecast outcomes such as sales, demand, customer behavior, or business performance.', highlights: ['Demand & sales forecasting', 'Customer behavior models', 'Performance forecasting'] },
      { title: 'Classification & Prediction', desc: 'Models that automatically categorize data, leads, documents, conversations, and other business information.', highlights: ['Automated categorization', 'Lead & document scoring', 'Conversation tagging'] },
      { title: 'Recommendation Systems', desc: 'Personalized recommendations based on user behavior, historical data, and business objectives.', highlights: ['Personalized suggestions', 'Behavior-based ranking', 'Business-goal aligned'] },
      { title: 'Anomaly & Pattern Detection', desc: 'ML systems that identify unusual activity, trends, and hidden patterns in large datasets.', highlights: ['Outlier & fraud detection', 'Trend discovery', 'Large-dataset analysis'] },
      { title: 'NLP & Text Intelligence', desc: 'Machine-learning solutions for text classification, sentiment, extraction, similarity, and language understanding.', highlights: ['Sentiment & classification', 'Entity extraction', 'Text similarity search'] },
      { title: 'Custom ML Models', desc: 'End-to-end development, training, evaluation, and deployment of models for specific business problems.', highlights: ['Custom model training', 'Evaluation & tuning', 'Production deployment'] },
    ],
  },
  {
    name: 'Voice & Conversational AI',
    icon: Mic,
    blurb: 'Voice agents and calling platforms that hold natural, useful conversations.',
    services: [
      { title: 'AI Voice Agents', desc: 'AI-powered agents capable of conducting natural conversations over phone calls.', highlights: ['Natural phone conversations', 'Real-time responses', 'Custom voice personas'] },
      { title: 'AI Calling Platforms', desc: 'Complete outbound calling systems with calling, recording, transcription, analysis, and dashboards.', highlights: ['Outbound calling at scale', 'Recording & transcription', 'Analytics dashboards'] },
      { title: 'Speech-to-Text Systems', desc: 'Convert conversations and recordings into searchable and structured text.', highlights: ['Accurate transcription', 'Searchable transcripts', 'Structured output'] },
      { title: 'Call Intelligence', desc: 'Automatically analyze conversations for quality, intent, sentiment, outcomes, and actionable insights.', highlights: ['Quality & intent analysis', 'Sentiment tracking', 'Actionable insights'] },
    ],
  },
  {
    name: 'Custom Software Development',
    icon: Code2,
    blurb: 'Web, mobile, and backend platforms engineered around your workflows.',
    services: [
      { title: 'Web Applications', desc: 'Complete web platforms including frontend, backend, databases, authentication, and deployment.', highlights: ['Full-stack build', 'Authentication & security', 'Deployment included'] },
      { title: 'Mobile Applications', desc: 'Custom Android and iOS applications connected to APIs, databases, and AI services.', highlights: ['Android & iOS', 'API-connected', 'AI-service ready'] },
      { title: 'Business Management Systems', desc: 'Internal platforms for CRM, leads, operations, reporting, workflows, and business processes.', highlights: ['CRM & lead tracking', 'Operations & reporting', 'Workflow automation'] },
      { title: 'Custom Backend & APIs', desc: 'Scalable backend infrastructure, REST APIs, databases, integrations, and background processing.', highlights: ['Scalable infrastructure', 'REST API design', 'Background processing'] },
    ],
  },
  {
    name: 'Data & Analytics',
    icon: Database,
    blurb: 'Dashboards, pipelines, and platforms that turn raw data into decisions.',
    services: [
      { title: 'Business Intelligence Dashboards', desc: 'Interactive dashboards that turn operational data into understandable business insights.', highlights: ['Interactive visualizations', 'Real-time metrics', 'Decision-ready insights'] },
      { title: 'Data Processing Pipelines', desc: 'Automated systems for collecting, cleaning, transforming, and processing large datasets.', highlights: ['Automated ingestion', 'Cleaning & transformation', 'Large-scale processing'] },
      { title: 'Natural Language Data Querying', desc: 'Allow users to ask questions about business databases using natural language.', highlights: ['Plain-language queries', 'Database-connected', 'Instant answers'] },
      { title: 'Data Analytics Platforms', desc: 'Custom systems combining databases, analytics, ML, and visualization into one platform.', highlights: ['Unified data platform', 'ML-powered analytics', 'Custom visualization'] },
    ],
  },
  {
    name: 'Automation & AI Integration',
    icon: Workflow,
    blurb: 'Automated workflows and integrations that connect your tools and AI services.',
    services: [
      { title: 'Business Process Automation', desc: 'Automate repetitive workflows by connecting applications, APIs, databases, and AI.', highlights: ['Workflow automation', 'App & API connections', 'Reduced manual work'] },
      { title: 'AI Workflow Automation', desc: 'Build workflows where AI performs tasks such as analysis, classification, extraction, and decision support.', highlights: ['AI-driven task execution', 'Classification & extraction', 'Decision support'] },
      { title: 'Third-Party Integrations', desc: 'Connect existing business software, APIs, communication platforms, databases, and AI services.', highlights: ['Software & API connections', 'Communication platforms', 'AI-service integration'] },
      { title: 'AI Transformation & Consulting', desc: 'Identify practical opportunities to introduce AI and build production-ready solutions.', highlights: ['Opportunity assessment', 'Practical AI roadmap', 'Production-ready builds'] },
    ],
  },
]

const Mark = () => <span className="wordmark">flint</span>

export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0].name)
  const closeMenu = () => setMenuOpen(false)
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="core-site services-page">
      <header className="site-header">
        <a href="/" className="brand" onClick={closeMenu} aria-label="Flint home"><Mark /><span>Applied AI &amp; IT engineering</span></a>
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Primary navigation">
          <a href="/#home" onClick={closeMenu}>Home</a><a href="/#about" onClick={closeMenu}>About</a><a href="/services" onClick={closeMenu}>Services</a><a href="/#contact" onClick={closeMenu}>Contact</a>
          <a href="/nest" className="app-link" onClick={closeMenu}>Nest <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>

      <main>
        <section className="services-hero">
          <a className="back-link" href="/"><ArrowLeft size={15} /> Back to home</a>
          <p className="eyebrow"><i /> Service catalog</p>
          <h1>Everything we build, organized by discipline.</h1>
          <p className="services-hero-copy">Seven areas of work, one delivery team. Explore what we can build for you — from AI agents to full-stack platforms.</p>
          <div className="services-stats">
            <div><b>07</b><span>Categories</span></div>
            <div><b>28+</b><span>Services</span></div>
            <div><b>01</b><span>Delivery team</span></div>
          </div>
        </section>

        <nav className="category-nav" aria-label="Jump to category">
          <div className="category-nav-scroll">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <a
                  key={category.name}
                  href={`#${slugify(category.name)}`}
                  className={category.name === activeCategory ? 'category-pill active' : 'category-pill'}
                >
                  <Icon size={14} strokeWidth={1.8} />{category.name}
                </a>
              )
            })}
          </div>
        </nav>

        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <section
              className="services-category"
              id={slugify(category.name)}
              key={category.name}
              data-category={category.name}
              ref={(el) => { sectionRefs.current[category.name] = el }}
            >
              <div className="category-head">
                <span className="category-icon"><Icon size={22} strokeWidth={1.7} /></span>
                <span className="category-index">{String(index + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}</span>
                <h2>{category.name}</h2>
                <p>{category.blurb}</p>
              </div>
              <div className="services-grid">
                {category.services.map((service, serviceIndex) => (
                  <article className="services-card" key={service.title}>
                    <span className="card-index">{String(serviceIndex + 1).padStart(2, '0')}</span>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <div className="card-tags">
                      {service.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="services-cta">
          <h2>Have a project in mind?</h2>
          <p>Tell us what you're building and we'll help you scope it.</p>
          <a className="button button-dark" href="/#contact">Start a project</a>
        </section>
      </main>

      <footer className="site-footer"><Mark /><span>Applied AI &amp; IT engineering</span><span>© {new Date().getFullYear()} Flint</span></footer>
    </div>
  )
}
