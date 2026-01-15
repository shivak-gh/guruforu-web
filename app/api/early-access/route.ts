import { NextRequest, NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'
import { getSecret } from '@/lib/secret-manager'

// Verify reCAPTCHA token and return detailed result
async function verifyRecaptcha(token: string): Promise<{ valid: boolean; error?: string; details?: any }> {
  let recaptchaSecret: string | null = null
  
  if (process.env.NODE_ENV === 'production') {
    recaptchaSecret = await getSecret('RECAPTCHA_SECRET_KEY')
  } else {
    recaptchaSecret = await getSecret('RECAPTCHA_SECRET_KEY')
    if (!recaptchaSecret) {
      recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || null
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
    
    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      return { 
        valid: false, 
        error: `reCAPTCHA verification failed: ${errorCodes.join(', ')}`,
        details: { errorCodes, hostname: data.hostname }
      }
    }
    
    const scoreThreshold = data.hostname?.includes('localhost') ? 0.3 : 0.5
    const isValidScore = (data.score || 0) > scoreThreshold
    const isValidAction = !data.action || data.action === 'early_access_form'
    
    if (!isValidScore) {
      return { 
        valid: false, 
        error: `reCAPTCHA score too low: ${data.score}`,
        details: { score: data.score, threshold: scoreThreshold }
      }
    }
    
    if (!isValidAction) {
      return { 
        valid: false, 
        error: `reCAPTCHA action mismatch: expected 'early_access_form', got '${data.action}'`,
        details: { expectedAction: 'early_access_form', actualAction: data.action }
      }
    }
    
    return { valid: true }
  } catch (error: any) {
    return { valid: false, error: `reCAPTCHA verification error: ${error.message || 'Unknown error'}` }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, recaptchaToken } = body

    // Validate email
    if (!email || !email.includes('@')) {
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
          { error: 'reCAPTCHA token is required' },
          { status: 400 }
        )
      }

      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaResult.valid) {
        return NextResponse.json(
          { 
            error: recaptchaResult.error || 'reCAPTCHA verification failed. Please try again.',
            details: recaptchaResult.details
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
        console.log('⚠️ Using BREVO_API_KEY from environment variable (Secret Manager unavailable)')
      }
    }
    
    if (!brevoApiKey) {
      console.error('❌ BREVO_API_KEY is not configured')
      console.error('   Options to fix:')
      console.error('   1. Set GOOGLE_CLOUD_PROJECT in .env.local and authenticate:')
      console.error('      gcloud auth application-default login')
      console.error('      Then ensure BREVO_API_KEY exists in Secret Manager')
      console.error('   2. Or set BREVO_API_KEY in .env.local as fallback')
      return NextResponse.json(
        { 
          error: 'Email service is not configured. BREVO_API_KEY is missing.',
          details: 'Please configure BREVO_API_KEY in Google Secret Manager (preferred) or set it in .env.local for local development.'
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
    const fromName = process.env.BREVO_FROM_NAME || 'GuruForU Early Access'

    // Sanitize email
    const sanitizeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const sanitizedEmail = sanitizeHtml(email)

    // Prepare email content
    const sendSmtpEmail = new SendSmtpEmail()
    sendSmtpEmail.subject = 'New Early Access Request - GuruForU'
    sendSmtpEmail.htmlContent = `
      <h2>New Early Access Request</h2>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p>This user has requested early access to GuruForU.</p>
    `
    sendSmtpEmail.textContent = `
New Early Access Request

Email: ${email}
Submitted: ${new Date().toLocaleString()}

This user has requested early access to GuruForU.
    `
    sendSmtpEmail.sender = { name: fromName, email: fromEmail }
    sendSmtpEmail.to = [{ email: recipientEmail }]
    sendSmtpEmail.replyTo = { email: email }

    // Send email using Brevo
    try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
      const responseBody = response.body as any
      const messageId = responseBody?.messageId || responseBody?.id || 'unknown'

      console.log('✅ Early access email sent successfully:', {
        messageId: messageId,
        email: email
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
    console.error('Early Access API error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
