# Google Analytics Debugging Guide

## Issue: Analytics works locally but not on Cloud Run

### Common Causes

1. **CSP (Content Security Policy) blocking requests**
   - Google Analytics uses multiple subdomains
   - Need to allow wildcard subdomains: `*.google-analytics.com`, `*.googletagmanager.com`

2. **Script loading order**
   - Consent mode must initialize before gtag.js loads
   - Scripts must load in correct sequence

3. **Network/CORS issues**
   - Cloud Run might have different network policies
   - Check browser console for blocked requests

## How to Debug

### 1. Check Browser Console (Production)

Visit `https://www.guruforu.com` and open DevTools:

```javascript
// Check if gtag is loaded
console.log('gtag available:', typeof window.gtag);
console.log('dataLayer:', window.dataLayer);

// Check consent
console.log('Consent:', localStorage.getItem('cookie-consent'));

// Check if scripts loaded
console.log('Scripts:', document.querySelectorAll('script[src*="googletagmanager"]'));
```

### 2. Check Network Tab

Look for:
- ✅ `https://www.googletagmanager.com/gtag/js?id=G-ZGXL6MTDYY` - Should load (200)
- ✅ `https://www.google-analytics.com/collect` - Should send data (200)
- ❌ Any blocked requests (CSP errors)

### 3. Check CSP Violations

In browser console, look for:
```
Content Security Policy: The page's settings blocked the loading of a resource
```

### 4. Verify Consent Mode

```javascript
// Check consent state
gtag('get', 'G-ZGXL6MTDYY', 'analytics_storage', (value) => {
  console.log('Analytics storage consent:', value);
});
```

## Fixes Applied

### 1. Updated CSP to Allow Wildcard Subdomains

**Before:**
```
script-src ... https://www.googletagmanager.com https://www.google-analytics.com
```

**After:**
```
script-src ... https://*.googletagmanager.com https://*.google-analytics.com
connect-src ... https://*.google-analytics.com https://*.googletagmanager.com
img-src ... https://*.google-analytics.com https://*.googletagmanager.com
```

### 2. Added Error Handling

- Wrapped GA initialization in try-catch
- Added onError handler for script loading
- Added debug logging (development only)

### 3. Ensured Proper Script Order

- Consent mode loads first (`beforeInteractive`)
- gtag.js loads second (`afterInteractive`)
- GA config loads after gtag.js

## Testing After Deployment

1. **Clear browser cache and cookies**
2. **Visit production site**
3. **Open DevTools Console**
4. **Check for errors**
5. **Accept consent banner**
6. **Verify network requests to google-analytics.com**

## Manual Verification

After deploying, test with:

```bash
# Check if CSP headers are correct
curl -I https://www.guruforu.com | grep -i "content-security-policy"

# Should see wildcard domains allowed
```

## If Still Not Working

1. **Check Cloud Run logs:**
   ```bash
   gcloud run services logs read guruforu-web --region=us-central1 --limit=50
   ```

2. **Verify script is in HTML:**
   - View page source
   - Search for "googletagmanager"
   - Should see script tags

3. **Test with Google Tag Assistant:**
   - Install Chrome extension
   - Visit site
   - Check for GA tag detection

4. **Check Real-Time Reports:**
   - Go to GA4 → Reports → Real-time
   - Visit site
   - Should see your visit within seconds

## Expected Behavior

✅ **Working:**
- Script loads without CSP errors
- Network requests to `google-analytics.com/collect` appear
- Real-time reports show visits
- No console errors

❌ **Not Working:**
- CSP violation errors in console
- No network requests to google-analytics.com
- Script tags missing from page source
- gtag is undefined
