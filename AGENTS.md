# AGENTS.md

## Build Commands (Turborepo + pnpm)
- `pnpm install` - install dependencies
- `pnpm dev` - run all apps (`pnpm dev --filter admin` or `--filter vendor`)
- `pnpm build` - build all apps (vendor requires `VENDOR_TENANT_ID` env)
- `pnpm lint` - lint all packages

## Code Style
- TypeScript strict mode; explicit types for function params and returns
- Imports: group by external → internal (`@acme/*`) → relative; prefer named exports
- React: functional components; `'use client'` directive for client components
- Naming: PascalCase (components), camelCase (functions/variables), SCREAMING_SNAKE_CASE (env)
- Use `cn()` helper from `@acme/ui` for conditional Tailwind classes

## Error Handling
- Route handlers: wrap in try/catch, log errors server-side, return `{ error: string }` with generic message
- Never expose upstream URLs, stack traces, or internal details to client
- Use `NextResponse.json({ error: 'Failed to load data' }, { status: 500 })`

## Architecture Rules
- Shared UI (`packages/ui`) must be tenant-agnostic; no tenantId logic in shared components
- Browser calls only internal `/api/*` routes; route handlers call upstream server-to-server
- Vendor app: tenant scoping enforced server-side from `VENDOR_TENANT_ID` env (never trust client)
- See `IMPLEMENTATION_PLAN.md` for detailed architecture spec
