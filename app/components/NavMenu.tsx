'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { detectLocale, localizeText, type Region } from '../../lib/locale'
import styles from './NavMenu.module.css'

const NAV_ITEMS = [
  { href: '/', label: 'Home', ariaLabel: 'GuruForU Home Page' },
  { href: '/about', label: 'About Us', ariaLabel: 'About GuruForU' },
  { href: '/how-it-works', label: 'How It Works', ariaLabel: 'How GuruForU Works' },
  { href: '/blog', label: 'Resources', ariaLabel: 'Learning Resources' },
  { href: '/contact', label: 'Contact', ariaLabel: 'Contact GuruForU' },
] as const

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NavMenu() {
  const pathname = usePathname()
  const [region, setRegion] = useState<Region>('DEFAULT')

  useEffect(() => {
    const localeInfo = detectLocale()
    setRegion(localeInfo.region)
  }, [])

  const localized = (text: string) => localizeText(text, region)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoLink} onClick={closeMenu}>
          <Image
            src="/guruforu-ai-education-logo-dark.png"
            alt="GuruForU Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.logoText}>GuruForU</span>
        </Link>

        {/* Desktop Menu */}
        <ul className={styles.desktopMenu}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${isNavActive(pathname, item.href) ? styles.navLinkActive : ''}`}
                aria-label={item.ariaLabel}
                aria-current={isNavActive(pathname, item.href) ? 'page' : undefined}
              >
                {localized(item.label)}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://learn.guruforu.com/"
              className={styles.navPortal}
              target="_blank"
              rel="noopener noreferrer"
            >
              {localized('Go to Classroom')}
            </a>
          </li>
          <li>
            <Link href="/free-session" className={styles.navCta}>
              {localized('Book Free Session')}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.mobileMenuList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.mobileNavLink} ${isNavActive(pathname, item.href) ? styles.mobileNavLinkActive : ''}`}
                onClick={closeMenu}
                aria-label={item.ariaLabel}
                aria-current={isNavActive(pathname, item.href) ? 'page' : undefined}
              >
                {localized(item.label)}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://learn.guruforu.com/"
              className={styles.mobilePortal}
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              {localized('Go to Classroom')}
            </a>
          </li>
          <li>
            <Link href="/free-session" className={styles.mobileCta} onClick={closeMenu}>
              {localized('Book Free Session')}
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </nav>
  )
}
