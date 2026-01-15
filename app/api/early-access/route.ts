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
        // Most common cause: domain not registered in reCAPTCHA console
        userFriendlyError = `reCAPTCHA verification failed. The domain "${data.hostname || 'your domain'}" may not be registered in the reCAPTCHA console. Please contact support if this issue persists.`
        console.error('❌ reCAPTCHA invalid-input-response - DIAGNOSIS:', {
          'Most Common Cause': `Domain "${data.hostname}" is NOT registered in reCAPTCHA console`,
          'Fix Required': `1. Go to https://www.google.com/recaptcha/admin
2. Find site with key: 6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob
3. Add domain to "Domains" list: ${data.hostname}
4. Save and wait 2-5 minutes for propagation`,
          'Other Possible Causes': {
            'Token expired': 'reCAPTCHA tokens expire after ~2 minutes',
            'Token already used': 'Tokens can only be used once',
            'Secret key mismatch': 'Ensure RECAPTCHA_SECRET_KEY matches the site key'
          }
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
      // Verify reCAPTCHA token is provided
      if (!recaptchaToken) {
        console.error('reCAPTCHA token is missing in request')
        return NextResponse.json(
          { 
            error: 'reCAPTCHA token is required. Please refresh the page and try again.',
            details: { 
              message: 'Token was not provided in the request',
              suggestion: 'This may indicate the reCAPTCHA script failed to load. Check browser console for errors.'
            }
          },
          { status: 400 }
        )
      }

      // Verify reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaResult.valid) {
        console.error('reCAPTCHA verification failed:', {
          error: recaptchaResult.error,
          details: recaptchaResult.details,
          hostname: request.headers.get('host'),
          userAgent: request.headers.get('user-agent')?.substring(0, 50)
        })
        
        // Provide more helpful error message
        let userMessage = recaptchaResult.error || 'reCAPTCHA verification failed. Please refresh the page and try again.'
        if (recaptchaResult.details?.errorCodes?.includes('invalid-input-response')) {
          const hostname = request.headers.get('host') || 'your domain'
          userMessage = `reCAPTCHA verification failed. The domain "${hostname}" may not be registered in the reCAPTCHA console. Please contact support if this issue persists.`
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
