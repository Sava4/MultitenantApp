# Agent Instruction Plan — Dual Deployment Pipelines (Admin + Embedded Vendor)

## 0) What we are building

We will deliver a **Turborepo monorepo** with **two Next.js (App Router) apps** and **one shared UI package**.

- **Admin app** (multi-tenant):

  - shows pipelines for **all tenants**
  - supports **TenantId Combobox filter**
  - uses **green theme**

- **Vendor app** (single-tenant embedded mode):

  - shows pipelines only for **one tenant**
  - tenant is injected via **env/config** (build must fail if missing)
  - uses **blue theme**
  - supports vendor branding (title + logo + colors)

Both apps must:

- load **initial state on the server** (RSC)
- perform **client refreshes** via **internal Next.js Route Handlers**
- **hide the upstream API URL** from the browser (never call upstream directly from client)
- encapsulate errors so internal details (upstream URL, stack traces, raw error text) do not leak to the client; return a generic message + requestId

Upstream API:

- `GET https://4y6vut7106.execute-api.us-east-1.amazonaws.com/v1/pipelines`
- optional query `tenantId=xxx-ten-1` filters server-side

---

## 1) Key design decisions (make them explicit)

### 1.1 Security / scoping rules

- **Vendor app is untrusted client**: client must not control tenant scoping.
- Vendor tenant must be derived on the server from **env/config** (or later from session/host/claims).
- **Route handler enforces tenant every time**.

### 1.2 No upstream URL leakage

- Browser calls only:
  - `/api/pipelines` (Admin)
  - `/api/pipelines` (Vendor — but forced server scope)
- Route handlers call upstream server-to-server.
- Never expose upstream URL in the response body or error messages.

### 1.3 App Router data flow

- `app/page.tsx` is a **Server Component** and performs the initial fetch.
- Interactive UI (filter/toggles/refresh) lives in a **Client Component** that calls internal route.

### 1.4 Theming approach

- Shared UI uses **Tailwind + shadcn/ui** and is themed by CSS variables.
- Each app sets theme variables in `globals.css` (green vs blue).
- Vendor app additionally reads a **tenant theme config file** (title/logo/colors), loaded on the server.

---

## 2) Monorepo layout

Target repo layout (as provided):

```
.
├─ package.json
├─ tsconfig.base.json
├─ apps
│  ├─ admin
│  │  ├─ package.json
│  │  ├─ next.config.mjs
│  │  ├─ postcss.config.cjs
│  │  ├─ tailwind.config.ts
│  │  └─ app
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     ├─ api
│  │     │  └─ pipelines
│  │     │     └─ route.ts
│  │     └─ globals.css
│  └─ vendor
│     ├─ package.json
│     ├─ next.config.mjs
│     ├─ postcss.config.cjs
│     ├─ tailwind.config.ts
│     └─ app
│        ├─ layout.tsx
│        ├─ page.tsx
│        ├─ api
│        │  └─ pipelines
│        │     └─ route.ts
│        ├─ tenant
│        │  └─ config.ts
│        └─ globals.css
└─ packages
   ├─ ui
   │  ├─ package.json
   │  ├─ tsconfig.json
   │  └─ src
   │     ├─ index.ts
   │     ├─ components
   │     │  └─ pipelines
   │     │     ├─ PipelinesTable.tsx
   │     │     ├─ TenantFilter.tsx
   │     │     └─ types.ts
   │     └─ lib
   │        └─ cn.ts
   └─ tailwind
      ├─ package.json
      ├─ tsconfig.json
      └─ src
         └─ preset.ts
```

> Note: the extra `api/pipelines/route.ts`, `tenant/config.ts`, and shared `cn.ts` are required to meet the functional requirements.

---

## 3) Turborepo setup

### 3.1 Root config

- Root `package.json`:

  - workspaces: `apps/*`, `packages/*`
  - turbo scripts: `dev`, `build`, `lint` per app

- `turbo.json`:

  - pipeline: build dependsOn packages build
  - cache enabled

### 3.2 Next transpilation of workspace packages

In **each** app `next.config.mjs`:

- `transpilePackages: ["@acme/ui", "@acme/tailwind"]`
- `output: "standalone"` (helps Docker + ECS)

---

## 4) Shared UI package: `@acme/ui`

### 4.1 Data types

Create:

- `PipelineApi` (API shape) with fields:
  - `tenantId: string`
  - `pipelineId: string`
  - `pipelineName: string`
  - `isActive: boolean`
  - `name: string`

### 4.2 Shared component contract

We build shared UI in **layers** so we keep it reusable and avoid hardcoding "admin vs vendor" rules.

#### 4.2.1 Recommended structure (layers)

**Layer A — Pure presentation (shared):**

- `PipelinesTable` (no tenancy knowledge)
  - renders rows + columns, empty state, loading state
- `SelectCombobox` (generic shadcn-based combobox)
  - takes `items: Array<{ value: string; label: string }>`
  - does **not** know what a tenant is

**Layer B — Composition (app-specific wrappers):**

- `AdminPipelinesPanel` (in `apps/admin`, client component)
  - owns `selectedTenantId` state (including "All tenants")
  - renders combobox + passes filtered data into `PipelinesTable`
  - calls `/api/pipelines?tenantId=...` when selection changes
- `VendorPipelinesPanel` (in `apps/vendor`, client component)
  - no tenant selector
  - calls `/api/pipelines` for refresh (server route forces tenant)

This keeps tenancy logic where it belongs (the app), while the shared UI stays generic.

#### 4.2.2 `PipelinesTable` API

\`\`

- Props:
  - `pipelines: PipelineApi[]` *(data to render; can be tenant-scoped or multi-tenant)*
  - `columns?: Array<'tenantId' | 'pipelineId' | 'pipelineName' | 'isActive' | 'name'>`
  - `title?: string`
  - `isRefreshing?: boolean`
  - `onRefresh?: () => Promise<void> | void` *(wrapper captures tenantId in a closure; the table never needs it)*
  - `toolbar?: React.ReactNode` *(optional slot; Admin can render the tenant combobox here)*

Recommendation: keep shared components **UI-only**. Route handlers + tenant scoping live in each app's wrapper/container components.

### 4.3 Client-side table features

- Render columns:
  - Admin: **Tenant ID**, Pipeline ID, Pipeline Name, Active
  - Vendor: Pipeline ID, Pipeline Name, Active
- Add `Switch` (shadcn) to display `isActive` state (no persistence needed; toggling can be local-only).
- Add refresh button to demonstrate client → internal API route → rerender.

### 4.4 Tailwind / shadcn theming

- Shared UI uses CSS variables for primary colors.
- Use shadcn pattern: `bg-primary text-primary-foreground` etc.
- Provide a `cn()` helper in `packages/ui/src/lib/cn.ts`.

---

## 5) Tailwind preset package: `@acme/tailwind`

- Expose a base preset that both apps import.
- Each app's `tailwind.config.ts` uses:
  - `presets: [preset]` *(optionally add an app-specific preset override; color theming can be done purely via ****globals.css**** CSS variables)*
  - content paths include app + ui package:
    - `./app/**/*.{ts,tsx}`
    - `../../packages/ui/src/**/*.{ts,tsx}`

---

## 6) Route Handlers (the important part)

We implement one route handler **per app**:

- `apps/admin/app/api/pipelines/route.ts`
- `apps/vendor/app/api/pipelines/route.ts`

### 6.1 Admin route handler behavior

- Accept optional `tenantId` query param.
- Build upstream URL server-side:
  - if `tenantId` present → call upstream `.../pipelines?tenantId=...`
  - else → call upstream without tenantId
- Return JSON list.
- On errors:
  - log server-side (console is fine)
  - return `{ error: 'Failed to load pipelines' }` with `status: 500`
  - do NOT include upstream URL nor raw error text.

### 6.2 Vendor route handler behavior (forced scoping)

- MUST ignore any `tenantId` query param from the client.
- MUST read `VENDOR_TENANT_ID` (or similar) from server env.
- Call upstream always as `.../pipelines?tenantId=${VENDOR_TENANT_ID}`
- Same sanitized error approach.

### 6.3 Caching

- For demo, prefer fresh:
  - `fetch(upstreamUrl, { cache: 'no-store' })`
- Alternatively add `next: { revalidate: 30 }` for stability.

---

## 7) Server Components: initial load

### 7.1 Admin `app/page.tsx`

- Fetch initial pipelines on the server via internal route OR direct upstream.
  - Preferred: call internal route using `fetch(`\${baseUrl}/api/pipelines`, ...)` requires base URL.
  - Simpler (and still doesn't leak to browser): server can call upstream directly.

To keep all upstream access in one place, prefer:

- create a server-only helper in the app itself (not in shared ui): `lib/getPipelines.ts` that calls upstream.

Then render:

- `PipelinesTable` with admin column set (includes `tenantId`) and `initialPipelines`.

### 7.2 Vendor `app/page.tsx`

- Validate tenant id at module init (and in next.config; see below).
- Server fetch pipelines for the tenant.
- Load tenant branding from `app/tenant/config.ts`.
- Render heading with vendor title + logo.
- Render `PipelinesTable` with vendor column set (excludes `tenantId`) and tenant-scoped data.

---

## 8) Vendor env validation (build must fail)

Requirement: vendor build should throw/fail if tenant is not provided.

Implement **both** (belt + suspenders):

1. `apps/vendor/next.config.mjs`

- During config evaluation, validate required env:
  - `if (!process.env.VENDOR_TENANT_ID) throw new Error('VENDOR_TENANT_ID is required')`

2. Vendor server module validation

- In `apps/vendor/app/tenant/config.ts` validate again and export `tenantId`.

This ensures:

- missing env fails CI during `next build`
- runtime errors don't get masked

---

## 9) Admin tenant filter UI

### 9.1 Where the tenantId lives

- Tenant selection is **admin-only UI state** and should live in an `apps/admin` **client wrapper** (e.g. `AdminPipelinesPanel`).
- The shared `PipelinesTable` stays generic and does **not** own tenantId.

### 9.2 Client wrapper behavior (`AdminPipelinesPanel`)

**Inputs from server (props):**

- `initialPipelines: PipelineApi[]` *(all tenants)*
- `tenantOptions: Array<{ value: string; label: string }>` *(derived from initial data)*

**State:**

- `selectedTenantId: string | null` *(null = All tenants)*
- `pipelines: PipelineApi[]`
- `isRefreshing: boolean`

**Behavior:**

- On tenant selection change, call internal route:
  - `null` → `/api/pipelines`
  - `tenantId` → `/api/pipelines?tenantId=...`
- Update `pipelines` state and re-render.

### 9.3 Rendering (recommended)

- Put the tenant combobox in a toolbar area above the table (or pass it via the table's `toolbar` slot).
- Pass a **closure** to `PipelinesTable.onRefresh`:
  - `onRefresh={() => refresh(selectedTenantId)}` *(table never sees the tenantId)*

### 9.4 "All tenants" option

- Include a synthetic option like `{ value: '__all__', label: 'All tenants' }`.
- Map it to `selectedTenantId = null`.

---

## 10) Vendor theming & branding

### 10.1 Theme tokens

Use CSS variables:

- `--primary`, `--primary-foreground`
- `--ring`, `--border`, etc.

Admin app `globals.css`: green tokens Vendor app `globals.css`: blue tokens

### 10.2 Vendor tenant config file

Create `apps/vendor/app/tenant/config.ts`:

- exports:
  - `tenantId`
  - `brand`: `{ appTitle, logoUrl?, poweredByLabel?, themeOverrides? }`

Optionally allow a folder-based branding per tenant:

- `apps/vendor/app/tenant/tenants/xxx-ten-1.ts`

And `config.ts` selects by env tenantId.

---

## 11) Docker + ECS readiness

We will ship **two Dockerfiles**, one per app, designed for ECS.

### 11.1 Build strategy

Use multi-stage builds:

- base: node + pnpm
- prune: `turbo prune --scope=admin --docker`
- install deps
- build Next app
- runner stage uses `.next/standalone` output

Do the same for vendor.

### 11.2 Minimal requirements

- Each app exposes port `3000`.
- Health endpoint optional (`/api/health`).
- Environment variables for vendor injected in ECS task definition.

---

## 12) Implementation checklist (do in this order)

1. Initialize turborepo with workspaces.
2. Create `packages/tailwind` preset + `packages/ui` skeleton.
3. Scaffold Next apps with App Router + Tailwind + shadcn.
4. Add `transpilePackages` to both apps.
5. Implement `PipelinesTable` and `TenantFilter` in `@acme/ui`.
6. Add route handlers in both apps; ensure vendor forces tenant from env.
7. Implement server-side initial fetch in both apps.
8. Implement admin combobox filter (client refresh calls internal route).
9. Add green/blue theming via globals.css and shadcn tokens.
10. Add vendor branding (title/logo) via tenant config.
11. Add vendor env validation in `next.config.mjs`.
12. Add Dockerfiles and a basic `docker-compose.yml` to run both locally.

---

## 13) "Definition of done"

- `pnpm dev --filter admin` shows all tenants + filter.
- `pnpm dev --filter vendor` shows only the env-provided tenant.
- Browser network calls only internal `/api/pipelines` (no upstream visible).
- Vendor build fails if `VENDOR_TENANT_ID` missing.
- Shared UI component used by both apps, styled differently (green vs blue).
- Docker build succeeds for both apps (standalone output).

---

## 14) Notes / future-proofing (optional)

If later we add real auth:

- derive tenantId from **JWT claims or host mapping**
- enforce scoping at API layer (RBAC/RLS), not in UI
- use API keys not only tenantId for access authhentication
