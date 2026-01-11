import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'GuruForU | Best Online Classes with AI-Powered Student Progress Tracker',
  description: 'Find the best online classes for your child with AI-powered personalized learning. Get comprehensive student progress tracking and mastery reports that show exactly how your child is advancing. Expert online tutors with AI-driven insights.',
  keywords: [
    'Best Online Classes',
    'Best Online Classes for Students',
    'Student Progress Tracker',
    'AI Student Progress Tracker',
    'Online Tuitions',
    'Online Tutoring',
    'Personalized Learning',
    'AI Mastery Tracking',
    'Online Classes for Kids',
    'Student Progress Monitoring',
    'AI-Powered Education',
    'Personalized Online Tutoring',
    'Home Schooling AI Assistant',
    'Online Coaching Mastery Reports',
    'Independent Teachers Platform',
    'GuruForU'
  ],
  icons: {
    icon: '/guruforu-ai-education-logo.png',
    apple: '/guruforu-ai-education-logo.png',
  },
  openGraph: {
    title: 'GuruForU - Best Online Classes with AI Student Progress Tracker',
    description: 'Premium online tuitions powered by AI. Get personalized learning with AI mastery tracking and expert online tutors. Comprehensive student progress reports for parents.',
    url: 'https://guruforu.com',
    siteName: 'GuruForU',
    images: [{ url: '/guruforu-ai-education-logo.png' }],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZGXL6MTDYY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZGXL6MTDYY');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}

