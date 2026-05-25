import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './StepTimer.module.css'

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
}

export default function StepTimer({ seconds, label }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  const pct = ((seconds - timeLeft) / seconds) * 100
  const radius = 28
  const circ = 2 * Math.PI * radius
  const dash = circ - (pct / 100) * circ

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    if (done) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setDone(true)
          // Gentle vibration if supported
          if (navigator.vibrate) navigator.vibrate([100, 50, 100])
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [done])

  const reset = () => {
    stop()
    setTimeLeft(seconds)
    setDone(false)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className={`${styles.timer} ${done ? styles.timerDone : ''}`}>
      <div className={styles.ring}>
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--sage-light)" strokeWidth="4" />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={done ? '#7a9e7e' : running ? '#4a6b4e' : '#7a9e7e'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            transform="rotate(-90 36 36)"
            style={{ transition: 'stroke-dashoffset 0.8s linear' }}
          />
        </svg>
        <div className={styles.ringInner}>
          {done ? (
            <span className={styles.doneCheck}>✓</span>
          ) : (
            <span className={styles.timeDisplay}>{fmt(timeLeft)}</span>
          )}
        </div>
      </div>

      <div className={styles.timerBody}>
        <p className={styles.timerLabel}>{done ? 'Complete!' : label || `Hold for ${fmt(seconds)}`}</p>
        <div className={styles.btns}>
          {!done && !running && (
            <button className={styles.startBtn} onClick={start}>
              ▶ Start
            </button>
          )}
          {running && (
            <button className={styles.pauseBtn} onClick={stop}>
              ⏸ Pause
            </button>
          )}
          {(done || timeLeft < seconds) && (
            <button className={styles.resetBtn} onClick={reset}>
              ↺ Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
