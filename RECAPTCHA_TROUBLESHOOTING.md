# reCAPTCHA v3 Troubleshooting Guide

If reCAPTCHA v3 is not working on the contact form, follow these steps:

## 1. Verify Environment Variables

### Check if .env.local exists and has the correct values:

```bash
# On Windows PowerShell
Get-Content .env.local | Select-String -Pattern "RECAPTCHA"

# On Linux/Mac
grep RECAPTCHA .env.local
```

**Required variables:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`
- `RECAPTCHA_SECRET_KEY=6LfwKEYsAAAAANDGm2TrSOra1Qw2HyQ3SKAi62BM` (for local dev)

## 2. Restart Development Server

**IMPORTANT:** Next.js requires restarting the dev server for `NEXT_PUBLIC_*` environment variables to be picked up.

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## 3. Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab:

### Expected logs:
- ✅ `reCAPTCHA Site Key configured: 6LfwKEYsAA...` (on page load)
- ✅ `reCAPTCHA v3 loaded successfully` (when script loads)
- ✅ `Getting reCAPTCHA token...` (on form submit)
- ✅ `reCAPTCHA token generated successfully` (before API call)

### Common errors:
- ❌ `reCAPTCHA Site Key is not set` → Environment variable not loaded, restart server
- ❌ `reCAPTCHA not loaded` → Script failed to load, check network
- ❌ `reCAPTCHA execution error` → Site key might be invalid or domain not registered
- ❌ `Failed to get reCAPTCHA token` → Check console for specific error

## 4. Verify Site Key Configuration

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Check your site settings
3. Verify your domain is registered (should include `localhost` for local dev)
4. Verify the Site Key matches: `6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob`

## 5. Check Network Tab

In Browser Dev Tools → Network tab:
- Look for request to `https://www.google.com/recaptcha/api.js?render=...`
- Should return HTTP 200
- Check if there are any CORS errors or blocked requests

## 6. Test reCAPTCHA Token Generation

Add this to browser console after page loads:

```javascript
// Check if grecaptcha is loaded
console.log('grecaptcha exists:', typeof window.grecaptcha !== 'undefined');

// Try to get a token manually
if (window.grecaptcha) {
  window.grecaptcha.ready(() => {
    window.grecaptcha.execute('6LfwKEYsAAAAAGScm2h15522_4x0a2-7FSLdX-Ob', {action: 'test'})
      .then(token => console.log('Token:', token))
      .catch(err => console.error('Error:', err));
  });
}
```

## 7. Check API Route Logs

Check your server console/terminal for API route logs:

### Expected logs:
- ✅ `reCAPTCHA verification response: { success: true, score: 0.9, ... }`
- ✅ `reCAPTCHA token received, submitting form...`

### Common API errors:
- ❌ `RECAPTCHA_SECRET_KEY is not set` → Secret key missing in Secret Manager or env
- ❌ `reCAPTCHA verification failed` → Check error codes in logs
- ❌ Score too low → Score below 0.5 (might indicate bot-like behavior)

## 8. Common Issues and Fixes

### Issue: "reCAPTCHA Site Key is not set"
**Fix:** 
1. Verify `.env.local` exists in project root
2. Restart dev server
3. Hard refresh browser

### Issue: "reCAPTCHA is not loaded"
**Fix:**
1. Check browser console for script loading errors
2. Verify internet connection
3. Check if Google services are blocked (corporate firewall, etc.)
4. Try disabling browser extensions

### Issue: "reCAPTCHA verification failed"
**Fix:**
1. Verify Secret Key matches Site Key in reCAPTCHA console
2. Check that domain is registered in reCAPTCHA settings
3. For local dev, ensure `localhost` is added to allowed domains
4. Check server logs for specific error codes

### Issue: "Score too low" (< 0.5)
**Fix:**
- This might indicate bot-like behavior
- Try submitting from a different browser/network
- Check if you're behind a VPN or proxy
- Score threshold is 0.5 by default (can be adjusted in API route)

## 9. Verify Secret Key Configuration

### For Local Development:
- Should be in `.env.local` as `RECAPTCHA_SECRET_KEY`

### For Production:
- Should be in Google Secret Manager as `RECAPTCHA_SECRET_KEY`
- Service account needs `roles/secretmanager.secretAccessor` permission

## 10. Test the Complete Flow

1. Open `/contact` page
2. Fill out the form
3. Open Browser Console (F12)
4. Submit the form
5. Watch for:
   - Token generation logs
   - API request to `/api/contact`
   - API response status

## Still Not Working?

1. Check if the reCAPTCHA keys are for **v3** (not v2)
2. Verify keys are from the same reCAPTCHA site
3. Check reCAPTCHA admin console for any warnings/errors
4. Try generating new keys in reCAPTCHA console
5. Check server-side logs for detailed error messages

## Debug Mode

To enable more detailed logging, the code already includes console.log statements. Check:
- Browser console for client-side issues
- Server terminal/console for API-side issues
