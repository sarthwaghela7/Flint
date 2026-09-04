const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || `${location.origin.replace(/^http/, 'ws')}/ws`

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  })
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.detail || 'Request failed')
  return res.json()
}

export const createMeeting = (title) =>
  request('/meetings/create', { method: 'POST', body: JSON.stringify({ title }) })

export const getMeeting = (code) => request(`/meetings/${code}`)

export const joinMeeting = (code, name) =>
  request(`/meetings/${code}/join`, { method: 'POST', body: JSON.stringify({ name }) })

export const leaveMeeting = (code, participantId) =>
  request(`/meetings/${code}/leave`, { method: 'POST', body: JSON.stringify({ participant_id: participantId }) })

export const approveWaitingRoom = (code, participantId) =>
  request(`/meetings/${code}/waiting-room/approve`, {
    method: 'POST',
    body: JSON.stringify({ participant_id: participantId }),
  })

/** Thin wrapper around the signaling WebSocket: offer/answer/ICE, presence, chat, reactions. */
export function connectSignaling(roomId, participantId) {
  const socket = new WebSocket(`${WS_BASE}/signaling/${roomId}?participant_id=${participantId}`)

  const listeners = new Map()

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    listeners.get(msg.type)?.forEach((fn) => fn(msg))
  }

  return {
    socket,
    on(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type).add(fn)
      return () => listeners.get(type)?.delete(fn)
    },
    send(type, payload) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, ...payload }))
      }
    },
    close() {
      socket.close()
    },
  }
}
