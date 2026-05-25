import Head from 'next/head'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useStorage } from '../hooks/useStorage'
import { exercises } from '../data/exercises'
import styles from '../styles/Progress.module.css'

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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Progress() {
  const [logs, setLogs] = useStorage('pilates-logs', [])
  const [userName, setUserName] = useStorage('pilates-name', '')
  const [nameInput, setNameInput] = useState('')
  const [editingName, setEditingName] = useState(false)

  const streak = getStreak(logs)
  const totalSessions = [...new Set(logs.map(l => l.date))].length
  const totalMins = logs.reduce((s, l) => s + (l.duration || 0), 0)

  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 27 + i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLogs = logs.filter(l => l.date === dateStr)
    const mins = dayLogs.reduce((s, l) => s + (l.duration || 0), 0)
    return { dateStr, mins, label: DAY_LABELS[d.getDay()], day: d.getDate() }
  })

  const maxMins = Math.max(...last28.map(d => d.mins), 1)

  const saveName = () => {
    if (nameInput.trim()) setUserName(nameInput.trim())
    setEditingName(false)
  }

  const clearLogs = () => {
    if (confirm('Clear all workout history? This cannot be undone.')) setLogs([])
  }

  const recentLogs = [...logs].reverse().slice(0, 10)

  return (
    <Layout>
      <Head><title>Kathrens Pilates — Progress</title></Head>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your <em>Progress</em></h1>
          <div className={styles.nameRow}>
            {editingName ? (
              <div className={styles.nameEdit}>
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  placeholder="Your name"
                  className={styles.nameInput}
                />
                <button className={styles.saveNameBtn} onClick={saveName}>Save</button>
              </div>
            ) : (
              <button className={styles.editNameBtn} onClick={() => { setNameInput(userName); setEditingName(true) }}>
                {userName ? `✦ ${userName}` : '+ Add your name'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{streak}</span>
            <span className={styles.statLabel}>day streak 🔥</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalSessions}</span>
            <span className={styles.statLabel}>total sessions</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalMins}</span>
            <span className={styles.statLabel}>total minutes</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Last 28 days</h2>
          <div className={styles.chartWrap}>
            <div className={styles.chart}>
              {last28.map((d, i) => (
                <div key={i} className={styles.bar} title={`${d.dateStr}: ${d.mins} min`}>
                  <div
                    className={`${styles.barFill} ${d.mins > 0 ? styles.barActive : ''}`}
                    style={{ height: `${Math.max((d.mins / maxMins) * 100, d.mins > 0 ? 8 : 0)}%` }}
                  />
                  {(i % 7 === 0) && <span className={styles.barLabel}>{d.day}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Workout history</h2>
          {recentLogs.length === 0 ? (
            <p className={styles.empty}>No workouts logged yet. Start moving! ✦</p>
          ) : (
            <div className={styles.historyList}>
              {recentLogs.map(log => (
                <div key={log.id} className={styles.historyItem}>
                  <div className={styles.historyDot} />
                  <div className={styles.historyBody}>
                    <span className={styles.historyName}>
                      {log.planName || (log.exercises ? log.exercises.map(id => exercises.find(e => e.id === id)?.name).filter(Boolean).join(', ') : 'Custom workout')}
                    </span>
                    <span className={styles.historyMeta}>
                      {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {log.duration} min
                    </span>
                    {log.notes && <span className={styles.historyNotes}>{log.notes}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {logs.length > 0 && (
          <div className={styles.section}>
            <button className={styles.clearBtn} onClick={clearLogs}>Clear all history</button>
          </div>
        )}
      </div>
    </Layout>
  )
}
