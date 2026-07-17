import Link from 'next/link'
import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import Script from 'next/script'
import PageFooter from '../components/PageFooter'
import { localizeText } from '../../lib/locale'

const NavMenu = dynamicImport(() => import('../components/NavMenu'), {
  ssr: true,
})

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'How GuruForU Works | Live Classes, Reports, and Parent Visibility',
  description:
    'See how GuruForU works for students, parents, and teachers with live online classes, AI-powered progress reports, and interactive learning tools.',
  keywords: [
    'how online tutoring works',
    'live tutoring platform',
    'online teaching platform',
    'AI learning reports',
    'parent progress tracking',
    'virtual classroom',
    'online math tutoring',
    'online science tutoring',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'How GuruForU Works | Live Tutoring Platform',
    description:
      'Learn how GuruForU connects students, parents, and teachers with live classes and AI-powered learning insights.',
    url: 'https://www.guruforu.com/how-it-works',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.guruforu.com/og-card.jpg',
        width: 1200,
        height: 630,
        alt: 'GuruForU - How Online Tutoring Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How GuruForU Works | Live Tutoring Platform',
    description: 'Live classes, AI progress reports, and better parent visibility in one platform.',
    images: ['https://www.guruforu.com/og-card.jpg'],
  },
  alternates: { canonical: 'https://www.guruforu.com/how-it-works' },
}

const OVERVIEW_STEPS = [
  {
    num: '1',
    title: 'Book a free session',
    text: 'Tell us about your child’s goals and schedule. We match them with the right tutor.',
  },
  {
    num: '2',
    title: 'Join live online',
    text: '1-on-1 video class with whiteboard, screen share, and real-time problem solving.',
  },
  {
    num: '3',
    title: 'Get AI progress reports',
    text: 'After every session, parents receive a Mastery Report with topics covered and next steps.',
  },
]

const PARENT_CARDS = [
  {
    icon: '👨‍👩‍👧',
    title: 'Enroll your child',
    text: 'Add your child with grade, subjects, and login details. Manage passwords and profiles anytime.',
    variant: '',
  },
  {
    icon: '✅',
    title: 'Approve teachers',
    text: 'Review connection requests, approve or reject tutors, and pause access whenever you need.',
    variant: 'amber',
  },
  {
    icon: '💳',
    title: 'Purchase credits',
    text: 'Buy class credits in flexible packages with secure payments. Track balance and history.',
    variant: 'green',
  },
  {
    icon: '📊',
    title: 'Track every session',
    text: 'Session timeline, AI reports, periodic progress summaries, and assignment tracking.',
    variant: '',
  },
  {
    icon: '🔔',
    title: 'Stay notified',
    text: 'Session reminders, AI report alerts, and assignment due-date updates — so you never miss what matters.',
    variant: 'amber',
  },
  {
    icon: '👥',
    title: 'Manage multiple children',
    text: 'Separate profiles, subjects, and progress dashboards for each child from one parent account.',
    variant: 'green',
  },
]

const STUDENT_CARDS = [
  {
    icon: '📝',
    title: 'Quick sign-up',
    text: 'Create a student account, add grade level, subjects, and learning goals in minutes.',
  },
  {
    icon: '🎥',
    title: 'Live classroom',
    text: 'HD video, interactive whiteboard, screen share, and live chat with your tutor.',
  },
  {
    icon: '📈',
    title: 'See your progress',
    text: 'Session history, AI summaries after each class, and trends that show what you’ve mastered.',
  },
]

const TEACHER_CARDS = [
  {
    icon: '🚀',
    title: 'Get started fast',
    text: 'Sign up, complete your profile, get approved, and start scheduling live classes.',
  },
  {
    icon: '📅',
    title: 'Your schedule',
    text: 'Set weekly availability, block holidays, and see projected earnings at a glance.',
  },
  {
    icon: '🎓',
    title: 'Teach live',
    text: 'HD video, whiteboard, screen share, chat, and a session timer built for tutoring.',
  },
  {
    icon: '💰',
    title: 'Keep your earnings',
    text: '100% of your class fees — zero commission. Only a nominal platform fee per session.',
  },
  {
    icon: '✨',
    title: 'AI writes your reports',
    text: 'Session summaries generated automatically after every class — no manual note-taking or admin work.',
  },
  {
    icon: '📋',
    title: 'Assign & review homework',
    text: 'Create assignments, track submissions, and give feedback — all from your teacher dashboard.',
  },
]

const CLASSROOM_FEATURES = [
  { icon: '🎥', title: 'HD video calling', text: 'Crystal-clear WebRTC video and audio for face-to-face teaching.' },
  { icon: '🖥️', title: 'Screen sharing', text: 'Share your full screen or a window for demos and walkthroughs.' },
  { icon: '✏️', title: 'Interactive whiteboard', text: 'Draw, annotate, and explain — teachers and students participate.' },
  { icon: '💬', title: 'Live chat', text: 'Exchange messages, links, and notes instantly during class.' },
  { icon: '🎬', title: 'Session recording', text: 'Classes recorded with audio transcription for later review.' },
  { icon: '🌐', title: 'Works everywhere', text: 'Chrome, Firefox, Edge, and Safari on desktop and mobile.' },
]

const AI_VISTA_ITEMS = [
  { title: 'Automated session summaries', text: 'Detailed reports after every class — topics, engagement, and key moments.' },
  { title: 'Audio transcription', text: 'Sessions transcribed so you can revisit what was discussed.' },
  { title: 'Progress analytics', text: 'Data-driven insights on strengths and areas to improve over time.' },
  { title: 'Zero extra admin', text: 'No manual note-taking. AI handles reports so tutors focus on teaching.' },
]

const COMPARE_ROWS = [
  { feature: 'Session reports', traditional: 'Manual / none', guruforu: 'AI-generated automatically' },
  { feature: 'Commission', traditional: '25–40% taken', guruforu: 'Zero commission' },
  { feature: 'Revenue ownership', traditional: 'Platform keeps majority', guruforu: 'Teacher keeps 100%' },
  { feature: 'Parent visibility', traditional: 'Limited or none', guruforu: 'Full AI-powered reports' },
  { feature: 'Admin work', traditional: 'Hours of paperwork', guruforu: 'Zero — AI handles it' },
]

const FAQ_ITEMS = [
  {
    q: 'How do I get started as a teacher on GuruForU?',
    a: 'Sign up using Google or email, complete your profile with subjects, qualifications and rates, get approved by our team, then start scheduling and conducting live classes.',
  },
  {
    q: 'What features does the live classroom include?',
    a: 'GuruForU classrooms include HD video calling, screen sharing, interactive whiteboard, live chat, session recording with transcription, and work on all major browsers.',
  },
  {
    q: 'How can parents track their child\'s progress?',
    a: 'Parents receive AI-generated session reports after each class, can view session timelines, access periodic progress reports, and monitor assignments from their dashboard.',
  },
  {
    q: 'Do teachers keep 100% of their earnings?',
    a: 'Yes, teachers keep 100% of their class fees with zero commission. GuruForU only charges a nominal platform fee per session.',
  },
]

const iconClass = (variant?: string) => {
  if (variant === 'amber') return 'about-card-icon about-card-icon-amber'
  if (variant === 'green') return 'about-card-icon about-card-icon-green'
  return 'about-card-icon'
}

export default async function HowItWorks() {
  const localized = (text: string) => localizeText(text, 'DEFAULT')

  const howItWorksSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How GuruForU Works',
    description:
      'Learn how GuruForU connects teachers, students, and parents through live video classes and AI-powered learning insights.',
    url: 'https://www.guruforu.com/how-it-works',
    mainEntity: {
      '@type': 'Service',
      name: 'GuruForU Online Tutoring Platform',
      description:
        'Real-time online classroom platform connecting teachers and students through live video, collaborative whiteboards, and AI-powered learning insights.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'GuruForU',
        url: 'https://www.guruforu.com',
      },
      serviceType: 'Online Tutoring',
      areaServed: 'Global',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <Script
        id="how-it-works-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksSchema) }}
      />
      <Script
        id="how-it-works-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <NavMenu />

      <main className="hiw">
        {/* Hero */}
        <section className="about-hero" aria-labelledby="hiw-heading">
          <div className="gf-container about-hero-inner">
            <div className="gf-badge">
              <span className="gf-badge-dot" aria-hidden="true" />
              Live Classroom + AI Reports
            </div>
            <h1 id="hiw-heading" className="about-hero-title">
              How GuruForU <span className="gf-text-primary">Works</span>
            </h1>
            <p className="about-hero-lead">
              Live video tutoring, an interactive whiteboard, and AI that reports progress to parents
              — all in one platform for students, parents, and teachers.
            </p>
            <div className="about-hero-ctas">
              <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                {localized('Book Free Session')}
              </Link>
              <Link href="/about" className="gf-btn-outline" prefetch={false}>
                {localized('About Us')}
              </Link>
            </div>
          </div>
        </section>

        {/* 3-step overview */}
        <section className="home-trust" aria-label="How GuruForU works in three steps">
          <div className="gf-container">
            <div className="home-steps">
              {OVERVIEW_STEPS.map((step) => (
                <div key={step.num} className="home-step">
                  <div className="home-step-num">{step.num}</div>
                  <h2 className="home-step-title">{step.title}</h2>
                  <p className="home-step-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience jump links */}
        <section className="about-section" aria-label="Choose your role">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 className="about-section-title">Built for everyone in the learning journey</h2>
              <p className="about-section-desc">
                Jump to the section that matters most to you.
              </p>
            </div>
            <nav className="hiw-audience-nav" aria-label="Page sections">
              <a href="#parents" className="hiw-audience-link">For Parents</a>
              <a href="#students" className="hiw-audience-link">For Students</a>
              <a href="#teachers" className="hiw-audience-link">For Teachers</a>
              <a href="#classroom" className="hiw-audience-link">Live Classroom</a>
              <a href="#ai-vista" className="hiw-audience-link">AI-Vista</a>
            </nav>
          </div>
        </section>

        {/* For Parents */}
        <section
          id="parents"
          className="about-section about-section-alt hiw-section-anchor"
          aria-labelledby="parents-heading"
        >
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="parents-heading" className="about-section-title">For Parents</h2>
              <p className="about-section-desc">
                Complete visibility and control — from enrollment to progress tracking after every
                session.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {PARENT_CARDS.map((card) => (
                <article key={card.title} className="about-card">
                  <div className={iconClass(card.variant)} aria-hidden="true">{card.icon}</div>
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-text">{card.text}</p>
                </article>
              ))}
            </div>
            <div className="hiw-highlight-card">
              <h3 className="hiw-highlight-card-title">Monitor sessions &amp; progress</h3>
              <ul className="hiw-highlight-list">
                <li>
                  <strong>Session timeline</strong> — every class with subject, date, duration,
                  teacher, and status.
                </li>
                <li>
                  <strong>AI session reports</strong> — topics discussed, engagement, strengths,
                  and recommendations after each class.
                </li>
                <li>
                  <strong>Periodic progress reports</strong> — monthly and quarterly learning trends.
                </li>
                <li>
                  <strong>Assignment tracking</strong> — due dates, submissions, and scores in one
                  place.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* For Students */}
        <section
          id="students"
          className="about-section hiw-section-anchor"
          aria-labelledby="students-heading"
        >
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="students-heading" className="about-section-title">For Students</h2>
              <p className="about-section-desc">
                Join live classes from your dashboard and track what you&apos;ve learned over time.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {STUDENT_CARDS.map((card) => (
                <article key={card.title} className="about-card">
                  <div className="about-card-icon" aria-hidden="true">{card.icon}</div>
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-text">{card.text}</p>
                </article>
              ))}
            </div>
            <div className="hiw-step-cards hiw-step-cards-4 hiw-step-cards-spaced">
              {[
                { num: '1', title: 'Sign up', text: 'Create your student account with grade and subjects.' },
                { num: '2', title: 'Connect', text: 'Browse tutors and send a connection request.' },
                { num: '3', title: 'Join class', text: 'One-click entry from your dashboard at session time.' },
                { num: '4', title: 'Review', text: 'Read AI summaries and track your progress over time.' },
              ].map((step) => (
                <div key={step.num} className="hiw-step-card">
                  <span className="hiw-step-card-num">{step.num}</span>
                  <h3 className="hiw-step-card-title">{step.title}</h3>
                  <p className="hiw-step-card-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Teachers */}
        <section
          id="teachers"
          className="about-section about-section-alt hiw-section-anchor"
          aria-labelledby="teachers-heading"
        >
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="teachers-heading" className="about-section-title">For Teachers</h2>
              <p className="about-section-desc">
                Teach on your terms with professional tools and AI that handles the admin work.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {TEACHER_CARDS.map((card, i) => (
                <article key={card.title} className="about-card">
                  <div
                    className={
                      i % 3 === 1
                        ? 'about-card-icon about-card-icon-amber'
                        : i % 3 === 2
                          ? 'about-card-icon about-card-icon-green'
                          : 'about-card-icon'
                    }
                    aria-hidden="true"
                  >
                    {card.icon}
                  </div>
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-text">{card.text}</p>
                </article>
              ))}
            </div>
            <div className="hiw-highlight-card">
              <h3 className="hiw-highlight-card-title">AI-Vista Educator Suite</h3>
              <ul className="hiw-highlight-list">
                <li>
                  <strong>Zero admin workflow</strong> — AI generates executive-quality session
                  reports automatically.
                </li>
                <li>
                  <strong>Objective growth proof</strong> — share AI progress reports with parents.
                </li>
                <li>
                  <strong>100% revenue ownership</strong> — no commission; nominal platform fee only.
                </li>
                <li>
                  <strong>Global reach</strong> — teach students worldwide and grow your practice.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Live Classroom */}
        <section
          id="classroom"
          className="about-section hiw-section-anchor"
          aria-labelledby="classroom-heading"
        >
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="classroom-heading" className="about-section-title">
                The live classroom experience
              </h2>
              <p className="about-section-desc">
                Every session runs in a purpose-built virtual classroom designed for interactive
                {localized(' Math')} &amp; Science tutoring.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {CLASSROOM_FEATURES.map((feature) => (
                <article key={feature.title} className="about-card">
                  <div className="about-card-icon about-card-icon-green" aria-hidden="true">{feature.icon}</div>
                  <h3 className="about-card-title">{feature.title}</h3>
                  <p className="about-card-text">{feature.text}</p>
                </article>
              ))}
            </div>
            <div className="hiw-requirements">
              <h3 className="hiw-requirements-title">Minimum requirements</h3>
              <ul className="hiw-requirements-list">
                <li><strong>Internet:</strong> 5 Mbps or higher (wired recommended)</li>
                <li><strong>Device:</strong> Laptop, desktop, or tablet with webcam and mic</li>
                <li><strong>Browser:</strong> Latest Chrome (recommended), Firefox, Edge, or Safari</li>
                <li><strong>Accessories:</strong> Writing pad recommended for students</li>
              </ul>
            </div>
          </div>
        </section>

        {/* AI-Vista */}
        <section
          id="ai-vista"
          className="about-section about-section-alt hiw-section-anchor"
          aria-labelledby="ai-vista-heading"
        >
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="ai-vista-heading" className="about-section-title">
                AI-Vista — smart learning insights
              </h2>
              <p className="about-section-desc">
                AI analyzes every session and generates professional reports — tutors teach, parents
                stay informed.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              {AI_VISTA_ITEMS.map((item, i) => (
                <article key={item.title} className="about-card">
                  <div
                    className={
                      i % 3 === 1
                        ? 'about-card-icon about-card-icon-amber'
                        : i % 3 === 2
                          ? 'about-card-icon about-card-icon-green'
                          : 'about-card-icon'
                    }
                    aria-hidden="true"
                  >
                    ✨
                  </div>
                  <h3 className="about-card-title">{item.title}</h3>
                  <p className="about-card-text">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="hiw-compare-wrap">
              <h3 className="hiw-compare-title">How we compare</h3>
              <table className="hiw-compare-table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Traditional platforms</th>
                    <th scope="col">GuruForU</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      <td>{row.traditional}</td>
                      <td className="hiw-compare-good">{row.guruforu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section className="about-section" aria-labelledby="why-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="why-heading" className="about-section-title">Why choose GuruForU?</h2>
            </div>
            <div className="about-cards about-cards-3">
              <article className="about-card">
                <div className="about-card-icon" aria-hidden="true">👩‍🏫</div>
                <h3 className="about-card-title">For teachers</h3>
                <p className="about-card-text">
                  Set your own rates, keep 100% of earnings, and let AI handle admin and reporting.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-amber" aria-hidden="true">🎓</div>
                <h3 className="about-card-title">For students</h3>
                <p className="about-card-text">
                  Learn from verified tutors in a live classroom with video, whiteboard, and chat.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-green" aria-hidden="true">📊</div>
                <h3 className="about-card-title">For parents</h3>
                <p className="about-card-text">
                  AI session reports, progress tracking, and full control over your child&apos;s
                  learning.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="about-section about-section-alt" aria-labelledby="faq-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="faq-heading" className="about-section-title">Frequently asked questions</h2>
            </div>
            <div className="about-faq">
              {FAQ_ITEMS.map((item) => (
                <article key={item.q} className="about-faq-item">
                  <h3 className="about-faq-q">{item.q}</h3>
                  <p className="about-faq-a">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section" aria-labelledby="cta-heading">
          <div className="gf-container">
            <div className="about-cta">
              <h2 id="cta-heading" className="about-cta-title">
                Ready to get started?
              </h2>
              <p className="about-cta-desc">
                Book a free session for your child — or sign up as a teacher. No commitment required.
              </p>
              <div className="about-cta-actions">
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  {localized('Book Free Session')}
                </Link>
                <Link href="/contact" className="gf-btn-outline" prefetch={false}>
                  {localized('Contact Us')}
                </Link>
              </div>
              <p className="about-cta-note">
                Already have an account?{' '}
                <a href="https://learn.guruforu.com/" target="_blank" rel="noopener noreferrer">
                  Go to Classroom →
                </a>
              </p>
            </div>
          </div>
        </section>

        <PageFooter />
      </main>
    </>
  )
}
