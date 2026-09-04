import { useEffect, useState } from 'react'
import { getEmail } from '../api/client'

export default function useEmailDetail(id) {
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setEmail(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getEmail(id)
      .then((data) => {
        if (!cancelled) setEmail(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load email')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return { email, loading, error }
}
