# Debug reCAPTCHA for Localhost Issue

Based on your error, here's how to debug and fix the reCAPTCHA verification failure on localhost:

## Current Error
```
status: 400
error: "reCAPTCHA verification failed. Please try again."
```

## Step 1: Check Server Logs

After submitting the form, check your **server terminal/console** (where you ran `npm run dev`). You should now see detailed logs like:

```
reCAPTCHA verification response: {
  success: false,
  score: undefined,
  action: undefined,
  hostname: 'localhost',
  'error-codes': ['invalid-input-response']
}
```

**Common error codes:**
- `missing-input-secret` - Secret key not found in environment
- `invalid-input-secret` - Secret key doesn't match site key
- `missing-input-response` - Token not provided
- `invalid-input-response` - Token is invalid/expired (most common for localhost)
- `bad-request` - Invalid request format
- `timeout-or-duplicate` - Token already used or expired

## Step 2: Verify Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob
RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM
```

**Important:** Restart your dev server after setting/updating these variables!

## Step 3: Check reCAPTCHA Console Settings

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Select your site (the one with Site Key: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`)
3. **Check Domains section:**
   - Ensure `localhost` is added to allowed domains
   - Also add `127.0.0.1` if needed
   - For testing, you might need to add `localhost:3000`

4. **Verify Keys Match:**
   - Site Key should be: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`
   - Secret Key should be: `6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM`
   - Both keys must be from the same reCAPTCHA site

## Step 4: Common Fixes

### Fix 1: Domain Not Registered
**Error:** `invalid-input-response`  
**Solution:** Add `localhost` to allowed domains in reCAPTCHA console

### Fix 2: Token Expiration
**Error:** `timeout-or-duplicate`  
**Solution:** Tokens expire after 2 minutes. Try submitting faster after page load, or refresh the page before submitting

### Fix 3: Secret Key Mismatch
**Error:** `invalid-input-secret`  
**Solution:** Verify the secret key matches the site key in reCAPTCHA console

### Fix 4: Environment Variable Not Loaded
**Error:** `missing-input-secret`  
**Solution:** 
1. Check `.env.local` exists in project root
2. Verify variable name is `RECAPTCHA_SECRET_KEY` (no typos)
3. **Restart dev server** after changing `.env.local`

## Step 5: Test Token Generation

Open browser console and test manually:

```javascript
// Check if token is being generated
window.grecaptcha.ready(() => {
  window.grecaptcha.execute('6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob', {action: 'contact_form'})
    .then(token => {
      console.log('Token generated:', token);
      console.log('Token length:', token.length);
      
      // Test the token verification manually
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `secret=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM&response=${token}`
      })
      .then(r => r.json())
      .then(data => {
        console.log('Verification result:', data);
        if (!data.success) {
          console.error('Error codes:', data['error-codes']);
        }
      });
    })
    .catch(err => console.error('Error:', err));
});
```

## Step 6: Check Server-Side Secret Loading

In your server terminal, look for these logs after form submission:

```
reCAPTCHA secret key found: 6LfwKEYsAA...i62BM
```

If you see an error about secret key not found, the issue is environment variable loading.

## Quick Fix Checklist

- [ ] `.env.local` exists in project root
- [ ] `RECAPTCHA_SECRET_KEY` is set correctly
- [ ] Dev server was restarted after setting env vars
- [ ] `localhost` is added to reCAPTCHA allowed domains
- [ ] Site Key and Secret Key match in reCAPTCHA console
- [ ] Browser console shows "reCAPTCHA token generated successfully"
- [ ] Server logs show detailed error codes

## Temporary Workaround for Localhost

If you need to test without fixing reCAPTCHA immediately, you can temporarily disable reCAPTCHA verification in development:

**⚠️ Only for local development testing:**

In `app/api/contact/route.ts`, temporarily modify the verification:

```typescript
// Temporary: Skip reCAPTCHA for localhost in development
const isLocalhost = process.env.NODE_ENV === 'development'
const recaptchaResult = isLocalhost 
  ? { valid: true } // Skip verification locally
  : await verifyRecaptcha(recaptchaToken)
```

**Remember to remove this before deploying to production!**
