import { NextRequest, NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'
import { getSecret } from '@/lib/secret-manager'

// Verify reCAPTCHA token and return detailed result
async function verifyRecaptcha(token: string): Promise<{ valid: boolean; error?: string; details?: any }> {
  // In production, always use Secret Manager (never env vars for secrets)
  // In development, allow fallback to env vars for easier local testing
  let recaptchaSecret: string | null = null
  
  if (process.env.NODE_ENV === 'production') {
    // Production: Only use Secret Manager for security
    recaptchaSecret = await getSecret('RECAPTCHA_SECRET_KEY')
  } else {
    // Development: Try Secret Manager first, fallback to env var for convenience
    recaptchaSecret = await getSecret('RECAPTCHA_SECRET_KEY')
    if (!recaptchaSecret) {
      recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || null
    }
  }

  if (!recaptchaSecret) {
    const errorMsg = 'RECAPTCHA_SECRET_KEY is not set in Secret Manager or environment variables'
    console.error(errorMsg)
    console.error('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasEnvVar: !!process.env.RECAPTCHA_SECRET_KEY,
      envVarLength: process.env.RECAPTCHA_SECRET_KEY?.length || 0
    })
    return { valid: false, error: errorMsg }
  }

  // Log that we have a secret key (but don't log the actual key)
  console.log('reCAPTCHA secret key found:', recaptchaSecret.substring(0, 10) + '...' + recaptchaSecret.substring(recaptchaSecret.length - 10))

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
    
    // Check for errors first
    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      const errorMsg = `reCAPTCHA verification failed: ${errorCodes.join(', ')}`
      console.error(errorMsg, {
        errorCodes,
        hostname: data.hostname,
        token: token.substring(0, 20) + '...'
      })
      return { 
        valid: false, 
        error: errorMsg,
        details: {
          errorCodes,
          hostname: data.hostname
        }
      }
    }
    
    // reCAPTCHA v3 returns a score (0.0 to 1.0), where 1.0 is very likely a legitimate interaction
    // We'll consider scores above 0.5 as valid (lowered to 0.3 for localhost to be more lenient)
    const scoreThreshold = data.hostname?.includes('localhost') ? 0.3 : 0.5
    const isValidScore = (data.score || 0) > scoreThreshold
    
    // Also check that the action matches (optional check)
    const isValidAction = !data.action || data.action === 'contact_form'
    
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
      const errorMsg = `reCAPTCHA action mismatch: expected 'contact_form', got '${data.action}'`
      console.warn(errorMsg)
      return { 
        valid: false, 
        error: errorMsg,
        details: {
          expectedAction: 'contact_form',
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
    const { name, email, subject, message, recaptchaToken } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Skip reCAPTCHA verification for localhost in development mode
    // This allows testing without configuring localhost in reCAPTCHA console
    const isLocalhost = process.env.NODE_ENV === 'development' || 
                       request.headers.get('host')?.includes('localhost') ||
                       request.headers.get('host')?.includes('127.0.0.1')

    if (isLocalhost && process.env.SKIP_RECAPTCHA_LOCALHOST !== 'false') {
      console.warn('⚠️ Skipping reCAPTCHA verification for localhost (development mode)')
      console.warn('⚠️ Set SKIP_RECAPTCHA_LOCALHOST=false in .env.local to enable reCAPTCHA on localhost')
    } else {
      // Verify reCAPTCHA token is provided
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'reCAPTCHA token is required' },
          { status: 400 }
        )
      }

      // Verify reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaResult.valid) {
        console.error('reCAPTCHA verification failed:', recaptchaResult.error, recaptchaResult.details)
        return NextResponse.json(
          { 
            error: recaptchaResult.error || 'reCAPTCHA verification failed. Please try again.',
            details: recaptchaResult.details
          },
          { status: 400 }
        )
      }
    }

    // Get Brevo API key - check environment variable first for local development
    let brevoApiKey: string | null = null
    
    // In development mode, try environment variable first (faster, no Secret Manager call)
    if (process.env.NODE_ENV === 'development') {
      brevoApiKey = process.env.BREVO_API_KEY || null
      if (brevoApiKey) {
        console.log('Using BREVO_API_KEY from environment variable (development mode)')
      }
    }
    
    // If not found in env, try Secret Manager (or fallback to env if Secret Manager fails)
    if (!brevoApiKey) {
      brevoApiKey = await getSecret('BREVO_API_KEY')
      
      // If Secret Manager failed, try environment variable as final fallback
      if (!brevoApiKey) {
        brevoApiKey = process.env.BREVO_API_KEY || null
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
    // Set API key using type assertion to access protected authentications property
    // This is the correct way to set the API key for Brevo SDK
    ;(apiInstance as any).authentications.apiKey.apiKey = brevoApiKey

    // Get recipient email from environment or use default
    const recipientEmail = process.env.CONTACT_EMAIL || 'support@guruforu.com'
    
    // For Brevo, the sender email must be verified in your Brevo account
    // If using an unverified email, Brevo will reject it
    // For testing, use a verified email from your Brevo account
    let fromEmail = process.env.BREVO_FROM_EMAIL || process.env.FROM_EMAIL || 'noreply@guruforu.com'
    const fromName = process.env.BREVO_FROM_NAME || 'GuruForU Contact Form'
    
    // Log warning if using potentially unverified email
    if (fromEmail.includes('@guruforu.com') && !process.env.BREVO_FROM_EMAIL_VERIFIED) {
      console.warn('⚠️ WARNING: Using @guruforu.com email as sender. Make sure this email is verified in Brevo dashboard.')
      console.warn('⚠️ If you get "sender not valid" error, verify the sender in Brevo or use a verified email address.')
      console.warn('⚠️ To use a verified email, set BREVO_FROM_EMAIL to your verified email in .env.local')
    }

    // Sanitize user input for HTML (basic XSS prevention)
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
    const sanitizedMessage = sanitizeHtml(message).replace(/\n/g, '<br>')
    const sanitizedSubject = sanitizeHtml(subject)

    // Subject mapping
    const subjectMap: Record<string, string> = {
      general: 'General Inquiry',
      support: 'Technical Support',
      billing: 'Billing Question',
      feedback: 'Feedback',
      other: 'Other'
    }
    const emailSubject = `Contact Form: ${subjectMap[subject] || 'Other'}`

    // Prepare email content
    const sendSmtpEmail = new SendSmtpEmail()
    sendSmtpEmail.subject = emailSubject
    sendSmtpEmail.htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Subject:</strong> ${subjectMap[subject] || sanitizedSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage}</p>
    `
    sendSmtpEmail.textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subjectMap[subject] || subject}

Message:
${message}
    `
    sendSmtpEmail.sender = { name: fromName, email: fromEmail }
    sendSmtpEmail.to = [{ email: recipientEmail }]
    sendSmtpEmail.replyTo = { email: email, name: name }

    // Log email details before sending (for debugging)
    console.log('Sending email:', {
      to: recipientEmail,
      from: `${fromName} <${fromEmail}>`,
      subject: emailSubject,
      replyTo: `${name} <${email}>`
    })

    // Send email using Brevo
    try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
      
      // Brevo API returns response.body with messageId
      // The response body structure may vary, so we check multiple possible locations
      const responseBody = response.body as any
      const messageId = responseBody?.messageId || responseBody?.id || 'unknown'

      console.log('✅ Email sent successfully:', {
        messageId: messageId,
        to: recipientEmail,
        responseBody: responseBody
      })

      return NextResponse.json(
        { success: true, messageId: messageId },
        { status: 200 }
      )
    } catch (error: any) {
      console.error('❌ Brevo API error:', error)
      
      // Log detailed error information
      if (error?.response?.body) {
        console.error('Brevo API error response:', JSON.stringify(error.response.body, null, 2))
      }
      if (error?.body) {
        console.error('Brevo API error body:', JSON.stringify(error.body, null, 2))
      }
      
      // Extract error message if available
      const errorMessage = error?.response?.body?.message || 
                          error?.body?.message || 
                          error?.response?.text ||
                          error?.message || 
                          'Unknown error'
      
      // Extract error code if available
      const errorCode = error?.response?.body?.code || error?.body?.code || error?.code
      const errorDetails = {
        message: errorMessage,
        code: errorCode,
        status: error?.response?.status || error?.status
      }

      console.error('Email sending failed:', errorDetails)
      
      // Check for specific Brevo sender validation error
      const isSenderInvalid = errorMessage?.toLowerCase().includes('sender') && 
                             (errorMessage?.toLowerCase().includes('not valid') ||
                              errorMessage?.toLowerCase().includes('not verified') ||
                              errorMessage?.toLowerCase().includes('validate'))
      
      let userFriendlyError = 'Failed to send email. Please try again later.'
      if (isSenderInvalid) {
        userFriendlyError = `Email sending failed: The sender email "${fromEmail}" is not verified in your Brevo account. Please verify this email in Brevo dashboard or use a verified email address. See EMAIL_TROUBLESHOOTING.md for details.`
        console.error('🔴 SENDER EMAIL NOT VERIFIED:', {
          sender: fromEmail,
          solution: 'Verify the sender email in Brevo dashboard or use a verified email in BREVO_FROM_EMAIL'
        })
      }
      
      return NextResponse.json(
        { 
          error: userFriendlyError, 
          details: errorDetails
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
