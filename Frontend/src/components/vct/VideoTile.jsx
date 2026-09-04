import { useEffect, useRef } from 'react'

export default function VideoTile({
  stream,
  name = 'Guest',
  muted = false,
  cameraOn = true,
  speaking = false,
  isSelf = false,
  pinned = false,
  onPin,
  reactions = [],
  className = '',
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream || null
  }, [stream])

  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div
      onClick={onPin}
      className={`group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-meetpanel ring-2 transition-all ${
        speaking ? 'ring-accent' : 'ring-transparent'
      } ${onPin ? 'cursor-pointer' : ''} ${className}`}
    >
      {cameraOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf}
          className="h-full w-full -scale-x-100 object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/40 text-lg font-semibold text-white">
          {initials}
        </span>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 text-xs text-white">
        {muted && <span aria-label="muted">🔇</span>}
        <span className="max-w-[10rem] truncate">{name}{isSelf ? ' (You)' : ''}</span>
      </div>

      {pinned && (
        <span className="absolute right-2 top-2 rounded-md bg-black/45 px-2 py-0.5 text-[0.65rem] text-white">
          Pinned
        </span>
      )}

      {reactions.map((r) => (
        <span
          key={r.id}
          className="animate-float-up absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl"
        >
          {r.emoji}
        </span>
      ))}
    </div>
  )
}
