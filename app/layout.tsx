import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coming Soon - GuruForU',
  description: 'We\'re working hard to launch something amazing. Stay tuned!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

