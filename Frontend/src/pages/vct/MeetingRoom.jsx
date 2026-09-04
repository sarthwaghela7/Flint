import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PreJoinScreen from '../../components/vct/PreJoinScreen'
import MeetingHeader from '../../components/vct/MeetingHeader'
import VideoGrid from '../../components/vct/VideoGrid'
import ScreenShareView from '../../components/vct/ScreenShareView'
import ControlBar from '../../components/vct/ControlBar'
import ChatPanel from '../../components/vct/ChatPanel'
import ParticipantsPanel from '../../components/vct/ParticipantsPanel'
import InviteModal from '../../components/vct/InviteModal'
import useWebRTC from '../../hooks/vct/useWebRTC'
import { joinMeeting, leaveMeeting, approveWaitingRoom } from '../../api/vct/signaling'

export default function MeetingRoom() {
  const { code } = useParams()
  const [joined, setJoined] = useState(false)
  const [participant, setParticipant] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [screenStream, setScreenStream] = useState(null)
  const [pinnedId, setPinnedId] = useState(null)
  const [panel, setPanel] = useState(null) // 'chat' | 'participants' | null
  const [showInvite, setShowInvite] = useState(true)
  const [waitingRoom, setWaitingRoom] = useState([])
  const [elapsed, setElapsed] = useState('00:00')

  const { peers, chatMessages, reactions, sendChat, sendReaction, broadcastState } = useWebRTC({
    roomId: joined ? code : null,
    participantId: participant?.id,
    localStream,
  })

  useEffect(() => {
    if (!joined) return
    const start = Date.now()
    const timer = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000)
      setElapsed(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [joined])

  useEffect(() => {
    broadcastState?.({ muted, cameraOn, speaking: false })
  }, [muted, cameraOn, broadcastState])

  const handleJoin = async ({ name, stream, muted: m, cameraOn: c }) => {
    try {
      const res = await joinMeeting(code, name)
      setParticipant({ id: res.participant_id, name, isHost: res.is_host })
      setLocalStream(stream)
      setMuted(m)
      setCameraOn(c)
      setJoined(true)
    } catch {
      // fall back to a local-only participant id if the API is unavailable
      setParticipant({ id: crypto.randomUUID(), name, isHost: false })
      setLocalStream(stream)
      setMuted(m)
      setCameraOn(c)
      setJoined(true)
    }
  }

  const leave = () => {
    if (participant) leaveMeeting(code, participant.id).catch(() => {})
    localStream?.getTracks().forEach((t) => t.stop())
    window.location.href = '/app/vct'
  }

  const toggleMic = () => {
    setMuted((v) => {
      localStream?.getAudioTracks().forEach((t) => (t.enabled = v))
      return !v
    })
  }

  const toggleCamera = () => {
    setCameraOn((v) => {
      localStream?.getVideoTracks().forEach((t) => (t.enabled = !v))
      return !v
    })
  }

  const toggleScreenShare = async () => {
    if (screenSharing) {
      screenStream?.getTracks().forEach((t) => t.stop())
      setScreenStream(null)
      setScreenSharing(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      stream.getVideoTracks()[0].onended = () => {
        setScreenSharing(false)
        setScreenStream(null)
      }
      setScreenStream(stream)
      setScreenSharing(true)
    } catch {
      // user cancelled the screen share picker
    }
  }

  const approve = async (participantId) => {
    try {
      await approveWaitingRoom(code, participantId)
    } finally {
      setWaitingRoom((prev) => prev.filter((p) => p.id !== participantId))
    }
  }

  const peerList = useMemo(
    () => Object.entries(peers).map(([id, p]) => ({ id, ...p, cameraOn: p.cameraOn ?? true })),
    [peers]
  )

  const tiles = useMemo(
    () => [
      {
        id: participant?.id || 'self',
        isSelf: true,
        name: participant?.name || 'You',
        stream: localStream,
        muted,
        cameraOn,
      },
      ...peerList,
    ],
    [participant, localStream, muted, cameraOn, peerList]
  )

  const reactionsByPeer = useMemo(() => {
    const map = {}
    reactions.forEach((r) => {
      map[r.from] = [...(map[r.from] || []), r]
    })
    return map
  }, [reactions])

  if (!joined) {
    return <PreJoinScreen meetingCode={code} onJoin={handleJoin} />
  }

  return (
    <div className="flex h-screen flex-col bg-meet text-white">
      <MeetingHeader
        title={participant?.title}
        code={code}
        elapsed={elapsed}
        participantCount={tiles.length}
        captionsOn={captionsOn}
        onToggleCaptions={() => setCaptionsOn((v) => !v)}
        onOpenChat={() => setPanel(panel === 'chat' ? null : 'chat')}
        onOpenParticipants={() => setPanel(panel === 'participants' ? null : 'participants')}
        recording={false}
      />

      <div className="flex min-h-0 flex-1">
        <div className="relative min-h-0 flex-1">
          {screenSharing ? (
            <ScreenShareView
              presenterTile={{ id: 'screen', name: participant?.name, stream: screenStream }}
              tiles={tiles}
              pinnedId={pinnedId}
              onPin={setPinnedId}
              reactionsByPeer={reactionsByPeer}
            />
          ) : (
            <VideoGrid tiles={tiles} pinnedId={pinnedId} onPin={setPinnedId} reactionsByPeer={reactionsByPeer} />
          )}

          {captionsOn && (
            <div className="pointer-events-none absolute bottom-24 left-1/2 w-full max-w-xl -translate-x-1/2 rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white">
              Live captions will appear here…
            </div>
          )}
        </div>

        <ChatPanel
          open={panel === 'chat'}
          onClose={() => setPanel(null)}
          messages={chatMessages}
          onSend={sendChat}
          selfName={participant?.name}
        />
        <ParticipantsPanel
          open={panel === 'participants'}
          onClose={() => setPanel(null)}
          participants={tiles.map((t) => ({ id: t.id, name: t.name, is_host: t.id === participant?.id && participant?.isHost }))}
          waitingRoom={waitingRoom}
          isHost={!!participant?.isHost}
          onMute={() => {}}
          onRemove={() => {}}
          onApprove={approve}
        />
      </div>

      <ControlBar
        muted={muted}
        cameraOn={cameraOn}
        screenSharing={screenSharing}
        handRaised={handRaised}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleHand={() => setHandRaised((v) => !v)}
        onReact={sendReaction}
        onLeave={leave}
        onToggleCaptions={() => setCaptionsOn((v) => !v)}
        captionsOn={captionsOn}
      />

      {showInvite && <InviteModal code={code} onClose={() => setShowInvite(false)} />}
    </div>
  )
}
