import Head from 'next/head'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useStorage } from '../hooks/useStorage'
import { exercises, workoutPlans } from '../data/exercises'
import styles from '../styles/Log.module.css'

export default function Log() {
  const [logs, setLogs] = useStorage('pilates-logs', [])
  const [mode, setMode] = useState('workout') // 'workout' | 'custom'
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedExercises, setSelectedExercises] = useState([])
  const [duration, setDuration] = useState(20)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const recentLogs = [...logs].reverse().slice(0, 5)

  const toggleExercise = (id) => {
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (mode === 'workout' && !selectedPlan) return
    if (mode === 'custom' && selectedExercises.length === 0) return

    const entry = {
      id: Date.now().toString(),
      date: today,
      duration: Number(duration),
      notes,
      ...(mode === 'workout'
        ? { type: 'workout', planId: selectedPlan, planName: workoutPlans.find(p => p.id === selectedPlan)?.name }
        : { type: 'custom', exercises: selectedExercises }),
    }
    setLogs([...logs, entry])
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSelectedPlan('')
    setSelectedExercises([])
    setNotes('')
    setDuration(20)
  }

  return (
    <Layout>
      <Head><title>Kathrens Pilates — Log Workout</title></Head>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Log a <em>Workout</em></h1>
          <p className={styles.sub}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {saved && (
          <div className={styles.successBanner}>
            ✦ Workout logged! Great work today.
          </div>
        )}

        <div className={styles.modeToggle}>
          <button className={`${styles.modeBtn} ${mode === 'workout' ? styles.modeActive : ''}`} onClick={() => setMode('workout')}>Choose a workout plan</button>
          <button className={`${styles.modeBtn} ${mode === 'custom' ? styles.modeActive : ''}`} onClick={() => setMode('custom')}>Custom selection</button>
        </div>

        {mode === 'workout' ? (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Select workout</h2>
            <div className={styles.planGrid}>
              {workoutPlans.map(plan => (
                <button
                  key={plan.id}
                  className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planSelected : ''}`}
                  style={{ '--plan-color': plan.color }}
                  onClick={() => { setSelectedPlan(plan.id); setDuration(plan.duration) }}
                >
                  <span className={styles.planName}>{plan.name}</span>
                  <span className={styles.planMeta}>{plan.duration} min · {plan.exercises.length} exercises</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Select exercises</h2>
            <div className={styles.exGrid}>
              {exercises.map(ex => (
                <button
                  key={ex.id}
                  className={`${styles.exBtn} ${selectedExercises.includes(ex.id) ? styles.exSelected : ''}`}
                  onClick={() => toggleExercise(ex.id)}
                >
                  <span>{ex.icon}</span> {ex.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Duration</h2>
          <div className={styles.durationRow}>
            <input
              type="range"
              min={5}
              max={90}
              step={5}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className={styles.slider}
            />
            <span className={styles.durationVal}>{duration} min</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Notes (optional)</h2>
          <textarea
            className={styles.textarea}
            placeholder="How did it feel? Any modifications?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.section}>
          <button className={styles.saveBtn} onClick={handleSave}>Save workout ✦</button>
        </div>

        {recentLogs.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent sessions</h2>
            <div className={styles.recentList}>
              {recentLogs.map(log => (
                <div key={log.id} className={styles.recentItem}>
                  <div>
                    <span className={styles.recentName}>{log.planName || `${log.exercises?.length || 0} exercises`}</span>
                    <span className={styles.recentDate}>{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span className={styles.recentDur}>{log.duration}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
