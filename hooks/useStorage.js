import { useState, useEffect } from 'react'

export function useStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) setValue(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [key])

  const set = (val) => {
    setValue(val)
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  }

  return [value, set, loaded]
}
