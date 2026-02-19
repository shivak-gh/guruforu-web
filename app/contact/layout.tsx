import type { Metadata } from 'next'
import Script from 'next/script'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I contact GuruForU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact GuruForU through the contact form on this page, by email at support@guruforu.com, or via WhatsApp. We typically respond within 24-48 hours.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is GuruForU\'s response time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We respond to inquiries within 24-48 hours during business days. For urgent matters, WhatsApp may provide a faster response.'
      }
    }
  ]
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'GuruForU',
  url: 'https://www.guruforu.com',
  description: 'AI-powered online tuition with personalized learning and student progress tracking.',
  email: 'support@guruforu.com',
  sameAs: [
    'https://twitter.com/guruforu_official',
    'https://www.instagram.com/guruforu_official/'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@guruforu.com',
    availableLanguage: 'English',
    areaServed: 'Worldwide',
    url: 'https://www.guruforu.com/contact'
  }
}

export const metadata: Metadata = {
  title: 'Contact Us | GuruForU - Get in Touch',
  description: 'Contact GuruForU for questions about online classes, AI-powered learning, or student progress tracking. We respond within 24-48 hours.',
  keywords: [
    'Contact GuruForU',
    'Online Tutoring Support',
    'Education Help',
    'Student Progress Questions',
    'AI Learning Support',
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
    title: 'Contact Us | GuruForU - Get in Touch',
    description: 'Contact GuruForU for questions about online classes, AI-powered learning, or student progress tracking.',
    url: 'https://www.guruforu.com/contact',
    siteName: 'GuruForU',
    images: [
      {
        url: 'https://www.guruforu.com/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Contact',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | GuruForU',
    description: 'Contact GuruForU for questions about online classes, AI-powered learning, or student progress tracking.',
    images: ['https://www.guruforu.com/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
  },
  alternates: {
    canonical: 'https://www.guruforu.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="contact-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="contact-localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  )
}
