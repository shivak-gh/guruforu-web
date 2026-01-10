# PowerShell script to update secrets in Google Secret Manager for guruforu-web
# Usage: .\update-secrets.ps1 [PROJECT_ID]

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT
)

if (-not $ProjectId) {
    $ProjectId = $env:GCP_PROJECT_ID
}

if (-not $ProjectId) {
    Write-Host "Error: PROJECT_ID is required" -ForegroundColor Red
    Write-Host "Usage: .\update-secrets.ps1 [-ProjectId PROJECT_ID]"
    Write-Host "Or set GOOGLE_CLOUD_PROJECT or GCP_PROJECT_ID environment variable"
    exit 1
}

Write-Host "Using GCP Project: $ProjectId" -ForegroundColor Green
Write-Host ""

$ServiceName = "guruforu-web"
$Region = "us-central1"

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Error: gcloud CLI is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
}

# Check if user is authenticated
$activeAuth = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $activeAuth) {
    Write-Host "Warning: You are not authenticated with gcloud" -ForegroundColor Yellow
    Write-Host "Run: gcloud auth login"
    exit 1
}

# Function to create or update a secret
function CreateOrUpdateSecret {
    param(
        [string]$SecretName,
        [string]$SecretValue
    )
    
    Write-Host "Setting up $SecretName..." -ForegroundColor Yellow
    
    # Check if secret exists
    $secretExists = gcloud secrets describe $SecretName --project=$ProjectId 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Secret $SecretName already exists, adding new version..."
        $SecretValue | gcloud secrets versions add $SecretName --data-file=- --project=$ProjectId 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Updated $SecretName" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Failed to update $SecretName" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "  Creating new secret $SecretName..."
        $SecretValue | gcloud secrets create $SecretName --data-file=- --project=$ProjectId 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Created $SecretName" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Failed to create $SecretName" -ForegroundColor Red
            return $false
        }
    }
    Write-Host ""
    return $true
}

# Get secrets from user
Write-Host "=== Setting up secrets for guruforu-web ===" -ForegroundColor Green
Write-Host ""

# Prompt for RECAPTCHA_SECRET_KEY
$secureRecaptcha = Read-Host "Enter your reCAPTCHA Secret Key" -AsSecureString
$recaptchaSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureRecaptcha)
)

if ([string]::IsNullOrWhiteSpace($recaptchaSecret)) {
    Write-Host "Error: RECAPTCHA_SECRET_KEY cannot be empty" -ForegroundColor Red
    exit 1
}

# Prompt for BREVO_API_KEY
$secureBrevo = Read-Host "Enter your Brevo API Key (starts with xkeysib-)" -AsSecureString
$brevoApiKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureBrevo)
)

if ([string]::IsNullOrWhiteSpace($brevoApiKey)) {
    Write-Host "Error: BREVO_API_KEY cannot be empty" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating/updating secrets in Secret Manager..." -ForegroundColor Green
Write-Host ""

# Create or update secrets
$recaptchaSuccess = CreateOrUpdateSecret "RECAPTCHA_SECRET_KEY" $recaptchaSecret
$brevoSuccess = CreateOrUpdateSecret "BREVO_API_KEY" $brevoApiKey

if (-not $recaptchaSuccess -or -not $brevoSuccess) {
    Write-Host "Failed to create/update secrets" -ForegroundColor Red
    exit 1
}

# Get service account
Write-Host "Getting Cloud Run service account..." -ForegroundColor Yellow
$serviceAccount = gcloud run services describe $ServiceName --region=$Region --format='value(spec.template.spec.serviceAccountName)' --project=$ProjectId 2>$null

# If service account is empty, use default compute service account
if ([string]::IsNullOrWhiteSpace($serviceAccount)) {
    $projectNumber = gcloud projects describe $ProjectId --format='value(projectNumber)' 2>$null
    $serviceAccount = "$projectNumber-compute@developer.gserviceaccount.com"
    Write-Host "  Using default compute service account: $serviceAccount"
} else {
    Write-Host "  Found service account: $serviceAccount"
}
Write-Host ""

# Grant access to secrets
Write-Host "Granting access to secrets..." -ForegroundColor Yellow
$secrets = @("RECAPTCHA_SECRET_KEY", "BREVO_API_KEY")

foreach ($secretName in $secrets) {
    Write-Host "  Granting access to $secretName..."
    gcloud secrets add-iam-policy-binding $secretName --member="serviceAccount:$serviceAccount" --role="roles/secretmanager.secretAccessor" --project=$ProjectId 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Access granted for $secretName" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Access might already be granted for $secretName" -ForegroundColor Yellow
    }
}
Write-Host ""

# Update Cloud Run service to use secrets
Write-Host "Updating Cloud Run service to use secrets..." -ForegroundColor Yellow
gcloud run services update $ServiceName --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest --region=$Region --project=$ProjectId 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Cloud Run service updated successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to update Cloud Run service" -ForegroundColor Red
    Write-Host "  You may need to update it manually:"
    Write-Host "  gcloud run services update $ServiceName --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest --region=$Region --project=$ProjectId"
    exit 1
}
Write-Host ""

Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Secrets have been configured in Google Secret Manager:"
Write-Host "  ✓ RECAPTCHA_SECRET_KEY"
Write-Host "  ✓ BREVO_API_KEY"
Write-Host ""
Write-Host "Cloud Run service has been updated to use these secrets."
Write-Host ""
Write-Host "To verify, run:"
Write-Host "  gcloud secrets list --project=$ProjectId"
Write-Host "  gcloud run services describe $ServiceName --region=$Region --project=$ProjectId --format='value(spec.template.spec.containers[0].env)'"
