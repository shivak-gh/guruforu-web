# Update Secrets in Google Secret Manager

This directory contains scripts to help you update secrets in Google Secret Manager for the `guruforu-web` application.

## Available Scripts

### 1. `update-secrets.sh` (Interactive Bash Script)
**Best for:** Linux, Mac, Git Bash, WSL

Interactive script that prompts you for secrets and sets everything up.

```bash
# Make executable (on Unix systems)
chmod +x update-secrets.sh

# Run the script
./update-secrets.sh [PROJECT_ID]

# Or set project ID as environment variable
export GOOGLE_CLOUD_PROJECT="your-project-id"
./update-secrets.sh
```

**What it does:**
- Prompts you to enter `RECAPTCHA_SECRET_KEY` (hidden input)
- Prompts you to enter `BREVO_API_KEY` (hidden input)
- Creates or updates secrets in Secret Manager
- Grants access to Cloud Run service account
- Updates Cloud Run service to use the secrets

### 2. `update-secrets.ps1` (Interactive PowerShell Script)
**Best for:** Windows PowerShell

Interactive PowerShell script with the same functionality.

```powershell
# Run the script
.\update-secrets.ps1 [-ProjectId PROJECT_ID]

# Or set project ID as environment variable
$env:GOOGLE_CLOUD_PROJECT = "your-project-id"
.\update-secrets.ps1
```

**What it does:**
- Same as the bash script but for Windows
- Uses secure password input for secrets
- Works with PowerShell on Windows

### 3. `update-secrets-quick.sh` (Quick Non-Interactive Script)
**Best for:** Automation, CI/CD, or when you have the values ready

Non-interactive script that takes values as arguments or environment variables.

```bash
# Using command-line arguments
./update-secrets-quick.sh PROJECT_ID RECAPTCHA_SECRET BREVO_API_KEY

# Using environment variables
export GOOGLE_CLOUD_PROJECT="your-project-id"
export RECAPTCHA_SECRET_KEY="your-recaptcha-secret"
export BREVO_API_KEY="your-brevo-api-key"
./update-secrets-quick.sh
```

**What it does:**
- Same setup as interactive scripts but non-interactive
- Useful for automation or CI/CD pipelines

## Prerequisites

1. **Install gcloud CLI:**
   ```bash
   # Install from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate with gcloud:**
   ```bash
   gcloud auth login
   gcloud auth application-default login  # For API access
   ```

3. **Set default project (optional):**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Usage Examples

### Example 1: Interactive Setup (Recommended for first time)

**On Linux/Mac/Git Bash:**
```bash
chmod +x update-secrets.sh
./update-secrets.sh your-gcp-project-id
```

**On Windows PowerShell:**
```powershell
.\update-secrets.ps1 -ProjectId your-gcp-project-id
```

The script will:
1. Prompt you for `RECAPTCHA_SECRET_KEY`
2. Prompt you for `BREVO_API_KEY`
3. Create/update secrets in Secret Manager
4. Grant permissions
5. Update Cloud Run service

### Example 2: Quick Update (When you have values)

```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export RECAPTCHA_SECRET_KEY="6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM"
export BREVO_API_KEY="xkeysib-your-brevo-api-key"
./update-secrets-quick.sh
```

### Example 3: Update Individual Secret

You can also update individual secrets manually:

```bash
# Update RECAPTCHA_SECRET_KEY
echo -n "your-new-secret-key" | gcloud secrets versions add RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID

# Update BREVO_API_KEY
echo -n "your-new-api-key" | gcloud secrets versions add BREVO_API_KEY \
  --data-file=- \
  --project=YOUR_PROJECT_ID
```

## What Secrets Are Updated

1. **RECAPTCHA_SECRET_KEY**
   - Your Google reCAPTCHA Secret Key
   - Used for verifying reCAPTCHA tokens on the backend
   - Get it from: https://www.google.com/recaptcha/admin

2. **BREVO_API_KEY**
   - Your Brevo (formerly Sendinblue) API Key
   - Used for sending emails from the contact form
   - Get it from: https://app.brevo.com/settings/keys/api

## Verification

After running the script, verify that secrets are configured:

```bash
# List all secrets
gcloud secrets list --project=YOUR_PROJECT_ID

# Check Cloud Run service configuration
gcloud run services describe guruforu-web \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID \
  --format='value(spec.template.spec.containers[0].env)'

# Check secret permissions
gcloud secrets get-iam-policy RECAPTCHA_SECRET_KEY --project=YOUR_PROJECT_ID
gcloud secrets get-iam-policy BREVO_API_KEY --project=YOUR_PROJECT_ID
```

## Troubleshooting

### Error: "gcloud: command not found"
- Install gcloud CLI from: https://cloud.google.com/sdk/docs/install

### Error: "You are not authenticated"
```bash
gcloud auth login
gcloud auth application-default login
```

### Error: "Permission denied"
- Make sure you have `Secret Manager Admin` or `Secret Manager Secret Accessor` role
- Or ask your GCP admin to grant permissions

### Error: "Service account not found"
- The script will automatically use the default compute service account
- Or create a service account and use it:
  ```bash
  gcloud iam service-accounts create cloud-run-secrets \
    --display-name="Cloud Run Secrets Accessor"
  ```

### Error: "Cloud Run service not found"
- Make sure the service name matches: `guruforu-web`
- Check the region: `us-central1`
- Deploy the service first if it doesn't exist

## Security Best Practices

1. ✅ **Never commit secrets to git** - Always use Secret Manager
2. ✅ **Rotate secrets regularly** - Especially after exposure
3. ✅ **Use different keys for dev/prod** - Separate environments
4. ✅ **Limit access** - Only grant access to necessary service accounts
5. ✅ **Monitor access** - Check secret access logs regularly

## Manual Setup (Alternative)

If you prefer to set up manually without scripts:

### Step 1: Create Secrets

```bash
PROJECT_ID="your-project-id"

# Create RECAPTCHA_SECRET_KEY
echo -n "your-recaptcha-secret" | gcloud secrets create RECAPTCHA_SECRET_KEY \
  --data-file=- \
  --project=$PROJECT_ID

# Create BREVO_API_KEY
echo -n "your-brevo-api-key" | gcloud secrets create BREVO_API_KEY \
  --data-file=- \
  --project=$PROJECT_ID
```

### Step 2: Grant Access

```bash
# Get service account
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

gcloud secrets add-iam-policy-binding BREVO_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID
```

### Step 3: Update Cloud Run Service

```bash
gcloud run services update guruforu-web \
  --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest \
  --region=us-central1 \
  --project=$PROJECT_ID
```

## Need Help?

- Check `FIX_EXPOSED_SECRET.md` for security issues
- Check `SETUP_PRODUCTION_SECRETS.md` for detailed setup instructions
- Google Cloud Secret Manager docs: https://cloud.google.com/secret-manager/docs
