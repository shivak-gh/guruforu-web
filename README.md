# GuruForU - Coming Soon Website

A beautiful, modern coming soon page built with Next.js and ready to deploy on Google Cloud Run.

## Features

- 🎨 Modern, responsive design with animated gradient background
- ⏱️ Real-time countdown timer
- 📧 Email notification signup form
- 🚀 Optimized for Google Cloud Run deployment
- ⚡ Fast and lightweight

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deploying to Google Cloud Run

### Prerequisites

- Google Cloud SDK installed and configured
- Docker installed (for local testing)
- A Google Cloud project with Cloud Run API enabled

### Deployment Steps

1. **Build and push the Docker image:**
```bash
gcloud builds submit --tag gcr.io/[PROJECT-ID]/guruforu-web
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy guruforu-web \
  --image gcr.io/[PROJECT-ID]/guruforu-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

Replace `[PROJECT-ID]` with your Google Cloud project ID.

### Alternative: Using Cloud Build

You can also use Cloud Build with a `cloudbuild.yaml` file for automated deployments.

## Configuration

- **Launch Date**: Edit the launch date in `app/page.tsx` (currently set to March 1, 2026)
- **Branding**: Update the title, logo, and footer text in `app/layout.tsx` and `app/page.tsx`
- **Email Notifications**: Implement your email notification service in the form submit handler in `app/page.tsx`

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Coming soon page component
│   ├── page.module.css     # Page styles
│   └── globals.css         # Global styles
├── Dockerfile              # Docker configuration for Cloud Run
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## License

© 2026 GuruForU. All rights reserved.

