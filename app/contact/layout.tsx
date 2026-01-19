import type { Metadata } from 'next'

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
  return children
}
