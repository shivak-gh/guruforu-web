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
          <img src="/guruforu-ai-education-logo.png" alt="GuruForU Logo" className={styles.logoImage} />
        </div>
        <div className={styles.comingSoonBadge}>Coming Soon</div>
        <h1 className={styles.title}>
          Premium Online Tuitions
          <br />
          <span className={styles.highlight}>Powered by AI</span>
        </h1>
        <p className={styles.subtitle}>
          The best online classes for your child, enhanced with AI-powered personalized learning. 
          <br />
          Get real-time student progress tracking and mastery reports that show exactly how your child is advancing.
        </p>
        <div className={styles.divider}></div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>AI Mastery Tracking</h3>
              <p className={styles.featureDescription}>Comprehensive student progress tracker that monitors your child&apos;s learning journey in real-time</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Personalized Learning</h3>
              <p className={styles.featureDescription}>AI-driven personalized learning paths tailored to your child&apos;s unique strengths and learning style</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Expert Online Tutors</h3>
              <p className={styles.featureDescription}>Connect with qualified independent teachers dedicated to your child&apos;s academic success</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>✓</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Interactive Learning Sessions</h3>
              <p className={styles.featureDescription}>Engaging live classes with interactive tools and multimedia content to keep your child motivated and learning</p>
            </div>
          </div>
        </div>

        <p className={styles.message}>
          Join thousands of parents who trust GuruForU for their children&apos;s online education journey.
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
