import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import StepTimer from '../../components/StepTimer'
import { exercises } from '../../data/exercises'
import styles from '../../styles/ExerciseDetail.module.css'

export async function getStaticPaths() {
  return {
    paths: exercises.map(e => ({ params: { id: e.id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const exercise = exercises.find(e => e.id === params.id) || null
  return { props: { exercise } }
}

export default function ExerciseDetail({ exercise }) {
  if (!exercise) return null

  const timedSteps = exercise.steps.filter(s => s.timer).length

  return (
    <Layout>
      <Head><title>Kathrens Pilates — {exercise.name}</title></Head>
      <div className={styles.page}>
        <Link href="/library" className={styles.back}>← Library</Link>

        <div className={styles.hero}>
          <div className={styles.heroIcon}>{exercise.icon}</div>
          <div>
            <h1 className={styles.title}>{exercise.name}</h1>
            <div className={styles.meta}>
              <span>{exercise.duration}</span>
              <span>·</span>
              <span>{exercise.level}</span>
              <span>·</span>
              <span>{exercise.targets.join(', ')}</span>
              {timedSteps > 0 && (
                <>
                  <span>·</span>
                  <span className={styles.timedBadge}>⏱ {timedSteps} timed step{timedSteps !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className={styles.summary}>{exercise.summary}</p>

        <h2 className={styles.stepsTitle}>Step by step</h2>
        <div className={styles.steps}>
          {exercise.steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {step.timer && (
                  <StepTimer
                    key={`${exercise.id}-step-${i}`}
                    seconds={step.timer}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {exercise.tip && (
          <div className={styles.tip}>
            <span className={styles.tipIcon}>✦</span>
            <p>{exercise.tip}</p>
          </div>
        )}

        <Link href="/log" className={styles.logBtn}>Log this exercise →</Link>
      </div>
    </Layout>
  )
}
