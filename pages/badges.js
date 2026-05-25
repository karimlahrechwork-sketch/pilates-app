import Head from 'next/head'
import Layout from '../components/Layout'
import { useStorage } from '../hooks/useStorage'
import { STREAK_MILESTONES, getNextMilestone } from '../data/milestones'
import styles from '../styles/Badges.module.css'

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

export default function Badges() {
  const [logs] = useStorage('pilates-logs', [])
  const [earned] = useStorage('pilates-earned-milestones', [])

  const streak = getStreak(logs)
  const next = getNextMilestone(streak, earned)
  const earnedCount = earned.length
  const progress = next ? Math.round((streak / next.days) * 100) : 100

  return (
    <Layout>
      <Head><title>Kathrens Pilates — Badges</title></Head>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your <em>Badges</em></h1>
          <p className={styles.sub}>{earnedCount} of {STREAK_MILESTONES.length} earned</p>
        </div>

        {next && (
          <div className={styles.nextCard}>
            <div className={styles.nextLeft}>
              <span className={styles.nextBadge}>{next.badge}</span>
              <div>
                <p className={styles.nextLabel}>Next milestone</p>
                <p className={styles.nextName}>{next.name}</p>
                <p className={styles.nextDays}>{next.days - streak} day{next.days - streak !== 1 ? 's' : ''} to go</p>
              </div>
            </div>
            <div className={styles.progressWrap}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min(progress, 100)}%`, background: next.color }}
                />
              </div>
              <span className={styles.progressPct}>{Math.min(progress, 100)}%</span>
            </div>
          </div>
        )}

        {earnedCount === STREAK_MILESTONES.length && (
          <div className={styles.allEarned}>
            <span>👑</span>
            <p>You've earned every badge, Kathryn. You are extraordinary!</p>
          </div>
        )}

        <div className={styles.grid}>
          {STREAK_MILESTONES.map(m => {
            const isEarned = earned.includes(m.id)
            return (
              <div
                key={m.id}
                className={`${styles.badge} ${isEarned ? styles.earned : styles.locked}`}
                style={isEarned ? { '--b': m.color, '--bl': m.colorLight } : {}}
              >
                <div className={styles.badgeEmoji}>{isEarned ? m.badge : '🔒'}</div>
                <div className={styles.badgeBody}>
                  <p className={styles.badgeName}>{m.name}</p>
                  <p className={styles.badgeDays}>{m.days} day streak</p>
                  {isEarned && <p className={styles.badgeMsg}>{m.message}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
