# Setup Production Secrets for Google Cloud Run

## Issue: RECAPTCHA_SECRET_KEY not found in production

Your production deployment is missing `RECAPTCHA_SECRET_KEY`. Here's how to fix it:

## Option 1: Store in Google Secret Manager (Recommended for Production)

### Step 1: Create Secret in Secret Manager

```bash
# Replace YOUR_PROJECT_ID with your actual GCP project ID
echo -n "6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### Step 2: Grant Access to Cloud Run Service Account

First, get your service account:

```bash
# Get the service account email
SERVICE_ACCOUNT=$(gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.serviceAccountName)' \
  --project=YOUR_PROJECT_ID)

# If empty, use default compute service account
if [ -z "$SERVICE_ACCOUNT" ]; then
  PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')
  SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
fi

echo "Service Account: $SERVICE_ACCOUNT"
```

Then grant access:

```bash
# Grant secret accessor role
gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_ID
```

### Step 3: Update Cloud Run to Use Secret

```bash
gcloud run services update guruforu-web \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

### Step 4: Set GOOGLE_CLOUD_PROJECT Environment Variable

```bash
gcloud run services update guruforu-web \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID" \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

## Option 2: Set as Environment Variable (Quick Fix)

If you need a quick fix, you can set it as an environment variable (less secure, but works):

```bash
gcloud run services update guruforu-web \
  --set-env-vars="RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM" \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

**Note:** This exposes the secret key in environment variables (visible in Cloud Run console). Secret Manager is more secure.

## Option 3: Update cloudbuild.yaml (For Future Deployments)

Update `cloudbuild.yaml` to set environment variables during deployment:

```yaml
- '--set-env-vars'
- 'NODE_ENV=production,NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob,CONTACT_EMAIL=support@guruforu.com,BREVO_FROM_EMAIL=noreply@guruforu.com,BREVO_FROM_NAME=GuruForU Contact Form,GOOGLE_CLOUD_PROJECT=$PROJECT_ID'
```

And add secrets reference:

```yaml
- '--update-secrets'
- 'RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest'
```

## Setup Both Secrets (RECAPTCHA_SECRET_KEY and BREVO_API_KEY)

You'll also need to set up `BREVO_API_KEY`:

### 1. Create BREVO_API_KEY Secret

```bash
echo -n "xkeysib-your_actual_brevo_api_key" | gcloud secrets create BREVO_API_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### 2. Grant Access

```bash
gcloud secrets add-iam-policy-binding BREVO_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_ID
```

### 3. Update Cloud Run

```bash
gcloud run services update guruforu-web \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID" \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

## Quick Setup Script

Here's a complete script to set everything up:

```bash
#!/bin/bash

PROJECT_ID="YOUR_PROJECT_ID"
REGION="us-central1"
SERVICE_NAME="guruforu-web"

# Set your secrets
RECAPTCHA_SECRET="6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM"
BREVO_API_KEY="xkeysib-your_actual_brevo_api_key"

# Get service account
SERVICE_ACCOUNT=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format='value(spec.template.spec.serviceAccountName)' \
  --project=$PROJECT_ID)

if [ -z "$SERVICE_ACCOUNT" ]; then
  PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
  SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
fi

echo "Using service account: $SERVICE_ACCOUNT"

# Create secrets (skip if already exists)
echo -n "$RECAPTCHA_SECRET" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=$PROJECT_ID 2>/dev/null || echo "RECAPTCHA_SECRET_KEY already exists"

echo -n "$BREVO_API_KEY" | gcloud secrets create BREVO_API_KEY \
  --data-file=- \
  --project=$PROJECT_ID 2>/dev/null || echo "BREVO_API_KEY already exists"

# Grant access
gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID

gcloud secrets add-iam-policy-binding BREVO_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID

# Update Cloud Run service
gcloud run services update $SERVICE_NAME \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob,CONTACT_EMAIL=support@guruforu.com,BREVO_FROM_EMAIL=noreply@guruforu.com,BREVO_FROM_NAME=GuruForU Contact Form" \
  --region=$REGION \
  --project=$PROJECT_ID

echo "✅ Secrets configured!"
```

## Verify Setup

After setting up, verify the configuration:

```bash
# Check environment variables
gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)' \
  --project=YOUR_PROJECT_ID

# Check secrets
gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)' \
  --project=YOUR_PROJECT_ID | grep -i secret
```

## Troubleshooting

### "Permission denied" error
- Make sure your service account has `roles/secretmanager.secretAccessor` role
- Check that the secret exists: `gcloud secrets list --project=YOUR_PROJECT_ID`

### "Secret not found" error
- Verify the secret name matches exactly: `RECAPTCHA_SECRET_KEY` (case-sensitive)
- Check that you're using the correct project ID

### "GCP Project ID is not set"
- Set `GOOGLE_CLOUD_PROJECT` environment variable in Cloud Run
- Or set `GCP_PROJECT_ID` environment variable

## After Setup

Once configured:
1. The service will automatically restart with the new configuration
2. Check logs to verify secrets are being loaded: `gcloud run services logs read guruforu-web --region=us-central1 --project=YOUR_PROJECT_ID`
3. Test the contact form again
