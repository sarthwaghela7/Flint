export default function EmptyState({ title = 'Nothing here', subtitle }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-8 text-center">
      <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.05] text-lg text-ink/25">
        ✉
      </span>
      <p className="text-sm font-semibold text-ink/70">{title}</p>
      {subtitle && <p className="text-xs text-ink/40">{subtitle}</p>}
    </div>
  )
}
