import { useEffect, useRef } from 'react'
import { Clapperboard, Heart, MicOff, PartyPopper, Pin, Smile, ThumbsUp } from 'lucide-react'

const REACTION_ICONS = {
  'thumbs-up': ThumbsUp,
  clap: Clapperboard,
  heart: Heart,
  smile: Smile,
  party: PartyPopper,
}

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
      className={`group relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-xl bg-meetpanel transition-shadow ${
        speaking ? 'ring-2 ring-accent' : 'ring-1 ring-white/5'
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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-base font-semibold text-white">
          {initials}
        </span>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[0.7rem] text-white">
        {muted && <MicOff size={12} className="shrink-0 text-accent" aria-label="Muted" />}
        <span className="max-w-[10rem] truncate">{name}{isSelf ? ' (You)' : ''}</span>
      </div>

      {pinned && (
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-[0.65rem] text-white/80">
          <Pin size={11} /> Pinned
        </span>
      )}

      {reactions.map((r) => {
        const Icon = REACTION_ICONS[r.emoji] || Smile
        return (
          <span
            key={r.id}
            className="animate-float-up absolute bottom-10 left-1/2 -translate-x-1/2 text-accent"
          >
            <Icon size={22} />
          </span>
        )
      })}
    </div>
  )
}
