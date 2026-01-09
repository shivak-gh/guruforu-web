'use client'

import styles from './page.module.css'

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
        <div className={styles.logo}>🚀</div>
        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.subtitle}>
          We're crafting something extraordinary. 
          <br />
          Something that will change the way you experience the web.
        </p>
        <div className={styles.divider}></div>
        <p className={styles.message}>
          Stay tuned for our grand launch. We can't wait to share it with you!
        </p>
      </div>

      <footer className={styles.footer}>
        <p>© 2026 GuruForU. All rights reserved.</p>
      </footer>
    </div>
  )
}
