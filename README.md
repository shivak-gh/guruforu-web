# GuruForU - Marketing Website

A modern K-12 online tutoring marketing site built with Next.js, deployed on Google Cloud Run.

**Developer documentation:** see **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** for localization, regional content, locale debug query params (`?gf_region=IN`), design system, SEO, and page architecture.

## Features

- 🎨 Light theme aligned with learn.guruforu.com (design tokens, card layouts)
- 🌍 Regional content on About (US, UK, IN, AE, AU, etc.) with locale debug via `?gf_region=` / `?gf_locale=`
- 📚 Resources blog, How It Works, About, contact & free-session flows
- 🚀 Optimized for Google Cloud Run deployment

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
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
- A Google Cloud project with Cloud Run API and Cloud Build API enabled
- Docker installed (for local testing)

### Option 1: Using Cloud Build (Recommended)

1. **Create the GitHub repository** (if not already created):
   - Go to https://github.com/gratiq and create a new repository named `guruforu-web`
   - Push your code:
   ```bash
   git remote add origin https://github.com/gratiq/guruforu-web.git
   git push -u origin main
   ```

2. **Connect GitHub to Cloud Build:**
   - Go to Cloud Build > Triggers in Google Cloud Console
   - Click "Create Trigger"
   - Connect your GitHub repository
   - Select the repository: `gratiq/guruforu-web`
   - Configure the trigger:
     - Name: `deploy-guruforu-web`
     - Event: Push to a branch
     - Branch: `^main$`
     - Configuration: Cloud Build configuration file
     - Location: `cloudbuild.yaml`

3. **Deploy:**
   - Push to the main branch, or manually trigger the build in Cloud Build

### Option 2: Manual Deployment

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
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

Replace `[PROJECT-ID]` with your Google Cloud project ID.

### Option 3: Using Cloud Build CLI

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Configuration

- **Branding**: Update the title, logo emoji, and footer text in `app/layout.tsx` and `app/page.tsx`
- **Message**: Customize the coming soon message in `app/page.tsx`
- **Styling**: Modify colors and animations in `app/page.module.css`

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Coming soon page component
│   ├── page.module.css     # Page styles
│   └── globals.css         # Global styles
├── Dockerfile              # Docker configuration for Cloud Run
├── cloudbuild.yaml         # Cloud Build configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## GitHub Setup

If you haven't created the GitHub repository yet:

1. Create a new repository at https://github.com/gratiq/guruforu-web
2. Add the remote and push:
```bash
git remote add origin https://github.com/gratiq/guruforu-web.git
git push -u origin main
```

## License

© 2026 GuruForU. All rights reserved.
