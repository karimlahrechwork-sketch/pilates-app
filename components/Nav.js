import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Nav.module.css'

const links = [
  { href: '/', label: 'Home', icon: '◈' },
  { href: '/library', label: 'Library', icon: '◉' },
  { href: '/progress', label: 'Progress', icon: '◎' },
  { href: '/log', label: 'Log', icon: '⊕' },
]

export default function Nav() {
  const router = useRouter()
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>✦</span>
        <span className={styles.logoText}>Pilātis</span>
      </div>
      <div className={styles.links}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`${styles.link} ${router.pathname === l.href ? styles.active : ''}`}>
            <span className={styles.icon}>{l.icon}</span>
            <span className={styles.label}>{l.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
