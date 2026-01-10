# Cloud Run Environment Variables Setup

After deploying to Google Cloud Run, you need to set environment variables for the application to work correctly.

## Required Environment Variables

### Public Variables (Safe to expose)
These can be set directly in Cloud Build or Cloud Run:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Your reCAPTCHA Site Key (public, safe to expose)
- `CONTACT_EMAIL` - Email address where contact form submissions are sent
- `BREVO_FROM_EMAIL` - Email address that appears as sender (must be verified in Brevo)
- `BREVO_FROM_NAME` - Name that appears as sender

### Secret Variables (Must be in Secret Manager)
These should be stored in Google Secret Manager for security:

- `BREVO_API_KEY` - Your Brevo API key (stored in Secret Manager)
- `RECAPTCHA_SECRET_KEY` - Your reCAPTCHA Secret Key (stored in Secret Manager)
- `GOOGLE_CLOUD_PROJECT` - Your GCP Project ID (can be env var or auto-detected)

## Quick Fix: Set Environment Variables in Cloud Run

### Option 1: Update via gcloud Command

```bash
gcloud run services update guruforu-web \
  --set-env-vars="NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob,CONTACT_EMAIL=support@guruforu.com,BREVO_FROM_EMAIL=noreply@guruforu.com,BREVO_FROM_NAME=GuruForU Contact Form,NODE_ENV=production" \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

### Option 2: Update via Cloud Console

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service: `guruforu-web`
3. Click **"Edit & Deploy New Revision"**
4. Go to **"Variables & Secrets"** tab
5. Click **"Add Variable"** and add:
   - **Name**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Value**: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`
6. Add other variables:
   - `CONTACT_EMAIL` = `support@guruforu.com`
   - `BREVO_FROM_EMAIL` = `noreply@guruforu.com`
   - `BREVO_FROM_NAME` = `GuruForU Contact Form`
   - `NODE_ENV` = `production`
7. Click **"Deploy"**

### Option 3: Update cloudbuild.yaml (Already Done)

The `cloudbuild.yaml` file has been updated to automatically set these environment variables during deployment.

## Set Secrets in Google Secret Manager

For sensitive values (API keys), use Secret Manager:

### 1. Create Secrets in Secret Manager

```bash
# Brevo API Key
echo -n "xkeysib-your_actual_brevo_api_key" | gcloud secrets create BREVO_API_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID

# reCAPTCHA Secret Key
echo -n "6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### 2. Grant Access to Cloud Run Service Account

```bash
# Get your service account email
SERVICE_ACCOUNT="$(gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.serviceAccountName)' \
  --project=YOUR_PROJECT_ID)"

# If service account is empty, use default compute service account
if [ -z "$SERVICE_ACCOUNT" ]; then
  SERVICE_ACCOUNT="YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com"
fi

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

### 3. Reference Secrets in Cloud Run

Update your Cloud Run service to use secrets:

```bash
gcloud run services update guruforu-web \
  --update-secrets=BREVO_API_KEY=BREVO_API_KEY:latest,RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

Or via Cloud Console:
1. Go to Cloud Run service
2. Edit & Deploy New Revision
3. Go to **"Variables & Secrets"** tab
4. Click **"Reference a secret"**
5. Add secrets:
   - **Name**: `BREVO_API_KEY`
   - **Secret**: Select `BREVO_API_KEY` from dropdown
   - **Version**: `latest`
6. Repeat for `RECAPTCHA_SECRET_KEY`
7. Deploy

## Verify Environment Variables

After setting environment variables, verify they're set correctly:

```bash
gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)' \
  --project=YOUR_PROJECT_ID
```

## Important Notes

1. **NEXT_PUBLIC_* Variables**: 
   - These are embedded at build time in Next.js
   - Also need to be available at runtime
   - Must be set in Cloud Run environment variables

2. **After Setting Variables**:
   - Cloud Run will automatically create a new revision
   - Traffic will route to the new revision
   - Old revisions remain available for rollback

3. **Build-Time vs Runtime**:
   - For Next.js standalone builds, `NEXT_PUBLIC_*` variables are embedded at build time
   - However, setting them as runtime env vars ensures they're available if needed

4. **Restart Service** (if needed):
   ```bash
   gcloud run services update-traffic guruforu-web \
     --to-latest \
     --region=us-central1 \
     --project=YOUR_PROJECT_ID
   ```

## Current Configuration

The `cloudbuild.yaml` has been updated to automatically set:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`
- `CONTACT_EMAIL=support@guruforu.com`
- `BREVO_FROM_EMAIL=noreply@guruforu.com`
- `BREVO_FROM_NAME=GuruForU Contact Form`
- `NODE_ENV=production`

If you redeploy, these will be set automatically. If you've already deployed, use Option 1 or 2 above to update the existing service.
