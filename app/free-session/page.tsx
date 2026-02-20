'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { detectLocale, localizeText, type Region } from '../../lib/locale'

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export default function FreeConsultation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    country: '',
    timeSlot: '',
    details: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [region, setRegion] = useState<Region>('DEFAULT')
  const recaptchaLoaded = useRef(false)
  // Get reCAPTCHA site key from environment (embedded at build time in Next.js)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  
  useEffect(() => {
    const localeInfo = detectLocale()
    setRegion(localeInfo.region)
  }, [])
  
  const localized = (text: string) => localizeText(text, region)

  // Debug: Log site key on mount (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (recaptchaSiteKey) {
        console.log('reCAPTCHA Site Key configured:', `${recaptchaSiteKey.substring(0, 10)}...`)
      } else {
        console.warn('reCAPTCHA Site Key not set. Form will work without reCAPTCHA on localhost.')
      }
    }
  }, [recaptchaSiteKey])

  // Load reCAPTCHA script
  useEffect(() => {
    if (!recaptchaSiteKey) {
      console.warn('reCAPTCHA Site Key is not set. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.')
      return
    }

    if (recaptchaLoaded.current || (typeof window !== 'undefined' && window.grecaptcha)) {
      return
    }

    // Check if script is already in the DOM
    if (typeof document !== 'undefined') {
      const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`)
      if (existingScript) {
        // Script already exists, wait for it to load
        const checkGrecaptcha = setInterval(() => {
          if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            recaptchaLoaded.current = true
            clearInterval(checkGrecaptcha)
          }
        }, 100)

        // Clear interval after 10 seconds
        setTimeout(() => clearInterval(checkGrecaptcha), 10000)
        return
      }

      // Create and load the script
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        // Wait for grecaptcha to be fully initialized
        if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
          recaptchaLoaded.current = true
          console.log('reCAPTCHA v3 loaded successfully')
        } else {
          // If grecaptcha isn't immediately available, check periodically
          const checkReady = setInterval(() => {
            if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
              recaptchaLoaded.current = true
              console.log('reCAPTCHA v3 ready')
              clearInterval(checkReady)
            }
          }, 100)
          setTimeout(() => clearInterval(checkReady), 10000)
        }
      }

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script')
        recaptchaLoaded.current = false
      }

      document.head.appendChild(script)
    }

    return () => {
      // Don't remove script on unmount as it might be used elsewhere
      // The browser will handle cleanup
    }
  }, [recaptchaSiteKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!recaptchaSiteKey) {
      console.error('reCAPTCHA Site Key is not configured')
      return null
    }

    // Wait for grecaptcha to be available (with timeout)
    let attempts = 0
    const maxAttempts = 50 // 5 seconds total (50 * 100ms)

    while (typeof window !== 'undefined' && !window.grecaptcha && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    if (typeof window === 'undefined' || !window.grecaptcha || typeof window.grecaptcha.ready !== 'function') {
      console.error('reCAPTCHA is not loaded. Please check your Site Key and network connection.')
      return null
    }

    try {
      return await new Promise((resolve) => {
        // Use grecaptcha.ready to ensure it's fully initialized
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(recaptchaSiteKey, {
              action: 'free_consultation_form'
            })
            if (!token) {
              console.error('reCAPTCHA returned empty token')
              resolve(null)
            } else {
              console.log('reCAPTCHA token generated successfully')
              resolve(token)
            }
          } catch (error: any) {
            console.error('reCAPTCHA execution error:', error)
            console.error('Error details:', {
              message: error?.message,
              siteKey: recaptchaSiteKey.substring(0, 10) + '...'
            })
            resolve(null)
          }
        })
      })
    } catch (error: any) {
      console.error('reCAPTCHA error:', error)
      console.error('Error message:', error?.message)
      return null
    }
  }

  // Generate summary message for email/WhatsApp
  const generateSummary = (data: typeof formData) => {
    return `FREE SESSION REQUEST
---------------------------
Parent: ${data.name}
Email: ${data.email}
Child's Grade: ${data.grade}
Country: ${data.country || 'Not specified'}
Best Time to Call: ${data.timeSlot || 'Not specified'}
Learning Challenges: ${data.details || 'Not specified'}`;
  }

  // WhatsApp action
  const handleWhatsAppClick = () => {
    if (!formData.name || !formData.email || !formData.grade) {
      setErrorMessage(localized('Please fill in at least Name, Email, and Grade before booking via WhatsApp.'))
      setSubmitStatus('error')
      return
    }

    const msg = encodeURIComponent(generateSummary(formData))
    // WhatsApp number: +91 6362 642 692 (formatted without + and spaces for URL)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916362642692'
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
    }
  }

  // Email action
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    // Validate required fields
    if (!formData.name || !formData.email || !formData.grade) {
      setSubmitStatus('error')
      setErrorMessage(localized('Please fill in all required fields (Name, Email, and Grade).'))
      setIsSubmitting(false)
      return
    }

    try {
      if (typeof window === 'undefined') {
        console.error('window object not available for form submission')
        setSubmitStatus('error')
        setErrorMessage('Unable to submit. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Skip reCAPTCHA for localhost in development mode
      const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1'
      const skipRecaptcha = isLocalhost && process.env.NODE_ENV === 'development'

      let recaptchaToken = null
      if (!skipRecaptcha && recaptchaSiteKey) {
        // Get reCAPTCHA token right before submission to avoid expiration
        console.log('Getting fresh reCAPTCHA token...')
        try {
          recaptchaToken = await getRecaptchaToken()
          if (!recaptchaToken) {
            console.error('Failed to get reCAPTCHA token after retries')
            setSubmitStatus('error')
            setErrorMessage(localized('reCAPTCHA verification failed. Please refresh the page and try again. If the problem persists, your domain may need to be registered in the reCAPTCHA console.'))
            setIsSubmitting(false)
            return
          }
          console.log('reCAPTCHA token received, submitting immediately...')
        } catch (error: any) {
          console.error('Error getting reCAPTCHA token:', error)
          setSubmitStatus('error')
          setErrorMessage(localized('reCAPTCHA verification failed. Please refresh the page and try again.'))
          setIsSubmitting(false)
          return
        }
      } else if (skipRecaptcha) {
        console.warn('⚠️ Skipping reCAPTCHA for localhost (development mode)')
      } else if (!recaptchaSiteKey) {
        console.warn('⚠️ reCAPTCHA Site Key not configured, submitting without token')
      }

      // Submit via free session API
      const response = await fetch('/api/free-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(recaptchaToken && { recaptchaToken }),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', grade: '', country: '', timeSlot: '', details: '' })
      } else {
        console.error('Form submission error:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details
        })
        
        // Set the specific error message from the API response
        setErrorMessage(data.error || localized('Something went wrong. Please try again.'))

        // Check if it's a reCAPTCHA error specifically
        if (data.error?.includes('reCAPTCHA') || response.status === 400) {
          console.error('reCAPTCHA verification failed:', data.error)
          if (data.details) {
            console.error('reCAPTCHA error details:', data.details)
            
            // Log specific error codes if available
            if (data.details.errorCodes) {
              console.error('reCAPTCHA error codes:', data.details.errorCodes)
            }
          }
        }
        
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(localized('Network error. Please check your connection and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Service structured data for SEO
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Free Online Tuition Session & Student Assessment',
    'description': 'Get a free 1-on-1 educational session. Our AI diagnostics identify learning gaps in any subject to help your child succeed.',
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'GuruForU',
      'url': 'https://www.guruforu.com'
    },
    'serviceType': 'Educational Consultation',
    'areaServed': 'Global',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'description': 'Free consultation session with AI-powered learning assessment'
    }
  }

  return (
    <>
      <Script
        id="free-session-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <NavMenu />
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>

        <div className={styles.content}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              {localized('Free AI Learning Diagnostic Session')}
            </h1>
            <p className={styles.heroSubtitle}>
              {localized('Book a')} <strong>{localized('15-minute strategy session')}</strong>. {localized('We\'ll analyze')} <strong>{localized('learning gaps')}</strong> {localized('and build a')} <strong>{localized('custom subject roadmap')}</strong> {localized('for your child—at no cost.')}
            </p>
            <p className={styles.heroSubtitle}>
              During your free session we&apos;ll discuss your child&apos;s goals, identify any learning gaps, and outline a personalized roadmap. No obligation—just a chance to see how GuruForU can support your child&apos;s success in math, science, and beyond.
            </p>
          </div>

          <div className={styles.mainContent}>
            {/* Form Section */}
            <div className={styles.formSection}>
              <h2 className={styles.formTitle}>{localized('Book Your Free Session')}</h2>
              
              <form className={styles.consultationForm} onSubmit={handleEmailSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    {localized('Parent Name')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder={localized('Your full name')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    {localized('Email')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder={localized('your.email@example.com')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="grade" className={styles.label}>
                    {localized('Child\'s Grade')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder={localized('e.g., Grade 5, Year 3, Class 8, etc.')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country" className={styles.label}>
                    {localized('Country')}
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    list="countries"
                    className={styles.input}
                    placeholder={localized('Start typing your country...')}
                    autoComplete="country-name"
                  />
                  <datalist id="countries">
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Austria">Austria</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Finland">Finland</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Greece">Greece</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="China">China</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Peru">Peru</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                  </datalist>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timeSlot" className={styles.label}>
                    {localized('Preferred time to contact you')}
                  </label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">{localized('Select preferred time')}</option>
                    <option value="Morning (9 AM - 12 PM)">{localized('Morning (9 AM - 12 PM)')}</option>
                    <option value="Afternoon (12 PM - 5 PM)">{localized('Afternoon (12 PM - 5 PM)')}</option>
                    <option value="Evening (5 PM - 8 PM)">{localized('Evening (5 PM - 8 PM)')}</option>
                    <option value="Anytime">{localized('Anytime')}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="details" className={styles.label}>
                    {localized('Tell us about their learning challenges')}
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    className={styles.textarea}
                    placeholder={localized('Describe any specific subjects, topics, or learning difficulties your child is facing...')}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className={styles.successMessage} role="alert">
                    ✓ {localized('Thank you! We\'ll contact you soon to schedule your free session.')}
                  </div>
                )}

                {submitStatus === 'error' && errorMessage && (
                  <div className={styles.errorMessage} role="alert">
                    <strong>{localized('Oops! Something went wrong.')}</strong>
                    <br />
                    {errorMessage}
                    <br />
                    <small>{localized('If the issue persists, please email us directly at')} <a href="mailto:support@guruforu.com" className={styles.emailLink}>support@guruforu.com</a></small>
                  </div>
                )}

                {!recaptchaSiteKey && typeof window !== 'undefined' && 
                 (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                  <div className={styles.warningMessage}>
                    ⚠️ Note: reCAPTCHA is not configured for localhost. Form will work without reCAPTCHA verification. 
                    To enable reCAPTCHA, set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local and restart your dev server.
                  </div>
                )}

                {recaptchaSiteKey && !recaptchaLoaded.current && (
                  <div className={styles.infoMessage}>
                    ℹ️ Loading reCAPTCHA protection...
                  </div>
                )}

                {recaptchaSiteKey && (
                  <div className={styles.captchaNotice}>
                    <small>
                      This site is protected by reCAPTCHA and the Google{' '}
                      <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.captchaLink}
                      >
                        Privacy Policy
                      </a>
                      {' '}and{' '}
                      <a 
                        href="https://policies.google.com/terms" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.captchaLink}
                      >
                        Terms of Service
                      </a>
                      {' '}apply.
                    </small>
                  </div>
                )}

                <div className={styles.actionButtons}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.primaryButton}
                  >
                    {isSubmitting ? localized('Submitting...') : localized('Secure My Free Session')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className={styles.whatsappButton}
                  >
                    <span className={styles.whatsappIcon}>💬</span>
                    {localized('Book via WhatsApp')}
                  </button>
                </div>
              </form>
            </div>

            {/* Roadmap & Trust Section */}
            <div className={styles.sidebar}>
              {/* Student Progress Roadmap */}
              <div className={styles.roadmap}>
                <h3 className={styles.roadmapTitle}>{localized('Your Child\'s Progress Roadmap')}</h3>
                <div className={styles.roadmapSteps}>
                  <div className={styles.roadmapStep}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{localized('Free Session')}</h4>
                      <p className={styles.stepDescription}>{localized('15-minute strategy session to understand your child\'s needs')}</p>
                    </div>
                  </div>
                  <div className={styles.roadmapStep}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{localized('AI Learning Diagnostic')}</h4>
                      <p className={styles.stepDescription}>{localized('Comprehensive analysis of learning gaps and strengths')}</p>
                    </div>
                  </div>
                  <div className={styles.roadmapStep}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{localized('Personalized Roadmap')}</h4>
                      <p className={styles.stepDescription}>{localized('Custom subject roadmap tailored to your child')}</p>
                    </div>
                  </div>
                  <div className={styles.roadmapStep}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{localized('Expert Tutor Matching')}</h4>
                      <p className={styles.stepDescription}>{localized('Connect with qualified tutors for ongoing support')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className={styles.trustSection}>
                <h3 className={styles.trustTitle}>{localized('What You\'ll Get')}</h3>
                <ul className={styles.trustList}>
                  <li className={styles.trustItem}>
                    <span className={styles.trustIcon}>✓</span>
                    <div>
                      <strong>{localized('Personalized Subject Roadmap')}</strong>
                      <p>{localized('Custom learning path designed specifically for your child')}</p>
                    </div>
                  </li>
                  <li className={styles.trustItem}>
                    <span className={styles.trustIcon}>✓</span>
                    <div>
                      <strong>{localized('AI Mastery Analysis')}</strong>
                      <p>{localized('Deep insights into learning gaps and strengths')}</p>
                    </div>
                  </li>
                  <li className={styles.trustItem}>
                    <span className={styles.trustIcon}>✓</span>
                    <div>
                      <strong>{localized('Expert Tutor Matching')}</strong>
                      <p>{localized('Connect with qualified tutors who understand your child\'s needs')}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink} prefetch={false}>{localized('GuruForU Home')}</Link>
              <Link href="/blog" className={styles.footerLink} prefetch={false}>{localized('Resources')}</Link>
              <Link href="/contact" className={styles.footerLink} prefetch={false}>{localized('Contact Us')}</Link>
              <a href="mailto:support@guruforu.com" className={styles.footerLink}>{localized('Email Support')}</a>
              <Link href="/terms" className={styles.footerLink} prefetch={false}>{localized('Terms and Conditions')}</Link>
              <Link href="/privacy" className={styles.footerLink} prefetch={false}>{localized('Privacy Policy')}</Link>
            </nav>
            <p className={styles.copyright}>© {new Date().getFullYear()} GuruForU. {localized('All rights reserved.')}</p>
          </footer>
        </div>
      </div>
    </>
  )
}
