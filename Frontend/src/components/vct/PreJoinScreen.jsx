import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Settings, Video, VideoOff } from 'lucide-react'
import useMediaDevices from '../../hooks/vct/useMediaDevices'
import DeviceMenu from './DeviceMenu'

export default function PreJoinScreen({ meetingCode, onJoin }) {
  const { devices, getStream } = useMediaDevices()
  const [stream, setStream] = useState(null)
  const [name, setName] = useState('')
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [cameraId, setCameraId] = useState('')
  const [micId, setMicId] = useState('')
  const [error, setError] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    let active = true
    getStream({ cameraId, micId })
      .then((s) => {
        if (!active) return
        setStream(s)
        setError(null)
      })
      .catch((err) => setError(err.message))
    return () => {
      active = false
      stream?.getTracks().forEach((t) => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraId, micId])

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  useEffect(() => {
    stream?.getAudioTracks().forEach((t) => (t.enabled = !muted))
  }, [muted, stream])

  useEffect(() => {
    stream?.getVideoTracks().forEach((t) => (t.enabled = cameraOn))
  }, [cameraOn, stream])

  const join = () => {
    onJoin({ name: name.trim() || 'Guest', stream, muted, cameraOn })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-ink">
      <header className="flex h-16 shrink-0 items-center px-6">
        <span className="font-logo text-sm lowercase tracking-tighter">flint</span>
        <span className="mx-3 text-xl leading-none text-ink/15">|</span>
        <span className="text-sm font-medium text-ink/60">Video conferencing</span>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center gap-10 px-6">
        {/* Camera preview — visual anchor */}
        <div className="relative w-full max-w-xl">
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-meet">
            {cameraOn && stream ? (
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full -scale-x-100 object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                {(name || 'You').slice(0, 2).toUpperCase()}
              </span>
            )}
            {error && (
              <p className="absolute inset-x-3 top-3 rounded-md bg-black/50 px-3 py-1.5 text-xs text-white">
                {error}
              </p>
            )}
          </div>

          {/* Device controls — floating beneath preview */}
          <div className="relative mt-4 flex items-center justify-center gap-2">
            <PreviewButton active={!muted} onClick={() => setMuted((v) => !v)} label={muted ? 'Unmute' : 'Mute'} danger={muted}>
              {muted ? <MicOff size={17} /> : <Mic size={17} />}
            </PreviewButton>
            <PreviewButton active={cameraOn} onClick={() => setCameraOn((v) => !v)} label={cameraOn ? 'Turn camera off' : 'Turn camera on'} danger={!cameraOn}>
              {cameraOn ? <Video size={17} /> : <VideoOff size={17} />}
            </PreviewButton>
            <PreviewButton onClick={() => setMenuOpen((v) => !v)} label="Device settings" active={menuOpen}>
              <Settings size={17} />
            </PreviewButton>
            <DeviceMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              devices={devices}
              cameraId={cameraId}
              micId={micId}
              onSelectCamera={(id) => { setCameraId(id); setMenuOpen(false) }}
              onSelectMic={(id) => { setMicId(id); setMenuOpen(false) }}
            />
          </div>
        </div>

        {/* Join column */}
        <div className="w-full max-w-xs shrink-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink/35">Meeting code</p>
          <p className="mt-1 font-mono text-sm text-ink/60">{meetingCode}</p>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="mt-6 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-sm outline-none transition-colors focus:border-accent/50"
          />

          <button
            type="button"
            onClick={join}
            className="mt-3 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join now
          </button>
          <button
            type="button"
            onClick={() => { setCameraOn(false); join() }}
            className="mt-3 w-full text-center text-xs font-medium text-ink/45 underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            Join without camera
          </button>
        </div>
      </main>
    </div>
  )
}

function PreviewButton({ active = true, danger = false, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors ${
        danger ? 'bg-accent' : active ? 'bg-meet hover:bg-meetpanel' : 'bg-meetpanel'
      }`}
    >
      {children}
    </button>
  )
}
