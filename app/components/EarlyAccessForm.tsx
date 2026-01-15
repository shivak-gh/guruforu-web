'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './EarlyAccessForm.module.css'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export default function EarlyAccessForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const recaptchaLoaded = useRef(false)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  // Load reCAPTCHA script
  useEffect(() => {
    if (!recaptchaSiteKey) {
      return
    }

    if (recaptchaLoaded.current || (typeof window !== 'undefined' && window.grecaptcha)) {
      return
    }

    if (typeof document !== 'undefined') {
      const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`)
      if (existingScript) {
        const checkGrecaptcha = setInterval(() => {
          if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            recaptchaLoaded.current = true
            clearInterval(checkGrecaptcha)
          }
        }, 100)
        setTimeout(() => clearInterval(checkGrecaptcha), 10000)
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
          recaptchaLoaded.current = true
        } else {
          const checkReady = setInterval(() => {
            if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
              recaptchaLoaded.current = true
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
  }, [recaptchaSiteKey])

  const getRecaptchaToken = async (retryCount = 0): Promise<string | null> => {
    if (!recaptchaSiteKey) {
      return null
    }

    if (typeof window === 'undefined') {
      return null
    }

    let attempts = 0
    const maxAttempts = 50

    while (!window.grecaptcha && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    if (!window.grecaptcha || typeof window.grecaptcha.ready !== 'function') {
      return null
    }

    try {
      return await new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            // Generate token with current timestamp to ensure freshness
            const token = await window.grecaptcha.execute(recaptchaSiteKey, {
              action: 'early_access_form'
            })
            if (!token) {
              console.error('reCAPTCHA returned empty token')
              // Retry once if we get an empty token
              if (retryCount < 1) {
                console.log('Retrying reCAPTCHA token generation...')
                setTimeout(async () => {
                  const retryToken = await getRecaptchaToken(retryCount + 1)
                  resolve(retryToken)
                }, 500)
              } else {
                resolve(null)
              }
            } else {
              console.log('reCAPTCHA token generated successfully', {
                tokenLength: token.length,
                timestamp: new Date().toISOString()
              })
              resolve(token)
            }
          } catch (error: any) {
            console.error('reCAPTCHA execution error:', error)
            // Retry once on error
            if (retryCount < 1) {
              console.log('Retrying reCAPTCHA token generation after error...')
              setTimeout(async () => {
                const retryToken = await getRecaptchaToken(retryCount + 1)
                resolve(retryToken)
              }, 1000)
            } else {
              resolve(null)
            }
          }
        })
      })
    } catch (error: any) {
      console.error('reCAPTCHA error:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      if (typeof window === 'undefined') {
        setSubmitStatus('error')
        setErrorMessage('Unable to submit. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setSubmitStatus('error')
        setErrorMessage('Please enter a valid email address.')
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
        // Generate token as late as possible to minimize expiration risk
        console.log('Getting fresh reCAPTCHA token...')
        try {
          recaptchaToken = await getRecaptchaToken()
          if (!recaptchaToken) {
            console.error('Failed to get reCAPTCHA token after retries')
            setSubmitStatus('error')
            setErrorMessage('reCAPTCHA verification failed. Please refresh the page and try again. If the problem persists, your domain may need to be registered in the reCAPTCHA console.')
            setIsSubmitting(false)
            return
          }
          console.log('reCAPTCHA token received, submitting immediately...')
          // Submit immediately after getting token to avoid expiration
        } catch (error: any) {
          console.error('Error getting reCAPTCHA token:', error)
          setSubmitStatus('error')
          setErrorMessage('reCAPTCHA verification failed. Please refresh the page and try again.')
          setIsSubmitting(false)
          return
        }
      }

      // Submit form
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...(recaptchaToken && { recaptchaToken }),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setEmail('')
      } else {
        setSubmitStatus('error')
        // Provide more specific error messages
        if (data.error) {
          setErrorMessage(data.error)
        } else if (response.status === 400) {
          setErrorMessage('Invalid request. Please check your email address and try again.')
        } else if (response.status === 500) {
          setErrorMessage('Server error. Please try again later or contact support@guruforu.com')
        } else {
          setErrorMessage('Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className={styles.input}
          required
          disabled={isSubmitting}
          aria-label="Email address for early access"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className={styles.button}
          aria-label="Submit early access request"
        >
          {isSubmitting ? 'Submitting...' : 'Notify Me'}
        </button>
      </div>
      
      {submitStatus === 'success' && (
        <div className={styles.successMessage} role="alert">
          ✓ Thank you! We&apos;ll notify you when we launch.
        </div>
      )}

      {submitStatus === 'error' && errorMessage && (
        <div className={styles.errorMessage} role="alert">
          <strong>Oops! Something went wrong.</strong>
          <br />
          {errorMessage}
          <br />
          <small>If the issue persists, please email us directly at <a href="mailto:support@guruforu.com" className={styles.emailLink}>support@guruforu.com</a></small>
        </div>
      )}

      {!recaptchaSiteKey && typeof window !== 'undefined' && 
       (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
        <div className={styles.warningMessage}>
          ⚠️ Note: reCAPTCHA is not configured for localhost. Form will work without reCAPTCHA verification. 
          To enable reCAPTCHA, set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local and restart your dev server.
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
    </form>
  )
}
