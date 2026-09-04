export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-accent" />
      <p className="text-sm text-ink/40">{label}</p>
    </div>
  )
}
