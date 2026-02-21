import styles from './page.module.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'

const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})

export const metadata: Metadata = {
  title: 'How It Works | Online Tutoring Platform | GuruForU',
  description: 'Learn how GuruForU works for teachers, students, and parents. Live video classes, AI-powered progress reports, interactive whiteboard, and complete visibility for parents.',
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
    title: 'How It Works | GuruForU Online Tutoring',
    description: 'Discover how GuruForU connects teachers, students, and parents through live video classes and AI-powered learning insights.',
    url: 'https://www.guruforu.com/how-it-works',
    siteName: 'GuruForU',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU - How Online Tutoring Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | GuruForU Online Tutoring',
    description: 'Live video classes, AI-powered progress reports, and complete visibility for parents.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
  },
  alternates: { canonical: 'https://www.guruforu.com/how-it-works' },
}

export default function HowItWorks() {
  const howItWorksSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How GuruForU Works',
    description: 'Learn how GuruForU connects teachers, students, and parents through live video classes and AI-powered learning insights.',
    url: 'https://www.guruforu.com/how-it-works',
    mainEntity: {
      '@type': 'Service',
      name: 'GuruForU Online Tutoring Platform',
      description: 'Real-time online classroom platform connecting teachers and students through live video, collaborative whiteboards, and AI-powered learning insights.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'GuruForU',
        url: 'https://www.guruforu.com',
      },
      serviceType: 'Online Tutoring',
      areaServed: 'Global',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Tutoring Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Live 1-on-1 Tutoring',
              description: 'HD video classes with interactive whiteboard and screen sharing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI-Powered Progress Reports',
              description: 'Automated session summaries and learning analytics for parents',
            },
          },
        ],
      },
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I get started as a teacher on GuruForU?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sign up using Google or email, complete your profile with subjects, qualifications and rates, get approved by our team, then start scheduling and conducting live classes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What features does the live classroom include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GuruForU classrooms include HD video calling, screen sharing, interactive whiteboard, live chat, session recording with transcription, and work on all major browsers.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can parents track their child\'s progress?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Parents receive AI-generated session reports after each class, can view session timelines, access periodic progress reports, and monitor assignments from their dashboard.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do teachers keep 100% of their earnings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, teachers keep 100% of their class fees with zero commission. GuruForU only charges a nominal platform fee per session.',
        },
      },
    ],
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
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>
        <div className={styles.content}>
          <article className={styles.article}>
            <h1 className={styles.title}>How GuruForU Works</h1>
            <p className={styles.lead}>
              GuruForU is a real-time online classroom platform that connects teachers and students through 
              <strong> live video</strong>, <strong>collaborative whiteboards</strong>, and <strong>AI-powered learning insights</strong>. 
              Whether you&apos;re a teacher, student, or parent — we have everything you need.
            </p>

            {/* Navigation Tabs */}
            <div className={styles.tabNav}>
              <a href="#teachers" className={styles.tabLink}>For Teachers</a>
              <a href="#students" className={styles.tabLink}>For Students</a>
              <a href="#parents" className={styles.tabLink}>For Parents</a>
            </div>

            {/* For Teachers Section */}
            <section id="teachers" className={styles.section}>
              <h2 className={styles.sectionTitle}>For Teachers</h2>
              
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Get Started in Minutes</h3>
                <ol className={styles.numberedList}>
                  <li><strong>Sign up</strong> using Google or email — it&apos;s quick and free.</li>
                  <li><strong>Complete your profile</strong> — add your subjects, qualifications, experience, class rate, and a short bio.</li>
                  <li><strong>Get approved</strong> — our team reviews your profile to ensure quality for students.</li>
                  <li><strong>Start teaching</strong> — once approved, you&apos;re ready to schedule and conduct live classes.</li>
                </ol>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Set Your Own Schedule</h3>
                <ul className={styles.list}>
                  <li>Use the <strong>weekly availability grid</strong> to mark the days and times you&apos;re free to teach.</li>
                  <li>Add <strong>break times and holidays</strong> so students only book when you&apos;re available.</li>
                  <li>View your <strong>projected earnings</strong> based on your availability — see weekly and monthly estimates at a glance.</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Conduct Live Classes</h3>
                <ul className={styles.list}>
                  <li><strong>HD Video &amp; Audio</strong> — teach face-to-face with your students using real-time video.</li>
                  <li><strong>Screen Sharing</strong> — share your screen to walk through presentations, documents, or coding exercises.</li>
                  <li><strong>Interactive Whiteboard</strong> — draw, annotate, and explain concepts visually in real time.</li>
                  <li><strong>Live Chat</strong> — exchange messages during the session for quick notes, links, or questions.</li>
                  <li><strong>Session Timer</strong> — track class duration in real time; the timer persists even if you refresh the page.</li>
                </ul>
              </div>

              <div className={styles.highlightBox}>
                <h3>AI-Vista Educator Suite</h3>
                <ul>
                  <li><strong>Zero Admin Workflow</strong> — AI automatically generates executive-quality session reports after every class. No manual note-taking required.</li>
                  <li><strong>Objective Growth Proof</strong> — share AI-generated progress reports with parents to demonstrate measurable student improvement.</li>
                  <li><strong>100% Revenue Ownership</strong> — keep what you earn. No commission fees, no marketplace cuts. We charge only a nominal platform fee per session.</li>
                  <li><strong>Build Your Global Brand</strong> — teach students from anywhere in the world and grow your independent tutoring practice.</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Points &amp; Earnings</h3>
                <ul className={styles.list}>
                  <li><strong>Bonus points</strong> awarded when you join the platform.</li>
                  <li><strong>Free classes</strong> to get started — no points needed for your first sessions.</li>
                  <li>After free classes, a <strong>nominal platform fee</strong> is deducted per session from your points balance.</li>
                  <li><strong>Purchase point packs</strong> anytime to keep teaching without interruption.</li>
                  <li><strong>Track everything</strong> — view your complete transaction history, total earnings, points balance, and class payment records from your dashboard.</li>
                </ul>
              </div>
            </section>

            {/* For Students Section */}
            <section id="students" className={styles.section}>
              <h2 className={styles.sectionTitle}>For Students</h2>
              
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Get Started Easily</h3>
                <ol className={styles.numberedList}>
                  <li><strong>Sign up</strong> using Google or email — choose the &quot;Student&quot; role.</li>
                  <li><strong>Complete your profile</strong> — add your name, grade level, learning goals, and preferred subjects.</li>
                  <li><strong>Connect with teachers</strong> — browse teacher profiles, check their expertise, and send a connection request.</li>
                  <li><strong>Start learning</strong> — once a teacher accepts, you can join scheduled live classes.</li>
                </ol>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Join Live Classes</h3>
                <ul className={styles.list}>
                  <li><strong>One-click classroom entry</strong> — join your scheduled class directly from your dashboard.</li>
                  <li><strong>HD Video &amp; Audio</strong> — see and hear your teacher clearly with real-time video.</li>
                  <li><strong>Interactive Whiteboard</strong> — follow along as your teacher draws and explains, or use the whiteboard yourself.</li>
                  <li><strong>Live Chat</strong> — ask questions, share notes, and interact during the session.</li>
                  <li><strong>Screen Sharing</strong> — view your teacher&apos;s screen for demonstrations and walkthroughs.</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Track Your Progress</h3>
                <ul className={styles.list}>
                  <li><strong>Session History</strong> — view all your past and upcoming classes with details like subject, date, duration, and teacher.</li>
                  <li><strong>AI-Powered Reports</strong> — receive detailed session summaries generated by AI after each class, covering key topics, engagement, and areas for improvement.</li>
                  <li><strong>Progress Reports</strong> — access periodic reports that track your learning trends and highlight strengths.</li>
                </ul>
              </div>
            </section>

            {/* For Parents Section */}
            <section id="parents" className={styles.section}>
              <h2 className={styles.sectionTitle}>For Parents</h2>
              <p className={styles.text}>
                GuruForU gives parents <strong>complete visibility and control</strong> over their child&apos;s learning journey — from enrollment to progress tracking.
              </p>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Enroll Your Child</h3>
                <ul className={styles.list}>
                  <li><strong>Add your child</strong> to the platform with their name, grade, subjects, and login credentials.</li>
                  <li><strong>Manage passwords</strong> — reset and update your child&apos;s account password anytime.</li>
                  <li><strong>Profile management</strong> — update your own profile and your child&apos;s information as needed.</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Manage Teacher Connections</h3>
                <ul className={styles.list}>
                  <li><strong>Approve or reject</strong> teacher connection requests for your child.</li>
                  <li><strong>Pause or resume</strong> access to any connected teacher at any time.</li>
                  <li><strong>Full oversight</strong> — you decide who teaches your child.</li>
                </ul>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Purchase Credits</h3>
                <ul className={styles.list}>
                  <li><strong>Buy class credits</strong> to book sessions for your child.</li>
                  <li><strong>Flexible packages</strong> available in multiple currencies.</li>
                  <li><strong>Secure payments</strong> powered by trusted payment providers.</li>
                  <li><strong>Track your balance</strong> — view credit balance and full transaction history from your dashboard.</li>
                </ul>
              </div>

              <div className={styles.highlightBox}>
                <h3>Monitor Sessions &amp; Progress</h3>
                <ul>
                  <li><strong>Session Timeline</strong> — view every attended session with subject, date, time, duration, teacher name, and status.</li>
                  <li><strong>AI Session Reports</strong> — receive detailed, AI-generated reports after each class covering topics discussed, engagement, strengths, and recommendations.</li>
                  <li><strong>Periodic Progress Reports</strong> — access monthly and quarterly reports that track learning trends over time.</li>
                  <li><strong>Assignment Tracking</strong> — monitor your child&apos;s assignments, submission status, due dates, and scores.</li>
                </ul>
              </div>
            </section>

            {/* Live Classroom Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>The Live Classroom Experience</h2>
              <p className={styles.text}>
                Every GuruForU class happens in a purpose-built virtual classroom designed for interactive learning:
              </p>

              <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                  <h4>HD Video Calling</h4>
                  <p>Crystal-clear, real-time video and audio powered by WebRTC peer-to-peer technology</p>
                </div>
                <div className={styles.featureCard}>
                  <h4>Screen Sharing</h4>
                  <p>Teachers can share their entire screen or specific windows for demonstrations</p>
                </div>
                <div className={styles.featureCard}>
                  <h4>Interactive Whiteboard</h4>
                  <p>Draw, write, and annotate in real time — both teachers and students can participate</p>
                </div>
                <div className={styles.featureCard}>
                  <h4>Live Chat</h4>
                  <p>Exchange messages, links, and notes instantly during the session</p>
                </div>
                <div className={styles.featureCard}>
                  <h4>Session Recording</h4>
                  <p>Classes are recorded with audio transcription for later review</p>
                </div>
                <div className={styles.featureCard}>
                  <h4>Works Everywhere</h4>
                  <p>Compatible with Chrome, Firefox, Edge, and Safari on desktop and mobile</p>
                </div>
              </div>

              <div className={styles.requirements}>
                <h3 className={styles.subsectionTitle}>Minimum Requirements</h3>
                <ul className={styles.list}>
                  <li><strong>Internet:</strong> 5 Mbps or higher (wired connection recommended)</li>
                  <li><strong>Device:</strong> Laptop, desktop, or tablet with a webcam and microphone</li>
                  <li><strong>Browser:</strong> Latest version of Chrome (recommended), Firefox, Edge, or Safari</li>
                  <li><strong>Accessories:</strong> Writing pad recommended for students, mandatory for teachers</li>
                </ul>
              </div>
            </section>

            {/* AI-Vista Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>AI-Vista — Smart Learning Insights</h2>
              <p className={styles.text}>
                GuruForU&apos;s <strong>AI-Vista</strong> technology automatically analyzes every session and generates professional reports — so teachers can focus on teaching and parents can stay informed.
              </p>

              <div className={styles.highlightBox}>
                <h3>What AI-Vista Delivers</h3>
                <ul>
                  <li><strong>Automated Session Summaries</strong> — detailed reports generated instantly after each class, covering topics, engagement, and key moments.</li>
                  <li><strong>Audio Transcription</strong> — every session is transcribed, making it easy to revisit what was discussed.</li>
                  <li><strong>Progress Analytics</strong> — track improvement over time with data-driven insights on strengths and areas to work on.</li>
                  <li><strong>Zero Extra Work</strong> — no manual note-taking, no admin overhead. AI handles it all.</li>
                </ul>
              </div>

              <div className={styles.comparisonTable}>
                <h3 className={styles.subsectionTitle}>How We Compare</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Traditional Platforms</th>
                      <th>GuruForU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Session Reports</td>
                      <td>Manual / None</td>
                      <td className={styles.highlight}>AI-generated automatically</td>
                    </tr>
                    <tr>
                      <td>Commission</td>
                      <td>25-40% taken</td>
                      <td className={styles.highlight}>Zero commission</td>
                    </tr>
                    <tr>
                      <td>Revenue Ownership</td>
                      <td>Platform keeps majority</td>
                      <td className={styles.highlight}>Teacher keeps 100%</td>
                    </tr>
                    <tr>
                      <td>Parent Visibility</td>
                      <td>Limited or none</td>
                      <td className={styles.highlight}>Full AI-powered reports</td>
                    </tr>
                    <tr>
                      <td>Admin Work</td>
                      <td>Hours of paperwork</td>
                      <td className={styles.highlight}>Zero — AI handles it</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Why Choose Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Why Choose GuruForU?</h2>
              <div className={styles.benefitsGrid}>
                <div className={styles.benefitCard}>
                  <h4>For Teachers</h4>
                  <p>Teach on your terms. Set your own rates, keep 100% of your earnings, and let AI handle the admin work.</p>
                </div>
                <div className={styles.benefitCard}>
                  <h4>For Students</h4>
                  <p>Learn from verified teachers in an interactive virtual classroom with real-time video, whiteboard, and chat.</p>
                </div>
                <div className={styles.benefitCard}>
                  <h4>For Parents</h4>
                  <p>Stay fully informed with AI-powered session reports, progress tracking, and complete control over your child&apos;s learning.</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
              <div className={styles.ctaBox}>
                <h3>Ready to Get Started?</h3>
                <p>Join GuruForU today — it&apos;s free to sign up for teachers and students!</p>
                <Link href="/free-session" className={styles.ctaButton}>
                  Book a Free Session →
                </Link>
              </div>
            </section>
          </article>

          <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink} prefetch={false}>Home</Link>
              <Link href="/about" className={styles.footerLink} prefetch={false}>About</Link>
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
