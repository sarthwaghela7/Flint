import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Header({ onMenuClick, onSearch }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-5 border-b border-ink/[0.08] bg-bg/80 px-5 backdrop-blur-sm">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-ink/60 transition-colors hover:bg-ink/5 hover:text-accent md:hidden"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <NavLink to="/app" className="flex shrink-0 items-baseline gap-3">
        <span className="font-logo text-xl leading-none tracking-tighter lowercase text-ink translate-y-1">flint</span>
        <span className="font-body text-2xl leading-none text-ink/15">|</span>
        <span className="font-body text-2xl leading-none font-medium tracking-normal text-ink translate-y-[1.2px]">Nest</span>
      </NavLink>
      <div className="hidden flex-1 justify-center md:flex">
        <SearchBar onSearch={onSearch} />
      </div>
      <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-bg">
          CF
        </span>
      </div>
    </header>
  )
}
