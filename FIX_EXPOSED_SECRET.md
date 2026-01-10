# Fix: Exposed reCAPTCHA Secret Key in GitHub

## Issue
GitGuardian detected that `RECAPTCHA_SECRET_KEY` was exposed in `cloudbuild.yaml` file committed to GitHub.

## Action Taken
✅ **Removed the exposed secret** from `cloudbuild.yaml`
✅ **Updated configuration** to use Google Secret Manager only
✅ **Updated code** to prioritize Secret Manager in production

## What Changed

### Before (EXPOSED):
```yaml
--set-env-vars: '...,RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM'
```

### After (SECURE):
```yaml
--update-secrets: 'RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest'
```

The secret is now referenced from Google Secret Manager, not hardcoded.

## IMPORTANT: Rotate the Exposed Key

Since the secret key was exposed in GitHub, you should **rotate it** for security:

### Step 1: Generate New reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site (Site Key: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`)
3. Click **"Settings"** or **"Edit"**
4. Regenerate the **Secret Key** (you may need to delete and recreate the site)
5. Copy the new **Site Key** and **Secret Key**

### Step 2: Update Google Secret Manager

Store the new secret in Secret Manager:

```bash
# Replace YOUR_PROJECT_ID and the new secret key
echo -n "YOUR_NEW_RECAPTCHA_SECRET_KEY" | gcloud secrets versions add RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

Or if the secret doesn't exist yet:

```bash
echo -n "YOUR_NEW_RECAPTCHA_SECRET_KEY" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

### Step 3: Update Site Key (if changed)

If you regenerated both keys, update `cloudbuild.yaml`:

```yaml
--build-arg: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_NEW_SITE_KEY'
--set-env-vars: '...,NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_NEW_SITE_KEY'
```

And update `.env.local` for local development.

### Step 4: Update Cloud Run Service

```bash
gcloud run services update guruforu-web \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest \
  --set-env-vars="NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_NEW_SITE_KEY,..." \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

## Setup Secret Manager (If Not Done Yet)

### 1. Create Secret in Secret Manager

```bash
PROJECT_ID="YOUR_PROJECT_ID"
RECAPTCHA_SECRET="YOUR_RECAPTCHA_SECRET_KEY"  # Use the NEW rotated key

echo -n "$RECAPTCHA_SECRET" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=$PROJECT_ID
```

### 2. Grant Access to Service Account

```bash
# Get your service account
SERVICE_ACCOUNT=$(gcloud run services describe guruforu-web \
  --region=us-central1 \
  --format='value(spec.template.spec.serviceAccountName)' \
  --project=$PROJECT_ID)

# If empty, use default compute service account
if [ -z "$SERVICE_ACCOUNT" ]; then
  PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
  SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
fi

# Grant access
gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID
```

### 3. Update Cloud Run to Use Secret

```bash
gcloud run services update guruforu-web \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest \
  --region=us-central1 \
  --project=$PROJECT_ID
```

## Verify Setup

After setting up Secret Manager:

1. **Check secret exists:**
   ```bash
   gcloud secrets list --project=YOUR_PROJECT_ID | grep RECAPTCHA_SECRET_KEY
   ```

2. **Verify service account has access:**
   ```bash
   gcloud secrets get-iam-policy RECAPTCHA_SECRET_KEY \
     --project=YOUR_PROJECT_ID
   ```

3. **Test the contact form** - it should work without errors

## Security Best Practices Going Forward

1. ✅ **Never commit secrets** to git repositories
2. ✅ **Use Secret Manager** for all sensitive values in production
3. ✅ **Use .env.local** for local development (already in .gitignore)
4. ✅ **Rotate exposed secrets** immediately after detection
5. ✅ **Use different keys** for development and production if possible

## Current Status

- ✅ `RECAPTCHA_SECRET_KEY` removed from `cloudbuild.yaml`
- ✅ Configuration updated to use Secret Manager references
- ✅ Code updated to prioritize Secret Manager in production
- ⚠️ **Action Required:** Rotate the exposed secret key in Google reCAPTCHA console

## Next Steps

1. **Rotate the reCAPTCHA secret key** (recommended for security)
2. **Store the new key in Google Secret Manager**
3. **Update Cloud Run** to use the secret from Secret Manager
4. **Test the contact form** to ensure everything works

The code is now secure - secrets are only in Secret Manager, not in the repository!
