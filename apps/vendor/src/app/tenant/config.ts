import { env } from "@/env";

/**
 * Tenant branding configuration.
 */
export interface TenantBrand {
  /** Application title displayed in header */
  appTitle: string;
  /** Optional logo URL (relative to public/ or absolute) */
  logoUrl?: string;
  /** Optional "Powered by" label in footer/header */
  poweredByLabel?: string;
  /** Optional theme overrides (HSL values) */
  themeOverrides?: {
    primary?: string;
    primaryForeground?: string;
  };
}

/**
 * Get the current tenant ID from environment.
 * This is validated at build time by @t3-oss/env-nextjs.
 */
export function getTenantId(): string {
  return env.VENDOR_TENANT_ID;
}

/**
 * Tenant branding configuration.
 * In a production setup, this could be loaded from a database or config file
 * based on the tenant ID.
 */
export const tenantBrand: TenantBrand = {
  appTitle: env.VENDOR_APP_TITLE || "Vendor Portal",
  logoUrl: env.VENDOR_LOGO_URL || undefined,
  poweredByLabel: env.VENDOR_POWERED_BY || "Powered by Acme",
  themeOverrides: env.VENDOR_THEME_PRIMARY || env.VENDOR_THEME_PRIMARY_FOREGROUND
    ? {
        primary: env.VENDOR_THEME_PRIMARY,
        primaryForeground: env.VENDOR_THEME_PRIMARY_FOREGROUND,
      }
    : undefined,
};

/**
 * Get tenant-specific branding.
 * This function can be extended to load different branding per tenant.
 */
export function getTenantBrand(_tenantId: string): TenantBrand {
  // Branding is now loaded from environment variables
  // In production, you might also have:
  // - A config file per tenant: `./tenants/${tenantId}.ts`
  // - A database lookup
  // - An API call
  return tenantBrand;
}
