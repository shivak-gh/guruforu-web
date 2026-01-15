'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './FreeConsultationFAB.module.css'

export default function FreeConsultationFAB() {
  const pathname = usePathname()

  // Don't show on the free session page itself
  if (pathname === '/free-session') {
    return null
  }

  return (
    <Link href="/free-session" className={styles.fab} aria-label="Book Free Session">
      <span className={styles.fabIcon}>💬</span>
      <span className={styles.fabText}>Free Session</span>
    </Link>
  )
}
