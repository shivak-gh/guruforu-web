import type { Metadata } from 'next'
import Script from 'next/script'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the free consultation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free consultation is a 1-on-1 educational counseling session where our AI diagnostics identify your child\'s learning gaps in any subject. We provide a personalized learning roadmap to help your child succeed.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is the free session really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There is no charge for the free consultation and student assessment. It is designed to help parents understand their child\'s learning needs before committing to tuition.'
      }
    },
    {
      '@type': 'Question',
      name: 'What happens during the free session?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'During the session, we assess your child\'s current level, identify gaps in understanding, and discuss a personalized learning plan. You can choose to book via the form or WhatsApp.'
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'Free Online Tuition Consultation & Student Assessment | GuruForU',
  description: 'Get a free 1-on-1 educational counseling session. Our AI diagnostics identify learning gaps in any subject to help your child succeed.',
  keywords: [
    'Free Online Tuition Consultation',
    'Free Student Assessment',
    'AI Learning Diagnostic',
    'Student Progress Analysis',
    'Free Educational Counseling',
    'Online Tutoring Consultation',
    'Child Learning Assessment',
    'Personalized Learning Roadmap',
    'GuruForU'
  ],
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
    title: 'Free Online Tuition Consultation & Student Assessment | GuruForU',
    description: 'Get a free 1-on-1 educational counseling session. Our AI diagnostics identify learning gaps to help your child succeed.',
    url: 'https://www.guruforu.com/free-session',
    siteName: 'GuruForU',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Free Consultation',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tuition Consultation & Student Assessment | GuruForU',
    description: 'Get a free 1-on-1 educational counseling session. Our AI diagnostics identify learning gaps.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
  },
  alternates: {
    canonical: 'https://www.guruforu.com/free-session',
  },
}

export default function FreeConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="free-session-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
