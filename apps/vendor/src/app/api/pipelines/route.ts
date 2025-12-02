import { NextResponse } from "next/server";
import { getPipelines } from "@/lib/api";

/**
 * Route handler for vendor pipelines.
 * IMPORTANT: This handler ignores any tenantId from the client request.
 * The tenant is always enforced server-side from VENDOR_TENANT_ID env.
 */
export async function GET(): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  try {
    // getPipelines() always uses VENDOR_TENANT_ID from env
    // No client-provided tenantId is ever used
    const pipelines = await getPipelines();

    return NextResponse.json(pipelines);
  } catch (error) {
    // Log the full error server-side for debugging
    console.error(`[${requestId}] Failed to fetch pipelines:`, error);

    // Return sanitized error to client (no internal details)
    return NextResponse.json(
      {
        error: "Failed to load pipelines",
        requestId,
      },
      { status: 500 }
    );
  }
}
