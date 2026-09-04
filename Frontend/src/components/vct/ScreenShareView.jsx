import VideoTile from './VideoTile'

export default function ScreenShareView({ presenterTile, tiles, pinnedId, onPin, reactionsByPeer = {} }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 sm:flex-row sm:p-4">
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-black">
        <video
          autoPlay
          playsInline
          ref={(el) => {
            if (el) el.srcObject = presenterTile.stream || null
          }}
          className="h-full w-full object-contain"
        />
        <div className="relative -mt-8 ml-2 w-fit rounded-md bg-black/45 px-2 py-1 text-xs text-white">
          {presenterTile.name} is presenting
        </div>
      </div>
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:w-52 sm:flex-col sm:overflow-y-auto sm:overflow-x-visible">
        {tiles.map((tile) => (
          <div key={tile.id} className="w-32 shrink-0 sm:w-auto">
            <VideoTile {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
          </div>
        ))}
      </div>
    </div>
  )
}
