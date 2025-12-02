import { getPipelines, extractTenantOptions } from "@/lib/api";
import { AdminPipelinesPanel } from "@/components/AdminPipelinesPanel";

export default async function HomePage(): Promise<React.JSX.Element> {
  // Fetch all pipelines on the server (no tenantId = all tenants)
  const pipelines = await getPipelines();
  const tenantOptions = extractTenantOptions(pipelines);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Pipeline Management</h2>
        <p className="text-muted-foreground">
          View and manage pipelines across all tenants. Filter by tenant to see specific data.
        </p>
      </div>
      <div className="rounded-lg border border-primary/20 bg-card shadow-sm">
        <AdminPipelinesPanel initialPipelines={pipelines} tenantOptions={tenantOptions} />
      </div>
    </div>
  );
}
