# Brevo Email Setup Guide

## Issue: Email service not configured

You're getting this error because `BREVO_API_KEY` is not set in your `.env.local` file.

## Quick Fix

### Step 1: Get Your Brevo API Key

1. Go to [Brevo Dashboard](https://app.brevo.com/settings/keys/api)
2. Sign up for a free account if you don't have one
3. Create a new API key with "Send emails" permission
4. Copy the API key (it starts with `xkeysib-...`)

### Step 2: Add to .env.local

Open `.env.local` in your project root and add:

```env
BREVO_API_KEY=xkeysib-your_api_key_here
```

Or update the existing line if it's already there with a placeholder.

### Step 3: Restart Dev Server

**IMPORTANT:** Restart your development server after adding/updating environment variables:

```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### Step 4: Test the Form

Go to `/contact` and submit the form. It should now work!

## Complete .env.local Example

Your `.env.local` should look like this:

```env
# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob
RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM

# Brevo Email Configuration
BREVO_API_KEY=xkeysib-your_actual_api_key_here
BREVO_FROM_EMAIL=noreply@guruforu.com
BREVO_FROM_NAME=GuruForU Contact Form
CONTACT_EMAIL=support@guruforu.com

# Google Cloud Project (optional for local dev, needed for Secret Manager)
GOOGLE_CLOUD_PROJECT=your-project-id
```

## Brevo Account Setup

If you don't have a Brevo account yet:

1. **Sign up** at [https://www.brevo.com](https://www.brevo.com)
   - Free tier includes 300 emails/day
   - Perfect for contact forms

2. **Verify your sender email**:
   - Go to Senders & IP > Email addresses
   - Add and verify your sender email
   - For testing, you can use your own email

3. **Create API Key**:
   - Go to Settings > API Keys
   - Click "Generate a new API key"
   - Give it a name (e.g., "Contact Form")
   - Select "Send emails" permission
   - Copy the key immediately (you can't see it again)

## Testing Without Brevo (Temporary)

If you just want to test the form without setting up Brevo right now, you can temporarily modify the API route to skip email sending for development.

**⚠️ Only for testing - don't use in production!**

The code will now show a clearer error message telling you exactly what's missing.

## Common Issues

### "BREVO_API_KEY is missing"
- **Fix:** Add `BREVO_API_KEY=your_key` to `.env.local`
- **Restart dev server** after adding

### "Invalid API key"
- **Fix:** Check that your API key is correct (starts with `xkeysib-`)
- **Fix:** Make sure the API key has "Send emails" permission
- **Fix:** Verify your Brevo account is active

### "Email sending failed"
- **Fix:** Verify your sender email in Brevo dashboard
- **Fix:** Check that `BREVO_FROM_EMAIL` matches a verified email in Brevo
- **Fix:** For testing, you can use `onboarding@resend.dev` (Brevo test email)

## For Production

When deploying to production:

1. **Store API key in Google Secret Manager**:
   ```bash
   echo -n "xkeysib-your_api_key" | gcloud secrets create BREVO_API_KEY \
     --data-file=- \
     --project=YOUR_PROJECT_ID
   ```

2. **Grant access** to your service account:
   ```bash
   gcloud secrets add-iam-policy-binding BREVO_API_KEY \
     --member="serviceAccount:YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor" \
     --project=YOUR_PROJECT_ID
   ```

3. **Set environment variables** in Cloud Run:
   ```bash
   gcloud run services update SERVICE_NAME \
     --set-env-vars="BREVO_FROM_EMAIL=noreply@guruforu.com,BREVO_FROM_NAME=GuruForU Contact Form,CONTACT_EMAIL=support@guruforu.com" \
     --project=YOUR_PROJECT_ID
   ```

The code will automatically use Secret Manager in production and environment variables in development!
