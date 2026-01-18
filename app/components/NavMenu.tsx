'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './NavMenu.module.css'

export default function NavMenu() {
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
            src="/guruforu-ai-education-logo.png"
            alt="GuruForU Logo"
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
          <span className={styles.logoText}>GuruForU</span>
        </Link>

        {/* Desktop Menu */}
        <ul className={styles.desktopMenu}>
          <li>
            <Link href="/" className={styles.navLink} aria-label="GuruForU Home Page">Home</Link>
          </li>
          <li>
            <Link href="/blog" className={styles.navLink} aria-label="Education Blog Articles">Blog</Link>
          </li>
          <li>
            <Link href="/free-session" className={styles.navLink}>Free Session</Link>
          </li>
          <li>
            <Link href="/contact" className={styles.navLink} aria-label="Contact GuruForU">Contact</Link>
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
          <li>
            <Link href="/" className={styles.mobileNavLink} onClick={closeMenu} aria-label="GuruForU Home Page">Home</Link>
          </li>
          <li>
            <Link href="/blog" className={styles.mobileNavLink} onClick={closeMenu} aria-label="Education Blog Articles">Blog</Link>
          </li>
          <li>
            <Link href="/free-session" className={styles.mobileNavLink} onClick={closeMenu}>Free Session</Link>
          </li>
          <li>
            <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu} aria-label="Contact GuruForU">Contact</Link>
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
