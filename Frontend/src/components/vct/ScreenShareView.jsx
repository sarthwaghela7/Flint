import { MonitorUp } from 'lucide-react'
import VideoTile from './VideoTile'

export default function ScreenShareView({ presenterTile, tiles, onPin, reactionsByPeer = {} }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-3">
      {/* Shared screen — dominant, never scrolls */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black ring-1 ring-white/5">
        <video
          autoPlay
          playsInline
          ref={(el) => {
            if (el) el.srcObject = presenterTile.stream || null
          }}
          className="h-full w-full object-contain"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 text-[0.7rem] text-white">
          <MonitorUp size={12} className="text-accent" />
          {presenterTile.name} is presenting
        </div>
      </div>

      {/* Participant strip — tiles scale down, no scrolling */}
      <div className="flex h-24 shrink-0 gap-2">
        {tiles.map((tile) => (
          <div key={tile.id} className="aspect-video h-full shrink-0">
            <VideoTile {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
          </div>
        ))}
      </div>
    </div>
  )
}
