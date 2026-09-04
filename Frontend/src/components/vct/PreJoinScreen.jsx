import { useEffect, useRef, useState } from 'react'
import useMediaDevices from '../../hooks/vct/useMediaDevices'

export default function PreJoinScreen({ meetingCode, onJoin }) {
  const { devices, getStream } = useMediaDevices()
  const [stream, setStream] = useState(null)
  const [name, setName] = useState('')
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [cameraId, setCameraId] = useState('')
  const [micId, setMicId] = useState('')
  const [error, setError] = useState(null)
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 py-10 text-ink">
      <div className="flex items-baseline gap-3">
        <span className="font-logo text-xl lowercase tracking-tighter">flint</span>
        <span className="text-2xl text-ink/15">|</span>
        <span className="text-2xl font-medium">VCT</span>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-6 md:flex-row">
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-meet md:w-2/3">
          {cameraOn && stream ? (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full -scale-x-100 object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
              {(name || 'You').slice(0, 2).toUpperCase()}
            </span>
          )}
          {error && (
            <p className="absolute bottom-3 left-3 right-3 rounded-md bg-black/50 px-3 py-1.5 text-xs text-white">
              {error}
            </p>
          )}

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${muted ? 'bg-red-600' : 'bg-white/15'} text-white`}
            >
              {muted ? '🔇' : '🎙️'}
            </button>
            <button
              type="button"
              onClick={() => setCameraOn((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${!cameraOn ? 'bg-red-600' : 'bg-white/15'} text-white`}
            >
              {cameraOn ? '📷' : '📵'}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-3 md:w-1/3">
          <h1 className="text-lg font-semibold">Ready to join?</h1>
          {meetingCode && <p className="text-sm text-ink/50">Meeting code: {meetingCode}</p>}

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
          />

          <select
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none focus:border-accent/40"
          >
            <option value="">Default camera</option>
            {devices.cameras.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || 'Camera'}
              </option>
            ))}
          </select>

          <select
            value={micId}
            onChange={(e) => setMicId(e.target.value)}
            className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm outline-none focus:border-accent/40"
          >
            <option value="">Default microphone</option>
            {devices.microphones.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || 'Microphone'}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={join}
            className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
          >
            Join now
          </button>
        </div>
      </div>
    </div>
  )
}
