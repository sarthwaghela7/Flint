/**
 * Balanced grid layout for the video grid.
 * Picks rows/columns that are as close to square as possible for the
 * given tile count, minimizing empty cells. No per-count hardcoding.
 */
export function computeGridLayout(count) {
  const n = Math.max(1, count)
  let best = { rows: 1, cols: n }
  let bestScore = Infinity
  for (let rows = 1; rows <= Math.ceil(Math.sqrt(n)); rows++) {
    const cols = Math.ceil(n / rows)
    const empty = rows * cols - n
    const balance = Math.abs(cols - rows)
    const score = empty * 2 + balance
    if (score < bestScore) {
      bestScore = score
      best = { rows, cols }
    }
  }
  return best
}

/**
 * Icon-based reaction set — identifiers map to lucide icons in the UI layer.
 */
export const REACTIONS = [
  { id: 'thumbs-up', label: 'Thumbs up' },
  { id: 'clap', label: 'Applause' },
  { id: 'heart', label: 'Heart' },
  { id: 'smile', label: 'Smile' },
  { id: 'party', label: 'Celebrate' },
]
