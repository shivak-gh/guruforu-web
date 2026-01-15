import { NextRequest, NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'
import { getSecret } from '@/lib/secret-manager'

// Verify reCAPTCHA token and return detailed result
async function verifyRecaptcha(token: string, action: string): Promise<{ valid: boolean; error?: string; details?: any }> {
  let recaptchaSecret: string | null = null
  
  // Prioritize Secret Manager for RECAPTCHA_SECRET_KEY
  recaptchaSecret = await getSecret('RECAPTCHA_SECRET_KEY')
  
  if (recaptchaSecret) {
    console.log('✅ Using RECAPTCHA_SECRET_KEY from Google Secret Manager')
  } else {
    // Fallback to environment variable if Secret Manager is unavailable
    recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || null
    if (recaptchaSecret) {
      console.warn('⚠️ Using RECAPTCHA_SECRET_KEY from environment variable (Secret Manager unavailable)')
    }
  }

  if (!recaptchaSecret) {
    const errorMsg = 'RECAPTCHA_SECRET_KEY is not set in Secret Manager or environment variables'
    console.error(errorMsg)
    return { valid: false, error: errorMsg }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${token}`,
    })

    const data = await response.json()
    
    // Log reCAPTCHA response for debugging
    console.log('reCAPTCHA verification response:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      'error-codes': data['error-codes'],
      'challenge_ts': data['challenge_ts']
    })
    
    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      
      // Provide user-friendly error messages for common error codes
      let userFriendlyError = `reCAPTCHA verification failed: ${errorCodes.join(', ')}`
      if (errorCodes.includes('invalid-input-response')) {
        userFriendlyError = 'reCAPTCHA token is invalid or expired. Please refresh the page and try again.'
        console.error('reCAPTCHA invalid-input-response - possible causes:', {
          'Token expired': 'reCAPTCHA tokens expire after ~2 minutes',
          'Token already used': 'Tokens can only be used once',
          'Domain mismatch': `Verify domain ${data.hostname} is registered in reCAPTCHA console`,
          'Secret key mismatch': 'Ensure RECAPTCHA_SECRET_KEY matches the site key'
        })
      } else if (errorCodes.includes('missing-input-response')) {
        userFriendlyError = 'reCAPTCHA token is missing. Please try again.'
      } else if (errorCodes.includes('timeout-or-duplicate')) {
        userFriendlyError = 'reCAPTCHA token has expired. Please refresh the page and try again.'
      }
      
      console.error('reCAPTCHA verification failed:', {
        errorCodes,
        hostname: data.hostname,
        tokenLength: token.length,
        userFriendlyError
      })
      
      return { 
        valid: false, 
        error: userFriendlyError,
        details: { errorCodes, hostname: data.hostname }
      }
    }
    
    const scoreThreshold = data.hostname?.includes('localhost') ? 0.3 : 0.5
    const isValidScore = (data.score || 0) > scoreThreshold
    const isValidAction = !data.action || data.action === action
    
    if (!isValidScore) {
      const errorMsg = `reCAPTCHA score too low: ${data.score} (threshold: ${scoreThreshold}). This might indicate bot-like behavior.`
      console.warn(errorMsg, {
        score: data.score,
        threshold: scoreThreshold,
        hostname: data.hostname,
        action: data.action
      })
      return { 
        valid: false, 
        error: errorMsg,
        details: {
          score: data.score,
          threshold: scoreThreshold,
          hostname: data.hostname
        }
      }
    }
    
    if (!isValidAction) {
      const errorMsg = `reCAPTCHA action mismatch: expected '${action}', got '${data.action}'`
      console.warn(errorMsg)
      return { 
        valid: false, 
        error: errorMsg,
        details: {
          expectedAction: action,
          actualAction: data.action
        }
      }
    }
    
    return { valid: true }
  } catch (error: any) {
    const errorMsg = `reCAPTCHA verification error: ${error.message || 'Unknown error'}`
    console.error(errorMsg, error)
    return { valid: false, error: errorMsg }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, grade, country, timeSlot, details, recaptchaToken } = body

    // Validate required fields
    if (!name || !email || !grade) {
      return NextResponse.json(
        { error: 'Name, Email, and Grade are required fields' },
        { status: 400 }
      )
    }

    // Validate email
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Skip reCAPTCHA verification for localhost in development mode
    const isLocalhost = process.env.NODE_ENV === 'development' || 
                       request.headers.get('host')?.includes('localhost') ||
                       request.headers.get('host')?.includes('127.0.0.1')

    if (isLocalhost && process.env.SKIP_RECAPTCHA_LOCALHOST !== 'false') {
      console.warn('⚠️ Skipping reCAPTCHA verification for localhost (development mode)')
    } else {
      if (!recaptchaToken) {
        return NextResponse.json(
          { 
            error: 'reCAPTCHA token is required. This may indicate the reCAPTCHA script failed to load. Check browser console for errors.',
            suggestion: 'This may indicate the reCAPTCHA script failed to load. Check browser console for errors.'
          },
          { status: 400 }
        )
      }

      const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'free_consultation_form')
      if (!recaptchaResult.valid) {
        console.error('reCAPTCHA verification failed:', {
          error: recaptchaResult.error,
          details: recaptchaResult.details,
          hostname: request.headers.get('host'),
          userAgent: request.headers.get('user-agent')?.substring(0, 50)
        })
        
        let userMessage = recaptchaResult.error || 'reCAPTCHA verification failed. Please refresh the page and try again.'
        if (recaptchaResult.details?.errorCodes?.includes('invalid-input-response')) {
          userMessage = 'reCAPTCHA verification failed. This usually means your domain needs to be registered in the reCAPTCHA console. Please refresh the page and try again, or contact support if the issue persists.'
        }

        return NextResponse.json(
          { 
            error: userMessage,
            details: {
              ...recaptchaResult.details,
              troubleshooting: 'If this error persists, verify that your production domain is registered in the reCAPTCHA console and that RECAPTCHA_SECRET_KEY matches your site key.'
            }
          },
          { status: 400 }
        )
      }
    }

    // Get Brevo API key - prioritize Secret Manager, fallback to environment variable
    let brevoApiKey: string | null = null
    
    // Try Secret Manager first (works in both development and production)
    brevoApiKey = await getSecret('BREVO_API_KEY')
    
    if (brevoApiKey) {
      console.log('✅ Using BREVO_API_KEY from Google Secret Manager')
    } else {
      // Fallback to environment variable if Secret Manager is unavailable
      brevoApiKey = process.env.BREVO_API_KEY || null
      if (brevoApiKey) {
        console.warn('⚠️ Using BREVO_API_KEY from environment variable (Secret Manager unavailable)')
      }
    }
    
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY is not configured')
      console.error('Please set BREVO_API_KEY in .env.local for local development')
      console.error('Or configure BREVO_API_KEY in Google Secret Manager for production')
      return NextResponse.json(
        { 
          error: 'Email service is not configured. BREVO_API_KEY is missing.',
          details: 'Please set BREVO_API_KEY in .env.local for local development, or configure it in Google Secret Manager for production.'
        },
        { status: 500 }
      )
    }

    // Initialize Brevo API client
    const apiInstance = new TransactionalEmailsApi()
    ;(apiInstance as any).authentications.apiKey.apiKey = brevoApiKey

    // Get recipient email from environment or use default
    const recipientEmail = process.env.CONTACT_EMAIL || 'support@guruforu.com'
    let fromEmail = process.env.BREVO_FROM_EMAIL || process.env.FROM_EMAIL || 'noreply@guruforu.com'
    const fromName = process.env.BREVO_FROM_NAME || 'GuruForU Free Consultation'

    // Sanitize HTML
    const sanitizeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const sanitizedName = sanitizeHtml(name)
    const sanitizedEmail = sanitizeHtml(email)
    const sanitizedGrade = sanitizeHtml(grade)
    const sanitizedCountry = country ? sanitizeHtml(country) : 'Not specified'
    const sanitizedTimeSlot = timeSlot ? sanitizeHtml(timeSlot) : 'Not specified'
    const sanitizedDetails = details ? sanitizeHtml(details) : 'Not specified'

    // Prepare email content
    const sendSmtpEmail = new SendSmtpEmail()
    sendSmtpEmail.subject = 'New Free Consultation Request - GuruForU'
    sendSmtpEmail.htmlContent = `
      <h2>New Free Consultation Request</h2>
      <p><strong>Parent Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Child's Grade:</strong> ${sanitizedGrade}</p>
      <p><strong>Country:</strong> ${sanitizedCountry}</p>
      <p><strong>Preferred Time to Call:</strong> ${sanitizedTimeSlot}</p>
      <p><strong>Learning Challenges:</strong></p>
      <p>${sanitizedDetails.replace(/\n/g, '<br>')}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p>This parent has requested a free consultation session.</p>
    `
    sendSmtpEmail.textContent = `
New Free Consultation Request

Parent Name: ${name}
Email: ${email}
Child's Grade: ${grade}
Country: ${country || 'Not specified'}
Preferred Time to Call: ${timeSlot || 'Not specified'}

Learning Challenges:
${details || 'Not specified'}

Submitted: ${new Date().toLocaleString()}

This parent has requested a free consultation session.
    `
    sendSmtpEmail.sender = { name: fromName, email: fromEmail }
    sendSmtpEmail.to = [{ email: recipientEmail }]
    sendSmtpEmail.replyTo = { email: email }

    // Send email using Brevo
    try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
      const responseBody = response.body as any
      const messageId = responseBody?.messageId || responseBody?.id || 'unknown'

      console.log('✅ Free consultation email sent successfully:', {
        messageId: messageId,
        email: email,
        name: name
      })

      return NextResponse.json(
        { success: true, messageId: messageId },
        { status: 200 }
      )
    } catch (error: any) {
      console.error('❌ Brevo API error:', error)
      
      const errorMessage = error?.response?.body?.message || 
                          error?.body?.message || 
                          error?.message || 
                          'Unknown error'
      
      return NextResponse.json(
        { 
          error: 'Failed to submit request. Please try again later.',
          details: { message: errorMessage }
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Free Consultation API error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
