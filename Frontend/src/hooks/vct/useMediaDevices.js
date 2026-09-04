import { useCallback, useEffect, useState } from 'react'

export default function useMediaDevices() {
  const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] })
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices()
      setDevices({
        cameras: list.filter((d) => d.kind === 'videoinput'),
        microphones: list.filter((d) => d.kind === 'audioinput'),
        speakers: list.filter((d) => d.kind === 'audiooutput'),
      })
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refresh()
    navigator.mediaDevices.addEventListener?.('devicechange', refresh)
    return () => navigator.mediaDevices.removeEventListener?.('devicechange', refresh)
  }, [refresh])

  const getStream = useCallback(async ({ cameraId, micId, video = true, audio = true } = {}) => {
    return navigator.mediaDevices.getUserMedia({
      video: video ? (cameraId ? { deviceId: { exact: cameraId } } : true) : false,
      audio: audio ? (micId ? { deviceId: { exact: micId } } : true) : false,
    })
  }, [])

  return { devices, error, refresh, getStream }
}
