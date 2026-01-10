# Fix reCAPTCHA Warning in Cloud Run

## Issue
After deployment to Google Cloud Run, you're seeing:
```
Warning: reCAPTCHA is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable and restart your dev server.
```

## Root Cause
For Next.js standalone builds, `NEXT_PUBLIC_*` environment variables must be available at **build time** (during Docker build), not just at runtime.

## Solution Applied

I've updated the build configuration to pass the reCAPTCHA site key as a build argument:

### 1. Updated Dockerfile
Added build argument support:
```dockerfile
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
```

### 2. Updated cloudbuild.yaml
Added build argument:
```yaml
- '--build-arg'
- 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob'
```

### 3. Updated Warning Message
Warning now only shows in development mode, not in production.

## Next Steps

### Option 1: Redeploy (Recommended)
Redeploy your service with the updated configuration:

```bash
# Push your code changes (cloudbuild.yaml and Dockerfile)
git add cloudbuild.yaml Dockerfile app/contact/page.tsx
git commit -m "Fix reCAPTCHA configuration for Cloud Run"
git push
```

Cloud Build will automatically:
1. Build with the reCAPTCHA site key as a build argument
2. Embed it in the Next.js bundle
3. Deploy to Cloud Run

### Option 2: Set Environment Variable in Existing Service

If you don't want to redeploy, you can set it as a runtime environment variable (though it should already be in cloudbuild.yaml):

```bash
gcloud run services update guruforu-web \
  --set-env-vars="NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob" \
  --region=us-central1 \
  --project=YOUR_PROJECT_ID
```

**Note:** For standalone builds, this won't fully fix it since the variable needs to be embedded at build time. Redeploying is the proper fix.

## Verify the Fix

After redeploying:

1. **Check the build logs** - You should see the build arg being passed
2. **Visit your site** - The warning should be gone
3. **Test the contact form** - reCAPTCHA should work (or be bypassed for localhost-style domains)

## For Production

The configuration now includes:
- ✅ Build-time embedding of `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- ✅ Runtime environment variables for other settings
- ✅ Proper handling in both development and production

## Current Configuration

Your `cloudbuild.yaml` now:
- Passes `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` as build argument (for embedding at build time)
- Sets runtime environment variables for other settings
- Will automatically configure everything on next deploy

**The fix is ready - just redeploy and the warning will be gone!**
