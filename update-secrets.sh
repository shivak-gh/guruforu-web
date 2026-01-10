#!/bin/bash

# Script to update secrets in Google Secret Manager for guruforu-web
# Usage: ./update-secrets.sh [PROJECT_ID]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get project ID from argument or environment variable
PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT:-${GCP_PROJECT_ID}}}

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: PROJECT_ID is required${NC}"
    echo "Usage: ./update-secrets.sh [PROJECT_ID]"
    echo "Or set GOOGLE_CLOUD_PROJECT or GCP_PROJECT_ID environment variable"
    exit 1
fi

echo -e "${GREEN}Using GCP Project: ${PROJECT_ID}${NC}"
echo ""

SERVICE_NAME="guruforu-web"
REGION="us-central1"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}Warning: You are not authenticated with gcloud${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Function to create or update a secret
create_or_update_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    
    echo -e "${YELLOW}Setting up ${SECRET_NAME}...${NC}"
    
    # Check if secret exists
    if gcloud secrets describe "$SECRET_NAME" --project="$PROJECT_ID" &>/dev/null; then
        echo "  Secret ${SECRET_NAME} already exists, adding new version..."
        echo -n "$SECRET_VALUE" | gcloud secrets versions add "$SECRET_NAME" \
            --data-file=- \
            --project="$PROJECT_ID"
        echo -e "  ${GREEN}✓ Updated ${SECRET_NAME}${NC}"
    else
        echo "  Creating new secret ${SECRET_NAME}..."
        echo -n "$SECRET_VALUE" | gcloud secrets create "$SECRET_NAME" \
            --data-file=- \
            --project="$PROJECT_ID"
        echo -e "  ${GREEN}✓ Created ${SECRET_NAME}${NC}"
    fi
    echo ""
}

# Function to get secret value from user
prompt_for_secret() {
    local SECRET_NAME=$1
    local PROMPT_TEXT=$2
    local SECRET_VALUE
    
    echo -e "${YELLOW}${PROMPT_TEXT}${NC}"
    echo "  (The value will be hidden for security)"
    read -s SECRET_VALUE
    echo ""
    
    if [ -z "$SECRET_VALUE" ]; then
        echo -e "${RED}Error: ${SECRET_NAME} cannot be empty${NC}"
        exit 1
    fi
    
    echo "$SECRET_VALUE"
}

# Get secrets from user
echo -e "${GREEN}=== Setting up secrets for guruforu-web ===${NC}"
echo ""

# Prompt for RECAPTCHA_SECRET_KEY
RECAPTCHA_SECRET=$(prompt_for_secret "RECAPTCHA_SECRET_KEY" "Enter your reCAPTCHA Secret Key:")

# Prompt for BREVO_API_KEY
BREVO_API_KEY=$(prompt_for_secret "BREVO_API_KEY" "Enter your Brevo API Key (starts with xkeysib-):")

echo ""
echo -e "${GREEN}Creating/updating secrets in Secret Manager...${NC}"
echo ""

# Create or update secrets
create_or_update_secret "RECAPTCHA_SECRET_KEY" "$RECAPTCHA_SECRET"
create_or_update_secret "BREVO_API_KEY" "$BREVO_API_KEY"

# Get service account
echo -e "${YELLOW}Getting Cloud Run service account...${NC}"
SERVICE_ACCOUNT=$(gcloud run services describe "$SERVICE_NAME" \
    --region="$REGION" \
    --format='value(spec.template.spec.serviceAccountName)' \
    --project="$PROJECT_ID" 2>/dev/null || echo "")

# If service account is empty, use default compute service account
if [ -z "$SERVICE_ACCOUNT" ]; then
    PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
    SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
    echo "  Using default compute service account: ${SERVICE_ACCOUNT}"
else
    echo "  Found service account: ${SERVICE_ACCOUNT}"
fi
echo ""

# Grant access to secrets
echo -e "${YELLOW}Granting access to secrets...${NC}"
for SECRET_NAME in "RECAPTCHA_SECRET_KEY" "BREVO_API_KEY"; do
    echo "  Granting access to ${SECRET_NAME}..."
    if gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --project="$PROJECT_ID" &>/dev/null; then
        echo -e "  ${GREEN}✓ Access granted for ${SECRET_NAME}${NC}"
    else
        echo -e "  ${YELLOW}⚠ Access might already be granted for ${SECRET_NAME}${NC}"
    fi
done
echo ""

# Update Cloud Run service to use secrets
echo -e "${YELLOW}Updating Cloud Run service to use secrets...${NC}"
if gcloud run services update "$SERVICE_NAME" \
    --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest \
    --region="$REGION" \
    --project="$PROJECT_ID"; then
    echo -e "${GREEN}✓ Cloud Run service updated successfully${NC}"
else
    echo -e "${RED}✗ Failed to update Cloud Run service${NC}"
    echo "  You may need to update it manually:"
    echo "  gcloud run services update $SERVICE_NAME \\"
    echo "    --update-secrets=RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest,BREVO_API_KEY=BREVO_API_KEY:latest \\"
    echo "    --region=$REGION \\"
    echo "    --project=$PROJECT_ID"
    exit 1
fi
echo ""

echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Secrets have been configured in Google Secret Manager:"
echo "  ✓ RECAPTCHA_SECRET_KEY"
echo "  ✓ BREVO_API_KEY"
echo ""
echo "Cloud Run service has been updated to use these secrets."
echo ""
echo "To verify, run:"
echo "  gcloud secrets list --project=$PROJECT_ID"
echo "  gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(spec.template.spec.containers[0].env)'"
