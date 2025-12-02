# MultitenantApp

Multi-tenant SaaS application with separate admin and vendor portals.

## Live Deployments

- **Admin Portal**: https://multitenant-admin-lmnb5urjra-uc.a.run.app/
- **Vendor Portal**: https://multitenant-vendor-lmnb5urjra-uc.a.run.app/

## Architecture

- **Admin App** (port 3000): Multi-tenant dashboard with tenant selector
- **Vendor App** (port 3001): Single-tenant portal (tenant ID from env)
- **Shared UI** (`@acme/ui`): Reusable components and tables
- **Shared Tailwind** (`@acme/tailwind`): Common theme configuration

## Development

```bash
# Install dependencies
pnpm install

# Run both apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter admin
pnpm dev --filter vendor

# Lint all packages
pnpm lint

# Build all packages
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Optional - defaults to AWS endpoint
UPSTREAM_API_URL=https://4y6vut7106.execute-api.us-east-1.amazonaws.com/v1/pipelines

# Required for vendor app build
VENDOR_TENANT_ID=xxx-ten-1
```

### Vendor App Theming

The vendor app supports custom branding and theming via environment variables:

```bash
# Custom branding
VENDOR_APP_TITLE="Acme Pipelines"
VENDOR_LOGO_URL="/logo.svg"
VENDOR_POWERED_BY="Powered by Acme Corp"

# Custom theme colors (HSL format)
VENDOR_THEME_PRIMARY="280 65% 60%"           # Purple theme
VENDOR_THEME_PRIMARY_FOREGROUND="0 0% 100%"  # White text
```

**Theme Color Examples:**
- **Purple**: `280 65% 60%` 
- **Orange**: `25 95% 53%`
- **Green**: `142 71% 45%`
- **Blue** (default): `221 83% 53%`
- **Red**: `0 84% 60%`

Each vendor deployment can have unique branding by setting these variables at build time.

## Demo: Multi-Theme Deployments

Run the demo script to see multiple vendor instances with different themes:

```bash
./demo-themes.sh
```

This will start 4 vendor instances on different ports:
- **Port 3001**: Blue theme (default)
- **Port 3002**: Purple theme
- **Port 3003**: Orange theme  
- **Port 3004**: Green theme

Each instance demonstrates how the same codebase can be customized per tenant.

## Production (Standalone)

Both apps are configured with `output: "standalone"` for optimized Docker deployments.

```bash
# Build for production
pnpm build

# Start both apps (after building)
pnpm start

# Start individual apps
cd apps/admin && pnpm start  # Runs on port 3000
cd apps/vendor && pnpm start # Runs on port 3001
```

## Docker

Each app is a separate deployment artifact:

```bash
# Build admin app
docker build -f Dockerfile.admin -t admin .
docker run -p 3000:3000 \
  -e UPSTREAM_API_URL=https://your-api.com/v1/pipelines \
  admin

# Build vendor app with custom branding
docker build -f Dockerfile.vendor -t vendor .
docker run -p 3001:3001 \
  -e VENDOR_TENANT_ID=xxx-ten-1 \
  -e UPSTREAM_API_URL=https://your-api.com/v1/pipelines \
  -e VENDOR_APP_TITLE="Acme Pipelines" \
  -e VENDOR_THEME_PRIMARY="280 65% 60%" \
  vendor
```

### Multi-Tenant Vendor Deployments

Deploy multiple vendor instances with different branding:

```bash
# Tenant A - Purple theme
docker run -p 3001:3001 \
  -e VENDOR_TENANT_ID=tenant-a \
  -e VENDOR_APP_TITLE="Tenant A Portal" \
  -e VENDOR_THEME_PRIMARY="280 65% 60%" \
  -e VENDOR_POWERED_BY="Powered by Tenant A" \
  vendor

# Tenant B - Orange theme
docker run -p 3002:3001 \
  -e VENDOR_TENANT_ID=tenant-b \
  -e VENDOR_APP_TITLE="Tenant B Portal" \
  -e VENDOR_THEME_PRIMARY="25 95% 53%" \
  -e VENDOR_POWERED_BY="Powered by Tenant B" \
  vendor
```

## Project Structure

```
apps/
  admin/          # Multi-tenant admin portal
  vendor/         # Single-tenant vendor portal
packages/
  ui/             # Shared React components
  tailwind/       # Shared Tailwind preset
```
