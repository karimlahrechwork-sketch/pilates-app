import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Layout from '../../components/Layout'
import { exercises } from '../../data/exercises'
import styles from '../../styles/Library.module.css'

const categories = ['all', 'core', 'flexibility', 'hips', 'glutes', 'back']

export default function Library() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? exercises : exercises.filter(e => e.category === filter)

  return (
    <Layout>
      <Head><title>Kathrens Pilates — Library</title></Head>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Exercise <em>Library</em></h1>
          <p className={styles.sub}>{exercises.length} beginner-friendly moves</p>
        </div>

        <div className={styles.filters}>
          {categories.map(c => (
            <button
              key={c}
              className={`${styles.filter} ${filter === c ? styles.active : ''}`}
              onClick={() => setFilter(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map(ex => (
            <Link key={ex.id} href={`/library/${ex.id}`} className={styles.card}>
              <div className={styles.cardIcon}>{ex.icon}</div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardName}>{ex.name}</h2>
                <p className={styles.cardDesc}>{ex.summary}</p>
                <div className={styles.tags}>
                  {ex.targets.map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                  <span className={styles.tag}>{ex.duration}</span>
                </div>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
