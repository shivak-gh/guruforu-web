import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'

const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})

export const metadata: Metadata = {
  title: 'Online Math & Science Tutoring | Free Session | GuruForU',
  description: 'Struggling with Math or Science? Get a FREE assessment session with expert tutors. Live 1-on-1 tutoring for K-12 students. See real progress with AI tracking. Book now!',
  keywords: [
    'online math tutoring',
    'online science tutoring',
    'K-12 tutoring',
    'free tutoring session',
    'algebra help online',
    'chemistry tutoring online',
    'physics tutoring online',
    'SAT math prep',
    'math tutor near me',
    'science tutor for kids',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Online Math & Science Tutoring | FREE Session',
    description: 'Expert 1-on-1 tutoring for K-12 students. Book your FREE assessment session today. Real teachers, real results, AI progress tracking.',
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
    description: 'Live online Math and Science tutoring for K-12 students. Expert teachers deliver personalized instruction aligned with Common Core and state standards, with AI-powered progress tracking.',
    foundingDate: '2024',
    knowsAbout: ['Math Tutoring', 'Science Tutoring', 'K-12 Education', 'Common Core', 'SAT Prep', 'AI Progress Tracking'],
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
        name: 'What Math subjects does GuruForU tutor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU offers tutoring for all K-12 Math levels: Elementary Math, Pre-Algebra, Algebra 1 & 2, Geometry, Trigonometry, Pre-Calculus, Calculus, and Statistics. We also offer SAT/ACT Math prep. All instruction is aligned with Common Core and state standards.'
        }
      },
      {
        '@type': 'Question',
        name: 'What Science subjects does GuruForU tutor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU offers tutoring for Biology, Chemistry, Physics, Earth Science, and General Science for all grade levels. We cover honors, AP, and standard courses, plus SAT Subject Test and AP exam preparation.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do live tutoring sessions work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Students meet with their tutor in live 1-on-1 or small group sessions (2-4 students) via our online classroom. Sessions include video chat, screen sharing, digital whiteboard, and real-time problem solving. Most sessions are 45-60 minutes.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do parents track their child\'s progress?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'After each session, parents receive AI-generated mastery reports showing topics covered, concepts mastered, areas needing work, and personalized recommendations. Our parent dashboard shows progress over time with clear visualizations.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the tutor qualifications?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All GuruForU tutors have degrees in Math, Science, or Education, with teaching or tutoring experience. Many are current or former classroom teachers. All tutors are background-checked and trained on our platform.'
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
            <h1 className={styles.title}>Online Math &amp; Science Tutoring That Works</h1>
            <p className={styles.lead}>
              Is your child struggling with Algebra? Falling behind in Chemistry? Feeling overwhelmed by homework?
              <br /><br />
              <strong>GuruForU connects your child with expert Math and Science tutors</strong> in live, 1-on-1 online sessions. 
              Our AI tracks every concept they master—so you can see exactly where they&apos;re improving and where they need more help.
            </p>

            <div className={styles.ctaBox}>
              <span className={styles.urgencyBadge}>Limited Spots Available</span>
              <h3>Start with a FREE Assessment Session</h3>
              <p>See how our tutors can help your child succeed in Math &amp; Science</p>
              <Link href="/free-session" className={styles.ctaButton}>
                Book Your Free Session →
              </Link>
            </div>

            <div className={styles.trustSignals}>
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>K-12</span>
                <span className={styles.trustLabel}>All Grade Levels</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>1-on-1</span>
                <span className={styles.trustLabel}>Live Sessions</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>AI</span>
                <span className={styles.trustLabel}>Progress Tracking</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustNumber}>Expert</span>
                <span className={styles.trustLabel}>Certified Tutors</span>
              </div>
            </div>

            <div className={styles.highlightBox}>
              <h3>What You Get with GuruForU:</h3>
              <ul>
                <li>✓ <strong>Live 1-on-1 tutoring</strong> with expert Math &amp; Science teachers</li>
                <li>✓ <strong>Personalized lessons</strong> aligned with your child&apos;s school curriculum</li>
                <li>✓ <strong>AI-powered progress reports</strong> after every session</li>
                <li>✓ <strong>Flexible scheduling</strong> — evenings, weekends, whenever works for you</li>
                <li>✓ <strong>Homework help &amp; exam prep</strong> including SAT/ACT</li>
              </ul>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Math Tutoring for Every Level</h2>
              <p className={styles.text}>
                From elementary arithmetic to AP Calculus, our tutors help students build confidence and master concepts at every grade level:
              </p>
              <ul className={styles.list}>
                <li><strong>Elementary Math (K-5)</strong> — Number sense, fractions, decimals, word problems, multiplication, division</li>
                <li><strong>Middle School Math (6-8)</strong> — Pre-Algebra, ratios, proportions, integers, intro to equations</li>
                <li><strong>Algebra 1 &amp; 2</strong> — Linear equations, quadratics, polynomials, functions, graphing</li>
                <li><strong>Geometry</strong> — Proofs, triangles, circles, area, volume, coordinate geometry</li>
                <li><strong>Pre-Calculus &amp; Trigonometry</strong> — Functions, limits, trig identities, sequences</li>
                <li><strong>Calculus (AP &amp; College Prep)</strong> — Derivatives, integrals, applications</li>
                <li><strong>SAT/ACT Math Prep</strong> — Test strategies, timed practice, score improvement</li>
              </ul>
              <p className={styles.text}>
                All instruction is aligned with <strong>Common Core</strong> and state standards. We work with your child&apos;s school curriculum—not against it.
              </p>

              <div className={styles.ctaBox}>
                <h3>Struggling with Math?</h3>
                <p>Our expert tutors have helped thousands of students go from frustrated to confident</p>
                <Link href="/free-session" className={styles.ctaButton}>
                  Get Math Help Now →
                </Link>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Science Tutoring That Makes Sense</h2>
              <p className={styles.text}>
                Science can feel abstract and confusing. Our tutors break down complex concepts into clear, understandable lessons:
              </p>
              <ul className={styles.list}>
                <li><strong>Biology</strong> — Cells, genetics, evolution, anatomy, ecology, AP Biology</li>
                <li><strong>Chemistry</strong> — Atomic structure, reactions, stoichiometry, acids/bases, AP Chemistry</li>
                <li><strong>Physics</strong> — Motion, forces, energy, waves, electricity, AP Physics</li>
                <li><strong>Earth &amp; Environmental Science</strong> — Geology, weather, climate, ecosystems</li>
                <li><strong>General Science (K-8)</strong> — Scientific method, experiments, foundational concepts</li>
              </ul>
              <p className={styles.text}>
                We cover <strong>honors, AP, and standard courses</strong>—plus lab report help and exam preparation.
              </p>

              <div className={styles.ctaBox}>
                <h3>Need Science Help?</h3>
                <p>From Biology to Physics — we make complex concepts click</p>
                <Link href="/free-session" className={styles.ctaButton}>
                  Get Science Help Now →
                </Link>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How Sessions Work</h2>
              <p className={styles.text}>
                <strong>Live 1-on-1 or Small Group (2-4 students)</strong> — Your child meets with their tutor in our online classroom via video chat. Sessions include screen sharing, a digital whiteboard for working through problems, and real-time Q&amp;A.
              </p>
              <p className={styles.text}>
                <strong>45-60 Minute Sessions</strong> — Long enough to make real progress, short enough to keep focus. Sessions are scheduled around your family&apos;s routine—after school, evenings, or weekends.
              </p>
              <p className={styles.text}>
                <strong>Personalized Instruction</strong> — Tutors adapt to your child&apos;s pace. Struggling with fractions? We&apos;ll spend more time there. Ready to move ahead? We&apos;ll challenge them with harder problems.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>AI-Powered Progress Tracking</h2>
              <p className={styles.text}>
                After every session, our AI analyzes your child&apos;s performance and generates a <strong>Mastery Report</strong> for parents:
              </p>
              <ul className={styles.list}>
                <li><strong>Topics Covered</strong> — What was taught in the session</li>
                <li><strong>Concepts Mastered</strong> — What your child now understands well</li>
                <li><strong>Areas Needing Work</strong> — Where they need more practice</li>
                <li><strong>Personalized Recommendations</strong> — What to focus on next</li>
                <li><strong>Progress Over Time</strong> — Visual charts showing improvement</li>
              </ul>
              <p className={styles.text}>
                No more guessing if tutoring is working. You&apos;ll see exactly how your child is progressing—backed by data.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Our Tutors</h2>
              <p className={styles.text}>
                Every GuruForU tutor is carefully selected and trained:
              </p>
              <ul className={styles.list}>
                <li><strong>Degrees in Math, Science, or Education</strong></li>
                <li><strong>Teaching or tutoring experience</strong> — Many are current or former classroom teachers</li>
                <li><strong>Background-checked and vetted</strong></li>
                <li><strong>Trained on our platform</strong> and teaching methods</li>
              </ul>
              <p className={styles.text}>
                We match your child with a tutor who fits their learning style, grade level, and subject needs.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Why Parents Choose GuruForU</h2>
              <ul className={styles.list}>
                <li><strong>Real teachers, real-time</strong> — Not videos. Not AI chatbots. Live instruction with a human expert.</li>
                <li><strong>You see the progress</strong> — Detailed reports after every session, not just a grade at the end of the semester.</li>
                <li><strong>Flexible scheduling</strong> — Sessions fit your life, not the other way around.</li>
                <li><strong>Aligned with school</strong> — We support what your child is learning in class, not a separate curriculum.</li>
                <li><strong>One platform</strong> — Student learning, teacher instruction, and parent reporting all in one place.</li>
              </ul>
            </section>

            <section className={styles.ctaSection}>
              <div className={styles.ctaBox}>
                <span className={styles.urgencyBadge}>Book This Week — Limited Availability</span>
                <h3>Ready to Help Your Child Succeed?</h3>
                <p>Start with a FREE assessment session. No commitment, no credit card required.</p>
                <Link href="/free-session" className={styles.ctaButton}>
                  Book Your Free Session Now →
                </Link>
              </div>
              <p className={styles.text} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Questions? <Link href="/contact" className={styles.link}>Contact us</Link> or call/text us anytime.
              </p>
            </section>

            <section className={styles.faqSection}>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <dl className={styles.faqList}>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>What Math subjects does GuruForU tutor?</dt>
                  <dd className={styles.faqAnswer}>
                    We tutor all K-12 Math levels: Elementary Math, Pre-Algebra, Algebra 1 &amp; 2, Geometry, Trigonometry, Pre-Calculus, Calculus, and Statistics. We also offer SAT/ACT Math prep. All instruction is aligned with Common Core and state standards.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>What Science subjects does GuruForU tutor?</dt>
                  <dd className={styles.faqAnswer}>
                    We tutor Biology, Chemistry, Physics, Earth Science, and General Science for all grade levels. We cover honors, AP, and standard courses, plus SAT Subject Test and AP exam preparation.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>How do live tutoring sessions work?</dt>
                  <dd className={styles.faqAnswer}>
                    Students meet with their tutor in live 1-on-1 or small group sessions (2-4 students) via our online classroom. Sessions include video chat, screen sharing, digital whiteboard, and real-time problem solving. Most sessions are 45-60 minutes.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>How do parents track their child&apos;s progress?</dt>
                  <dd className={styles.faqAnswer}>
                    After each session, parents receive AI-generated Mastery Reports showing topics covered, concepts mastered, areas needing work, and personalized recommendations. Our parent dashboard shows progress over time with clear visualizations.
                  </dd>
                </div>
                <div className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>What are the tutor qualifications?</dt>
                  <dd className={styles.faqAnswer}>
                    All GuruForU tutors have degrees in Math, Science, or Education, with teaching or tutoring experience. Many are current or former classroom teachers. All tutors are background-checked and trained on our platform.
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
