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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is GuruForU?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU is a team of educators and technologists building AI-powered online tutoring. We provide premium online tuition enhanced with personalized learning, detailed mastery reports, and expert teacher support so every student can learn at their own pace.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does GuruForU offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU offers K-12 online tutoring with AI-driven progress tracking, curriculum-aligned learning paths for math and science, one-on-one expert instruction, and parent and student support resources. Our platform helps families see exactly where students excel and where to focus.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I get started with GuruForU?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Book a free consultation session to discuss your child\'s learning needs. Our AI diagnostics identify learning gaps and create a personalized roadmap. You can also explore our learning resources for tips and guides, or contact us for more information.'
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="about-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="about-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
              <p className={styles.text}>
                We believe every child learns differently. Our platform uses AI to adapt to each student&apos;s strengths and gaps while keeping expert teachers at the center of the experience—so your child gets both personalized pacing and human support.
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
                Articles and learning content on GuruForU are written and reviewed by our <strong>GuruForU Editorial Team</strong>—
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
                support your child&apos;s learning, or explore our <Link href="/blog" className={styles.link}>learning resources</Link> for
                tips and guides.
              </p>
            </section>

            <section className={styles.faqSection}>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <dl className={styles.faqList}>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>Who is GuruForU?</dt>
                  <dd className={styles.faqAnswer}>
                    GuruForU is a team of educators and technologists building AI-powered online tutoring. We provide premium online tuition enhanced with personalized learning, detailed mastery reports, and expert teacher support so every student can learn at their own pace.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>What does GuruForU offer?</dt>
                  <dd className={styles.faqAnswer}>
                    GuruForU offers K-12 online tutoring with AI-driven progress tracking, curriculum-aligned learning paths for math and science, one-on-one expert instruction, and parent and student support resources. Our platform helps families see exactly where students excel and where to focus.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>How can I get started with GuruForU?</dt>
                  <dd className={styles.faqAnswer}>
                    Book a <Link href="/free-session" className={styles.link}>free consultation session</Link> to discuss your child&apos;s learning needs. Our AI diagnostics identify learning gaps and create a personalized roadmap. You can also explore our <Link href="/blog" className={styles.link}>learning resources</Link> for tips and guides, or <Link href="/contact" className={styles.link}>contact us</Link> for more information.
                  </dd>
                </div>
              </dl>
            </section>
          </article>

          <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink} prefetch={false}>Home</Link>
              <Link href="/blog" className={styles.footerLink} prefetch={false}>Resources</Link>
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
