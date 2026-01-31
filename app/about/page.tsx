import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'

const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})

export const metadata: Metadata = {
  title: 'About GuruForU | Our Team, Expertise & Mission in Online Education',
  description: 'Learn about GuruForU: our education experts, editorial team, and mission to deliver AI-powered personalized tutoring and real-time progress tracking for K-12 students.',
  keywords: [
    'about GuruForU',
    'online tutoring team',
    'education experts',
    'K-12 tutoring',
    'AI-powered learning',
    'personalized education',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'About GuruForU | Our Team & Mission in Online Education',
    description: 'Our education experts and mission: AI-powered personalized tutoring and progress tracking for K-12.',
    url: 'https://www.guruforu.com/about',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: 'https://www.guruforu.com/about' },
}

export default function AboutUs() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    description: 'AI-powered online tutoring with personalized learning and real-time progress tracking for K-12 students.',
    foundingDate: '2024',
    knowsAbout: ['Online Education', 'K-12 Tutoring', 'AI-Powered Learning', 'Student Progress Tracking'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@guruforu.com',
      url: 'https://www.guruforu.com/contact',
    },
  }

  return (
    <>
      <Script
        id="about-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <NavMenu />
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>
        <div className={styles.content}>
          <article className={styles.article}>
            <h1 className={styles.title}>About GuruForU</h1>
            <p className={styles.lead}>
              We&apos;re a team of educators and technologists building <strong>AI-powered online tutoring</strong> so every student
              can learn at their own pace with real-time progress tracking and expert support.
            </p>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Who We Are</h2>
              <p className={styles.text}>
                GuruForU provides premium online tuition enhanced with AI-powered personalized learning and detailed mastery reports.
                Our platform helps parents and students see exactly where they excel and where to focus—so learning is transparent and effective.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Our Expertise</h2>
              <p className={styles.text}>
                Our editorial and curriculum team includes experienced educators and specialists in K-12 education. We create
                evidence-based content and learning paths for math, science, and study strategies—backed by real classroom and
                tutoring experience.
              </p>
              <ul className={styles.list}>
                <li>K-12 curriculum design and alignment</li>
                <li>Online tutoring and one-on-one instruction</li>
                <li>AI-driven progress tracking and diagnostics</li>
                <li>Parent and student support resources</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Editorial & Trust</h2>
              <p className={styles.text}>
                Blog and learning content on GuruForU are written and reviewed by our <strong>GuruForU Editorial Team</strong>—
                educators and curriculum specialists focused on accurate, practical advice for parents and students. We link to
                trusted sources and keep our recommendations aligned with current best practices in education.
              </p>
              <p className={styles.text}>
                For our full approach to privacy and data, see our <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
                For questions or partnerships, <Link href="/contact" className={styles.link}>contact us</Link>.
              </p>
            </section>

            <section className={styles.ctaSection}>
              <h2 className={styles.sectionTitle}>Get Started</h2>
              <p className={styles.text}>
                Book a <Link href="/free-session" className={styles.link}>free consultation session</Link> to see how GuruForU can
                support your child&apos;s learning, or explore our <Link href="/blog" className={styles.link}>education blog</Link> for
                tips and guides.
              </p>
            </section>
          </article>

          <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink} prefetch={false}>Home</Link>
              <Link href="/blog" className={styles.footerLink} prefetch={false}>Blog</Link>
              <Link href="/contact" className={styles.footerLink} prefetch={false}>Contact</Link>
              <Link href="/free-session" className={styles.footerLink} prefetch={false}>Free Session</Link>
              <Link href="/privacy" className={styles.footerLink} prefetch={false}>Privacy</Link>
            </nav>
            <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  )
}
