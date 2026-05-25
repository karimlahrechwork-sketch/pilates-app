import { useState, useEffect, useCallback } from 'react'
import '../styles/globals.css'
import AmbientPlayer from '../components/AmbientPlayer'
import MilestoneCelebration from '../components/MilestoneCelebration'
import Nav from '../components/Nav'
import { checkNewMilestones } from '../data/milestones'

function getStreak(logs) {
  if (!logs.length) return 0
  const days = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  let cursor = today
  for (const day of days) {
    if (day === cursor) {
      streak++
      const d = new Date(cursor)
      d.setDate(d.getDate() - 1)
      cursor = d.toISOString().split('T')[0]
    } else break
  }
  return streak
}

function loadStored(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function saveStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export default function App({ Component, pageProps }) {
  const [celebration, setCelebration] = useState(null)
  const [celebrationQueue, setCelebrationQueue] = useState([])
  const [earnedIds, setEarnedIds] = useState([])
  const [newCount, setNewCount] = useState(0)

  // Load earned milestones on mount
  useEffect(() => {
    setEarnedIds(loadStored('pilates-earned-milestones', []))
  }, [])

  // Check milestones whenever logs change (listen via storage event + interval)
  const checkMilestones = useCallback(() => {
    const logs = loadStored('pilates-logs', [])
    const earned = loadStored('pilates-earned-milestones', [])
    const streak = getStreak(logs)
    const newOnes = checkNewMilestones(streak, earned)

    if (newOnes.length > 0) {
      const updatedEarned = [...earned, ...newOnes.map(m => m.id)]
      saveStored('pilates-earned-milestones', updatedEarned)
      setEarnedIds(updatedEarned)
      setNewCount(c => c + newOnes.length)
      setCelebrationQueue(q => [...q, ...newOnes])
    }
  }, [])

  // Show next celebration from queue
  useEffect(() => {
    if (!celebration && celebrationQueue.length > 0) {
      const [next, ...rest] = celebrationQueue
      setCelebration(next)
      setCelebrationQueue(rest)
    }
  }, [celebration, celebrationQueue])

  // Poll for log changes (covers same-tab updates)
  useEffect(() => {
    checkMilestones()
    const id = setInterval(checkMilestones, 3000)
    return () => clearInterval(id)
  }, [checkMilestones])

  // Also catch cross-tab storage changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'pilates-logs') checkMilestones()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [checkMilestones])

  const handleCloseCelebration = () => {
    setCelebration(null)
    setNewCount(0)
  }

  return (
    <>
      <Component {...pageProps} />
      <AmbientPlayer />
      <MilestoneCelebration milestone={celebration} onClose={handleCloseCelebration} />
    </>
  )
}
