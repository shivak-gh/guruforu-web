# Localization Audit Report

## Current Localization Status

The project currently localizes the following terms:
- **Personalized** → **Personalised** (UK, AU, NZ)
- **Personalize** → **Personalise** (UK, AU, NZ)
- **Personalization** → **Personalisation** (UK, AU, NZ)
- **Personalized attention** → **Personalised attention** (UK, AU, NZ)
- **Math** → **Maths** (UK, AU, NZ)
- **Online Tuitions** → **Online Tutoring** (UK, AU, NZ)
- **Tuitions** → **Tutoring** (UK, AU, NZ)

## Hardcoded Text That Needs Localization

### Navigation & Menu Items
- **Home** (app/components/NavMenu.tsx)
- **Blog** (app/components/NavMenu.tsx)
- **Free Session** (app/components/NavMenu.tsx)
- **Contact** (app/components/NavMenu.tsx)

### Button Text
- **Notify Me** (app/page.tsx, app/components/EarlyAccessForm.tsx)
- **Send Message** (app/contact/page.tsx)
- **Sending...** (app/contact/page.tsx)
- **Submitting...** (app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Secure My Free Session** (app/free-session/page.tsx)
- **Book via WhatsApp** (app/free-session/page.tsx)
- **Book a free session** (app/page.tsx)
- **contact us** (app/page.tsx)

### Form Labels & Placeholders
- **Name** (app/contact/page.tsx, app/free-session/page.tsx)
- **Email** (app/contact/page.tsx, app/free-session/page.tsx)
- **Subject** (app/contact/page.tsx)
- **Message** (app/contact/page.tsx)
- **Parent Name** (app/free-session/page.tsx)
- **Child's Grade** (app/free-session/page.tsx)
- **Country** (app/free-session/page.tsx)
- **Preferred time to contact you** (app/free-session/page.tsx)
- **Tell us about their learning challenges** (app/free-session/page.tsx)
- **Your full name** (placeholder - app/contact/page.tsx, app/free-session/page.tsx)
- **your.email@example.com** (placeholder - app/contact/page.tsx, app/free-session/page.tsx)
- **Enter your email address** (placeholder - app/components/EarlyAccessForm.tsx)
- **Select a subject** (app/contact/page.tsx)
- **Select preferred time** (app/free-session/page.tsx)
- **e.g., Grade 5, Year 3, Class 8, etc.** (placeholder - app/free-session/page.tsx)
- **Start typing your country...** (placeholder - app/free-session/page.tsx)
- **Describe any specific subjects, topics, or learning difficulties...** (placeholder - app/free-session/page.tsx)
- **Tell us how we can help you...** (placeholder - app/contact/page.tsx)

### Form Options
- **General Inquiry** (app/contact/page.tsx)
- **Technical Support** (app/contact/page.tsx)
- **Billing Question** (app/contact/page.tsx)
- **Feedback** (app/contact/page.tsx)
- **Other** (app/contact/page.tsx)
- **Morning (9 AM - 12 PM)** (app/free-session/page.tsx)
- **Afternoon (12 PM - 5 PM)** (app/free-session/page.tsx)
- **Evening (5 PM - 8 PM)** (app/free-session/page.tsx)
- **Anytime** (app/free-session/page.tsx)

### Page Headings & Titles
- **Now Accepting Early Access** (app/page.tsx, app/early-access/page.tsx)
- **AI-Powered Online Classes** (app/page.tsx)
- **Why Choose GuruForU for Your Child's Education?** (app/page.tsx)
- **Key Benefits of Online Learning with GuruForU** (app/page.tsx)
- **Contact Us** (app/contact/page.tsx, footer links)
- **Get in Touch** (app/contact/page.tsx)
- **Get Early Access to GuruForU** (app/early-access/page.tsx)
- **Early Access Benefits** (app/early-access/page.tsx)
- **Free AI Learning Diagnostic Session** (app/free-session/page.tsx)
- **Book Your Free Session** (app/free-session/page.tsx)
- **Your Child's Progress Roadmap** (app/free-session/page.tsx)
- **What You'll Get** (app/free-session/page.tsx)
- **Our Blog** (app/blog/page.tsx)
- **Explore Our Blog Categories** (app/components/BlogCategories.tsx)

### Success & Error Messages
- **Thank you! Your message has been sent successfully. We'll get back to you soon.** (app/contact/page.tsx)
- **Thank you! We'll notify you when we launch.** (app/components/EarlyAccessForm.tsx)
- **Thank you! We'll contact you soon to schedule your free session.** (app/free-session/page.tsx)
- **Oops! Something went wrong.** (app/contact/page.tsx, app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Something went wrong. Please try again.** (app/contact/page.tsx, app/components/EarlyAccessForm.tsx)
- **Please enter a valid email address.** (app/components/EarlyAccessForm.tsx)
- **Invalid request. Please check your email address and try again.** (app/components/EarlyAccessForm.tsx)
- **Server error. Please try again later or contact support@guruforu.com** (app/components/EarlyAccessForm.tsx)
- **Network error. Please check your connection and try again.** (app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Please fill in all required fields (Name, Email, and Grade).** (app/free-session/page.tsx)
- **Please fill in at least Name, Email, and Grade before booking via WhatsApp.** (app/free-session/page.tsx)
- **reCAPTCHA verification failed. Please refresh the page and try again.** (app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Unable to submit. Please try again.** (app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)

### Info & Warning Messages
- **Loading reCAPTCHA protection...** (app/contact/page.tsx, app/free-session/page.tsx)
- **Note: reCAPTCHA is not configured for localhost...** (app/contact/page.tsx, app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.** (app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Privacy Policy** (link text - app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Terms of Service** (link text - app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)

### Contact Page Content
- **We'd love to hear from you! Get in touch with us for any questions, feedback, or support about our online education platform.** (app/contact/page.tsx)
- **Email** (section title - app/contact/page.tsx)
- **Response Time** (section title - app/contact/page.tsx)
- **We typically respond within 24-48 hours during business days** (app/contact/page.tsx)
- **Support Availability** (section title - app/contact/page.tsx)
- **We're here to help! Reach out anytime and we'll get back to you as soon as possible.** (app/contact/page.tsx)
- **You may also find answers in our:** (app/contact/page.tsx)
- **If the issue persists, please email us directly at support@guruforu.com** (app/contact/page.tsx, app/components/EarlyAccessForm.tsx, app/free-session/page.tsx)
- **Please check your browser console (F12) for detailed error information.** (app/contact/page.tsx)

### Early Access Page Content
- **Be among the first to experience premium online tuitions powered by AI. Get notified when we launch and receive exclusive early access benefits.** (app/early-access/page.tsx)
- **Priority access** (app/early-access/page.tsx)
- **Special launch pricing** (app/early-access/page.tsx)
- **Exclusive onboarding support** (app/early-access/page.tsx)
- **Early feature previews** (app/early-access/page.tsx)
- **← Back to Home** (app/early-access/page.tsx)

### Free Session Page Content
- **Book a 15-minute strategy session. We'll analyze learning gaps and build a custom subject roadmap for your child—at no cost.** (app/free-session/page.tsx)
- **Free Session** (roadmap step - app/free-session/page.tsx)
- **15-minute strategy session to understand your child's needs** (app/free-session/page.tsx)
- **AI Learning Diagnostic** (roadmap step - app/free-session/page.tsx)
- **Comprehensive analysis of learning gaps and strengths** (app/free-session/page.tsx)
- **Personalized Roadmap** (roadmap step - app/free-session/page.tsx)
- **Custom subject roadmap tailored to your child** (app/free-session/page.tsx)
- **Expert Tutor Matching** (roadmap step - app/free-session/page.tsx)
- **Connect with qualified tutors for ongoing support** (app/free-session/page.tsx)
- **Personalized Subject Roadmap** (app/free-session/page.tsx)
- **Custom learning path designed specifically for your child** (app/free-session/page.tsx)
- **AI Mastery Analysis** (app/free-session/page.tsx)
- **Deep insights into learning gaps and strengths** (app/free-session/page.tsx)
- **Expert Tutor Matching** (app/free-session/page.tsx)
- **Connect with qualified tutors who understand your child's needs** (app/free-session/page.tsx)

### Home Page Content
- **The best online classes for your child, enhanced with AI-powered Personalized Learning. Get real-time student progress tracking and mastery reports that show exactly how your child is advancing.** (app/page.tsx)
- **AI Mastery Tracking** (app/page.tsx)
- **Comprehensive student progress tracker that monitors your child's learning journey in real-time, providing detailed insights into their academic performance.** (app/page.tsx)
- **AI-driven personalized learning paths tailored to your child's unique strengths and learning style, ensuring optimal educational outcomes.** (app/page.tsx)
- **Expert Online Tutors** (app/page.tsx)
- **Connect with qualified independent teachers dedicated to your child's academic success, carefully selected for their expertise and teaching excellence.** (app/page.tsx)
- **Interactive Learning Sessions** (app/page.tsx)
- **Engaging live classes with interactive tools and multimedia content to keep your child motivated and learning effectively.** (app/page.tsx)
- **Flexible scheduling** - Learn at your own pace and convenience (app/page.tsx)
- **Real-time progress tracking** - See your child's improvement instantly (app/page.tsx)
- **Expert guidance** - Qualified tutors with proven track records (app/page.tsx)
- **Comprehensive reports** - Detailed analytics and mastery insights (app/page.tsx)
- **Safe learning environment** - Secure platform with parental controls (app/page.tsx)
- **Join thousands of parents who trust GuruForU for their children's online education journey. Learn more about our educational resources, book a free session, or contact us for more information.** (app/page.tsx)
- **educational resources** (link text - app/page.tsx)

### Blog Page Content
- **Expert insights on child education, learning strategies, and AI-powered personalized learning** (app/blog/page.tsx)
- **No blog posts available yet. Check back soon!** (app/blog/page.tsx)

### Footer Links (All Pages)
- **Education Blog** (app/page.tsx, app/early-access/page.tsx, app/blog/page.tsx, app/free-session/page.tsx)
- **GuruForU Home** (app/early-access/page.tsx, app/free-session/page.tsx)
- **Email Support** (app/page.tsx, app/early-access/page.tsx, app/blog/page.tsx, app/free-session/page.tsx)
- **Terms and Conditions** (app/page.tsx, app/contact/page.tsx, app/early-access/page.tsx, app/blog/page.tsx, app/free-session/page.tsx)
- **Privacy Policy** (app/page.tsx, app/contact/page.tsx, app/early-access/page.tsx, app/blog/page.tsx, app/free-session/page.tsx)
- **Shipping Policy** (app/page.tsx)
- **Cancellation and Refunds** (app/page.tsx, app/contact/page.tsx)
- **© {year} GuruForU. All rights reserved.** (all pages)

### Free Consultation FAB
- **Free Session** (app/components/FreeConsultationFAB.tsx)

## Recommendations

### High Priority (User-Facing UI Elements)
1. **Navigation items** - Home, Blog, Contact, Free Session
2. **Button text** - Notify Me, Send Message, Book via WhatsApp, etc.
3. **Form labels and placeholders** - All form fields
4. **Success/Error messages** - All user feedback messages
5. **Page headings** - Main page titles and section headings

### Medium Priority (Content Text)
1. **Feature descriptions** - Home page feature descriptions
2. **Benefits list** - Key benefits text
3. **Form options** - Subject dropdown, time slots
4. **Roadmap steps** - Free session page roadmap content

### Low Priority (Legal/Footer)
1. **Footer links** - These are often kept in English for legal reasons
2. **Copyright text** - Standard legal text
3. **reCAPTCHA notices** - Technical/legal text

## Implementation Suggestions

1. **Extend `localized-content.json`** to include all these strings
2. **Create a helper function** for common UI elements (buttons, labels, etc.)
3. **Consider using a translation key system** for better maintainability
4. **Add region-specific variations** for:
   - Time formats (12-hour vs 24-hour)
   - Date formats
   - Currency symbols (already handled)
   - Educational terminology (already partially handled)

## Notes

- Some text like "reCAPTCHA" and technical terms may not need localization
- Legal pages (Terms, Privacy, Shipping, Cancellation) may need full translations rather than just word replacements
- Consider whether "Grade" vs "Year" terminology is already handled (it appears in educational terms)
- Time slots (Morning, Afternoon, Evening) might need timezone-aware localization
