import { useCallback, useEffect, useRef, useState } from 'react'
import { connectSignaling } from '../../api/vct/signaling'

const ICE_SERVERS = [
  { urls: import.meta.env.VITE_STUN_URL || 'stun:stun.l.google.com:19302' },
  ...(import.meta.env.VITE_TURN_URL
    ? [
        {
          urls: import.meta.env.VITE_TURN_URL,
          username: import.meta.env.VITE_TURN_USERNAME,
          credential: import.meta.env.VITE_TURN_CREDENTIAL,
        },
      ]
    : []),
]

/**
 * Mesh P2P WebRTC for small meetings (<8 participants).
 * For larger rooms, swap this hook for an SFU (mediasoup) client — signaling
 * message shapes are designed to be forward-compatible with that upgrade.
 */
export default function useWebRTC({ roomId, participantId, localStream }) {
  const [peers, setPeers] = useState({}) // id -> { stream, name, muted, cameraOn, speaking }
  const [chatMessages, setChatMessages] = useState([])
  const [reactions, setReactions] = useState([])
  const [connected, setConnected] = useState(false)

  const signalRef = useRef(null)
  const pcsRef = useRef(new Map())

  const createPeerConnection = useCallback(
    (peerId) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

      localStream?.getTracks().forEach((track) => pc.addTrack(track, localStream))

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          signalRef.current?.send('ice-candidate', { to: peerId, candidate: event.candidate })
        }
      }

      pc.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [peerId]: { ...prev[peerId], stream: event.streams[0] },
        }))
      }

      pc.onconnectionstatechange = () => {
        if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
          removePeer(peerId)
        }
      }

      pcsRef.current.set(peerId, pc)
      return pc
    },
    [localStream]
  )

  const removePeer = (peerId) => {
    pcsRef.current.get(peerId)?.close()
    pcsRef.current.delete(peerId)
    setPeers((prev) => {
      const next = { ...prev }
      delete next[peerId]
      return next
    })
  }

  useEffect(() => {
    if (!roomId || !participantId) return
    const signal = connectSignaling(roomId, participantId)
    signalRef.current = signal

    signal.socket.onopen = () => setConnected(true)
    signal.socket.onclose = () => setConnected(false)

    const offListeners = [
      signal.on('peer-joined', async ({ peerId, name }) => {
        setPeers((prev) => ({ ...prev, [peerId]: { ...prev[peerId], name } }))
        const pc = createPeerConnection(peerId)
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        signal.send('offer', { to: peerId, sdp: offer })
      }),

      signal.on('offer', async ({ from, sdp, name }) => {
        setPeers((prev) => ({ ...prev, [from]: { ...prev[from], name } }))
        const pc = createPeerConnection(from)
        await pc.setRemoteDescription(new RTCSessionDescription(sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        signal.send('answer', { to: from, sdp: answer })
      }),

      signal.on('answer', async ({ from, sdp }) => {
        await pcsRef.current.get(from)?.setRemoteDescription(new RTCSessionDescription(sdp))
      }),

      signal.on('ice-candidate', async ({ from, candidate }) => {
        try {
          await pcsRef.current.get(from)?.addIceCandidate(new RTCIceCandidate(candidate))
        } catch {
          // candidate arrived before remote description was set; safe to ignore
        }
      }),

      signal.on('peer-left', ({ peerId }) => removePeer(peerId)),

      signal.on('chat', (msg) => setChatMessages((prev) => [...prev, msg])),

      signal.on('reaction', (msg) => {
        const reactionId = `${msg.from}-${Date.now()}`
        setReactions((prev) => [...prev, { ...msg, id: reactionId }])
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== reactionId))
        }, 1600)
      }),

      signal.on('peer-state', ({ peerId, muted, cameraOn, speaking }) => {
        setPeers((prev) => ({
          ...prev,
          [peerId]: { ...prev[peerId], muted, cameraOn, speaking },
        }))
      }),
    ]

    return () => {
      offListeners.forEach((off) => off())
      signal.close()
      pcsRef.current.forEach((pc) => pc.close())
      pcsRef.current.clear()
    }
  }, [roomId, participantId, createPeerConnection])

  const sendChat = useCallback((text) => {
    signalRef.current?.send('chat', { text })
  }, [])

  const sendReaction = useCallback((emoji) => {
    signalRef.current?.send('reaction', { emoji })
  }, [])

  const broadcastState = useCallback((state) => {
    signalRef.current?.send('peer-state', state)
  }, [])

  return { peers, chatMessages, reactions, connected, sendChat, sendReaction, broadcastState }
}
