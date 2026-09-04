import { NavLink } from 'react-router-dom'
import { FOLDERS, FROM_ADDRESSES } from '../constants'

export default function Sidebar({ open, onClose, onCompose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-30 flex h-full w-64 shrink-0 flex-col gap-7 border-r border-ink/[0.08] bg-bg p-4 transition-transform md:static md:z-auto md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onCompose}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 active:scale-[0.98]"
        >
          Compose
        </button>

        <nav className="flex flex-col gap-0.5">
          {FOLDERS.map((f) => (
            <NavLink
              key={f.key}
              to={f.key === 'inbox' ? '/app' : `/app/${f.key}`}
              end={f.key === 'inbox'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-accent/10 font-semibold text-accent' : 'text-ink/65 hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {f.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink/[0.08] pt-4">
          <p className="mb-2 px-3 text-[0.65rem] font-medium uppercase tracking-wider text-ink/35">
            From addresses
          </p>
          <ul className="flex flex-col gap-0.5">
            {FROM_ADDRESSES.map((addr) => (
              <li key={addr} className="truncate rounded-lg px-3 py-1.5 text-xs text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink/80">
                {addr}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto border-t border-ink/[0.08] pt-4">
          <NavLink
            to="/app/vct"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A1F] px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors visited:text-white hover:bg-[#e6511c] active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M3 7.5C3 6.67 3.67 6 4.5 6h9A1.5 1.5 0 0 1 15 7.5v9A1.5 1.5 0 0 1 13.5 18h-9A1.5 1.5 0 0 1 3 16.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m16.5 9.6 3.3-2.1a.9.9 0 0 1 1.2.8v7.4a.9.9 0 0 1-1.2.8l-3.3-2.1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            VCT
          </NavLink>
        </div>
      </aside>
    </>
  )
}
