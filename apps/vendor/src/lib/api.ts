import "server-only";
import { env } from "@/env";
import type { PipelineApi } from "@acme/ui";

/**
 * Fetch pipelines from the upstream API (server-only).
 * Always scoped to the vendor's tenant ID from environment.
 * This function should never be imported in client components.
 *
 * @returns Array of pipelines for the vendor's tenant
 * @throws Error if the upstream API call fails
 */
export async function getPipelines(): Promise<PipelineApi[]> {
  const url = new URL(env.UPSTREAM_API_URL);
  
  // Always scope to the vendor's tenant - this is the critical security enforcement
  url.searchParams.set("tenantId", env.VENDOR_TENANT_ID);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstream API error: ${response.status}`);
  }

  const data = await response.json();
  return data as PipelineApi[];
}
