import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    UPSTREAM_API_URL: z
      .string()
      .url()
      .optional()
      .default("https://4y6vut7106.execute-api.us-east-1.amazonaws.com/v1/pipelines"),
    /**
     * Required tenant ID for the vendor app.
     * Build will fail if this is not provided.
     */
    VENDOR_TENANT_ID: z
      .string()
      .min(1, "VENDOR_TENANT_ID is required for vendor app"),
    /**
     * Optional branding customization
     */
    VENDOR_APP_TITLE: z.string().optional(),
    VENDOR_LOGO_URL: z.string().optional(),
    VENDOR_POWERED_BY: z.string().optional(),
    VENDOR_THEME_PRIMARY: z.string().optional(),
    VENDOR_THEME_PRIMARY_FOREGROUND: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    UPSTREAM_API_URL: process.env.UPSTREAM_API_URL,
    VENDOR_TENANT_ID: process.env.VENDOR_TENANT_ID,
    VENDOR_APP_TITLE: process.env.VENDOR_APP_TITLE,
    VENDOR_LOGO_URL: process.env.VENDOR_LOGO_URL,
    VENDOR_POWERED_BY: process.env.VENDOR_POWERED_BY,
    VENDOR_THEME_PRIMARY: process.env.VENDOR_THEME_PRIMARY,
    VENDOR_THEME_PRIMARY_FOREGROUND: process.env.VENDOR_THEME_PRIMARY_FOREGROUND,
  },
});
