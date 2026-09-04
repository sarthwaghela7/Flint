import { useCallback, useEffect, useState } from 'react'
import { getEmails, markRead, markStar, searchEmails } from '../api/client'

export default function useEmailList(folder) {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(
    async (query) => {
      setLoading(true)
      setError(null)
      try {
        const data = query ? await searchEmails(query) : await getEmails(folder)
        setEmails(data.emails ?? data)
      } catch (err) {
        setError(err.message || 'Failed to load emails')
      } finally {
        setLoading(false)
      }
    },
    [folder]
  )

  useEffect(() => {
    load()
  }, [load])

  const toggleStar = async (id, starred) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred } : e)))
    try {
      await markStar(id, starred)
    } catch {
      setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !starred } : e)))
    }
  }

  const toggleRead = async (id, read) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read } : e)))
    try {
      await markRead(id, read)
    } catch {
      setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: !read } : e)))
    }
  }

  return { emails, loading, error, reload: load, toggleStar, toggleRead }
}
