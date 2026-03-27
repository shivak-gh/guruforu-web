import type { Metadata } from 'next'
import Script from 'next/script'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the free Math & Science assessment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free session is a 15-minute 1-on-1 assessment where our expert tutors evaluate your child\'s current level in Math or Science, identify learning gaps, and create a personalized improvement plan.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this really free with no obligation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free with no credit card required and no obligation. It\'s designed to help you understand how GuruForU can help your child succeed in Math and Science before making any commitment.'
      }
    },
    {
      '@type': 'Question',
      name: 'What Math and Science subjects do you cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cover all K-12 Math (Elementary Math through AP Calculus, SAT/ACT Prep) and Science (Biology, Chemistry, Physics, Earth Science) including honors and AP courses.'
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'Book a Free Math & Science Assessment | GuruForU',
  description: 'Book a free 15-minute assessment with expert Math and Science tutors. No credit card, no obligation, and a clear plan for your child.',
  keywords: [
    'free math tutoring session',
    'free science tutoring',
    'math tutor free trial',
    'algebra help free',
    'chemistry tutoring free session',
    'physics tutor free',
    'K-12 tutoring free trial',
    'online math tutor',
    'SAT prep free session',
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
    title: 'Free Math & Science Assessment | GuruForU',
    description: 'Book a free 15-minute assessment with expert tutors and get a personalized next-step plan.',
    url: 'https://www.guruforu.com/free-session',
    siteName: 'GuruForU',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Free Math & Science Session',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Math & Science Assessment | GuruForU',
    description: 'No-obligation 15-minute assessment with expert tutors. Book your free session.',
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
