import "server-only";
import { env } from "@/env";
import type { PipelineApi } from "@acme/ui";

/**
 * Fetch pipelines from the upstream API (server-only).
 * This function should never be imported in client components.
 *
 * @param tenantId - Optional tenant ID to filter pipelines
 * @returns Array of pipelines
 * @throws Error if the upstream API call fails
 */
export async function getPipelines(tenantId?: string): Promise<PipelineApi[]> {
  const url = new URL(env.UPSTREAM_API_URL);

  if (tenantId) {
    url.searchParams.set("tenantId", tenantId);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstream API error: ${response.status}`);
  }

  const data = await response.json();
  return data as PipelineApi[];
}

/**
 * Extract unique tenant IDs from pipelines and format as options.
 */
export function extractTenantOptions(
  pipelines: PipelineApi[]
): Array<{ value: string; label: string }> {
  const tenantIds = [...new Set(pipelines.map((p) => p.tenantId))].sort();
  return tenantIds.map((id) => ({ value: id, label: id }));
}
