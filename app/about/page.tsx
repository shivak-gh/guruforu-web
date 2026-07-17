import Link from 'next/link'
import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import Script from 'next/script'
import PageFooter from '../components/PageFooter'
import { getAboutPageContent, getAboutPageSeo, localizeText } from '../../lib/locale'

const NavMenu = dynamicImport(() => import('../components/NavMenu'), {
  ssr: true,
})

export const dynamic = 'force-static'

const ABOUT_URL = 'https://www.guruforu.com/about'
const ABOUT_OG_IMAGE = {
  url: 'https://www.guruforu.com/og-card.jpg',
  width: 1200,
  height: 630,
  alt: 'GuruForU - Online Math & Science Tutoring',
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = getAboutPageSeo('DEFAULT')

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: ABOUT_URL,
      siteName: 'GuruForU',
      type: 'website',
      locale: 'en_US',
      images: [ABOUT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [ABOUT_OG_IMAGE.url],
    },
    alternates: { canonical: ABOUT_URL },
  }
}

const WHY_CARDS = [
  {
    icon: '👩‍🏫',
    title: 'Real teachers, real-time',
    text: 'Not videos or chatbots — live instruction with a human expert every session.',
  },
  {
    icon: '📊',
    title: 'You see the progress',
    text: 'Detailed reports after every session, not just a grade at semester end.',
  },
  {
    icon: '📅',
    title: 'Flexible scheduling',
    text: 'Evenings, weekends, and holidays — sessions fit your family routine.',
  },
  {
    icon: '🏫',
    title: 'Aligned with school',
    text: 'We support what your child learns in class, not a separate curriculum.',
  },
  {
    icon: '🔗',
    title: 'One platform',
    text: 'Student learning, teacher instruction, and parent reporting in one place.',
  },
  {
    icon: '🌍',
    title: 'Global reach',
    key: 'globalReach' as const,
  },
]

const TUTOR_CARDS = [
  { icon: '🎓', title: 'Qualified degrees', text: 'Math, Science, or Education backgrounds' },
  { icon: '📋', title: 'Teaching experience', text: 'Many are current or former classroom teachers' },
  { icon: '✅', title: 'Background-checked', text: 'Every tutor is vetted before joining' },
  { icon: '💻', title: 'Platform trained', text: 'Expert in our live classroom tools and methods' },
]

const AI_REPORT_ITEMS = [
  'Topics covered in each session',
  'Concepts your child has mastered',
  'Areas that need more practice',
  'Personalized recommendations for next steps',
  'Progress charts over time',
]

const FAQ_STATIC = [
  {
    q: 'How do live tutoring sessions work?',
    a: 'Students meet their tutor in live 1-on-1 or small group sessions (2–4 students) via our online classroom with video, screen share, digital whiteboard, and real-time problem solving. Sessions are typically 45–60 minutes.',
  },
  {
    q: 'How do parents track progress?',
    a: 'After each session, parents receive AI-generated Mastery Reports with topics covered, concepts mastered, areas needing work, and personalized recommendations on the parent dashboard.',
  },
  {
    q: 'What are the tutor qualifications?',
    a: 'All tutors have degrees in Math, Science, or Education with teaching or tutoring experience. They are background-checked and trained on our platform before working with students.',
  },
]

export default async function AboutUs() {
  const content = getAboutPageContent('DEFAULT')
  const localized = (text: string) => localizeText(text, 'DEFAULT')

  const faqItems = [
    {
      q: 'What Math subjects does GuruForU tutor?',
      a: localized(content.faqMathAnswer),
    },
    {
      q: 'What Science subjects does GuruForU tutor?',
      a: localized(content.faqScienceAnswer),
    },
    ...FAQ_STATIC.map((item) => ({
      q: localized(item.q),
      a: localized(item.a),
    })),
  ]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'GuruForU',
    url: 'https://www.guruforu.com',
    description: localized(content.orgSchemaDescription),
    foundingDate: '2024',
    knowsAbout: content.orgSchemaKnowsAbout.map((item) => localized(item)),
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
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
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

      <main className="about">
        {/* Hero */}
        <section className="about-hero" aria-labelledby="about-heading">
          <div className="gf-container about-hero-inner">
            <div className="gf-badge">
              <span className="gf-badge-dot" aria-hidden="true" />
              {localized(content.heroBadge)}
            </div>
            <h1 id="about-heading" className="about-hero-title">
              Online {localized('Math')} &amp; Science Tutoring That{' '}
              <span className="gf-text-primary">Works</span>
            </h1>
            <p className="about-hero-lead">
              GuruForU connects your child with expert tutors in live 1-on-1 sessions. Our AI
              tracks every concept they master — so you always know where they&apos;re improving
              and where they need help.
            </p>
            <div className="about-hero-ctas">
              <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                {localized('Book Free Session')}
              </Link>
              <Link href="/how-it-works" className="gf-btn-outline" prefetch={false}>
                {localized('How It Works')}
              </Link>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="home-trust" aria-label="GuruForU at a glance">
          <div className="gf-container">
            <div className="home-trust-grid">
              <div className="home-trust-item">
                <span className="home-trust-value">{content.trustGradeValue}</span>
                <span className="home-trust-label">{localized(content.trustGradeLabel)}</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">1-on-1</span>
                <span className="home-trust-label">{localized('Live Sessions')}</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">AI</span>
                <span className="home-trust-label">{localized('Progress Tracking')}</span>
              </div>
              <div className="home-trust-item">
                <span className="home-trust-value">Expert</span>
                <span className="home-trust-label">{localized('Certified Tutors')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="about-section" aria-labelledby="benefits-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="benefits-heading" className="about-section-title">
                What you get with GuruForU
              </h2>
              <p className="about-section-desc">
                Everything parents need for confident, measurable learning at home.
              </p>
            </div>
            <div className="about-cards about-cards-3">
              <article className="about-card">
                <div className="about-card-icon" aria-hidden="true">🎥</div>
                <h3 className="about-card-title">Live 1-on-1 tutoring</h3>
                <p className="about-card-text">
                  Expert {localized('Math')} &amp; Science teachers in real-time video sessions with
                  whiteboard and screen share.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-amber" aria-hidden="true">📚</div>
                <h3 className="about-card-title">{localized('Personalized lessons')}</h3>
                <p className="about-card-text">
                  Instruction aligned with your child&apos;s school curriculum and learning pace.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-green" aria-hidden="true">✨</div>
                <h3 className="about-card-title">AI progress reports</h3>
                <p className="about-card-text">
                  Mastery summaries after every session so you never guess if tutoring is working.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon" aria-hidden="true">📅</div>
                <h3 className="about-card-title">Flexible scheduling</h3>
                <p className="about-card-text">
                  Evenings, weekends, and holidays — book sessions when it works for your family.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-amber" aria-hidden="true">📝</div>
                <h3 className="about-card-title">Homework &amp; exam prep</h3>
                <p className="about-card-text">{localized(content.examPrepCard)}</p>
              </article>
              <article className="about-card">
                <div className="about-card-icon about-card-icon-green" aria-hidden="true">🌐</div>
                <h3 className="about-card-title">Global curriculum</h3>
                <p className="about-card-text">{localized(content.globalCurriculumCard)}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Math & Science */}
        <section className="about-section about-section-alt" aria-labelledby="subjects-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="subjects-heading" className="about-section-title">
                Subjects we tutor
              </h2>
              <p className="about-section-desc">{localized(content.subjectsSectionDesc)}</p>
            </div>

            <article className="about-topic-card">
              <div className="about-topic-header">
                <div className="about-topic-icon" aria-hidden="true">📐</div>
                <div>
                  <h3 className="about-topic-title">{localized('Math for every level')}</h3>
                  <p className="about-topic-desc">
                    Build confidence from arithmetic through advanced secondary {localized('Math')}{' '}
                    with tutors who adapt to your child&apos;s pace.
                  </p>
                </div>
              </div>
              <ul className="about-topic-list">
                {content.mathTopics.map((topic) => (
                  <li key={topic.label}>
                    <strong>{localized(topic.label)}</strong> — {localized(topic.text)}
                  </li>
                ))}
              </ul>
              <div className="about-topic-footer">
                <p className="about-topic-note">{localized(content.mathAlignmentNote)}</p>
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  Get {localized('Math')} Help
                </Link>
              </div>
            </article>

            <article className="about-topic-card">
              <div className="about-topic-header">
                <div className="about-topic-icon about-topic-icon-science" aria-hidden="true">🔬</div>
                <div>
                  <h3 className="about-topic-title">Science that makes sense</h3>
                  <p className="about-topic-desc">
                    Complex concepts broken into clear, visual lessons your child can actually
                    follow.
                  </p>
                </div>
              </div>
              <ul className="about-topic-list">
                {content.scienceTopics.map((topic) => (
                  <li key={topic.label}>
                    <strong>{localized(topic.label)}</strong> — {localized(topic.text)}
                  </li>
                ))}
              </ul>
              <div className="about-topic-footer">
                <p className="about-topic-note">{localized(content.scienceAlignmentNote)}</p>
                <Link href="/free-session" className="gf-btn-primary" prefetch={false}>
                  Get Science Help
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* How sessions work */}
        <section className="about-section" aria-labelledby="sessions-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="sessions-heading" className="about-section-title">
                How sessions work
              </h2>
              <p className="about-section-desc">
                Simple, focused, and designed for real progress every week.
              </p>
            </div>
            <div className="home-steps">
              <div className="home-step">
                <div className="home-step-num">1</div>
                <h3 className="home-step-title">Join live online</h3>
                <p className="home-step-text">
                  1-on-1 or small group (2–4) via video, whiteboard, and screen share in our
                  classroom.
                </p>
              </div>
              <div className="home-step">
                <div className="home-step-num">2</div>
                <h3 className="home-step-title">45–60 minute sessions</h3>
                <p className="home-step-text">
                  Long enough to make progress, short enough to stay focused. Scheduled around
                  your routine.
                </p>
              </div>
              <div className="home-step">
                <div className="home-step-num">3</div>
                <h3 className="home-step-title">{localized('Personalized pacing')}</h3>
                <p className="home-step-text">
                  Tutors spend more time where your child struggles and move ahead when
                  they&apos;re ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI + Tutors */}
        <section className="about-section about-section-alt" aria-labelledby="platform-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="platform-heading" className="about-section-title">
                AI insights &amp; expert tutors
              </h2>
              <p className="about-section-desc">
                Human expertise plus technology that keeps parents in the loop.
              </p>
            </div>
            <div className="about-cards about-cards-4">
              {TUTOR_CARDS.map((card) => (
                <article key={card.title} className="about-card">
                  <div className="about-card-icon" aria-hidden="true">{card.icon}</div>
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-text">{localized(card.text)}</p>
                </article>
              ))}
            </div>
            <article className="about-topic-card about-topic-card-spaced">
              <div className="about-topic-header">
                <div className="about-topic-icon" aria-hidden="true">📈</div>
                <div>
                  <h3 className="about-topic-title">AI-powered Mastery Reports</h3>
                  <p className="about-topic-desc">
                    After every session, our AI generates a report so you know exactly what your
                    child learned.
                  </p>
                </div>
              </div>
              <ul className="about-topic-list">
                {AI_REPORT_ITEMS.map((item) => (
                  <li key={item}>{localized(item)}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Why parents choose */}
        <section className="about-section" aria-labelledby="why-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="why-heading" className="about-section-title">
                Why parents choose GuruForU
              </h2>
            </div>
            <div className="about-cards about-cards-3">
              {WHY_CARDS.map((card) => (
                <article key={card.title} className="about-card">
                  <div className="about-card-icon" aria-hidden="true">{card.icon}</div>
                  <h3 className="about-card-title">{card.title}</h3>
                  <p className="about-card-text">
                    {'key' in card && card.key === 'globalReach'
                      ? localized(content.globalReachCard)
                      : card.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="about-section about-section-alt" aria-labelledby="faq-heading">
          <div className="gf-container">
            <div className="about-section-head">
              <h2 id="faq-heading" className="about-section-title">
                Frequently asked questions
              </h2>
            </div>
            <div className="about-faq">
              {faqItems.map((item) => (
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
                Ready to help your child succeed?
              </h2>
              <p className="about-cta-desc">
                Start with a free assessment session — no commitment, no credit card required.
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
                Questions? <Link href="/contact">Reach out anytime</Link> — we&apos;re here to
                help.
              </p>
            </div>
          </div>
        </section>

        <PageFooter />
      </main>
    </>
  )
}
