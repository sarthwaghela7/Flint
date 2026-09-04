import { useMemo, useRef, useState } from 'react'
import VideoTile from './VideoTile'
import { computeGridLayout } from '../../lib/gridLayout'

/**
 * Balanced video grid — auto-arranges any tile count into near-square
 * rows/columns. Self-view floats as a small draggable tile (bottom-right).
 */
export default function VideoGrid({ tiles, pinnedId, onPin, reactionsByPeer = {} }) {
  const self = tiles.find((t) => t.isSelf)
  const others = tiles.filter((t) => !t.isSelf)
  const { rows, cols } = useMemo(() => computeGridLayout(others.length), [others.length])

  const [pipPos, setPipPos] = useState(null) // {x, y} once dragged
  const dragRef = useRef(null)

  const startDrag = (e) => {
    const el = dragRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top
    const move = (ev) => {
      const parent = el.offsetParent?.getBoundingClientRect()
      if (!parent) return
      const x = Math.min(Math.max(ev.clientX - parent.left - startX, 0), parent.width - rect.width)
      const y = Math.min(Math.max(ev.clientY - parent.top - startY, 0), parent.height - rect.height)
      setPipPos({ x, y })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const pinned = pinnedId ? others.find((t) => t.id === pinnedId) : null
  const gridTiles = pinned ? others.filter((t) => t.id !== pinnedId) : others

  return (
    <div className="relative h-full min-h-0 p-3">
      {pinned ? (
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="min-h-0 flex-1">
            <VideoTile {...pinned} pinned onPin={() => onPin(null)} reactions={reactionsByPeer[pinned.id]} className="h-full" />
          </div>
          {gridTiles.length > 0 && (
            <div className="flex shrink-0 gap-2">
              {gridTiles.map((tile) => (
                <div key={tile.id} className="w-36 shrink-0">
                  <VideoTile {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className="grid h-full gap-2"
          style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {gridTiles.map((tile) => (
            <VideoTile key={tile.id} {...tile} onPin={() => onPin(tile.id)} reactions={reactionsByPeer[tile.id]} />
          ))}
        </div>
      )}

      {self && (
        <div
          ref={dragRef}
          onPointerDown={startDrag}
          className="absolute z-10 w-40 cursor-grab touch-none active:cursor-grabbing"
          style={pipPos ? { left: pipPos.x, top: pipPos.y } : { right: 16, bottom: 16 }}
        >
          <VideoTile {...self} reactions={reactionsByPeer[self.id]} />
        </div>
      )}
    </div>
  )
}
