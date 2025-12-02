# GitHub Actions Workflows

## Overview

This directory contains GitHub Actions workflows for CI/CD deployment to Google Cloud Run.

## Workflows

### 1. `build-test.yml` - CI Pipeline
Runs on all PRs and pushes to main:
- Lints code with ESLint
- Builds all apps (admin + vendor)
- Tests Docker image builds
- Validates container startup

### 2. `deploy-admin.yml` - Admin App Deployment
Deploys the admin app to Cloud Run:
- Triggers on changes to `apps/admin/**`, `packages/**`, or workflow file
- Builds Next.js app in standalone mode
- Creates Docker image and pushes to GCR
- Deploys to Cloud Run service `multitenant-admin`
- Manual trigger available via workflow_dispatch

### 3. `deploy-vendor.yml` - Vendor App Deployment
Deploys the vendor app to Cloud Run:
- Triggers on changes to `apps/vendor/**`, `packages/**`, or workflow file
- Requires `VENDOR_TENANT_ID` environment variable
- Creates Docker image and pushes to GCR
- Deploys to Cloud Run service `multitenant-vendor`
- Manual trigger available with optional tenant ID override

## Required GitHub Secrets

Configure these in your repository settings (Settings → Secrets and variables → Actions):

### Required Secrets
- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_SA_KEY` - Service account JSON key with permissions:
  - Cloud Run Admin
  - Storage Admin (for GCR)
  - Service Account User
- `VENDOR_TENANT_ID` - Default tenant ID for vendor app
- `UPSTREAM_API_URL` - Backend API URL

### Optional Secrets
- `GCP_REGION` - GCP region (defaults to `us-central1`)

## Setup Instructions

### 1. Create GCP Service Account

```bash
# Set your project ID
export GCP_PROJECT_ID="your-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deploy" \
  --project=${GCP_PROJECT_ID}

# Grant necessary roles
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com

# Copy the content of key.json to GCP_SA_KEY secret
cat key.json
```

### 2. Enable Required GCP APIs

```bash
gcloud services enable run.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project=${GCP_PROJECT_ID}
```

### 3. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Content of the `key.json` file
   - `VENDOR_TENANT_ID`: Your default vendor tenant ID
   - `UPSTREAM_API_URL`: Your backend API URL
   - `GCP_REGION` (optional): e.g., `us-central1`

### 4. Initial Deployment

Push to main branch or manually trigger the workflows:

```bash
# Via GitHub UI
# Go to Actions tab → Select workflow → Run workflow

# Or push changes
git add .
git commit -m "feat: add cloud run deployment"
git push origin main
```

## Manual Deployment

You can manually trigger deployments from the Actions tab:

1. Go to Actions
2. Select the deployment workflow (admin or vendor)
3. Click "Run workflow"
4. For vendor, optionally override the tenant ID
5. Click "Run workflow" button

## Environment Variables

### Admin App
- `NODE_ENV`: production
- `UPSTREAM_API_URL`: Backend API endpoint

### Vendor App
- `NODE_ENV`: production
- `VENDOR_TENANT_ID`: Tenant identifier
- `UPSTREAM_API_URL`: Backend API endpoint

## Resource Configuration

Default Cloud Run settings:
- **Memory**: 512Mi
- **CPU**: 1
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10
- **Timeout**: 300s
- **Port**: 3000 (admin) / 3001 (vendor)

Adjust these in the workflow files under the `gcloud run deploy` step.

## Monitoring

After deployment:
- View logs: `gcloud run logs read SERVICE_NAME --project=${GCP_PROJECT_ID}`
- Check status: `gcloud run services describe SERVICE_NAME --region=${GCP_REGION}`
- View in console: https://console.cloud.google.com/run

## Troubleshooting

### Build Failures
- Check that `output: "standalone"` is set in `next.config.ts`
- Ensure all dependencies are in `package.json`
- Verify pnpm workspace configuration

### Docker Build Issues
- Standalone output must exist before Docker build
- Check file paths in Dockerfile match build output

### Deployment Errors
- Verify service account has correct permissions
- Check that GCP APIs are enabled
- Ensure environment variables are set correctly
- Review Cloud Run logs for runtime errors

### Container Startup Issues
- Verify `PORT` environment variable matches container EXPOSE
- Check that all required env vars are provided
- Review container logs in Cloud Run console
