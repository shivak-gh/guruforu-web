# Fix: Sender Email Not Valid Error

## Error Message
```
Sending has been rejected because the sender you used noreply@guruforu.com is not valid. 
Validate your sender or authenticate your domain
```

## Quick Fix Options

### Option 1: Verify Sender Email in Brevo (Recommended for Production)

1. **Go to Brevo Dashboard**:
   - Visit: [https://app.brevo.com/senders-and-ips/emails](https://app.brevo.com/senders-and-ips/emails)

2. **Add and Verify Sender**:
   - Click **"Add a sender"** button
   - Enter email: `noreply@guruforu.com`
   - Enter your name: `GuruForU`
   - Click **"Save"**

3. **Verify the Email**:
   - Check the inbox for `noreply@guruforu.com`
   - Click the verification link in the email
   - Or verify via DNS (if you own the domain)

4. **Wait for Verification**:
   - It may take a few minutes to process
   - Check Brevo dashboard to see verification status

### Option 2: Use a Verified Email for Testing (Quick Fix)

If you need to test immediately, use an email that's already verified in your Brevo account:

1. **Check Verified Senders**:
   - Go to [Brevo Senders](https://app.brevo.com/senders-and-ips/emails)
   - See which emails are already verified (green checkmark)

2. **Update .env.local**:
   ```env
   # Use a verified email from your Brevo account
   BREVO_FROM_EMAIL=your_verified_email@example.com
   BREVO_FROM_NAME=GuruForU Contact Form
   CONTACT_EMAIL=support@guruforu.com
   ```

3. **Restart Dev Server**:
   ```bash
   # Stop server (Ctrl+C), then:
   npm run dev
   ```

4. **Test Again**:
   - Submit the contact form
   - Should work now!

### Option 3: Verify Domain in Brevo (For Production)

If you own the `guruforu.com` domain:

1. **Authenticate Domain**:
   - Go to [Brevo Domains](https://app.brevo.com/senders-and-ips/domains)
   - Click **"Authenticate a new domain"**
   - Enter: `guruforu.com`
   - Follow DNS verification instructions

2. **Add DNS Records**:
   - Add the provided DNS records to your domain
   - Wait for DNS propagation (can take up to 24 hours)

3. **Once Verified**:
   - Any email from `@guruforu.com` will work
   - No need to verify individual sender emails

## Temporary Testing Solution

For immediate testing without domain verification:

1. **Use Your Personal Email** (that's verified):
   ```env
   BREVO_FROM_EMAIL=your_personal_email@gmail.com
   BREVO_FROM_NAME=GuruForU Contact Form
   CONTACT_EMAIL=support@guruforu.com
   ```

2. **Or Use Brevo Test Email**:
   - Brevo may allow sending from your account's verified email
   - Check your Brevo dashboard for verified senders

## Verification Status Check

After adding a sender in Brevo:

1. Go to **Senders & IP** > **Email addresses**
2. Find your sender email
3. Status should show:
   - ✅ **Verified** (green) - Can send emails
   - ⚠️ **Pending** (yellow) - Waiting for verification
   - ❌ **Not verified** (red) - Needs verification

## What Happens After Verification

Once the sender email is verified:
- ✅ Emails will be sent successfully
- ✅ Emails will be less likely to go to spam
- ✅ Better email deliverability
- ✅ Professional sender reputation

## For Production Deployment

When deploying to production:
1. **Verify the domain** (`guruforu.com`) in Brevo
2. **OR verify the sender email** (`noreply@guruforu.com`)
3. **Set environment variables** in your hosting platform
4. **Test email sending** before going live

## Summary

**The error means**: Brevo requires sender emails to be verified before sending.

**Quick fix**: Use a verified email address for testing.

**Long-term fix**: Verify `noreply@guruforu.com` or authenticate the `guruforu.com` domain in Brevo.

The code will now show a clearer error message when this happens!
