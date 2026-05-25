import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useStorage } from '../hooks/useStorage'
import { workoutPlans, exercises } from '../data/exercises'
import styles from '../styles/Home.module.css'

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

function getWeekMinutes(logs) {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return logs
    .filter(l => new Date(l.date) >= weekAgo)
    .reduce((sum, l) => sum + (l.duration || 0), 0)
}

function getWeekSessions(logs) {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const days = new Set(logs.filter(l => new Date(l.date) >= weekAgo).map(l => l.date))
  return days.size
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Home() {
  const [logs] = useStorage('pilates-logs', [])
  const [userName] = useStorage('pilates-name', 'there')
  const [todayPlan, setTodayPlan] = useState(null)

  const streak = getStreak(logs)
  const weekMins = getWeekMinutes(logs)
  const weekSessions = getWeekSessions(logs)
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter(l => l.date === today)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 6 + i)
    const dateStr = d.toISOString().split('T')[0]
    const isToday = dateStr === today
    const done = logs.some(l => l.date === dateStr)
    return { label: days[d.getDay()], dateStr, isToday, done }
  })

  useEffect(() => {
    const plans = workoutPlans
    setTodayPlan(plans[new Date().getDay() % plans.length])
  }, [])

  return (
    <Layout>
      <Head><title>Kathrens Pilates — Home</title></Head>
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroContent}>
            <p className={styles.greeting}>{greeting}, {userName} ✦</p>
            <h1 className={styles.heroTitle}>Kathrens<br /><em>Pilates</em></h1>
            <p className={styles.heroSub}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{weekSessions}</span>
            <span className={styles.statLabel}>sessions this week</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{weekMins}</span>
            <span className={styles.statLabel}>minutes moved</span>
          </div>
          <div className={`${styles.statCard} ${styles.statAccent}`}>
            <span className={styles.statNum}>{streak} 🔥</span>
            <span className={styles.statLabel}>day streak</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>This week</h2>
          <div className={styles.weekRow}>
            {weekDays.map(d => (
              <div key={d.dateStr} className={styles.dayCol}>
                <span className={styles.dayLabel}>{d.label}</span>
                <div className={`${styles.dayDot} ${d.done ? styles.dayDone : ''} ${d.isToday ? styles.dayToday : ''}`}>
                  {d.done ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Today's session</h2>
          {todayLogs.length > 0 ? (
            <div className={styles.completedBanner}>
              <span>✦</span>
              <div>
                <strong>Session complete!</strong>
                <p>You logged {todayLogs.length} workout{todayLogs.length > 1 ? 's' : ''} today.</p>
              </div>
            </div>
          ) : todayPlan ? (
            <div className={styles.planCard} style={{ '--plan-color': todayPlan.color }}>
              <div className={styles.planHeader}>
                <div>
                  <h3 className={styles.planName}>{todayPlan.name}</h3>
                  <p className={styles.planMeta}>{todayPlan.duration} min · {todayPlan.level} · {todayPlan.exercises.length} exercises</p>
                </div>
                <span className={styles.planDuration}>{todayPlan.duration}m</span>
              </div>
              <div className={styles.planExercises}>
                {todayPlan.exercises.map(id => {
                  const ex = exercises.find(e => e.id === id)
                  return ex ? (
                    <Link key={id} href={`/library/${id}`} className={styles.planEx}>
                      <span>{ex.icon}</span> {ex.name}
                    </Link>
                  ) : null
                })}
              </div>
              <Link href="/log" className={styles.logBtn}>Log this workout →</Link>
            </div>
          ) : null}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick access</h2>
          <div className={styles.quickGrid}>
            <Link href="/library" className={styles.quickCard}>
              <span className={styles.quickIcon}>◉</span>
              <span className={styles.quickLabel}>Browse exercises</span>
            </Link>
            <Link href="/log" className={styles.quickCard}>
              <span className={styles.quickIcon}>⊕</span>
              <span className={styles.quickLabel}>Log a workout</span>
            </Link>
            <Link href="/progress" className={styles.quickCard}>
              <span className={styles.quickIcon}>◎</span>
              <span className={styles.quickLabel}>View progress</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
