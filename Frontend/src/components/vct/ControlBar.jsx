import { useState } from 'react'

const REACTIONS = ['👍', '👏', '❤️', '😂', '🎉']

export default function ControlBar({
  muted,
  cameraOn,
  screenSharing,
  handRaised,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleHand,
  onReact,
  onLeave,
  onToggleCaptions,
  captionsOn,
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [reactOpen, setReactOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-3">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-meetpanel px-2.5 py-2 shadow-lg">
        <ControlButton active={!muted} onClick={onToggleMic} label={muted ? 'Unmute' : 'Mute'}>
          {muted ? '🔇' : '🎙️'}
        </ControlButton>
        <ControlButton active={cameraOn} onClick={onToggleCamera} label={cameraOn ? 'Turn off camera' : 'Turn on camera'}>
          {cameraOn ? '📷' : '📵'}
        </ControlButton>
        <ControlButton active={screenSharing} onClick={onToggleScreenShare} label="Present screen">
          🖥️
        </ControlButton>
        <ControlButton active={handRaised} onClick={onToggleHand} label="Raise hand">
          ✋
        </ControlButton>

        <div className="relative hidden sm:block">
          <ControlButton onClick={() => setReactOpen((v) => !v)} label="React">
            😀
          </ControlButton>
          {reactOpen && (
            <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-meetpanel p-2 shadow-lg">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onReact(emoji)
                    setReactOpen(false)
                  }}
                  className="rounded-full p-1.5 text-lg hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative hidden sm:block">
          <ControlButton onClick={() => setMoreOpen((v) => !v)} label="More options">
            ⋮
          </ControlButton>
          {moreOpen && (
            <div className="absolute bottom-14 right-0 w-44 rounded-xl bg-meetpanel p-1.5 text-sm text-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onToggleCaptions()
                  setMoreOpen(false)
                }}
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
              >
                {captionsOn ? 'Turn off captions' : 'Turn on captions'}
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onLeave}
          className="ml-1 flex h-10 items-center gap-1.5 rounded-full bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500"
        >
          Leave
        </button>
      </div>
    </div>
  )
}

function ControlButton({ active = true, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition-colors ${
        active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-600 text-white hover:bg-red-500'
      }`}
    >
      {children}
    </button>
  )
}
