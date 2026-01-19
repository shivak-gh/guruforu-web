'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { detectLocale, localizeText, type Region } from '../../lib/locale'
import styles from './FreeConsultationFAB.module.css'

export default function FreeConsultationFAB() {
  const pathname = usePathname()
  const [region, setRegion] = useState<Region>('DEFAULT')
  
  useEffect(() => {
    const localeInfo = detectLocale()
    setRegion(localeInfo.region)
  }, [])
  
  const localized = (text: string) => localizeText(text, region)

  // Don't show on the free session page itself
  if (pathname === '/free-session') {
    return null
  }

  return (
    <Link href="/free-session" className={styles.fab} aria-label="Book Free Session">
      <span className={styles.fabIcon}>💬</span>
      <span className={styles.fabText}>{localized('Free Session')}</span>
    </Link>
  )
}
