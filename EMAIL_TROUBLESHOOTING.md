# Email Not Sending - Troubleshooting Guide

If emails are not being sent to `support@guruforu.com`, follow these steps:

## Step 1: Check Server Logs

After submitting the contact form, check your **server terminal** (where `npm run dev` is running). Look for:

### Expected Success Logs:
```
✅ Email sent successfully: {
  messageId: "...",
  to: "support@guruforu.com",
  ...
}
```

### Error Logs to Look For:
```
❌ Brevo API error: ...
Brevo API error response: {...}
```

## Step 2: Common Issues and Fixes

### Issue 1: Sender Email Not Verified in Brevo

**Error:** `Invalid sender email` or `Sender not verified`

**Fix:**
1. Go to [Brevo Dashboard](https://app.brevo.com/senders-and-ips/emails)
2. Go to **Senders & IP** > **Email addresses**
3. Add and verify your sender email (`noreply@guruforu.com` or the one in `BREVO_FROM_EMAIL`)
4. Check your email inbox for verification email
5. Click the verification link

**OR** for testing, use a verified email or your own email temporarily:
```env
BREVO_FROM_EMAIL=your_verified_email@example.com
```

### Issue 2: Email in Spam Folder

**Check:** Even if the API says "success", emails might go to spam

**Fix:**
1. Check spam/junk folder in `support@guruforu.com`
2. Check Brevo dashboard > **Statistics** > **Transactional emails** to see delivery status
3. Verify sender reputation in Brevo

### Issue 3: Brevo API Key Permissions

**Error:** `Unauthorized` or `403 Forbidden`

**Fix:**
1. Go to [Brevo API Keys](https://app.brevo.com/settings/keys/api)
2. Verify your API key has **"Send emails"** permission
3. Make sure the key is not expired or revoked
4. Regenerate the key if needed

### Issue 4: Invalid Recipient Email

**Error:** `Invalid recipient email`

**Fix:**
1. Check that `CONTACT_EMAIL=support@guruforu.com` is set correctly in `.env.local`
2. Verify the email address is valid
3. For testing, try a different email address

### Issue 5: Brevo Account Limits

**Error:** `Quota exceeded` or `Daily limit reached`

**Fix:**
1. Check your Brevo account limits
2. Free tier: 300 emails/day
3. Check Brevo dashboard > **Statistics** for usage

## Step 3: Test Email Configuration

### Check Current Configuration:

```bash
# Check .env.local
Get-Content .env.local | Select-String -Pattern "BREVO|CONTACT"
```

Should show:
- `BREVO_API_KEY=xkeysib-...` ✅ (your actual key)
- `BREVO_FROM_EMAIL=noreply@guruforu.com` ⚠️ (must be verified)
- `CONTACT_EMAIL=support@guruforu.com` ✅

### Test Email Sending:

1. **Submit the form** at `/contact`
2. **Check browser console** (F12) for client-side errors
3. **Check server terminal** for API logs
4. **Check Brevo dashboard** > **Statistics** > **Transactional emails** to see if email was sent

## Step 4: Quick Fix for Testing

For immediate testing, you can:

1. **Use your own verified email** temporarily:
   ```env
   BREVO_FROM_EMAIL=your_email@example.com
   CONTACT_EMAIL=your_email@example.com
   ```

2. **Verify sender email** in Brevo dashboard

3. **Check Brevo email logs** to see delivery status

## Step 5: Verify Email is Actually Sent

Even if you don't receive the email, check:

1. **Brevo Dashboard** → **Statistics** → **Transactional emails**
   - Shows all sent emails
   - Shows delivery status (sent, delivered, bounced, etc.)
   - Shows error messages if any

2. **Server Logs** - Look for:
   ```
   ✅ Email sent successfully: { messageId: "..." }
   ```

3. **API Response** - Check browser Network tab:
   - Response should have `success: true` and `messageId`

## Step 6: Common Brevo Error Codes

- `401` - Invalid API key
- `403` - Insufficient permissions or sender not verified
- `400` - Invalid email format or missing required fields
- `429` - Rate limit exceeded
- `500` - Brevo server error (try again later)

## Step 7: Debug Mode

The code now logs detailed information. After submitting the form, check:

1. **Server Terminal** for:
   - Email sending details
   - Brevo API response
   - Error messages with codes

2. **Browser Console** (F12) for:
   - Form submission status
   - API response

3. **Network Tab** (F12) for:
   - API request/response
   - Status codes
   - Response body

## Next Steps

1. **Submit the form again**
2. **Check server logs** for detailed error messages
3. **Verify sender email** in Brevo if not done
4. **Check Brevo dashboard** for email delivery status
5. **Check spam folder** in recipient email

The improved logging will now show exactly what's happening!
