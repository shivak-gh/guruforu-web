# reCAPTCHA Setup Instructions

Your reCAPTCHA keys have been configured. Follow these steps to complete the setup:

## 1. Set the Site Key (Public Key)

The Site Key is safe to expose and should be set as an environment variable.

### For Local Development

Create or update `.env.local` file in the root directory:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob
```

### For Production (Google Cloud Run)

Set the environment variable:

```bash
gcloud run services update SERVICE_NAME \
  --set-env-vars="NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob" \
  --project=YOUR_PROJECT_ID
```

## 2. Store Secret Key in Google Secret Manager

The Secret Key must be stored securely in Google Secret Manager.

### Create the Secret

```bash
# Replace YOUR_PROJECT_ID with your actual GCP project ID
echo -n "6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### If the Secret Already Exists (Update it)

```bash
echo -n "6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM" | gcloud secrets versions add RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### Grant Access to Your Service Account

```bash
# Replace with your actual service account email
SERVICE_ACCOUNT="YOUR_SERVICE_ACCOUNT@YOUR_PROJECT_ID.iam.gserviceaccount.com"

gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_ID
```

## 3. For Local Development (Alternative)

If you prefer to use environment variables for local development instead of Secret Manager:

Add to `.env.local`:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob
RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM
```

**Note:** The code will automatically fall back to environment variables in development mode if Secret Manager is unavailable.

## 4. Verify Setup

1. Restart your development server: `npm run dev`
2. Navigate to `/contact`
3. Open browser console and check for any reCAPTCHA errors
4. Submit the form to test

## Security Notes

- ✅ **Site Key** (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`): Safe to expose, can be in environment variables
- 🔒 **Secret Key** (`RECAPTCHA_SECRET_KEY`): Must be kept secret, use Secret Manager in production
- Never commit `.env.local` to version control (already in `.gitignore`)
