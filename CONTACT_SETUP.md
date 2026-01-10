# Contact Form Setup Guide

This guide will help you set up email functionality and reCAPTCHA for the contact form using Brevo (formerly Sendinblue) and Google Secret Manager.

## Prerequisites

1. **Brevo Account** (for sending emails)
   - Sign up at [https://www.brevo.com](https://www.brevo.com)
   - Get your API key from Settings > API Keys
   - Note: You need at least a free account

2. **Google Cloud Secret Manager** (for storing API keys securely)
   - Ensure you have a Google Cloud Project
   - Enable Secret Manager API
   - Grant your Cloud Run service account access to Secret Manager

3. **Google reCAPTCHA v3** (for spam protection)
   - Go to [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
   - Create a new site
   - Select reCAPTCHA v3
   - Add your domain
   - Copy your Site Key and Secret Key

## Google Secret Manager Setup

### 1. Create Secrets in Google Secret Manager

Store your API keys securely in Google Secret Manager:

```bash
# Store Brevo API Key
gcloud secrets create BREVO_API_KEY \
  --data-file=- <<< "your_brevo_api_key_here" \
  --project=YOUR_PROJECT_ID

# Store reCAPTCHA Secret Key (optional, can also use environment variable)
gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- <<< "your_recaptcha_secret_key_here" \
  --project=YOUR_PROJECT_ID
```

### 2. Grant Access to Your Service Account

Grant your Cloud Run service account access to read secrets:

```bash
# Get your service account email
SERVICE_ACCOUNT="YOUR_SERVICE_ACCOUNT@YOUR_PROJECT_ID.iam.gserviceaccount.com"

# Grant secret accessor role
gcloud secrets add-iam-policy-binding BREVO_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_ID

gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_ID
```

### 3. Update Secret Versions (if needed)

To update a secret:

```bash
# Update Brevo API Key
echo -n "new_api_key_value" | gcloud secrets versions add BREVO_API_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

## Environment Variables Setup

For local development, create a `.env.local` file:

```env
# Google Cloud Project ID (required for Secret Manager)
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
# OR
GCP_PROJECT_ID=your-gcp-project-id

# For local development, you can override secrets with environment variables
# (These will only be used if Secret Manager is unavailable)
BREVO_API_KEY=your_brevo_api_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Email configuration
CONTACT_EMAIL=support@guruforu.com
BREVO_FROM_EMAIL=noreply@guruforu.com
BREVO_FROM_NAME=GuruForU Contact Form

# Google reCAPTCHA v3 (public key - safe to expose)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Environment Variables Explained

- **GOOGLE_CLOUD_PROJECT** or **GCP_PROJECT_ID**: Your Google Cloud Project ID (required for Secret Manager)
- **BREVO_API_KEY**: Your Brevo API key. Stored in Secret Manager in production, can use env var for local dev
- **RECAPTCHA_SECRET_KEY**: Your reCAPTCHA Secret Key. Can be stored in Secret Manager or env var
- **CONTACT_EMAIL**: The email address where contact form submissions will be sent
- **BREVO_FROM_EMAIL**: The email address that will appear as the sender (must be verified in Brevo)
- **BREVO_FROM_NAME**: The name that will appear as the sender
- **NEXT_PUBLIC_RECAPTCHA_SITE_KEY**: Your reCAPTCHA Site Key (public key, safe to expose)

## Brevo Email Setup

1. **Verify Your Sender Domain** (Recommended for Production):
   - In Brevo, go to Senders & IP > Domains
   - Add and verify your domain (e.g., guruforu.com)
   - Update `BREVO_FROM_EMAIL` to use your verified domain (e.g., `noreply@guruforu.com`)

2. **Verify Sender Email** (For Testing):
   - In Brevo, go to Senders & IP > Email addresses
   - Add and verify a sender email
   - Use this verified email in `BREVO_FROM_EMAIL`

3. **Get Your API Key**:
   - Go to Settings > API Keys
   - Create a new API key with "Send emails" permission
   - Store this key in Google Secret Manager

## Local Development Setup

For local development, you have two options:

### Option 1: Use Environment Variables (Easier for local dev)

1. Create `.env.local` with your API keys
2. The code will automatically fall back to environment variables if Secret Manager is unavailable

### Option 2: Use Google Secret Manager Locally

1. Install Google Cloud SDK and authenticate:
   ```bash
   gcloud auth application-default login
   ```

2. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. The code will automatically fetch secrets from Secret Manager

## reCAPTCHA Setup

1. **Register your domain**:
   - When creating reCAPTCHA keys, add your production domain
   - For local development, you can also add `localhost`

2. **Store Secret Key**:
   - Option 1: Store in Google Secret Manager (recommended for production)
   - Option 2: Use environment variable `RECAPTCHA_SECRET_KEY`

3. **Test your setup**:
   - The reCAPTCHA v3 runs invisibly in the background
   - It scores user interactions (0.0 to 1.0)
   - Scores above 0.5 are considered valid submissions

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/contact`

3. Fill out the form and submit

4. Check:
   - Your email inbox for the contact form submission
   - Browser console for any errors
   - Server logs for API errors

## Troubleshooting

### Email not sending
- Verify your `BREVO_API_KEY` is correct and stored in Secret Manager
- Check that `BREVO_FROM_EMAIL` is verified in Brevo
- Verify your service account has `secretmanager.secretAccessor` role
- Check server logs for Brevo API errors
- Ensure your project ID is set correctly (`GOOGLE_CLOUD_PROJECT` or `GCP_PROJECT_ID`)

### Secret Manager not working
- Verify Secret Manager API is enabled in your GCP project
- Check that your service account has the correct IAM permissions
- For local development, ensure you're authenticated: `gcloud auth application-default login`
- Verify the secret name matches exactly (case-sensitive): `BREVO_API_KEY`
- Check that your GCP project ID is set correctly

### reCAPTCHA not working
- Verify both `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (env var) and `RECAPTCHA_SECRET_KEY` (Secret Manager or env var) are set
- Check that your domain is registered in reCAPTCHA
- Ensure the keys match (Site Key and Secret Key are from the same reCAPTCHA site)
- Check browser console for any script loading errors

### Form submission errors
- Check browser console for client-side errors
- Check server logs for API route errors
- Verify all required environment variables are set
- Ensure you've installed dependencies: `npm install`

## Production Deployment

When deploying to production (e.g., Google Cloud Run):

1. **Ensure secrets are in Secret Manager**:
   - All sensitive API keys should be stored in Secret Manager
   - Public keys (like `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) can be environment variables

2. **Set environment variables in Cloud Run**:
   ```bash
   gcloud run services update SERVICE_NAME \
     --set-env-vars="GOOGLE_CLOUD_PROJECT=your-project-id,CONTACT_EMAIL=support@guruforu.com,BREVO_FROM_EMAIL=noreply@guruforu.com,BREVO_FROM_NAME=GuruForU Contact Form,NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key" \
     --project=YOUR_PROJECT_ID
   ```

3. **Verify service account permissions**:
   - Your Cloud Run service account needs `roles/secretmanager.secretAccessor` role
   - This allows it to read secrets from Secret Manager

4. **Update domain in reCAPTCHA**:
   - Add your production domain to the reCAPTCHA site configuration

5. **Verify email domain in Brevo**:
   - Add and verify your domain
   - Update `BREVO_FROM_EMAIL` to use your domain

## Security Notes

- **Never commit** `.env.local` or `.env` files to version control (already in `.gitignore`)
- **Always use Secret Manager** for sensitive keys in production
- `NEXT_PUBLIC_*` variables are exposed to the browser (only use for public keys)
- `BREVO_API_KEY` and `RECAPTCHA_SECRET_KEY` must remain secret and stored in Secret Manager
- The secret cache TTL is 5 minutes to reduce API calls while keeping data relatively fresh

## Architecture

The implementation uses:
- **Google Secret Manager**: For secure storage of API keys (`BREVO_API_KEY`, `RECAPTCHA_SECRET_KEY`)
- **Brevo API**: For sending transactional emails
- **Google reCAPTCHA v3**: For spam protection (invisible to users)
- **Secret Caching**: Secrets are cached for 5 minutes to improve performance
- **Fallback to Environment Variables**: For local development convenience
