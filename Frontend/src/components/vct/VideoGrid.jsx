import VideoTile from './VideoTile'

function gridClass(count) {
  if (count <= 1) return 'grid-cols-1'
  if (count <= 2) return 'grid-cols-2'
  if (count <= 4) return 'grid-cols-2'
  if (count <= 9) return 'grid-cols-3'
  return 'grid-cols-4'
}

export default function VideoGrid({ tiles, pinnedId, onPin, reactionsByPeer = {} }) {
  const pinned = pinnedId ? tiles.find((t) => t.id === pinnedId) : null
  const rest = pinned ? tiles.filter((t) => t.id !== pinnedId) : tiles

  if (pinned) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3 p-4">
        <div className="min-h-0 flex-1">
          <VideoTile {...pinned} onPin={() => onPin(null)} pinned reactions={reactionsByPeer[pinned.id]} className="h-full" />
        </div>
        {rest.length > 0 && (
          <div className="flex shrink-0 gap-3 overflow-x-auto pb-1">
            {rest.map((tile) => (
              <div key={tile.id} className="w-40 shrink-0">
                <VideoTile {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`grid h-full auto-rows-fr ${gridClass(tiles.length)} gap-3 p-4`}>
      {tiles.map((tile) => (
        <VideoTile key={tile.id} {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
      ))}
    </div>
  )
}
