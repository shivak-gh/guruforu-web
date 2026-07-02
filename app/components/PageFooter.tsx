import Link from 'next/link'
import Image from 'next/image'

type PageFooterProps = {
  localized?: (text: string) => string
}

export default function PageFooter({ localized = (t) => t }: PageFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="gf-footer">
      <div className="gf-container">
        <div className="gf-footer-grid">
          <div className="gf-footer-brand-col">
            <Link href="/" className="gf-footer-brand" prefetch={false}>
              <Image
                src="/guruforu-ai-education-logo-dark.png"
                alt=""
                width={36}
                height={36}
                className="gf-footer-logo"
              />
              <span className="gf-footer-name">GuruForU</span>
            </Link>
            <p className="gf-footer-tagline">
              Live 1-on-1 Math &amp; Science tutoring with AI-powered progress tracking for K-12
              students.
            </p>
          </div>

          <nav className="gf-footer-col" aria-label="Company">
            <h3 className="gf-footer-heading">{localized('Company')}</h3>
            <ul className="gf-footer-links">
              <li>
                <Link href="/about" className="gf-footer-link" prefetch={false}>
                  {localized('About Us')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="gf-footer-link" prefetch={false}>
                  {localized('Contact')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="gf-footer-link" prefetch={false}>
                  {localized('Blog')}
                </Link>
              </li>
              <li>
                <Link href="/site-map" className="gf-footer-link" prefetch={false}>
                  {localized('Site Map')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="gf-footer-col" aria-label="Product">
            <h3 className="gf-footer-heading">{localized('Product')}</h3>
            <ul className="gf-footer-links">
              <li>
                <Link href="/how-it-works" className="gf-footer-link" prefetch={false}>
                  {localized('How It Works')}
                </Link>
              </li>
              <li>
                <Link href="/free-session" className="gf-footer-link" prefetch={false}>
                  {localized('Free Session')}
                </Link>
              </li>
              <li>
                <a
                  href="https://learn.guruforu.com/"
                  className="gf-footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {localized('Classroom Login')}
                </a>
              </li>
            </ul>
          </nav>

          <nav className="gf-footer-col" aria-label="Legal">
            <h3 className="gf-footer-heading">{localized('Legal')}</h3>
            <ul className="gf-footer-links">
              <li>
                <Link href="/terms" className="gf-footer-link" prefetch={false}>
                  {localized('Terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="gf-footer-link" prefetch={false}>
                  {localized('Privacy')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="gf-footer-link" prefetch={false}>
                  {localized('Shipping')}
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refunds" className="gf-footer-link" prefetch={false}>
                  {localized('Refunds')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="gf-footer-bottom">
          <p className="gf-footer-copy">
            © {year} GuruForU. {localized('All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  )
}
