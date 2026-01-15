# Fixing reCAPTCHA "invalid-input-response" Error in Production

## Error: `invalid-input-response`

This error occurs when reCAPTCHA cannot verify the token. Common causes:

### 1. Domain Not Registered in reCAPTCHA Console

**Most Common Issue**: Your production domain must be registered in the reCAPTCHA console.

**Fix:**
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your reCAPTCHA site (the one with Site Key: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`)
3. Under "Domains", add your production domain:
   - `guruforu.com`
   - `www.guruforu.com`
   - `*.guruforu.com` (if using subdomains)
4. Save the changes
5. Wait a few minutes for changes to propagate

### 2. Secret Key Mismatch

**Issue**: The `RECAPTCHA_SECRET_KEY` in Secret Manager doesn't match the Site Key.

**Fix:**
1. Verify in reCAPTCHA console that your Secret Key matches the Site Key
2. Update the secret in Google Secret Manager:
   ```bash
   echo -n "your_recaptcha_secret_key" | gcloud secrets versions add RECAPTCHA_SECRET_KEY \
     --data-file=- \
     --project=YOUR_PROJECT_ID
   ```

### 3. Token Expiration

**Issue**: reCAPTCHA tokens expire after ~2 minutes. If the user takes too long to submit, the token expires.

**Fix:** (Already implemented)
- The code now generates the token right before submission
- If you see this error, users should refresh and try again

### 4. Token Already Used

**Issue**: reCAPTCHA tokens can only be used once. If the form is submitted multiple times with the same token, it fails.

**Fix:** (Already implemented)
- Each form submission generates a fresh token

## Verification Steps

### Check Secret Manager Configuration

```bash
# Verify the secret exists
gcloud secrets describe RECAPTCHA_SECRET_KEY --project=YOUR_PROJECT_ID

# Check the secret value (first 10 chars)
gcloud secrets versions access latest --secret=RECAPTCHA_SECRET_KEY --project=YOUR_PROJECT_ID | head -c 10
```

### Check Cloud Run Environment

```bash
# Verify environment variables are set
gcloud run services describe guruforu-web \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID \
  --format="value(spec.template.spec.containers[0].env)"
```

### Check reCAPTCHA Console

1. Visit: https://www.google.com/recaptcha/admin
2. Find your site with Site Key: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`
3. Verify:
   - ✅ Domain `guruforu.com` is listed
   - ✅ Domain `www.guruforu.com` is listed (if using www)
   - ✅ Secret Key matches what's in Secret Manager

## Testing After Fix

1. **Clear browser cache** and cookies
2. **Visit** your production site: `https://www.guruforu.com/contact`
3. **Fill out the form** and submit
4. **Check browser console** (F12) for any reCAPTCHA errors
5. **Check Cloud Run logs** for reCAPTCHA verification details:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=guruforu-web" \
     --limit=50 \
     --format=json \
     --project=YOUR_PROJECT_ID
   ```

## Common Error Codes

- `invalid-input-response`: Token is invalid, expired, or domain not registered
- `missing-input-response`: Token was not sent
- `timeout-or-duplicate`: Token expired or was already used
- `invalid-input-secret`: Secret key is wrong

## Quick Fix Checklist

- [ ] Domain registered in reCAPTCHA console
- [ ] Secret key matches site key
- [ ] `RECAPTCHA_SECRET_KEY` exists in Secret Manager
- [ ] Cloud Run service account has `secretmanager.secretAccessor` role
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in Cloud Run env vars
- [ ] `GOOGLE_CLOUD_PROJECT` is set in Cloud Run env vars

## Still Not Working?

1. **Check Cloud Run logs** for detailed error messages
2. **Verify the hostname** in the error response matches your domain
3. **Test with a fresh token** by refreshing the page
4. **Check reCAPTCHA quota** - ensure you haven't exceeded limits
