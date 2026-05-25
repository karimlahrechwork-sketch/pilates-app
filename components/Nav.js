import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Nav.module.css'

const links = [
  { href: '/', label: 'Home', icon: '◈' },
  { href: '/library', label: 'Library', icon: '◉' },
  { href: '/progress', label: 'Progress', icon: '◎' },
  { href: '/log', label: 'Log', icon: '⊕' },
  { href: '/badges', label: 'Badges', icon: '✦' },
]

const FlowerLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32" aria-hidden="true">
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#c8dfc9" opacity="0.9"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#7a9e7e" opacity="0.6" transform="rotate(45 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#c8dfc9" opacity="0.9" transform="rotate(90 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#7a9e7e" opacity="0.6" transform="rotate(135 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#c8dfc9" opacity="0.9" transform="rotate(180 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#7a9e7e" opacity="0.6" transform="rotate(225 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#c8dfc9" opacity="0.9" transform="rotate(270 20 20)"/>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill="#7a9e7e" opacity="0.6" transform="rotate(315 20 20)"/>
    <circle cx="20" cy="20" r="5.5" fill="#7a9e7e"/>
    <circle cx="20" cy="20" r="3" fill="#4a6b4e"/>
  </svg>
)

export default function Nav({ badgeNotify }) {
  const router = useRouter()
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <FlowerLogo />
        <div className={styles.logoText}>
          <span className={styles.logoName}>Kathrens</span>
          <span className={styles.logoPilates}>Pilates</span>
        </div>
      </Link>
      <div className={styles.links}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`${styles.link} ${router.pathname === l.href ? styles.active : ''}`}>
            <span className={styles.icon}>{l.icon}</span>
            <span className={styles.label}>{l.label}</span>
            {l.href === '/badges' && badgeNotify > 0 && (
              <span className={styles.dot}>{badgeNotify}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
