import { useEffect, useState } from 'react'
import styles from './MilestoneCelebration.module.css'

export default function MilestoneCelebration({ milestone, onClose }) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!milestone) return
    // Stagger in
    setTimeout(() => setVisible(true), 50)

    // Generate confetti particles
    const p = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: -10 - Math.random() * 20,
      size: 5 + Math.random() * 7,
      rot: Math.random() * 360,
      color: ['#7a9e7e', '#c17f5a', '#9b8ec4', '#c8dfc9', '#f5ede5', '#b8860b'][i % 6],
      dur: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.5,
    }))
    setParticles(p)
  }, [milestone])

  if (!milestone) return null

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`${styles.overlay} ${visible ? styles.show : ''}`} onClick={handleClose}>
      {/* Confetti */}
      <div className={styles.confettiWrap} aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              transform: `rotate(${p.rot}deg)`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              borderRadius: p.id % 3 === 0 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      <div
        className={`${styles.card} ${visible ? styles.cardIn : ''}`}
        onClick={e => e.stopPropagation()}
        style={{ '--badge-color': milestone.color, '--badge-light': milestone.colorLight }}
      >
        <div className={styles.badgeWrap}>
          <div className={styles.badgeRing} />
          <div className={styles.badgeEmoji}>{milestone.badge}</div>
        </div>

        <div className={styles.sparkles} aria-hidden="true">
          {['★', '✦', '·', '✦', '★'].map((s, i) => (
            <span key={i} className={styles.sparkle} style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>
          ))}
        </div>

        <p className={styles.congrats}>Achievement Unlocked!</p>
        <h2 className={styles.badgeName}>{milestone.name}</h2>
        <div className={styles.streakPill}>
          {milestone.days} day streak 🔥
        </div>
        <p className={styles.message}>{milestone.message}</p>

        <button className={styles.closeBtn} onClick={handleClose}>
          Thank you ✦
        </button>
      </div>
    </div>
  )
}
