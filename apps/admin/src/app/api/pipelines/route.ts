import { NextResponse, type NextRequest } from "next/server";
import { getPipelines } from "@/lib/api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") ?? undefined;

    const pipelines = await getPipelines(tenantId);

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
