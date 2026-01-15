'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './FreeConsultationFAB.module.css'

export default function FreeConsultationFAB() {
  const pathname = usePathname()

  // Don't show on the free consultation page itself
  if (pathname === '/free-consultation') {
    return null
  }

  return (
    <Link href="/free-consultation" className={styles.fab} aria-label="Book Free Consultation">
      <span className={styles.fabIcon}>💬</span>
      <span className={styles.fabText}>Free Consultation</span>
    </Link>
  )
}
