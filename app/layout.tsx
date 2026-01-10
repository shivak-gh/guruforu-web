import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'GuruForU | AI-Powered Teaching Assistant & Learning Insights',
  description: 'Empowering independent teachers with AI-driven classroom insights, automated progress reports, and personalized student mastery tracking.',
  keywords: ['GuruForU', 'AI Teaching Assistant', 'Student Progress Insights', 'Personalized Learning Portal', 'Teacher Virtual Office'],
  icons: {
    icon: '/guru-logo.jpg',
    apple: '/guru-logo.jpg',
  },
  openGraph: {
    title: 'GuruForU - Elevate Your Teaching Experience',
    description: 'Provide professional learning insights and automated summaries for your students effortlessly.',
    url: 'https://guruforu.com',
    siteName: 'GuruForU',
    images: [{ url: '/guruforu.png' }],
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

