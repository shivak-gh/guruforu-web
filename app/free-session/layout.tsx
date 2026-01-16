import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online Tuition Session & Student Assessment | GuruForU',
  description: 'Get a free 1-on-1 educational session. Our AI diagnostics identify learning gaps in any subject to help your child succeed. Book your free session today.',
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
    title: 'Free Online Tuition Session & Student Assessment | GuruForU',
    description: 'Get a free 1-on-1 educational session. Our AI diagnostics identify learning gaps in any subject to help your child succeed.',
    url: 'https://www.guruforu.com/free-session',
    siteName: 'GuruForU',
    images: [
      {
        url: '/guruforu-ai-education-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'GuruForU Free Session',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tuition Session & Student Assessment | GuruForU',
    description: 'Get a free 1-on-1 educational counseling session. Our AI diagnostics identify learning gaps.',
    images: ['/guruforu-ai-education-logo-dark.png'],
    creator: '@guruforu_official',
    site: '@guruforu_official',
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
  return <>{children}</>
}
