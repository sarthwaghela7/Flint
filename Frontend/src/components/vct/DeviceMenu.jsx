import { useEffect, useRef } from 'react'
import { Check, Mic, Video } from 'lucide-react'

/**
 * Compact device-selection popover for the lobby preview.
 * Anchored above the trigger; does not push the layout.
 */
export default function DeviceMenu({ open, onClose, devices, cameraId, micId, onSelectCamera, onSelectMic }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open, onClose])

  if (!open) return null

  const section = (title, Icon, items, current, onSelect) => (
    <div>
      <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-white/40">
        <Icon size={12} /> {title}
      </p>
      {items.length === 0 && <p className="px-3 py-1 text-xs text-white/35">Default</p>}
      {items.map((d) => (
        <button
          key={d.deviceId}
          type="button"
          onClick={() => onSelect(d.deviceId)}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-white/80 hover:bg-white/10"
        >
          <span className="truncate">{d.label || title}</span>
          {d.deviceId === current && <Check size={13} className="shrink-0 text-accent" />}
        </button>
      ))}
    </div>
  )

  return (
    <div
      ref={ref}
      className="absolute bottom-14 left-1/2 z-30 w-64 -translate-x-1/2 rounded-xl bg-meetpanel p-1.5 shadow-xl ring-1 ring-white/10"
      role="menu"
    >
      {section('Camera', Video, devices.cameras, cameraId, onSelectCamera)}
      <div className="mx-2 my-1 h-px bg-white/10" />
      {section('Microphone', Mic, devices.microphones, micId, onSelectMic)}
    </div>
  )
}
