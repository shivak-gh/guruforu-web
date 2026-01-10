'use client'

import styles from './page.module.css'
import Link from 'next/link'

export default function ComingSoon() {
  return (
    <div className={styles.container}>
      
      
      <div className={styles.background}>
        <div className={styles.gradient}></div>
        <div className={styles.particles}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.logo}>
          <img src="/guru-logo.png" alt="GuruForU Logo" className={styles.logoImage} />
        </div>
        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.subtitle}>
          We&apos;re crafting something extraordinary. 
          <br />
          Something that will change the way you experience the web.
        </p>
        <div className={styles.divider}></div>
        <p className={styles.message}>
          Stay tuned for our grand launch. We can&apos;t wait to share it with you!
        </p>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.footerLinks}>
          <Link href="/terms" className={styles.footerLink}>Terms and Conditions</Link>
          <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="/shipping" className={styles.footerLink}>Shipping Policy</Link>
          <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
          <Link href="/cancellation-refunds" className={styles.footerLink}>Cancellation and Refunds</Link>
        </nav>
        <p className={styles.copyright}>© 2026 GuruForU. All rights reserved.</p>
      </footer>
    </div>
  )
}
