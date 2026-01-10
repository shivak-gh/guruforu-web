#!/bin/bash

# Quick script to update secrets with values directly (for automation/CI)
# Usage: ./update-secrets-quick.sh PROJECT_ID RECAPTCHA_SECRET BREVO_API_KEY
# Or set environment variables: RECAPTCHA_SECRET_KEY and BREVO_API_KEY

set -e

PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT:-${GCP_PROJECT_ID}}}
RECAPTCHA_SECRET=${2:-${RECAPTCHA_SECRET_KEY}}
BREVO_API_KEY=${3:-${BREVO_API_KEY}}

SERVICE_NAME="guruforu-web"
REGION="us-central1"

if [ -z "$PROJECT_ID" ] || [ -z "$RECAPTCHA_SECRET" ] || [ -z "$BREVO_API_KEY" ]; then
    echo "Usage: ./update-secrets-quick.sh PROJECT_ID RECAPTCHA_SECRET BREVO_API_KEY"
    echo "Or set: GOOGLE_CLOUD_PROJECT, RECAPTCHA_SECRET_KEY, BREVO_API_KEY"
    exit 1
fi

echo "Updating secrets for project: $PROJECT_ID"

# Create or update RECAPTCHA_SECRET_KEY
if gcloud secrets describe RECAPTCHA_SECRET_KEY --project="$PROJECT_ID" &>/dev/null; then
    echo -n "$RECAPTCHA_SECRET" | gcloud secrets versions add RECAPTCHA_SECRET_KEY --data-file=- --project="$PROJECT_ID"
else
    echo -n "$RECAPTCHA_SECRET" | gcloud secrets create RECAPTCHA_SECRET_KEY --data-file=- --project="$PROJECT_ID"
fi

# Create or update BREVO_API_KEY
if gcloud secrets describe BREVO_API_KEY --project="$PROJECT_ID" &>/dev/null; then
    echo -n "$BREVO_API_KEY" | gcloud secrets versions add BREVO_API_KEY --data-file=- --project="$PROJECT_ID"
else
    echo -n "$BREVO_API_KEY" | gcloud secrets create BREVO_API_KEY --data-file=- --project="$PROJECT_ID"
fi

# Get service account
SERVICE_ACCOUNT=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(spec.template.spec.serviceAccountName)' --project="$PROJECT_ID" 2>/dev/null || echo "")
if [ -z "$SERVICE_ACCOUNT" ]; then
    PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
    SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
fi

# Grant access
gcloud secrets add-iam-policy-binding RECAPTCHA_SECRET_KEY --member="serviceAccount:${SERVICE_ACCOUNT}" --role="roles/secretmanager.secretAccessor" --project="$PROJECT_ID" 2>/dev/null || true
gcloud secrets add-iam-policy-binding BREVO_API_KEY --member="serviceAccount:${SERVICE_ACCOUNT}" --role="roles/secretmanager.secretAccessor" --project="$PROJECT_ID" 2>/dev/null || true

# Update Cloud Run service
gcloud run services update "$SERVICE_NAME" --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest --region="$REGION" --project="$PROJECT_ID"

echo "✓ Secrets updated successfully"
