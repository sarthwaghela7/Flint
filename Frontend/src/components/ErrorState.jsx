export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-medium text-accent">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-ink/10 px-4 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent"
        >
          Retry
        </button>
      )}
    </div>
  )
}
