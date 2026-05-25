import Nav from './Nav'
import AmbientPlayer from './AmbientPlayer'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Nav />
      <main className={styles.main}>
        {children}
      </main>
      <AmbientPlayer />
    </div>
  )
}
