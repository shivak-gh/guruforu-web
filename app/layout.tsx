import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'GuruForU | AI-Powered Online Classes & Personalized Student Insights',
  description: 'Top-tier online classes enhanced by AI. GuruForU connects parents with independent teachers who provide data-driven student mastery reports and personalized learning paths.',
  keywords: [
    'GuruForU', 
    'Best Online Classes for Students', 
    'Personalized Online Tutoring', 
    'AI Student Progress Tracker', 
    'Home Schooling AI Assistant', 
    'Online Coaching Mastery Reports',
    'Independent Teachers Platform'
  ],
  icons: {
    icon: '/guruforu-ai-education-logo.png',
    apple: '/guruforu-ai-education-logo.png',
  },
  openGraph: {
    title: 'GuruForU - High-Impact Online Classes with AI Insights',
    description: 'Find expert independent teachers using AI to deliver the most detailed student progress reports in online education.',
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

