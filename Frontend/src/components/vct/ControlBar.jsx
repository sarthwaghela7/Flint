import { useEffect, useRef, useState } from 'react'
import {
  Captions, CircleDot, Clapperboard, Heart, MessageSquare, Mic, MicOff,
  MoreVertical, PartyPopper, PhoneOff, ScreenShare, Smile, ThumbsUp, Users,
  Video, VideoOff,
} from 'lucide-react'

const REACTION_ICONS = {
  'thumbs-up': ThumbsUp,
  clap: Clapperboard,
  heart: Heart,
  smile: Smile,
  party: PartyPopper,
}
const REACTION_IDS = Object.keys(REACTION_ICONS)

export default function ControlBar({
  muted,
  cameraOn,
  screenSharing,
  recording = false,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecord,
  onToggleChat,
  onToggleParticipants,
  onToggleCaptions,
  captionsOn,
  onReact,
  onLeave,
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [reactOpen, setReactOpen] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    if (!moreOpen && !reactOpen) return
    const onDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setMoreOpen(false)
        setReactOpen(false)
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [moreOpen, reactOpen])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-3">
      <div ref={barRef} className="pointer-events-auto flex items-center gap-1 rounded-full bg-meetpanel px-2 py-2 shadow-xl ring-1 ring-white/10">
        <ControlButton onClick={onToggleMic} label={muted ? 'Unmute microphone' : 'Mute microphone'} off={muted}>
          {muted ? <MicOff size={17} /> : <Mic size={17} />}
        </ControlButton>
        <ControlButton onClick={onToggleCamera} label={cameraOn ? 'Turn camera off' : 'Turn camera on'} off={!cameraOn}>
          {cameraOn ? <Video size={17} /> : <VideoOff size={17} />}
        </ControlButton>
        <ControlButton onClick={onToggleScreenShare} label={screenSharing ? 'Stop presenting' : 'Present screen'} active={screenSharing}>
          <ScreenShare size={17} />
        </ControlButton>
        <ControlButton onClick={onToggleRecord} label={recording ? 'Stop recording' : 'Record meeting'} active={recording}>
          <CircleDot size={17} />
        </ControlButton>
        <ControlButton onClick={onToggleChat} label="In-call messages">
          <MessageSquare size={17} />
        </ControlButton>
        <ControlButton onClick={onToggleParticipants} label="Participants">
          <Users size={17} />
        </ControlButton>

        <div className="relative">
          <ControlButton onClick={() => { setReactOpen((v) => !v); setMoreOpen(false) }} label="Send a reaction" active={reactOpen}>
            <Smile size={17} />
          </ControlButton>
          {reactOpen && (
            <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-meetpanel p-1.5 shadow-xl ring-1 ring-white/10">
              {REACTION_IDS.map((id) => {
                const Icon = REACTION_ICONS[id]
                return (
                  <button
                    key={id}
                    type="button"
                    title={id}
                    aria-label={id}
                    onClick={() => { onReact(id); setReactOpen(false) }}
                    className="rounded-full p-2 text-white/70 transition-colors hover:bg-accent/15 hover:text-accent"
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <ControlButton onClick={() => { setMoreOpen((v) => !v); setReactOpen(false) }} label="More options" active={moreOpen}>
            <MoreVertical size={17} />
          </ControlButton>
          {moreOpen && (
            <div className="absolute bottom-14 right-0 w-48 rounded-xl bg-meetpanel p-1.5 text-sm text-white shadow-xl ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => { onToggleCaptions(); setMoreOpen(false) }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-white/80 transition-colors hover:bg-white/10"
              >
                <Captions size={15} /> {captionsOn ? 'Hide captions' : 'Show captions'}
              </button>
            </div>
          )}
        </div>

        <div className="mx-1 h-6 w-px bg-white/10" />

        <button
          type="button"
          onClick={onLeave}
          title="Leave call"
          aria-label="Leave call"
          className="flex h-10 w-14 items-center justify-center rounded-full bg-accent text-white transition-opacity hover:opacity-90"
        >
          <PhoneOff size={17} />
        </button>
      </div>
    </div>
  )
}

function ControlButton({ active = false, off = false, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-accent/20 text-accent'
          : off
            ? 'bg-white/5 text-white/50'
            : 'text-white/80 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}
