'use client'

import { useEffect, useState } from 'react'
import { detectLocale, getLocaleDebugParams, type LocaleInfo } from '../../lib/locale'
import styles from './LocaleDebugBanner.module.css'

export default function LocaleDebugBanner() {
  const [info, setInfo] = useState<LocaleInfo | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const debug = getLocaleDebugParams(params)
    if (!debug.locale && !debug.region) return
    setInfo(detectLocale())
  }, [])

  if (!info) return null

  const clearUrl = (() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('gf_locale')
    url.searchParams.delete('gf_region')
    return url.pathname + url.search + url.hash
  })()

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.label}>Locale debug</span>
      <code className={styles.code}>
        {info.locale} · {info.region} · {info.countryName}
      </code>
      <a href={clearUrl} className={styles.clear}>
        Clear
      </a>
    </div>
  )
}
