import Nav from './Nav'
import styles from './Layout.module.css'

export default function Layout({ children, badgeNotify = 0 }) {
  return (
    <div className={styles.layout}>
      <Nav badgeNotify={badgeNotify} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
